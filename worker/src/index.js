// Cloudflare Worker: fetch proxy for the disboards ROFR scraper.
//
// Why this exists: disboards' nginx/WAF blocks requests from Google Cloud's
// IP ranges, so the Firebase Function (running on GCP) gets a 403. Cloudflare's
// network is not blocked, so the Function calls this Worker, which fetches the
// page from Cloudflare's egress and relays the HTML back.
//
// Since 2026-08-11 disboards also fronts the forum with a "stile" bot
// mitigation layer: an unrecognised client is 307'd to /.stile/challenge and
// served a "Checking your browser" interstitial. The interstitial ships a JS
// proof-of-work, but it also carries the site's own no-JavaScript fallback
// ("Continue without JavaScript"), which is a plain link chain ending in a
// __stile_clr clearance cookie. This Worker walks that fallback chain rather
// than running the proof-of-work -- fewer moving parts, and it is the path the
// site itself offers to clients that don't execute JS.
//
// It is intentionally locked down so it can't be abused as an open proxy:
//   - requires a shared secret (PROXY_SECRET) in the X-Proxy-Secret header
//   - only proxies https requests to disboards.com, on every hop
//
// NOTE: the User-Agent below is cosmetic. We empirically confirmed disboards
// serves any UA (even none) from a non-datacenter IP -- the IP is what matters.
const ALLOWED_HOSTS = new Set(["www.disboards.com", "disboards.com"]);

// The challenge chain is: target -> 307 -> /.stile/challenge (interstitial)
// -> /.stile/challenge/verify -> meta-refresh back to the target with a
// ?__stile_resume= token. Four hops in practice; the cap is slack for retries.
const MAX_HOPS = 10;

// Markers that mean "this is an interstitial, not the page we asked for".
const CHALLENGE_MARKERS = ["/.stile/", "__stile_resume", "Checking your browser"];

// Best-effort clearance cache. Worker isolates are recycled freely and this is
// deliberately not KV: a cold isolate just re-walks the chain (3 extra
// requests, once). __stile_clr is a session cookie, so it is re-earned on
// expiry the same way.
let cachedCookies = "";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const parseCookieHeader = (header) => {
  const jar = new Map();
  for (const part of (header || "").split(";")) {
    const pair = part.trim();
    const eq = pair.indexOf("=");
    if (eq > 0) {
      jar.set(pair.slice(0, eq), pair.slice(eq + 1));
    }
  }
  return jar;
};

const serializeJar = (jar) =>
  [...jar].map(([name, value]) => `${name}=${value}`).join("; ");

const collectSetCookies = (response, jar) => {
  // getSetCookie() keeps multiple Set-Cookie headers separate; the older
  // single-header read folds them together and would corrupt values.
  const headers =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [response.headers.get("set-cookie")].filter(Boolean);

  for (const header of headers) {
    const pair = header.split(";")[0].trim();
    const eq = pair.indexOf("=");
    if (eq > 0) {
      jar.set(pair.slice(0, eq), pair.slice(eq + 1));
    }
  }
};

// Resolve a possibly-relative hop and refuse to leave the allowlisted hosts,
// so a redirect can never turn this into an open proxy.
const resolveHop = (location, baseUrl) => {
  const url = new URL(location, baseUrl);
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
    throw new Error(`Refusing to follow hop off-site: ${url.hostname}`);
  }
  return url.toString();
};

const looksLikeChallenge = (html) =>
  CHALLENGE_MARKERS.some((marker) => html.includes(marker));

// The chain is driven by <meta http-equiv="refresh"> and plain <a href> links,
// neither of which fetch() follows on its own.
const findNextHop = (html, baseUrl) => {
  const meta = html.match(
    /<meta[^>]+http-equiv=["']refresh["'][^>]*content=["'][^"']*?url=([^"']+)["']/i
  );
  if (meta) {
    return resolveHop(meta[1].replace(/&amp;/g, "&"), baseUrl);
  }

  const link = html.match(/href=["'](\/\.stile\/[^"']+)["']/i);
  if (link) {
    return resolveHop(link[1].replace(/&amp;/g, "&"), baseUrl);
  }

  return null;
};

// Fetch `target`, transparently completing the stile challenge if one is
// served. Redirects are followed manually so Set-Cookie on the intermediate
// hops (where the clearance is actually issued) isn't lost.
const fetchThroughChallenge = async (target) => {
  const jar = parseCookieHeader(cachedCookies);
  let url = target;

  for (let hop = 0; hop < MAX_HOPS; hop++) {
    const cookies = serializeJar(jar);
    const response = await fetch(url, {
      headers: cookies ? { ...BROWSER_HEADERS, Cookie: cookies } : BROWSER_HEADERS,
      redirect: "manual",
    });
    collectSetCookies(response, jar);

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return { response, body: "" };
      }
      url = resolveHop(location, url);
      continue;
    }

    const body = await response.text();
    const next = looksLikeChallenge(body) ? findNextHop(body, url) : null;
    if (!next) {
      // Landed on real content. Keep the clearance for the next invocation.
      if (jar.has("__stile_clr")) {
        cachedCookies = serializeJar(jar);
      }
      return { response, body };
    }

    url = next;
  }

  return { exhausted: true };
};

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

    let result;
    try {
      result = await fetchThroughChallenge(targetUrl.toString());
    } catch (error) {
      return new Response(`Proxy error: ${error.message}`, { status: 502 });
    }

    // Never relay an interstitial as if it were the page: the caller checks
    // response.ok, and a 200 challenge page would surface downstream as a
    // bogus "thread markup changed" parse error.
    if (result.exhausted) {
      return new Response(
        `Bot challenge not cleared after ${MAX_HOPS} hops`,
        { status: 502 }
      );
    }

    // Relay status + body so the Function can detect upstream failures.
    return new Response(result.body, {
      status: result.response.status,
      headers: {
        "Content-Type":
          result.response.headers.get("content-type") || "text/html; charset=utf-8",
      },
    });
  },
};
