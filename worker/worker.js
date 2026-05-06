export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    // Build the upstream request to OpenRouter
    const upstream = new Request(
      `https://openrouter.ai${path}`,
      {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': request.headers.get('Origin') || 'https://gebondar.github.io',
          'X-Title': 'Hod Drona Reglament'
        },
        body: request.body
      }
    );

    let response = await fetch(upstream);

    // Copy response with CORS headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
