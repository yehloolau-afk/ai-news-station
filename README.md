# AI News Station

**Live →** [yehloolau-afk.github.io/ai-news-station/](https://yehloolau-afk.github.io/ai-news-station/)

**📊 数据看板 →** [admin.html](https://yehloolau-afk.github.io/ai-news-station/admin.html)（站长专用，需口令）

**📰 AI 日报存档 →** [daily/](https://yehloolau-afk.github.io/ai-news-station/daily/)（每日静态页，搜索引擎与 AI 引擎可抓取，Actions 每天三次自动更新）

**📡 RSS 订阅 →** [feed.xml](https://yehloolau-afk.github.io/ai-news-station/feed.xml)

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

### 数据管道（全部在本仓库 Actions 运行）

| 工作流 | 频率 | 产出 |
|---|---|---|
| 更新频道数据 | 每小时 | `data/{featured,all,official,products,design,videos}.json` + `feed.xml`（页面首屏的同源快速数据层） |
| 生成日报静态页 | 每天 3 次 | `daily/*.html` 永久存档 + `sitemap.xml`（GEO/SEO 抓取层，站内日报频道同源复用） |
| 更新访问统计 | 每天 2 次 | `data/stats.json`（数据看板） |

### 加载策略

- 首屏 `<link rel="preload">` 预载精选数据，同源 JSON 一次请求出内容，无 CORS 代理依赖
- 静态数据过期时 stale-while-revalidate：先展示旧内容，后台走 RSS 代理路径刷新
- 桌面端全量后台预取；移动端轻量预取（仅同源静态 JSON + 今日日报，不走代理，省流量）
- 日报频道历史日期直接读仓库内永久存档，不受上游 API 仅保留 10 天的限制

### 移动端

- 底部 Tab 导航 + 「更多」浮层（频道分组 + 日报存档 / 订阅周报 / 站点数据入口）
- 翻译延迟执行不阻塞首屏，Phase 2 数据量减半

---

## Stack

- Single HTML file — no framework, no backend
- GitHub Actions for scheduled data updates
- Deployed on Netlify + GitHub Pages

`Claude Code` · `Vanilla HTML / CSS / JS` · `GitHub Actions` · `Netlify`

---

## 访问统计与数据看板

站点接入了两套访问统计，并自建了一个聚合数据看板。

### 数据看板

- 地址：[yehloolau-afk.github.io/ai-news-station/admin.html](https://yehloolau-afk.github.io/ai-news-station/admin.html)（站点侧边栏底部有「📊 站点数据」小入口，页面已设 noindex）
- 需要输入访问口令（口令不写在公开仓库里；口令的 SHA-256 哈希存在 `admin.html` 的 `PASS_HASH`，仅用于挡路人）
- 一屏展示：今日/近30天访客与浏览量、30 天趋势图、国内/海外占比、来源渠道、国内来源类型（百度统计，待接入）

**修改口令**：浏览器控制台运行
`crypto.subtle.digest('SHA-256', new TextEncoder().encode('新口令')).then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))`
把输出替换 `admin.html` 里的 `PASS_HASH` 即可。

### 数据管道

```
GitHub Actions（每天北京时间 09:30 / 21:30）
  → scripts/fetch-stats.mjs 拉取 Umami / 百度统计
  → 写入 data/stats.json 并提交
  → admin.html 读取渲染
```

- 手动更新数据：仓库 Actions 页 → 「更新访问统计」→ Run workflow
- Umami 走分享链接的只读接口（免费版没有 API key），分享 ID 存在仓库 Secret `UMAMI_SHARE_ID`
- ⚠️ 如果在 Umami 后台删除了该网站的 Share 链接，数据拉取会失败；重新创建 Share 后用
  `gh secret set UMAMI_SHARE_ID` 更新即可（新分享 ID 是链接 `/share/` 后面那段）

### 两个统计后台

| 后台 | 用途 | 入口 |
|---|---|---|
| Umami | 国内外全部访客：趋势、国家分布、来源 | https://cloud.umami.is |
| 百度统计 | 国内渠道细节：百度搜索、微信、知乎等占比 | https://tongji.baidu.com |

统计脚本都挂在 `index.html` 的 `</head>` 前。

### 以后接入百度统计 API（待办）

看板里「国内来源类型」目前显示未配置，原因是百度「数据导出服务」有开通门槛：**站点昨日 PV > 100**。等流量达标后：

1. 百度统计后台 → 使用设置 → 其它设置 → **数据导出服务** → 开通，得到 API Key 和 Secret Key
2. 浏览器打开授权链接获取 code：
   `http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id={API_KEY}&redirect_uri=oob&scope=basic&display=popup`
3. 用 code 换 refresh token：
   `http://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code={CODE}&client_id={API_KEY}&client_secret={SECRET_KEY}&redirect_uri=oob`
4. 配置三个仓库 Secrets：`BAIDU_API_KEY`、`BAIDU_SECRET_KEY`、`BAIDU_REFRESH_TOKEN`（refresh token 有效期十年）

`scripts/fetch-stats.mjs` 已内置百度数据的拉取逻辑，Secrets 配好后下一次运行自动生效，无需改代码。

---

Star this if it is useful to you.
