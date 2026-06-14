// Cloudflare Worker: fetch proxy for the disboards ROFR scraper.
//
// Why this exists: disboards' nginx/WAF blocks requests from Google Cloud's
// IP ranges, so the Firebase Function (running on GCP) gets a 403. Cloudflare's
// network is not blocked, so the Function calls this Worker, which fetches the
// page from Cloudflare's egress and relays the HTML back.
//
// It is intentionally locked down so it can't be abused as an open proxy:
//   - requires a shared secret (PROXY_SECRET) in the X-Proxy-Secret header
//   - only proxies https requests to disboards.com
//
// NOTE: the User-Agent below is cosmetic. We empirically confirmed disboards
// serves any UA (even none) from a non-datacenter IP -- the IP is what matters.
const ALLOWED_HOSTS = new Set(["www.disboards.com", "disboards.com"]);

export default {
  async fetch(request, env) {
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (!env.PROXY_SECRET || request.headers.get("x-proxy-secret") !== env.PROXY_SECRET) {
      return new Response("Forbidden", { status: 403 });
    }

    const target = new URL(request.url).searchParams.get("url");
    if (!target) {
      return new Response("Missing 'url' query param", { status: 400 });
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch {
      return new Response("Invalid 'url' query param", { status: 400 });
    }

    if (targetUrl.protocol !== "https:" || !ALLOWED_HOSTS.has(targetUrl.hostname)) {
      return new Response("Target host not allowed", { status: 403 });
    }

    const upstream = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    // Relay status + body so the Function can detect upstream failures.
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") || "text/html; charset=utf-8",
      },
    });
  },
};
