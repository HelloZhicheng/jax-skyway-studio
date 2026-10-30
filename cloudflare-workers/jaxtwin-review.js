/**
 * JAXTWIN Review — Cloudflare D1 staging (Supabase-free)
 *
 * IMPORTANT: Safe migration build. WRITES_ENABLED is false by design.
 * Only enable writes after Cloudflare D1 schema/data and BOTH access paths have
 * been validated and the frontend has been updated. Instructor endpoint must be
 * protected by Cloudflare Access at the edge before enabling it.
 *
 * /                  - classroom student pilot (username + UF email + workspace ID)
 * /instructor        - reserved for Access-protected instructor requests
 * /health            - public D1/schema health (no student details)
 *
 * BINDING: DB -> jaxtwin-storage-db. No R2, Supabase or app secret needed.
 */

const WRITES_ENABLED = env => env.JAXTWIN_REVIEW_WRITES_ENABLED === 'true';
const INSTRUCTOR_ENABLED = false; // keep disabled until /instructor is protected by Access
const MAX_BYTES = 500_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ORIGINS = new Set([
  'https://jaxtwin.pages.dev',
  'http://localhost:3001',
  'https://localhost:3001',
  'https://jaxtwin-review.xzc0318.workers.dev'
]);
const txt = (value, n) => typeof value === 'string' ? value.trim().slice(0, n) : '';
const parse = (v, fallback) => {
  if (v == null || v === '') return fallback;
  if (typeof v !== 'string') return v;
  try { return JSON.parse(v); } catch { return fallback; }
};
const jstr = value => JSON.stringify(value);

function response(req, status, data) {
  const origin = req.headers.get('Origin');
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'vary': 'Origin',
    'access-control-allow-methods': 'POST, OPTIONS, GET',
    'access-control-allow-headers': 'authorization,content-type,apikey'
  });
  if (origin && ORIGINS.has(origin)) headers.set('access-control-allow-origin', origin);
  return new Response(JSON.stringify(data), { status, headers });
}
function problem(status, message) {
  const err = new Error(message);
  err.httpStatus = status;
  return err;
}
function toScene(row) {
  return {
    id: row.id, session_id: row.session_id,
    camera: parse(row.camera, {}), marks: parse(row.marks, []),
    notes: parse(row.notes, []), thumbnail: row.thumbnail || '',
    updated_at: row.updated_at
  };
}
function validScene(scene) {
  if (!scene || !UUID.test(scene.id || '') || !scene.camera ||
      typeof scene.camera !== 'object' || Array.isArray(scene.camera)) return false;
  if (!Array.isArray(scene.marks) || !Array.isArray(scene.notes) ||
      scene.marks.length > 350 || scene.notes.length > 100) return false;
  if (scene.thumbnail && (typeof scene.thumbnail !== 'string' ||
      scene.thumbnail.length > 130000 || !/^data:image\/jpeg;base64,/.test(scene.thumbnail))) return false;
  if (JSON.stringify({camera:scene.camera, marks:scene.marks, notes:scene.notes}).length > 450000) return false;
  if (scene.notes.some(n => typeof n?.text !== 'string' || n.text.length > 3000)) return false;
  return true;
}
async function schema(env) {
  if (!env.DB) return { dbBound: false, tablesReady: false, tables: {} };
  const list = ['jaxtwin_workspaces','jaxtwin_review_memberships','jaxtwin_review_sessions','jaxtwin_review_scenes'];
  const tables = {};
  const results = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  const existing = new Set((results.results || []).map(x => x.name));
  for (const name of list) tables[name] = existing.has(name);
  return { dbBound: true, tablesReady: list.every(name => tables[name]), tables };
}
async function studentAllowed(env, workspaceId, studentAccess) {
  const username = txt(studentAccess?.username, 32).toLowerCase();
  const email = txt(studentAccess?.ufEmail, 160).toLowerCase();
  if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username) ||
      !/^[^\s@]+@ufl\.edu$/.test(email)) throw problem(403, 'Sign in to My Workspace first.');
  const row = await env.DB.prepare(
    'SELECT id FROM jaxtwin_workspaces WHERE id = ? AND lower(username) = ? AND lower(uf_email) = ? LIMIT 1'
  ).bind(workspaceId, username, email).first();
  if (!row) throw problem(403, 'Workspace does not match current JaxTwin login.');
  // Classroom pilot only. This is NOT strong authentication: a known email can be impersonated.
  return { role: 'student-pilot', email };
}
async function instructorAllowed(request, env, workspaceId) {
  if (!INSTRUCTOR_ENABLED) throw problem(403, 'Instructor endpoint disabled until Cloudflare Access is configured.');
  // Defense-in-depth requires Cloudflare Access to protect /instructor at the edge.
  // Do not enable INSTRUCTOR_ENABLED without a matching Access application policy.
  const jwt = txt(request.headers.get('cf-access-jwt-assertion'), 8000);
  const email = txt(request.headers.get('cf-access-authenticated-user-email'), 160).toLowerCase();
  if (!jwt || !/^[^\s@]+@[^\s@]+$/.test(email)) throw problem(403, 'Cloudflare Access instructor session required.');
  const row = await env.DB.prepare(
    'SELECT role FROM jaxtwin_review_memberships WHERE workspace_id = ? AND lower(email) = ? LIMIT 1'
  ).bind(workspaceId, email).first();
  if (!row) throw problem(403, 'Instructor is not assigned to this Review workspace.');
  return { role: row.role, email };
}
async function mustSession(env, sessionId, workspaceId) {
  if (!UUID.test(sessionId)) throw problem(400, 'Invalid review session.');
  const row = await env.DB.prepare(
    'SELECT id FROM jaxtwin_review_sessions WHERE id = ? AND workspace_id = ? LIMIT 1'
  ).bind(sessionId, workspaceId).first();
  if (!row) throw problem(404, 'Review session not found in this workspace.');
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    if (origin && !ORIGINS.has(origin)) return response(request, 403, { error: 'Origin not allowed' });
    if (request.method === 'OPTIONS') return new Response(null, {
      status: 204, headers: response(request, 200, {}).headers
    });
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      try {
        const status = await schema(env);
        return response(request, 200, {
          ok: status.dbBound && status.tablesReady,
          service: 'jaxtwin-review',
          mode: 'cloudflare-d1-staging',
          ...status,
          writesEnabled: WRITES_ENABLED(env),
          instructorEnabled: INSTRUCTOR_ENABLED,
          supabaseRequired: false
        });
      } catch (e) {
        return response(request, 500, { ok: false, error: 'D1 health check failed' });
      }
    }
    if (request.method !== 'POST' || !['/', '/instructor'].includes(url.pathname))
      return response(request, 405, { error: 'POST only' });
    try {
      if (!env.DB) throw problem(503, 'D1 DB binding missing.');
      if (Number(request.headers.get('content-length') || '0') > MAX_BYTES)
        throw problem(413, 'Request too large.');
      const raw = await request.text();
      if (new TextEncoder().encode(raw).length > MAX_BYTES) throw problem(413, 'Request too large.');
      let body;
      try { body = JSON.parse(raw); } catch { throw problem(400, 'Invalid JSON.'); }
      if (!body || Array.isArray(body) || typeof body !== 'object') throw problem(400, 'JSON object required.');
      const action = txt(body.action, 50);
      if (['request_code','verify_code','refresh_token'].includes(action))
        throw problem(409, 'Review email OTP is replaced by Cloudflare Access; frontend migration needed.');
      if (!['list','create_session','get','rename_session','delete_session','save_scene','delete_scene'].includes(action))
        throw problem(400, 'Unknown action.');
      const workspaceId = txt(body.workspaceId, 160);
      if (!UUID.test(workspaceId)) throw problem(400, 'Select a valid student workspace.');
      if (url.pathname === '/instructor') await instructorAllowed(request, env, workspaceId);
      else await studentAllowed(env, workspaceId, body.studentAccess);
      if (action === 'list') {
        const result = await env.DB.prepare(
          'SELECT id,workspace_id,title,created_at,updated_at FROM jaxtwin_review_sessions WHERE workspace_id = ? ORDER BY created_at DESC LIMIT 100'
        ).bind(workspaceId).all();
        return response(request, 200, { sessions: result.results || [] });
      }
      const modifies = ['create_session','rename_session','delete_session','save_scene','delete_scene'].includes(action);
      if (modifies && !WRITES_ENABLED(env)) throw problem(403, 'Review writes disabled during migration testing.');
      if (action === 'create_session') {
        const now = new Date().toISOString();
        const title = txt(body.title, 120) || now.slice(0,10) + ' · Review';
        const id = crypto.randomUUID();
        await env.DB.prepare(
          'INSERT INTO jaxtwin_review_sessions (id,workspace_id,title,created_at,updated_at) VALUES (?,?,?,?,?)'
        ).bind(id,workspaceId,title,now,now).run();
        const session = await env.DB.prepare(
          'SELECT id,workspace_id,title,created_at,updated_at FROM jaxtwin_review_sessions WHERE id = ?'
        ).bind(id).first();
        return response(request,200,{session});
      }
      const sessionId = txt(body.sessionId, 80);
      await mustSession(env, sessionId, workspaceId);
      if (action === 'get') {
        const result = await env.DB.prepare(
          'SELECT id,session_id,camera,marks,notes,thumbnail,updated_at FROM jaxtwin_review_scenes WHERE session_id = ? ORDER BY created_at ASC LIMIT 200'
        ).bind(sessionId).all();
        return response(request, 200, { scenes: (result.results || []).map(toScene) });
      }
      if (action === 'rename_session') {
        const title = txt(body.title, 120);
        if (!title) throw problem(400, 'Review name cannot be blank.');
        await env.DB.prepare('UPDATE jaxtwin_review_sessions SET title = ?, updated_at = ? WHERE id = ? AND workspace_id = ?')
          .bind(title,new Date().toISOString(),sessionId,workspaceId).run();
        const session = await env.DB.prepare('SELECT id,workspace_id,title,created_at,updated_at FROM jaxtwin_review_sessions WHERE id = ?')
          .bind(sessionId).first();
        return response(request, 200, { session });
      }
      if (action === 'delete_session') {
        // Explicitly delete scoped scenes: works even if D1 lacks ON DELETE CASCADE.
        await env.DB.batch([
          env.DB.prepare('DELETE FROM jaxtwin_review_scenes WHERE session_id = ?').bind(sessionId),
          env.DB.prepare('DELETE FROM jaxtwin_review_sessions WHERE id = ? AND workspace_id = ?').bind(sessionId,workspaceId)
        ]);
        return response(request, 200, { ok: true });
      }
      if (action === 'save_scene') {
        const s = body.scene;
        if (!validScene(s)) throw problem(400, 'Invalid or oversized Review Scene.');
        const existing = await env.DB.prepare('SELECT session_id FROM jaxtwin_review_scenes WHERE id = ?').bind(s.id).first();
        if (existing && existing.session_id !== sessionId) throw problem(409, 'Scene belongs to another Review Session.');
        const now = new Date().toISOString();
        await env.DB.prepare(`INSERT INTO jaxtwin_review_scenes
          (id,session_id,camera,marks,notes,thumbnail,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)
          ON CONFLICT(id) DO UPDATE SET camera=excluded.camera, marks=excluded.marks,
          notes=excluded.notes, thumbnail=excluded.thumbnail, updated_at=excluded.updated_at
          WHERE jaxtwin_review_scenes.session_id=excluded.session_id`)
          .bind(s.id,sessionId,jstr(s.camera),jstr(s.marks),jstr(s.notes),s.thumbnail||'',now,now).run();
        return response(request, 200, { ok: true });
      }
      if (action === 'delete_scene') {
        const sceneId = txt(body.sceneId, 80);
        if (!UUID.test(sceneId)) throw problem(400, 'Invalid scene ID.');
        await env.DB.prepare('DELETE FROM jaxtwin_review_scenes WHERE id = ? AND session_id = ?').bind(sceneId,sessionId).run();
        return response(request, 200, { ok: true });
      }
      throw problem(400, 'Unknown action.');
    } catch (e) {
      const status = Number(e?.httpStatus || 500);
      if (status === 500) console.error('[jaxtwin-review]', e?.message || 'unknown');
      return response(request, status, { error: status === 500 ? 'Review server error; check Worker logs and D1 schema.' : e.message });
    }
  }
};