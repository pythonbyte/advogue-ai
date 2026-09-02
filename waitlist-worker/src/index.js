const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_ORIGINS = new Set([
  "https://advogue.ai",
  "https://www.advogue.ai",
  "https://pythonbyte.github.io",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
  "http://127.0.0.1:8080",
  "http://localhost:8080",
  "http://127.0.0.1:8000",
  "http://localhost:8000",
]);

function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://advogue.ai";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "invalid_json" }, 400, origin);
    }

    const email = String(payload.email || "")
      .trim()
      .toLowerCase();
    const source = String(payload.source || "advogue.ai").slice(0, 80);

    if (!EMAIL_RE.test(email)) {
      return json({ error: "invalid_email" }, 400, origin);
    }

    const createdAt = new Date().toISOString();
    try {
      await env.DB.prepare(
        "INSERT INTO waitlist (email, created_at, source) VALUES (?, ?, ?)",
      )
        .bind(email, createdAt, source)
        .run();
    } catch (err) {
      const message = String(err && err.message ? err.message : err);
      if (message.includes("UNIQUE")) {
        return json({ ok: true }, 200, origin);
      }
      return json({ error: "unavailable" }, 503, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
