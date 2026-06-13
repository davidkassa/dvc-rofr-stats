# Deploying the disboards fetch proxy

This Cloudflare Worker works around disboards blocking Google Cloud IPs with a
403. The Firebase Function (on GCP) calls this Worker, which fetches the page
from Cloudflare's network and relays the HTML back.

The shared secret below gates the Worker so it can't be used as an open proxy.
It must be set in **three** places with the **same value**:

1. the Worker (Cloudflare secret `PROXY_SECRET`)
2. the prod Firebase project (`SCRAPER_PROXY_SECRET`)
3. the staging Firebase project (`SCRAPER_PROXY_SECRET`)

Generate a secret once and reuse it:

    openssl rand -hex 32

---

## 1. Deploy the Worker (personal Cloudflare account)  [DONE]

Deployed to: `https://dvc-rofr-proxy.workinghard.workers.dev`
(personal account `David.kassa@gmail.com's Account`, pinned in wrangler.toml).
`PROXY_SECRET` is set. To redeploy after code changes:

    cd worker && npx wrangler deploy

## 2. Point the Function at the Worker  [DONE]

`functions/.env` (committed) holds the non-secret Worker URL:

    SCRAPER_PROXY_URL=https://dvc-rofr-proxy.workinghard.workers.dev

Leaving it empty makes the Function fetch disboards directly (the old path).

## 3. Create the Firebase secret in BOTH projects  [TODO - needs Firebase auth]

Do this BEFORE merging to main — the Function binds this secret, so a deploy
without it will fail under `--non-interactive`.

    firebase functions:secrets:set SCRAPER_PROXY_SECRET --project prod      # dvc-rofr-stats
    firebase functions:secrets:set SCRAPER_PROXY_SECRET --project staging   # dvc-rofr-stats-dev

## 4. Ship

Merge to `main` (prod) / push to the staging branch. After the next `hourly_job`
run, confirm the warning line is gone:

    processDisBoardsData finished with N of M thread(s) failing.
