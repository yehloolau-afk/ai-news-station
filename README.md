# AI News Station

**Live →** [yehloolau-afk.github.io/ai-news-station/](https://yehloolau-afk.github.io/ai-news-station/)

**📊 Dashboard →** [admin.html](https://yehloolau-afk.github.io/ai-news-station/admin.html) (owner-only, passcode protected)

**📰 AI Daily archive →** [daily/](https://yehloolau-afk.github.io/ai-news-station/daily/) (static pages crawlable by search & AI engines, rebuilt 3×/day via Actions)

**🕐 AI model release timeline →** [timeline/](https://yehloolau-afk.github.io/ai-news-station/timeline/) (who, which model, when, key specs — maintained from 2023 onward)

**📡 RSS →** [feed.xml](https://yehloolau-afk.github.io/ai-news-station/feed.xml)

A 7-channel AI news aggregator built for design teams. Pulls from 20+ Chinese and English sources, auto-translates, and updates every hour via GitHub Actions.

---

## Channels

| Channel | What you get |
|---|---|
| Featured | Curated highlights worth your attention |
| All | Every article from all sources |
| Official | Releases from OpenAI, Anthropic, Google, etc. |
| Launches | New products and tools |
| Design | AI x design, tools for designers |
| Video | Video generation, Sora, Kling, and more |
| Daily | Today's digest |

Plus a **Timeline** group (its own sidebar section) — the first entry is the AI model release timeline; more archives (funding, policy…) can slot in later.

---

## Sources

**Chinese media (auto-translated):** Quantum Bit · Aifaner · Geek Park · Sspai · Synced · Huxiu · 36Kr

**English media:** The Verge · TechCrunch · Wired · VentureBeat · OpenAI Blog · Anthropic · Google DeepMind · MIT Technology Review

---

## How it works

- GitHub Actions fetches and processes articles every hour
- Single HTML file reads the generated JSON data — no server needed
- Chinese articles are auto-translated via language detection

```
GitHub Actions (hourly) → fetch RSS/APIs → process + translate → write JSON → static site serves it
```

### Data pipelines (all run as Actions in this repo)

| Workflow | Frequency | Output |
|---|---|---|
| Update channel data | Hourly | `data/{featured,all,official,products,design,videos}.json` + `feed.xml` (same-origin fast data layer for first paint) |
| Build daily static pages | 3×/day | Permanent `daily/*.html` archive + `sitemap.xml` (GEO/SEO crawl layer, reused by the in-app Daily channel). Also extracts model-release candidates from the daily "model releases" section into `data/model-candidates.json` (merged into `data/models.json` after human review) and rebuilds the `timeline/` static page |
| Update analytics | 2×/day | `data/stats.json` (dashboard) |

### Loading strategy

- First paint uses `<link rel="preload">` for the Featured data — one same-origin JSON request, no CORS proxy dependency
- Stale-while-revalidate when static data is expired: show cached content first, refresh in the background via the RSS proxy path
- Desktop prefetches all channels in the background; mobile does a light prefetch (same-origin static JSON + today's daily only, no proxy, saves bandwidth)
- The Daily channel reads historical dates straight from the in-repo permanent archive, unaffected by the upstream API's 10-day retention limit

### Mobile

- Bottom tab navigation + a "More" sheet (channel group + entries for Daily archive / newsletter / dashboard)
- Translation is deferred so it never blocks first paint; Phase 2 payload is halved

---

## Stack

- Single HTML file — no framework, no backend
- GitHub Actions for scheduled data updates
- Deployed on GitHub Pages

`Claude Code` · `Vanilla HTML / CSS / JS` · `GitHub Actions` · `GitHub Pages`

---

## Analytics & dashboard

The site wires in two analytics providers and ships a self-hosted aggregated dashboard.

### Dashboard

- URL: [yehloolau-afk.github.io/ai-news-station/admin.html](https://yehloolau-afk.github.io/ai-news-station/admin.html) (a small "📊 Site data" entry sits at the bottom of the sidebar; the page is set to `noindex`)
- Requires a passcode. The passcode itself is **not** committed — only its SHA-256 hash lives in `PASS_HASH` inside `admin.html`, and it only keeps casual visitors out.
- One screen: today / last-30-day visitors and pageviews, 30-day trend chart, domestic vs. overseas split, referrers, and domestic referrer types (Baidu Tongji, pending).

**Change the passcode** — run this in the browser console:
`crypto.subtle.digest('SHA-256', new TextEncoder().encode('new-passcode')).then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))`
Replace `PASS_HASH` in `admin.html` with the output.

### Pipeline

```
GitHub Actions (daily, 09:30 / 21:30 Beijing time)
  → scripts/fetch-stats.mjs pulls from Umami / Baidu Tongji
  → writes data/stats.json and commits
  → admin.html reads and renders
```

- Manual refresh: repo Actions tab → "Update analytics" → Run workflow
- Umami uses the read-only share-link endpoint (the free plan has no API key); the share ID is stored in the repo secret `UMAMI_SHARE_ID`
- ⚠️ If the site's Share link is deleted in the Umami dashboard, the pull will fail. Recreate the Share and update the secret with `gh secret set UMAMI_SHARE_ID` (the new share ID is the segment after `/share/` in the link).

### The two analytics backends

| Backend | Purpose | Entry |
|---|---|---|
| Umami | All visitors worldwide: trend, country distribution, referrers | https://cloud.umami.is |
| Baidu Tongji | Domestic channel detail: Baidu Search, WeChat, Zhihu, etc. | https://tongji.baidu.com |

Both tracking scripts sit just before `</head>` in `index.html`.

### Wiring up the Baidu Tongji API (TODO)

The dashboard's "domestic referrer types" panel shows "not configured" because Baidu's Data Export Service has a gate: **the site's previous-day PV must exceed 100**. Once traffic clears that bar:

1. Baidu Tongji → Settings → Other Settings → **Data Export Service** → enable, and get an API Key + Secret Key
2. Open the authorization URL in a browser to obtain a code:
   `http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id={API_KEY}&redirect_uri=oob&scope=basic&display=popup`
3. Exchange the code for a refresh token:
   `http://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code={CODE}&client_id={API_KEY}&client_secret={SECRET_KEY}&redirect_uri=oob`
4. Set three repo secrets: `BAIDU_API_KEY`, `BAIDU_SECRET_KEY`, `BAIDU_REFRESH_TOKEN` (the refresh token is valid for ten years)

`scripts/fetch-stats.mjs` already contains the Baidu fetch logic — once the secrets are set it takes effect on the next run, no code change needed.

---

Star this if it is useful to you.
