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

function clip(value, max) {
  return String(value || "").trim().slice(0, max);
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

    const email = clip(payload.email, 254).toLowerCase();
    const name = clip(payload.name, 120);
    const oabs = clip(payload.oabs, 200);
    const area = clip(payload.area, 40);
    const lawyers = clip(payload.lawyers, 20);
    const caseload = clip(payload.caseload, 20);
    const source = clip(payload.source, 80) || "advogue.ai";

    if (!EMAIL_RE.test(email) || name.length < 2) {
      return json({ error: "invalid_payload" }, 400, origin);
    }

    const createdAt = new Date().toISOString();
    try {
      await env.DB.prepare(
        `INSERT INTO waitlist (email, created_at, source, name, oabs, area, lawyers, caseload)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
           source = excluded.source,
           name = excluded.name,
           oabs = excluded.oabs,
           area = excluded.area,
           lawyers = excluded.lawyers,
           caseload = excluded.caseload`,
      )
        .bind(email, createdAt, source, name, oabs, area, lawyers, caseload)
        .run();
    } catch (err) {
      return json({ error: "unavailable" }, 503, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
