// 从 data/models.json 生成「AI 模型发布时间线」静态页（GEO 抓取层）
// 站内「AI 大事记」频道读取同一份 JSON，双端内容一致

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SITE = 'https://yehloolau-afk.github.io/ai-news-station';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const { updatedAt, entries } = JSON.parse(readFileSync('data/models.json', 'utf8'));
const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

const slug = (e) => `${e.date}-${e.model.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-').replace(/^-|-$/g, '')}`;

// 按年分组
const byYear = {};
sorted.forEach((e) => { const y = e.date.slice(0, 4); (byYear[y] = byYear[y] || []).push(e); });

const body = `<h1>AI 模型发布时间线</h1>
<div class="sub">哪家 · 什么模型 · 哪天发布 · 关键规格 —— 持续维护的结构化档案，共 ${sorted.length} 条 · 更新于 ${updatedAt}</div>
${Object.entries(byYear).sort((a, b) => b[0].localeCompare(a[0])).map(([year, list]) => `
<h2 id="y${year}">${year} 年（${list.length} 条）</h2>
${list.map((e) => `<article id="${esc(slug(e))}">
<div class="meta"><span class="date">${e.date}</span><span class="company">${esc(e.company)}</span><span class="type">${esc(e.type)}</span></div>
<h3>${e.sourceUrl ? `<a href="${esc(e.sourceUrl)}" rel="noopener" target="_blank">${esc(e.model)}</a>` : esc(e.model)}</h3>
<p>${esc(e.highlight)}</p>
${e.specs?.length ? `<ul class="specs">${e.specs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
${e.sourceName ? `<div class="src">信源：${esc(e.sourceName)}</div>` : ''}
</article>`).join('\n')}`).join('\n')}`;

const description = `AI 模型发布时间线：${sorted.length} 条主流大模型发布档案（${sorted[sorted.length - 1].date.slice(0, 7)} 至 ${sorted[0].date.slice(0, 7)}），含发布日期、厂商、关键规格与官方信源，持续更新。`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AI 模型发布时间线',
  description,
  inLanguage: 'zh-CN',
  url: `${SITE}/timeline/`,
  numberOfItems: sorted.length,
  itemListElement: sorted.slice(0, 30).map((e, i) => ({
    '@type': 'ListItem', position: i + 1,
    name: `${e.company} ${e.model}（${e.date} 发布）`,
    url: `${SITE}/timeline/#${slug(e)}`,
  })),
};

mkdirSync('timeline', { recursive: true });
writeFileSync('timeline/index.html', `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI 模型发布时间线 — 哪家、什么模型、哪天发布、关键规格 | 飞翔的AI资讯站</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}/timeline/">
<meta property="og:title" content="AI 模型发布时间线 | 飞翔的AI资讯站">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="article">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",Arial,sans-serif;
    background:#f4f6f8; color:#111827; line-height:1.7; }
  .wrap { max-width:760px; margin:0 auto; padding:28px 18px 60px; }
  .top { font-size:13px; margin-bottom:18px; }
  .top a { color:#6b7280; text-decoration:none; }
  .top a:hover { color:#d92b2b; }
  h1 { font-size:24px; margin-bottom:6px; }
  .sub { font-size:13px; color:#6b7280; margin-bottom:24px; }
  h2 { font-size:17px; margin:30px 0 12px; padding-left:10px; border-left:3px solid #d92b2b; }
  article { background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; margin-bottom:10px; }
  .meta { display:flex; gap:8px; align-items:center; font-size:12px; margin-bottom:6px; flex-wrap:wrap; }
  .date { color:#d92b2b; font-weight:700; font-variant-numeric:tabular-nums; }
  .company { color:#111827; font-weight:600; }
  .type { color:#6b7280; background:#f4f6f8; padding:1px 8px; border-radius:10px; }
  article h3 { font-size:16px; margin-bottom:4px; }
  article h3 a { color:#111827; text-decoration:none; }
  article h3 a:hover { color:#d92b2b; }
  article p { font-size:13.5px; color:#4b5563; }
  .specs { list-style:none; display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
  .specs li { font-size:12px; color:#4b5563; background:#f4f6f8; border:1px solid #e5e7eb; padding:2px 8px; border-radius:10px; }
  .src { font-size:12px; color:#9ca3af; margin-top:8px; }
  footer { margin-top:40px; font-size:12px; color:#9ca3af; text-align:center; }
  footer a { color:#6b7280; }
</style>
</head>
<body>
<div class="wrap">
<div class="top"><a href="${SITE}/">← 飞翔的AI资讯站</a> · <a href="${SITE}/daily/">日报存档</a></div>
${body}
<footer>由 <a href="${SITE}/">飞翔的AI资讯站</a> 维护 · 条目均附官方信源链接 · 发现错漏欢迎指正</footer>
</div>
</body>
</html>
`);

console.log(`timeline/index.html generated: ${sorted.length} entries, ${Object.keys(byYear).length} years`);
