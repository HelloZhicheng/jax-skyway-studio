/**
 * JAXTWIN cloudflare-migration PREVIEW gateway.
 * Only PUBLIC READ actions; writes, admin, login and Review are not proxied.
 * Uses Service Bindings on the PAGES PREVIEW environment:
 *   JAX_SHARE -> jaxtwin-share
 *   JAX_DISPLAY -> jaxtwin-display-area
 *   JAX_EXHIBITION -> jaxtwin-exhibition
 */
const ROUTES = Object.freeze({
  share: {binding: 'JAX_SHARE', origin: 'https://jaxtwin-share.xzc0318.workers.dev', actions: ['view']},
  display: {binding: 'JAX_DISPLAY', origin: 'https://jaxtwin-display-area.xzc0318.workers.dev', actions: ['view']},
  exhibition: {binding: 'JAX_EXHIBITION', origin: 'https://jaxtwin-exhibition.xzc0318.workers.dev', actions: ['list','health']}
});
const TOKEN = /^[0-9a-f]{64}$/;
function json(data,status=200){return Response.json(data,{status,headers:{'cache-control':'no-store','x-content-type-options':'nosniff'}});}
function allowedOrigin(url,value){
  try { const u = new URL(value); return u.origin === url.origin; } catch {return false;}
}
function fileProxyUrl(url, upstream){
  try {
    const u = new URL(upstream);
    if (u.origin === ROUTES.share.origin && u.pathname === '/file')
      return new URL('/_jax_cf/share/file'+u.search, url.origin).toString();
  } catch {}
  return upstream;
}
export async function onRequest(context) {
  const {request,env} = context;
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const resource = segments[1];
  const extra = segments.slice(2);
  if (resource === 'health' && request.method === 'GET')
    return json({ok:true,mode:'PUBLIC_READ_ONLY_PREVIEW',binds:{
      share:!!env.JAX_SHARE,display:!!env.JAX_DISPLAY,exhibition:!!env.JAX_EXHIBITION
    },supabaseWritesUntouched:true});
  if (!Object.prototype.hasOwnProperty.call(ROUTES,resource)) return json({error:'NOT_FOUND'},404);
  const route = ROUTES[resource];
  const service = env[route.binding];
  if (!service || typeof service.fetch !== 'function')
    return json({error:'MISSING_PREVIEW_SERVICE_BINDING',binding:route.binding},503);
  if (extra.length) {
    if (resource !== 'share' || extra.length !== 1 || extra[0] !== 'file' ||
        !['GET','HEAD'].includes(request.method)) return json({error:'NOT_FOUND'},404);
    // Share Worker checks cryptographic link signature, expiry, revocation and R2 membership.
    const remote = new URL('/file'+url.search,route.origin);
    const headers = new Headers();
    const range = request.headers.get('range');
    if (range) headers.set('range',range);
    const upstream = await service.fetch(new Request(remote.toString(),{
      method:request.method,headers
    }));
    const h = new Headers(upstream.headers);
    h.set('Cache-Control','private, no-store');
    h.set('X-Content-Type-Options','nosniff');
    h.delete('set-cookie');
    return new Response(request.method==='HEAD'?null:upstream.body,{status:upstream.status,headers:h});
  }
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'allow':'POST, OPTIONS'}});
  if(request.method!=='POST')return json({error:'POST_REQUIRED'},405);
  if(request.headers.get('origin') && !allowedOrigin(url,request.headers.get('origin')))
    return json({error:'CROSS_ORIGIN_DISABLED'},403);
  let body;
  try{
    const input = await request.text();
    if (input.length > 2048) return json({error:'BODY_TOO_LARGE'},413);
    body = JSON.parse(input);
  }catch{return json({error:'INVALID_JSON'},400);}
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      !route.actions.includes(body.action)) return json({error:'READ_ONLY_ACTION_REQUIRED'},403);
  if (resource !== 'exhibition' && !TOKEN.test(body.token || ''))
    return json({error:'INVALID_SHARE_TOKEN'},400);
  // Strip untrusted browser headers. Cloudflare Worker receives no spoofed student identity.
  const remote = new URL('/',route.origin);
  const payload = resource === 'exhibition' ? {action:body.action} : {action:'view',token:body.token};
  let upstream;
  try{
    upstream = await service.fetch(new Request(remote.toString(),{
      method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)
    }));
  }catch(e){console.error('PUBLIC_PREVIEW_UPSTREAM_FAILED',resource,e);return json({error:'UPSTREAM_UNAVAILABLE'},502);}
  let result;
  try {result=await upstream.json();} catch {return json({error:'UPSTREAM_INVALID_JSON'},502);}
  if(resource==='share' && upstream.ok){
    for(const m of result.models || []) if(m && typeof m.url==='string') m.url=fileProxyUrl(url,m.url);
    for(const p of result.sitePlans || []) if(p && typeof p.url==='string') p.url=fileProxyUrl(url,p.url);
    if(result.sitePlan && typeof result.sitePlan.url==='string') result.sitePlan.url=fileProxyUrl(url,result.sitePlan.url);
  }
  return json(result,upstream.status);
}
