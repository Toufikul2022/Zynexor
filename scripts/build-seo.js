// Builds one static, indexable page per blog article (blog/<id>.html) and the sitemap.
// Articles are edited in site.js (the ARTICLES list). Run after changing them:  node scripts/build-seo.js
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'),SITE='https://www.zynexor.com',TODAY=new Date().toISOString().slice(0,10);
const js=fs.readFileSync(path.join(ROOT,'site.js'),'utf8');
const m=js.match(/var ARTICLES=(\[[\s\S]*?\n  \]);/);if(!m)throw new Error('ARTICLES not found in site.js');
const ARTICLES=Function('return '+m[1])();
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const meta=fs.existsSync(path.join(ROOT,'scripts/article-dates.json'))?JSON.parse(fs.readFileSync(path.join(ROOT,'scripts/article-dates.json'),'utf8')):{};
for(const a of ARTICLES)if(!meta[a.id])meta[a.id]=TODAY;
fs.writeFileSync(path.join(ROOT,'scripts/article-dates.json'),JSON.stringify(meta,null,2)+'\n');
const firstPara=a=>a.body.find(p=>!p.startsWith('## '));
const desc=a=>{const t=firstPara(a);return t.length>158?t.slice(0,t.lastIndexOf(' ',155))+'…':t};
for(const a of ARTICLES){
  const url=`${SITE}/blog/${a.id}`,img=`${SITE}/assets/work/${a.img}.jpg`,d=meta[a.id];
  const body=a.body.map(p=>p.startsWith('## ')?`<h2>${esc(p.slice(3))}</h2>`:`<p>${esc(p)}</p>`).join('\n      ');
  const others=ARTICLES.filter(x=>x.id!==a.id).slice(0,3).map(x=>`<li><a href="blog/${x.id}">${esc(x.t)}</a></li>`).join('');
  const ld=[{"@context":"https://schema.org","@type":"BlogPosting","headline":a.t,"description":desc(a),"image":img,"url":url,"mainEntityOfPage":url,
      "datePublished":d,"dateModified":d,"articleSection":a.cat,"inLanguage":"en",
      "author":{"@type":"Organization","name":"Zynexor","url":SITE+'/'},"publisher":{"@type":"Organization","name":"Zynexor","logo":{"@type":"ImageObject","url":SITE+'/assets/brand/zynexor-icon.png'}}},
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":SITE+'/'},{"@type":"ListItem","position":2,"name":"Blog","item":SITE+'/blog'},{"@type":"ListItem","position":3,"name":a.t,"item":url}]}];
  const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<base href="/">
<title>${esc(a.t)} | Zynexor Blog</title>
<meta name="description" content="${esc(desc(a))}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Zynexor">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(a.t)}">
<meta property="og:description" content="${esc(desc(a))}">
<meta property="og:image" content="${img}">
<meta property="article:published_time" content="${d}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="icon" type="image/png" href="assets/brand/favicon.png">
<link rel="preload" href="assets/fonts/urbanist-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="site.css">
</head>
<body data-page="blog" class="page-light">
<main class="wrap" style="padding-top:130px;padding-bottom:100px">
  <article class="article">
    <nav aria-label="Breadcrumb" class="back"><a href="./">Home</a>&nbsp;/&nbsp;<a href="blog">Blog</a></nav>
    <p class="mute" style="margin-top:28px;font-size:13px">${esc(a.cat)} · ${esc(a.read)} · <time datetime="${d}">${new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</time></p>
    <h1>${esc(a.t)}</h1>
    <video class="cover" src="assets/video/${a.img}.mp4" poster="assets/work/${a.img}.jpg" muted loop playsinline preload="none" data-auto aria-hidden="true"></video>
    <div class="body">
      ${body}
    </div>
    <p style="margin-top:40px"><button class="btn btn-accent" data-contact>Talk to us about your project ↗</button></p>
    <section class="more-reads" aria-label="More articles"><h2>More from the Zynexor blog</h2><ul>${others}</ul></section>
  </article>
</main>
<div id="foot"></div>
<script src="site.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT,'blog',a.id+'.html'),html);
}
const pages=[['/','1.0'],['/services','0.9'],['/cases','0.9'],['/about','0.8'],['/blog','0.8']];
const urls=pages.map(([p,pr])=>`  <url><loc>${SITE}${p}</loc><lastmod>${TODAY}</lastmod><priority>${pr}</priority></url>`)
  .concat(ARTICLES.map(a=>`  <url><loc>${SITE}/blog/${a.id}</loc><lastmod>${meta[a.id]}</lastmod><priority>0.7</priority></url>`));
fs.writeFileSync(path.join(ROOT,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log('built',ARTICLES.length,'article pages + sitemap');
