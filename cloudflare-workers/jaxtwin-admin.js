// JAXTWIN Admin — Cloudflare-only / read-only
// Authorised email(s): xzc0318@gmail.com, zhicheng.xu@ufl.edu
// Bindings: DB (D1), MODELS (R2). Requires Access > All traffic.
// NO Supabase keys needed. Delete disabled.

/**
 * JaxTwin Admin — Cloudflare-only staging worker (read-only)
 * Cloudflare Worker binding: DB = D1 jaxtwin-storage-db, MODELS = R2 jaxtwin-storage
 * Protect this Worker using the Cloudflare Workers > Access tab, All traffic.
 * IMPORTANT: Access policy should allow ONLY verified, named instructor email addresses.
 * An independent application-level whitelist is enforced below.
 * No Supabase credentials, no secrets, no writes, no deletion.
 */
const PRIMARY_INSTRUCTORS = new Set(['xzc0318@gmail.com', 'zhicheng.xu@ufl.edu']);
const ORIGINS = new Set(['https://jaxtwin.pages.dev','http://localhost:3001','https://localhost:3001']);
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8a-f][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const MAX_BODY_BYTES = 8192;
const enc = new TextEncoder();

function cors(request) {
  const origin = request.headers.get('origin');
  return {
    ...(origin && ORIGINS.has(origin) ? {'access-control-allow-origin':origin} : {}),
    'vary':'Origin', 'access-control-allow-methods':'GET, HEAD, POST, OPTIONS',
    'access-control-allow-headers':'content-type, authorization, range',
    'access-control-expose-headers':'content-length, content-range, accept-ranges',
    'cache-control':'no-store'
  };
}
function respond(request, code, data) {
  return new Response(JSON.stringify(data), {status:code, headers:{...cors(request),'content-type':'application/json; charset=utf-8'}});
}
function parse(value, fallback) {
  if (typeof value !== 'string') return value ?? fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}
function arr(value) { const v=parse(value,[]); return Array.isArray(v)?v:[]; }
function obj(value) { const v=parse(value,{}); return v && typeof v==='object' && !Array.isArray(v)?v:{}; }
function validKey(workspaceId,key) {
  return UUID.test(workspaceId) && typeof key==='string' && key.startsWith(`guest/${workspaceId}/`) &&
    key.length < 1500 && !key.split('/').some(part=>part==='' || part==='.' || part==='..');
}
function adminEmails(env) {
  const optional=String(env.ADMIN_EMAILS||'').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean);
  return new Set([...PRIMARY_INSTRUCTORS,...optional]);
}
async function requireAdmin(ctx,env) {
  // ctx.access is injected by Cloudflare only after successful Worker-level Access auth.
  if (!ctx?.access) return null;
  const identity=await ctx.access.getIdentity();
  const email=String(identity?.email||'').trim().toLowerCase();
  return adminEmails(env).has(email)?email:null;
}
function fileUrl(request,workspaceId,key) {
  const url=new URL(request.url);
  url.pathname='/file';
  url.search='';
  url.searchParams.set('workspaceId',workspaceId);
  url.searchParams.set('key',key);
  return url.toString();
}
async function listWorkspaces(env) {
  const {results:ws}=await env.DB.prepare(`
    SELECT id,username,uf_email,hidden_scene_features,scene_bookmarks,site_plan
    FROM jaxtwin_workspaces WHERE username IS NOT NULL ORDER BY username ASC LIMIT 250
  `).all();
  const {results:countRows}=await env.DB.prepare(`
    SELECT workspace_id,COUNT(*) AS total FROM jaxtwin_buildings GROUP BY workspace_id
  `).all();
  const counts=new Map((countRows||[]).map(x=>[x.workspace_id,Number(x.total)]));
  return (ws||[]).map(w=>{
    const plan=obj(w.site_plan);
    return {id:w.id,username:w.username,ufEmail:w.uf_email||'',
      buildingCount:counts.get(w.id)||0,
      planCount:Array.isArray(plan.plans)?plan.plans.length:(plan.imagePath?1:0),
      hiddenCount:arr(w.hidden_scene_features).length,
      bookmarkCount:arr(w.scene_bookmarks).length};
  });
}
async function getWorkspace(env,id) {
  return env.DB.prepare(`
    SELECT id,username,uf_email,hidden_scene_features,scene_bookmarks,site_plan
    FROM jaxtwin_workspaces WHERE id=? LIMIT 1
  `).bind(id).first();
}
async function getBuildings(env,id) {
  const {results}=await env.DB.prepare(`
    SELECT client_key,name,visible,model_path,transform
    FROM jaxtwin_buildings WHERE workspace_id=? ORDER BY created_at ASC LIMIT 15
  `).bind(id).all();
  return results||[];
}
function sitePlansOf(ws) {
  const raw=obj(ws.site_plan);
  return Array.isArray(raw.plans)?raw.plans:(raw.imagePath?[{...raw,id:raw.id||'legacy-plan'}]:[]);
}
async function viewWorkspace(request,env,id) {
  const ws=await getWorkspace(env,id);
  if (!ws?.username) return {status:404,data:{error:'Student Workspace not found'}};
  const rows=await getBuildings(env,id);
  const models=rows.filter(r=>r.client_key && validKey(id,r.model_path)).map(r=>{
    const tr=obj(r.transform);
    return {id:r.client_key,name:r.name,visible:r.visible===true || r.visible===1 || r.visible==='true',
      origin:tr.origin,spatialReferenceWkid:tr.spatialReferenceWkid,
      numbers:tr.numbers,importCheck:tr.importCheck||null,
      url:fileUrl(request,id,r.model_path)};
  });
  const plans=sitePlansOf(ws).slice(0,10).filter(p=>
    p && validKey(id,p.imagePath) && p.imagePath.startsWith(`guest/${id}/site-plans/`)
  ).map(p=>({...p,url:fileUrl(request,id,p.imagePath)}));
  return {status:200,data:{username:ws.username,ufEmail:ws.uf_email||'',models,
    hiddenSceneFeatures:arr(ws.hidden_scene_features),bookmarks:arr(ws.scene_bookmarks),
    sitePlan:plans[0]||null,sitePlans:plans}};
}
function mime(key) {
  return ({glb:'model/gltf-binary',gltf:'model/gltf+json',pdf:'application/pdf',
    png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',
    stl:'model/stl',obj:'text/plain'})[key.split('.').pop()?.toLowerCase()]||'application/octet-stream';
}
async function serveFile(request,env,url) {
  const id=url.searchParams.get('workspaceId')||'',key=url.searchParams.get('key')||'';
  if (!validKey(id,key)) return respond(request,400,{error:'Invalid workspace file path'});
  const ws=await getWorkspace(env,id);
  if (!ws?.username) return respond(request,404,{error:'Workspace not found'});
  const rows=await getBuildings(env,id);
  const allowedModel=rows.some(r=>r.model_path===key);
  const allowedPlan=sitePlansOf(ws).some(p=>p?.imagePath===key && key.startsWith(`guest/${id}/site-plans/`));
  if (!allowedModel && !allowedPlan) return respond(request,403,{error:'File is not listed in workspace'});
  const file=request.method==='HEAD' ? await env.MODELS.head(key) :
    await env.MODELS.get(key,request.headers.has('range')?{range:request.headers}:undefined);
  if (!file) return respond(request,404,{error:'File not found in R2; check migration status'});
  const headers=new Headers(cors(request));
  file.writeHttpMetadata(headers);
  if (!headers.has('content-type')||headers.get('content-type')==='application/octet-stream')
    headers.set('content-type',mime(key));
  headers.set('cache-control','private, no-store');
  headers.set('accept-ranges','bytes');
  if (file.httpEtag) headers.set('etag',file.httpEtag);
  const partial=request.method==='GET' && request.headers.has('range') && file.range;
  if (partial) {
    const start=file.range.offset, len=file.range.length;
    headers.set('content-range',`bytes ${start}-${start+len-1}/${file.size}`);
    headers.set('content-length',String(len));
  } else headers.set('content-length',String(file.size));
  return new Response(request.method==='HEAD'?null:file.body,{status:partial?206:200,headers});
}

export default {
  async fetch(request,env,ctx) {
    const url=new URL(request.url);
    if (request.headers.has('origin')&&!ORIGINS.has(request.headers.get('origin')))
      return respond(request,403,{error:'Origin not allowed'});
    // No /file, /health, or other sensitive API is available without Access.
    // Cross-origin OPTIONS requires Access auth too. A same-origin proxy can be added at front-end cutover.
    try {
      const email=await requireAdmin(ctx,env);
      if (!email) return respond(request,403,{error:'Cloudflare Access instructor authorization required'});
      if (request.method==='OPTIONS') return new Response(null,{status:204,headers:cors(request)});
      if (!env.DB || !env.MODELS) return respond(request,503,{error:'D1 DB / R2 MODELS bindings missing'});
      if ((url.pathname==='/'||url.pathname==='/health') && request.method==='GET')
        return respond(request,200,{ok:true,service:'jaxtwin-admin',mode:'cloudflare-only / read-only',
          d1Bound:true,r2Bound:true,authProvider:'Cloudflare Access',authenticatedEmail:email,
          supabaseRequired:false,deleteEnabled:false});
      if (url.pathname==='/file' && (request.method==='GET'||request.method==='HEAD'))
        return await serveFile(request,env,url);
      if (url.pathname!=='/' || request.method!=='POST') return respond(request,405,{error:'POST only'});
      const bodyText=await request.text();
      if (enc.encode(bodyText).length>MAX_BODY_BYTES) return respond(request,413,{error:'Request too large'});
      let body;
      try {body=JSON.parse(bodyText);} catch {return respond(request,400,{error:'Invalid JSON'});}
      if (!body||typeof body!=='object'||Array.isArray(body)) return respond(request,400,{error:'Object required'});
      const action=String(body.action||'');
      if (action==='whoami') return respond(request,200,{email});
      if (action==='login'||action==='begin_email_login')
        return respond(request,409,{error:'Instructor login now uses Cloudflare Access. Front-end login needs migration before cutover.'});
      if (action==='list') return respond(request,200,{workspaces:await listWorkspaces(env)});
      if (action==='view') {
        const id=String(body.workspaceId||'');
        if (!UUID.test(id)) return respond(request,400,{error:'Invalid Workspace ID'});
        const result=await viewWorkspace(request,env,id);
        return respond(request,result.status,result.data);
      }
      if (action==='schema_check') {
        const tables={};
        for (const table of ['jaxtwin_workspaces','jaxtwin_buildings']) {
          const result=await env.DB.prepare(`PRAGMA table_info(${table})`).all();
          tables[table]=(result.results||[]).map(x=>x.name);
        }
        return respond(request,200,{tables});
      }
      if (action==='delete_workspace') return respond(request,403,{error:'Deletion disabled during migration'});
      return respond(request,400,{error:'Unsupported admin action'});
    } catch (error) {
      console.error('[jaxtwin-admin cloudflare only]',error?.message||'unknown');
      return respond(request,500,{error:'Admin Worker error; review Cloudflare logs and D1 schema'});
    }
  }
};