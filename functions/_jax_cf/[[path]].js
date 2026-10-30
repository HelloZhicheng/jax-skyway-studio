/**
 * JAXTWIN cloudflare-migration PREVIEW gateway.
 * Public Share/Exhibition and authenticated instructor/Admin routes.
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

  // Same-origin Cloudflare backend routes. Keep old student identifiers
  // (username + UF email) and let each Worker validate its own requests.
  // This gateway never sends requests to Supabase.
  const BACKENDS = {
    guest: 'https://jaxtwin-guest.xzc0318.workers.dev',
    display: 'https://jaxtwin-display-area.xzc0318.workers.dev',
    review: 'https://jaxtwin-review.xzc0318.workers.dev'
  };
  if (Object.prototype.hasOwnProperty.call(BACKENDS, resource)) {
    if (request.headers.get('origin') && !allowedOrigin(url,request.headers.get('origin')))
      return json({error:'CROSS_ORIGIN_DISABLED'},403);
    const destinations = {guest:'JAX_GUEST',display:'JAX_DISPLAY',review:'JAX_REVIEW'};
    const binding = env[destinations[resource]];
    // Direct route fallback avoids requiring new bindings just to read.
    const base = BACKENDS[resource];
    const path = resource==='guest' ? (
      extra.length===0 ? '/guest' :
      extra[0]==='_r2_download' ? '/_r2_download' :
      ['_r2_upload','_r2_part','_r2_complete'].includes(extra[0]) ? '/'+extra.join('/') : null
    ) : resource==='display' ? (extra.length===0?'/':null) :
         (extra.length===0?'/':extra.length===1&&extra[0]==='instructor'?'/instructor':null);
    if(path===null) return json({error:'NOT_FOUND'},404);
    if(resource==='review' && path==='/instructor')
      return json({error:'INSTRUCTOR_ACCESS_NOT_CONFIGURED'},403);
    const upstreamUrl = new URL(path+url.search,base);
    const backendHeaders = new Headers();
    for(const name of ['content-type','range','content-length'])
      if(request.headers.has(name)) backendHeaders.set(name,request.headers.get(name));
    // Do not forward browser cookies, spoofable identities, or Preview Origin to Workers.
    let payload;
    if(['GET','HEAD','OPTIONS'].includes(request.method)){
      payload = new Request(upstreamUrl,{method:request.method,headers:backendHeaders});
    } else if(['POST','PUT'].includes(request.method)) {
      payload = new Request(upstreamUrl,{method:request.method,headers:backendHeaders,body:request.body});
    } else return json({error:'METHOD_NOT_ALLOWED'},405);
    let response;
    try {
      response = binding?.fetch ? await binding.fetch(payload) : await fetch(payload);
    } catch(e) {
      console.error('CLOUDFLARE_BACKEND_ERROR',resource,e);
      return json({error:'CLOUDFLARE_BACKEND_UNAVAILABLE',resource},502);
    }
    // Rewrite guest-generated upload/download URLs so the browser stays on Pages.
    if(resource==='guest' && request.method==='POST' && response.headers.get('content-type')?.includes('json')){
      let body;try{body=await response.json()}catch{return json({error:'INVALID_BACKEND_JSON'},502)}
      const rewrite = value=>{
        if(typeof value==='string' && value.startsWith(base+'/'))
          return url.origin+'/_jax_cf/guest'+value.slice(base.length);
        if(Array.isArray(value))return value.map(rewrite);
        if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,rewrite(v)]));
        return value;
      };
      return json(rewrite(body),response.status);
    }
    return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers:response.headers});
  }



  if(resource==='admin') {
    // Verify Cloudflare Access-signed identity in the Admin Worker.
    // The Pages Service Binding does NOT transport ctx.access.
    const review=extra.length===1 && extra[0]==='review';
    const file=extra.length===1 && extra[0]==='file';
    if(extra.length>1 || (extra.length===1 && !review && !file))
      return json({error:'NOT_FOUND'},404);
    if(file ? !['GET','HEAD'].includes(request.method) : request.method!=='POST')
      return json({error:'METHOD_NOT_ALLOWED'},405);
    if(request.headers.get('origin') && !allowedOrigin(url,request.headers.get('origin')))
      return json({error:'CROSS_ORIGIN_DISABLED'},403);
    if(!env.JAX_ADMIN || typeof env.JAX_ADMIN.fetch!=='function')
      return json({error:'MISSING_ADMIN_SERVICE_BINDING'},503);
    let source;
    if(!file) {
      source=await request.text();
      if(source.length>(review?500000:8192)) return json({error:'BODY_TOO_LARGE'},413);
      let body;
      try{body=JSON.parse(source)}catch{return json({error:'INVALID_JSON'},400)}
      if(!body||typeof body!=='object'||Array.isArray(body))
        return json({error:'OBJECT_REQUIRED'},400);
      const actions=review
        ? ['list','create_session','get','rename_session','delete_session','save_scene','delete_scene']
        : ['whoami','list','view','schema_check'];
      if(!actions.includes(body.action)) return json({error:'ADMIN_ACTION_NOT_ALLOWED'},403);
    }
    const headerJwt=request.headers.get('cf-access-jwt-assertion');
    const cookies=request.headers.get('cookie')||'';
    const cookieJwt=cookies.match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1]||'';
    let jwt=headerJwt;
    try{if(!jwt && cookieJwt) jwt=decodeURIComponent(cookieJwt);}catch{return json({error:'INVALID_ACCESS_COOKIE'},403)}
    if(!jwt) return json({error:'CLOUDFLARE_ACCESS_REQUIRED'},403);
    const origin='https://jaxtwin-admin.xzc0318.workers.dev';
    const target=new URL(file?'/file'+url.search:review?'/review':'/',origin);
    const headers=new Headers({'cf-access-jwt-assertion':jwt});
    if(file && request.headers.get('range')) headers.set('range',request.headers.get('range'));
    if(!file)headers.set('content-type','application/json');
    let upstream;
    try{
      upstream=await env.JAX_ADMIN.fetch(new Request(target,{
        method:request.method,headers,body:file?undefined:source
      }));
    }catch(e){
      console.error('ADMIN_SERVICE_UNAVAILABLE',e);
      return json({error:'ADMIN_SERVICE_UNAVAILABLE'},502);
    }
    if(file) {
      const h=new Headers(upstream.headers);
      h.set('cache-control','private, no-store');
      h.delete('set-cookie');
      return new Response(request.method==='HEAD'?null:upstream.body,{status:upstream.status,headers:h});
    }
    let result;
    try{result=await upstream.json()}catch{return json({error:'INVALID_ADMIN_RESPONSE'},502)}
    if(upstream.ok) {
      const rewrite=v=>{
        if(typeof v==='string' && v.startsWith(origin+'/file?'))
          return url.origin+'/_jax_cf/admin/file?'+v.slice((origin+'/file?').length);
        if(Array.isArray(v)) return v.map(rewrite);
        if(v && typeof v==='object')
          return Object.fromEntries(Object.entries(v).map(([k,vv])=>[k,rewrite(vv)]));
        return v;
      };
      result=rewrite(result);
    }
    return json(result,upstream.status);
  }

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
