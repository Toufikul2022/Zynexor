// Service pages, case study pages, static (crawlable) footer and blog links, RSS, sitemap, llms.txt and llms-full.txt.
const fs=require('fs'),path=require('path');
module.exports=function({ROOT,SITE,TODAY,ARTICLES,esc,inline,plain,isList,isFaq,faqs,render,meta,firstPara,desc}){
const SERV=JSON.parse(fs.readFileSync(path.join(ROOT,'content/services.json'),'utf8'));
const CASES=JSON.parse(fs.readFileSync(path.join(ROOT,'content/cases.json'),'utf8'));
const ORG={"@type":"Organization","@id":SITE+"/#org","name":"Zynexor","url":SITE+"/"};
const byKey=k=>CASES.find(c=>c.key===k);
const W=(...p)=>fs.writeFileSync(path.join(ROOT,...p.slice(0,-1)),p[p.length-1]);
for(const d of ['services','cases'])fs.mkdirSync(path.join(ROOT,d),{recursive:true});

// ---------- static footer (seen by crawlers that do not run JavaScript; site.js replaces it with the designed footer) ----------
const li=(h,t)=>`<li><a href="${h}">${esc(t)}</a></li>`;
const FOOT=`<footer class="seo-foot wrap" aria-label="Site links">
<nav><h2>Services</h2><ul>${SERV.map(x=>li('services/'+x.id,x.name)).join('')}</ul></nav>
<nav><h2>Case studies</h2><ul>${CASES.map(c=>li('cases/'+c.id,c.client)).join('')}</ul></nav>
<nav><h2>Latest articles</h2><ul>${ARTICLES.slice(0,6).map(a=>li('blog/'+a.id,a.t)).join('')}</ul></nav>
<nav><h2>Zynexor</h2><ul>${li('./','Home')}${li('about','About us')}${li('cases','All case studies')}${li('blog','Blog')}</ul>
<p>Digital agency for branding, websites, apps and social media in Canada, the USA and Bangladesh. Email <a href="mailto:infozynexor@gmail.com">infozynexor@gmail.com</a> or <a href="https://calendly.com/zynexor/30min">book a free 30-minute call</a>.</p></nav>
</footer>`;

// ---------- shared page template ----------
function page({url,title,description,ogType,ld,crumbs,eyebrow,h1,img,metaHtml,body,related,ctaCase}){
  const bc=crumbs.map(([n,h],i)=>i<crumbs.length-1?`<a href="${h}">${esc(n)}</a>`:'').filter(Boolean).join('&nbsp;/&nbsp;');
  ld=ld.concat([{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":crumbs.map(([n,h],i)=>({"@type":"ListItem","position":i+1,"name":n,"item":SITE+'/'+h.replace(/^\.\//,'')}))}]);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<base href="/">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Zynexor">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/assets/work/${img}.jpg">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="icon" type="image/png" href="assets/brand/favicon.png">
<link rel="preload" href="assets/fonts/urbanist-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="site.css">
</head>
<body data-page="${ogType==='article'?'cases':'services'}" class="page-light">
<main class="wrap" style="padding-top:130px;padding-bottom:100px">
  <article class="article">
    <nav aria-label="Breadcrumb" class="back">${bc}</nav>
    <p class="mute" style="margin-top:28px;font-size:13px">${esc(eyebrow)}</p>
    <h1>${esc(h1)}</h1>
    ${metaHtml||''}
    <video class="cover" src="assets/video/${img}.mp4" poster="assets/work/${img}.jpg" muted loop playsinline preload="none" data-auto aria-hidden="true"></video>
    <div class="body">
      ${body}
    </div>
    <p class="cta-row"><button class="btn btn-accent" data-book>Book a free call ↗</button><button class="btn btn-ghost" data-contact>Write to us</button>${ctaCase?`<button class="btn btn-ghost" data-case="${ctaCase}">View project screens</button>`:''}</p>
    <section class="more-reads" aria-label="Related"><h2>Related</h2><ul>${related}</ul></section>
  </article>
</main>
<div id="foot">${FOOT}</div>
<script src="site.js"></script>
</body>
</html>
`;}

// ---------- service pages ----------
for(const s of SERV){
  const url=`${SITE}/services/${s.id}`,d=desc(s),fq=faqs(s);
  const ld=[{"@context":"https://schema.org","@type":"Service","name":s.name,"serviceType":s.name,"description":d,"url":url,"provider":ORG,
    "areaServed":[{"@type":"Country","name":"Canada"},{"@type":"Country","name":"United States"}],"image":`${SITE}/assets/work/${s.img}.jpg`}];
  if(fq.length)ld.push({"@context":"https://schema.org","@type":"FAQPage","mainEntity":fq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))});
  const related=s.cases.map(byKey).filter(Boolean).map(c=>li('cases/'+c.id,'Case study: '+c.client)).join('')+SERV.filter(x=>x.id!==s.id).slice(0,2).map(x=>li('services/'+x.id,x.name)).join('');
  W('services',s.id+'.html',page({url,title:s.title,description:d,ogType:'website',ld,crumbs:[['Home','./'],['Services','services'],[s.name,'services/'+s.id]],
    eyebrow:'Services · Canada & USA',h1:s.t,img:s.img,body:s.body.map(render).join('\n      '),related}));
}
// ---------- case study pages ----------
for(const c of CASES){
  const url=`${SITE}/cases/${c.id}`,d=desc(c);
  const ld=[{"@context":"https://schema.org","@type":"Article","headline":c.t,"description":d,"url":url,"image":`${SITE}/assets/work/${c.img}.jpg`,"author":ORG,"publisher":ORG,
    "about":{"@type":"Organization","name":c.client},"keywords":c.services.join(', '),"datePublished":meta['case:'+c.id]||TODAY}];
  const metaHtml=`<dl class="case-facts"><div><dt>Client</dt><dd>${esc(c.client)}</dd></div><div><dt>Industry</dt><dd>${esc(c.industry)}</dd></div>${c.location?`<div><dt>Location</dt><dd>${esc(c.location)}</dd></div>`:''}<div><dt>Services</dt><dd>${esc(c.services.join(', '))}</dd></div></dl>`;
  const svc=SERV.filter(s=>s.cases.includes(c.key)).map(s=>li('services/'+s.id,s.name)).join('');
  const related=svc+CASES.filter(x=>x.id!==c.id).slice(0,2).map(x=>li('cases/'+x.id,'Case study: '+x.client)).join('');
  W('cases',c.id+'.html',page({url,title:`${c.client} case study | Zynexor`,description:d,ogType:'article',ld,crumbs:[['Home','./'],['Cases','cases'],[c.client,'cases/'+c.id]],
    eyebrow:'Case study · '+c.industry,h1:c.t,img:c.img,metaHtml,body:c.body.map(render).join('\n      '),related,ctaCase:c.key}));
}
// ---------- static footer + crawlable blog links on the main pages ----------
for(const f of ['index','about','services','cases','blog'].map(n=>n+'.html').concat(ARTICLES.map(a=>'blog/'+a.id+'.html'))){
  const p=path.join(ROOT,f);let h=fs.readFileSync(p,'utf8');
  h=h.replace(/<div id="foot">[\s\S]*?<\/div>\n<script src="site.js"><\/script>/,`<div id="foot">${FOOT}</div>\n<script src="site.js"></script>`);
  if(f==='blog.html'){
    h=h.replace(/<div class="agrid" id="agrid">[\s\S]*?<\/div>\n<\/main>/,`<div class="agrid" id="agrid">${ARTICLES.map(a=>`<a class="atile" href="blog/${a.id}"><span class="meta">${esc(a.read)} <i>|</i> ${esc(a.cat)}</span><h3>${esc(a.t)}</h3></a>`).join('')}</div>\n</main>`);
    if(!h.includes('application/rss+xml'))h=h.replace('<link rel="icon"','<link rel="alternate" type="application/rss+xml" title="Zynexor Blog" href="https://www.zynexor.com/rss.xml">\n<link rel="icon"');
  }
  fs.writeFileSync(p,h);
}
// ---------- RSS ----------
const rssDate=d=>new Date(d+'T12:00:00Z').toUTCString();
W('rss.xml',`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Zynexor Blog</title><link>${SITE}/blog</link><description>Branding, web design, apps and digital growth for businesses in Canada and the USA.</description><language>en</language>
${ARTICLES.map(a=>`<item><title>${esc(a.t)}</title><link>${SITE}/blog/${a.id}</link><guid>${SITE}/blog/${a.id}</guid><pubDate>${rssDate(meta[a.id])}</pubDate><category>${esc(a.cat)}</category><description>${esc(desc(a))}</description></item>`).join('\n')}
</channel></rss>
`);
// ---------- sitemap ----------
const u=(p,pr,lm)=>`  <url><loc>${SITE}${p}</loc><lastmod>${lm||TODAY}</lastmod><priority>${pr}</priority></url>`;
W('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[u('/','1.0'),u('/services','0.9'),...SERV.map(s=>u('/services/'+s.id,'0.9')),u('/cases','0.8'),...CASES.map(c=>u('/cases/'+c.id,'0.7')),u('/about','0.7'),u('/blog','0.8'),
  ...ARTICLES.map(a=>u('/blog/'+a.id,'0.7',meta[a.id]))].join('\n')}
</urlset>
`);
// ---------- llms.txt and llms-full.txt ----------
const head=`# Zynexor

> Zynexor is a digital agency that designs and builds brands, websites, web apps, mobile apps and social media campaigns for growing businesses. Founded in 2023, the team of designers, developers and marketers works across Canada, the USA and Bangladesh, serving clients in Canada and the USA.

Contact: infozynexor@gmail.com · Book a free 30-minute intro call: https://calendly.com/zynexor/30min · Website: ${SITE}

## Key facts
- Services: branding, website design and development, mobile app design and development, UI/UX for SaaS and dashboards, social media marketing
- Team locations: Canada, USA, Bangladesh; works remotely with clients across Canada and the USA
- Process: discover (week 1), design (weeks 2–4), build (weeks 4–8), launch and grow (ongoing)
- Typical timelines: brand 3–6 weeks; small-business website 6–10 weeks; app MVP about 3–6 months
- Pricing: fixed price for clear scopes after a free discovery call; monthly retainers for ongoing work
- Clients own all final files, code and accounts
`;
W('llms.txt',head+`
## Services
${SERV.map(s=>`- [${s.name}](${SITE}/services/${s.id}): ${firstPara(s).split(/(?<=[.?!])\s/)[0]}`).join('\n')}

## Case studies
${CASES.map(c=>`- [${c.client}](${SITE}/cases/${c.id}): ${c.t.split(': ').slice(1).join(': ')||c.t}`).join('\n')}

## Company
- [About Zynexor](${SITE}/about): story (2023–2026), values, team in Canada, the USA and Bangladesh

## Blog
${ARTICLES.map(a=>`- [${a.t}](${SITE}/blog/${a.id}): ${firstPara(a).split(/(?<=[.?!])\s/)[0]}`).join('\n')}

## Optional
- [Full text of all services, case studies and articles](${SITE}/llms-full.txt)
`);
const txt=x=>x.body.map(b=>b.startsWith('#')?'\n'+b+'\n':plain(b)).join('\n\n');
W('llms-full.txt',head+'\n'+SERV.map(s=>`\n---\n\n# ${s.t}\nURL: ${SITE}/services/${s.id}\n\n${txt(s)}`).join('\n')
  +CASES.map(c=>`\n---\n\n# ${c.t}\nURL: ${SITE}/cases/${c.id}\nClient: ${c.client} · Industry: ${c.industry}${c.location?' · Location: '+c.location:''} · Services: ${c.services.join(', ')}\n\n${txt(c)}`).join('\n')
  +ARTICLES.map(a=>`\n---\n\n# ${a.t}\nURL: ${SITE}/blog/${a.id}\n\n${txt(a)}`).join('\n')+'\n');
console.log('pages:',SERV.length,'services,',CASES.length,'cases; footer, rss, sitemap, llms files updated');
};
