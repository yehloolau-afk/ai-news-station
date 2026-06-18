# AI News Station

**Live →** [yehloolau-afk.github.io/ai-news-station](https://yehloolau-afk.github.io/ai-news-station/)

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

---

## Stack

- Single HTML file — no framework, no backend
- GitHub Actions for scheduled data updates
- Deployed on Netlify + GitHub Pages

`Claude Code` · `Vanilla HTML / CSS / JS` · `GitHub Actions` · `Netlify`

---

Star this if it is useful to you.
