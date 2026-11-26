export async function onRequest({ request, env }) {
  const url = new URL(request.url)
  const json = (body, status) => Response.json(body, { status, headers: { 'cache-control': 'private, no-store' } })
  if (url.pathname !== '/_jax_feedback' && url.pathname !== '/_jax_feedback/') return json({ error: 'Not found.' }, 404)
  if (request.method !== 'POST') return json({ error: 'POST required.' }, 405)
  if (request.headers.get('origin') && request.headers.get('origin') !== url.origin) return json({ error: 'Origin not allowed.' }, 403)
  const headers = new Headers({ 'content-type': request.headers.get('content-type') || '' })
  // Only signed assertions are forwarded; the Worker asks Admin to verify them.
  let jwt = request.headers.get('cf-access-jwt-assertion') || request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!jwt) {
    const cookie = (request.headers.get('cookie') || '').match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1]
    try { if (cookie) jwt = decodeURIComponent(cookie) } catch { return json({ error: 'Invalid access session.' }, 403) }
  }
  if (jwt) headers.set('cf-access-jwt-assertion', jwt)
  if (request.headers.has('content-length')) headers.set('content-length', request.headers.get('content-length'))
  try {
    const upstream = new Request('https://jaxtwin-platform-feedback.xzc0318.workers.dev/', {
      method: 'POST', headers, body: request.body, duplex: 'half'
    })
    return env.JAX_PLATFORM_FEEDBACK?.fetch ? await env.JAX_PLATFORM_FEEDBACK.fetch(upstream) : await fetch(upstream)
  } catch { return json({ error: 'Feedback is temporarily unavailable. Your draft has not been sent.' }, 503) }
}