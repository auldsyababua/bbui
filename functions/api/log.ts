// Cloudflare Pages Function to capture client-side logs
export async function onRequest(context: any) {
  const { request, env } = context;
  
  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const logs = await request.json();
    
    // Log to console (will be captured by wrangler tail)
    console.log(JSON.stringify({
      type: 'client_log',
      timestamp: new Date().toISOString(),
      url: request.url,
      logs: Array.isArray(logs) ? logs : [logs],
      headers: {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
      },
    }));

    // You could also store in KV, R2, or send to an analytics service
    // if (env.LOGS_KV) {
    //   await env.LOGS_KV.put(
    //     `log_${Date.now()}_${crypto.randomUUID()}`,
    //     JSON.stringify(logs),
    //     { expirationTtl: 86400 * 7 } // 7 days
    //   );
    // }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error processing logs:', error);
    return new Response(JSON.stringify({ error: 'Failed to process logs' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}