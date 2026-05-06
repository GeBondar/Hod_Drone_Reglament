const OPENROUTER = Deno.env.get("OPENROUTER_API_KEY")!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const url = new URL(req.url);
  const target = `https://openrouter.ai${url.pathname}${url.search}`;

  const resp = await fetch(target, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER}`,
      "HTTP-Referer": "https://gebondar.github.io",
      "X-Title": "Hod Drona Reglament",
    },
    body: req.body,
  });

  const headers = new Headers(resp.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(resp.body, { status: resp.status, headers });
});
