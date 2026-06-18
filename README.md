# AI News Station · AI 资讯站

**Live →** [7-ai-station.netlify.app](https://7-ai-station.netlify.app/)

A 7-channel AI news aggregator built for design teams. Pulls from 20+ Chinese and English sources, auto-translates, and updates every hour via GitHub Actions.

---

## Channels

| Channel | What you get |
|---|---|
| ⭐ Featured | Curated highlights worth your attention |
| 📰 All | Every article from all sources |
| 🏢 Official | Releases from OpenAI, Anthropic, Google, etc. |
| 🚀 Launches | New products and tools |
| 🎨 Design | AI × design, tools for designers |
| 🎬 Video | Video generation, Sora, Kling, and more |
| ☀️ Daily | Today's digest |

---

## Sources

**Chinese:** 量子位 · 爱范儿 · 极客公园 · 少数派 · 机器之心 · 虎嗅 · 36kr · 差评

**English:** The Verge · TechCrunch · Wired · VentureBeat · OpenAI Blog · Anthropic · Google DeepMind · MIT Technology Review

---

## How it works

- GitHub Actions fetches and processes articles every hour
- Single HTML file reads the generated JSON data — no server
- Articles in Chinese are auto-translated with language detection

```
GitHub Actions (hourly) → fetch RSS/APIs → process + translate → write JSON → GitHub Pages serves it
```

---

## Stack

- Single HTML file — no framework, no backend
- GitHub Actions for scheduled data updates
- Deployed on Netlify + GitHub Pages

`Claude Code` · `Vanilla HTML / CSS / JS` · `GitHub Actions` · `Netlify`

---

⭐ If this is useful to you, leave a star!
