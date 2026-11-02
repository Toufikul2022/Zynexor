/* Zynexor shared behaviour: chrome (nav, CTA, footer, modals), scroll effects, galleries, blog data. */
(function(){
  var EMAIL='hello@zynexor.com';           // TODO: replace with your real address
  var FORM_ENDPOINT='';                     // TODO: paste a Formspree (or similar) URL to receive messages
  var SOCIAL={instagram:'#',behance:'#',linkedin:'#',facebook:'#',x:'#'}; // TODO: your profile links
  var LOCATION='Worldwide · Remote';        // TODO: your city and country, e.g. 'Dhaka - Bangladesh'
  var W='assets/work/', V='assets/video/';
  var page=document.body.getAttribute('data-page')||'home';
  var light=document.body.classList.contains('page-light');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- shared data ---------- */
  var CASES={
    amc:{t:'A&M Canadian Immigration Law',i:['amc-about','amc-lawyer','amc-services','amc-pnp-roadmap','amc-news','amc-blog','amc-mindmap','amc-pathways','amc-footer']},
    trustlayer:{t:'TrustLayer AI',i:['trustlayer-landing','trustlayer-dashboard','trustlayer-analytics']},
    socialboost:{t:'SocialBoost AI',i:['socialboost-landing','socialboost-generator','socialboost-mobile']},
    styleb:{t:'Style.Bd',i:['styleb-home','styleb-feed','styleb-trending','styleb-shop','styleb-profile','styleb-messages']},
    sabbir:{t:'Sabbir LIVE',i:['sabbir-home','sabbir-tiktok','sabbir-shorts','sabbir-reels','sabbir-contact','sabbir-footer']},
    funpark:{t:'Funpark Indoor Amusement Center',i:['funpark-tuesday','funpark-everything','funpark-discount','funpark-jump','funpark-allinone','funpark-christmas','funpark-bounce','funpark-newyear']},
    crm:{t:'Immigration Consultancy CRM',i:['crm-reports','crm-meetings']}
  };
  var ARTICLES=[
    {id:'website-that-sells',cat:'Design',t:'How a clear website turns visitors into clients',img:'amc-services',read:'5 min read',
     body:['Most service websites fail for the same reason: they describe the business instead of answering the visitor. A person who lands on a law firm, clinic or agency site arrives with one question. Can you help me, and what happens next?',
     '## Start with the question',
     'When we designed the A&M Canadian Immigration Law website, every page began with a real client question. Which stream fits me? What are the latest draw results? Who will handle my file? The services directory, lawyer profile and live draw tables each answer one of those questions directly.',
     '## Make the next step obvious',
     'Each page ends with a single action, such as booking an appointment or reading the next guide. Visitors should never have to hunt for it. A clear next step does more for conversions than any visual flourish.',
     '## Keep it fresh',
     'Search engines and people both reward sites that stay current. A simple news and case-law library gives the firm a reason to publish regularly and gives clients a reason to come back.']},
    {id:'trust-for-ai',cat:'Design',t:'Designing trust into AI products',img:'trustlayer-landing',read:'6 min read',
     body:['AI tools ask people to hand over data and decisions. That only works when the product earns trust at every step.',
     '## Show what the system knows',
     'For TrustLayer AI we built a tool registry that lists every AI tool a team uses, with its risk level and data handling. Making the invisible visible is the first step toward trust.',
     '## Turn policy into a guided flow',
     'Policies are usually long documents nobody reads. A step-by-step policy generator turns them into short choices that teams can finish in minutes.',
     '## Let customers see it too',
     'A public trust portal lets a company prove its AI practices to clients. Good design here is calm, factual and easy to scan.']},
    {id:'scroll-stopping-posts',cat:'Social media',t:'What makes a social post stop the scroll',img:'funpark-bounce',read:'4 min read',
     body:['People decide in under a second whether to stop on a post. Three things decide it: one big idea, real faces and a reason to act now.',
     '## One idea per post',
     'Our Funpark posts each carry a single message, such as "Bounce Mode" or "Everything 50% off". Big type and strong photography do the work. Small print stays small.',
     '## Use the real place',
     'Real kids, real trampolines and real staff beat stock imagery every time. They show the experience instead of describing it.',
     '## Build a rhythm',
     'A recurring offer like Discount Tuesday trains followers to expect and share your posts. Seasonal posts for Christmas and New Year keep the feed warm between offers.']},
    {id:'live-shopping-app',cat:'Success story',t:'Designing a live shopping app for mobile-first buyers',img:'styleb-feed',read:'5 min read',
     body:['Style.Bd brings fashion sellers and buyers together in Bangladesh, where most shopping starts on a phone and many purchases begin in a live video.',
     '## Shopping as entertainment',
     'The trending feed and live shopping tabs borrow the patterns people already know from social apps. Buyers can like, comment and buy without leaving the stream.',
     '## Trust signals everywhere',
     'Verified seller badges, clear order status and in-app messaging reduce the worry of buying from someone new.',
     '## Small screens, big thumbs',
     'Every action sits within thumb reach, and the bottom bar keeps the five key areas one tap away.']},
    {id:'brand-system',cat:'Branding',t:'Why your brand needs a system, not just a logo',img:'socialboost-landing',read:'4 min read',
     body:['A logo is a signature. A brand system is the handwriting: colour, type, spacing, imagery and tone that make everything you publish feel like you.',
     '## Consistency builds recognition',
     'When SocialBoost AI launched, the same purple gradients, rounded type and confident headlines ran across the landing page, the app and every social post. People recognise the product before they read its name.',
     '## Systems save time',
     'With clear rules, your team can produce new pages and posts quickly without a designer checking every detail.',
     '## Start small',
     'A good starter system needs only a logo, two typefaces, a short colour palette and a few layout examples. You can grow it as the business grows.']},
    {id:'one-crm',cat:'Success story',t:'From spreadsheets to one CRM',img:'crm-meetings',read:'5 min read',
     body:['Growing service businesses often run on spreadsheets, inboxes and memory. It works until a lead slips through the cracks.',
     '## Map the real workflow',
     'For an immigration consultancy we followed a client from first enquiry to final file and designed a CRM around it: leads, deals, clients, projects, tasks, meetings and reports.',
     '## Calendars people actually use',
     'Meetings live in a clear monthly view with upcoming appointments on the side, so the whole team sees the day at a glance.',
     '## Reports that answer questions',
     'Revenue by month, lead sources and conversion by stage turn daily work into decisions.']}
  ];
  /* video helper: every work visual is a looping muted video with its still image as poster */
  function vid(name,cls,label){
    return '<video'+(cls?' class="'+cls+'"':'')+' src="'+V+name+'.mp4" poster="'+W+name+'.jpg" muted loop playsinline preload="none" data-auto'+
      (label?' aria-label="'+label.replace(/"/g,'&quot;')+'"':' aria-hidden="true"')+'></video>';
  }
  window.ZX={CASES:CASES,ARTICLES:ARTICLES,W:W,V:V,vid:vid};

  /* ---------- chrome ---------- */
  var links=[['cases.html','Cases','cases'],['services.html','Service','services'],['blog.html','Blog','blog'],['about.html','About us','about']];
  var navHTML='<nav class="pill-nav" id="pillNav" aria-label="Main">'+
    '<a class="logo" href="index.html" aria-label="Zynexor home"><img src="assets/brand/zynexor-icon.png" alt="Zynexor"></a>'+
    '<div class="pill-links">'+links.map(function(l){return '<a href="'+l[0]+'"'+(page===l[2]?' aria-current="page"':'')+'>'+l[1]+'</a>'}).join('')+'</div>'+
    '<button class="p-book" data-contact>Book a call</button>'+
    '<button class="p-contact" data-contact>Contact</button>'+
    '<button class="p-menu" id="pMenu" aria-label="Open menu"><span></span><span></span></button></nav>'+
    '<div class="m-menu" id="mMenu"><button class="close" id="mClose" aria-label="Close menu">✕</button>'+
    links.map(function(l){return '<a href="'+l[0]+'">'+l[1]+'</a>'}).join('')+'</div>'+
    '<button class="float-cta" data-contact>Book a call <span aria-hidden="true">↗</span></button>';
  document.body.insertAdjacentHTML('afterbegin',navHTML);

  var cols='<div><h4>Cases</h4><ul>'+['A&amp;M Immigration','TrustLayer AI','SocialBoost AI','Style.Bd','Sabbir LIVE','Funpark'].map(function(c){return '<li><a href="cases.html">'+c+'</a></li>'}).join('')+'</ul></div>'+
    '<div><h4>Services</h4><ul><li><a href="services.html">Complex solution</a></li><li><a href="services.html#branding">Branding</a></li><li><a href="services.html#design">Design</a></li><li><a href="services.html#development">Development</a></li></ul></div>'+
    '<div><h4>About us</h4><ul><li><a href="about.html#numbers">Numbers</a></li><li><a href="about.html#mission">Mission</a></li><li><a href="about.html#values">Values</a></li><li><a href="about.html#clients">Clients</a></li></ul></div>';
  var soc='<div class="socials">'+'<a href="'+SOCIAL.facebook+'" aria-label="Facebook" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V9c0-.6.4-1 1-1z" fill="currentColor"/></svg></a>'+'<a href="'+SOCIAL.behance+'" aria-label="Behance" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6h6.2c2 0 3.3 1 3.3 2.7 0 1.2-.7 2-1.6 2.3 1.3.3 2.1 1.3 2.1 2.7C12 15.8 10.5 17 8.3 17H2zm3 2.3v2.4h2.6c.8 0 1.3-.5 1.3-1.2S8.4 8.3 7.6 8.3zm0 4.5v2.8h3c.9 0 1.5-.6 1.5-1.4s-.6-1.4-1.5-1.4zM15 6.5h5.5V8H15zM17.8 9.4c2.6 0 4 1.8 3.9 4.6h-6c.1 1.3.9 2 2.1 2 .8 0 1.4-.3 1.7-.9h2.1c-.5 1.8-2 2.8-3.9 2.8-2.6 0-4.2-1.7-4.2-4.3 0-2.5 1.7-4.2 4.3-4.2zm-2 3.4h3.9c-.1-1.1-.8-1.8-1.9-1.8s-1.8.7-2 1.8z" fill="currentColor"/></svg></a>'+'<a href="'+SOCIAL.instagram+'" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="16.8" cy="7.2" r="1.3" fill="currentColor"/></svg></a>'+'<a href="'+SOCIAL.x+'" aria-label="X" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4.6l3.9 5.3L17 4h2.6l-5.9 6.9L20.5 20h-4.6l-4.2-5.7L6.7 20H4.1l6.3-7.3z" fill="currentColor"/></svg></a>'+'<a href="'+SOCIAL.linkedin+'" aria-label="LinkedIn" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="9" width="3.6" height="11" fill="currentColor"/><circle cx="5.8" cy="5.6" r="2.1" fill="currentColor"/><path d="M10 9h3.4v1.6c.6-1 1.9-1.9 3.6-1.9 3 0 4 1.9 4 4.9V20h-3.6v-5.6c0-1.4-.3-2.6-1.8-2.6s-2 1.1-2 2.6V20H10z" fill="currentColor"/></svg></a>'+'</div>';
  var foot=document.getElementById('foot');
  if(foot){
    if(light){
      foot.innerHTML='<div class="wrap"><div class="foot-light"><span>© '+new Date().getFullYear()+' Zynexor. All rights reserved.</span><a href="index.html">Back to zynexor home →</a></div></div>';
    }else{
      foot.innerHTML='<section class="wrap cta-wrap"><div class="cta" id="ctaCard">'+
        '<div class="cta-copy"><h2>Innovate<br>with us</h2><p>Our creative solutions help businesses launch faster, look credible and expand their reach.</p>'+
        '<div class="btns"><button class="btn btn-write" data-contact>Write us</button><button class="btn btn-book" data-contact>Book a call</button></div></div>'+
        '<div class="cta-art" aria-hidden="true"><div class="dev">'+
          '<div class="dl"><i></i><i></i></div>'+
          '<div class="w-rev"><span class="ico"><svg viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span><div><i class="ln"></i><b>$ 264,2K</b></div></div>'+
          '<div class="w-vis"><i class="ln"></i><i class="bar"><em></em></i><b>56K<sup>▲ 14%</sup></b></div>'+
          '<div class="w-stat"><span>Visit statistics</span><svg viewBox="0 0 280 110"><g class="g"><path d="M8 0V100M45 0V100M82 0V100M119 0V100M156 0V100M193 0V100M230 0V100M267 0V100"/></g><polyline points="8,92 45,84 64,58 98,58 119,30 156,44 193,28 230,30 267,14"/><g class="d"><circle cx="45" cy="84" r="4"/><circle cx="64" cy="58" r="4"/><circle cx="98" cy="58" r="4"/><circle cx="119" cy="30" r="4"/><circle cx="156" cy="44" r="4"/><circle cx="193" cy="28" r="4"/><circle cx="230" cy="30" r="4"/><circle cx="267" cy="14" r="4"/></g></svg><div class="mo"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span></div>'+
            '<div class="rate"><span>Rate<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="1.6"/></svg></span><b>+ 58%</b></div></div>'+
          '<div class="w-roi"><span><i>▮▮</i>ROI</span><svg viewBox="0 0 60 24"><path d="M2 20c6-2 6-12 12-10s4 10 10 8 6-14 12-12 4 10 10 8 6-8 12-8" fill="none" stroke="#fff" stroke-width="1.4"/></svg><b>312%</b><small>Return on investment</small><em>+ 20,1%</em></div>'+
          '<div class="mo2"><span>Mar</span><span>Apr</span></div>'+
        '</div></div></div></section>'+
        '<footer class="foot"><div class="wrap"><div class="foot-top">'+cols+
        '<div class="foot-mail"><a class="big" href="mailto:'+EMAIL+'">'+EMAIL+'</a>'+soc+'</div></div>'+
        '<div class="foot-bot"><span>Copyright © '+new Date().getFullYear()+' Zynexor. All rights reserved.</span><span>'+LOCATION+'</span></div></div></footer>';
    }
  }

  document.body.insertAdjacentHTML('beforeend',
    '<dialog class="modal" id="contactModal" aria-label="Contact Zynexor"><form class="modal-in" id="contactForm" novalidate>'+
    '<button type="button" class="x" id="cClose" aria-label="Close">✕</button>'+
    '<h2>Let\'s talk</h2><p class="mute" style="font-size:14px">Tell us about your project. We reply within one business day.</p>'+
    '<div class="fld"><label for="c-name">Name</label><input id="c-name" name="name" autocomplete="name" required></div>'+
    '<div class="fld"><label for="c-email">Email</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>'+
    '<div class="fld"><label for="c-msg">Project</label><textarea id="c-msg" name="message" required></textarea></div>'+
    '<button class="btn btn-accent" type="submit">Send message ↗</button>'+
    '<div class="mail-row">Or email <code id="cMail">'+EMAIL+'</code><button type="button" id="cCopy">Copy</button></div>'+
    '<p class="note" id="cNote" role="status"></p></form></dialog>'+
    '<dialog class="lb" id="lb" aria-label="Case gallery"><div class="lb-in"><div class="lb-head"><div><h3 id="lbT"></h3><span id="lbC"></span></div><button class="lb-b" id="lbX" aria-label="Close gallery">✕</button></div>'+
    '<div class="lb-stage"><video id="lbI" muted loop playsinline autoplay></video><button class="lb-b lb-prev" id="lbP" aria-label="Previous">←</button><button class="lb-b lb-next" id="lbN" aria-label="Next">→</button></div><div class="lb-th" id="lbTh"></div></div></dialog>');

  /* nav: expanded at top and when scrolling up; compact when scrolling down */
  var nav=document.getElementById('pillNav'),lastY=scrollY;
  function navState(){var y=scrollY;if(y<80||y<lastY-4)nav.classList.add('open');else if(y>lastY+4)nav.classList.remove('open');lastY=y}
  addEventListener('scroll',navState,{passive:true});navState();
  nav.addEventListener('mouseenter',function(){nav.classList.add('open')});
  var mm=document.getElementById('mMenu');
  document.getElementById('pMenu').addEventListener('click',function(){mm.classList.add('show')});
  document.getElementById('mClose').addEventListener('click',function(){mm.classList.remove('show')});
  mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mm.classList.remove('show')})});

  /* contact modal */
  var cm=document.getElementById('contactModal'),cf=document.getElementById('contactForm'),note=document.getElementById('cNote');
  document.addEventListener('click',function(e){var t=e.target.closest('[data-contact]');if(t){e.preventDefault();note.textContent='';cm.showModal?cm.showModal():cm.setAttribute('open','')}});
  document.getElementById('cClose').addEventListener('click',function(){cm.close()});
  cm.addEventListener('click',function(e){if(e.target===cm)cm.close()});
  document.getElementById('cCopy').addEventListener('click',function(){
    var b=this;function sel(){var r=document.createRange();r.selectNodeContents(document.getElementById('cMail'));var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected'}
    try{navigator.clipboard.writeText(EMAIL).then(function(){b.textContent='Copied'},sel)}catch(e){sel()}
  });
  cf.addEventListener('submit',function(e){
    e.preventDefault();
    if(!cf.checkValidity()){note.textContent='Please fill in your name, a valid email and a short message.';return}
    if(!FORM_ENDPOINT){note.textContent='The form is not connected yet. Please email '+EMAIL+'.';return}
    note.textContent='Sending…';
    fetch(FORM_ENDPOINT,{method:'POST',body:new FormData(cf),headers:{Accept:'application/json'}})
      .then(function(r){if(!r.ok)throw 0;cf.reset();note.textContent='Thanks! We received your message.'})
      .catch(function(){note.textContent='Sending failed. Please email '+EMAIL+' instead.'});
  });

  /* lightbox */
  var lb=document.getElementById('lb'),lbI=document.getElementById('lbI'),lbTh=document.getElementById('lbTh'),cur,idx=0;
  function show(n){idx=(n+cur.i.length)%cur.i.length;lbI.poster=W+cur.i[idx]+'.jpg';lbI.src=V+cur.i[idx]+'.mp4';lbI.setAttribute('aria-label',cur.t+' screen '+(idx+1));lbI.muted=true;var pp=lbI.play();if(pp&&pp.catch)pp.catch(function(){});document.getElementById('lbC').textContent=(idx+1)+' / '+cur.i.length;
    lbTh.querySelectorAll('button').forEach(function(b,j){b.classList.toggle('on',j===idx)})}
  function openCase(k){cur=CASES[k];if(!cur)return;document.getElementById('lbT').textContent=cur.t;lbTh.innerHTML='';
    cur.i.forEach(function(n,j){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Image '+(j+1));b.innerHTML='<img src="'+W+n+'.jpg" alt="" loading="lazy">';b.onclick=function(){show(j)};lbTh.appendChild(b)});
    lb.showModal?lb.showModal():lb.setAttribute('open','');show(0)}
  document.addEventListener('click',function(e){var t=e.target.closest('[data-case]');if(t){e.preventDefault();openCase(t.getAttribute('data-case'))}});
  document.getElementById('lbX').onclick=function(){lb.close()};
  lb.addEventListener('close',function(){lbI.pause();lbI.removeAttribute('src');lbI.load()});
  document.getElementById('lbP').onclick=function(){show(idx-1)};
  document.getElementById('lbN').onclick=function(){show(idx+1)};
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
  var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(sx==null)return;var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(idx+(d<0?1:-1));sx=null});

  /* headings: wrap each word so it can lift and light up on hover */
  document.querySelectorAll('.h-xl,.h-l,.h-m,.h-s,.ab-title,.sv-h,.sv-title span,.hero h1,.st-item h3,.bx-card h3,.cta h2,.article h1').forEach(function(h){
    if(h.classList.contains('hx'))return;h.classList.add('hx');
    var walk=document.createTreeWalker(h,NodeFilter.SHOW_TEXT,null),nodes=[],n;while(n=walk.nextNode())nodes.push(n);
    nodes.forEach(function(t){if(!t.nodeValue.trim())return;var f=document.createDocumentFragment();
      t.nodeValue.split(/(\s+)/).forEach(function(part){if(!part)return;if(/^\s+$/.test(part)){f.appendChild(document.createTextNode(part))}else{var s=document.createElement('span');s.className='hw';s.textContent=part;f.appendChild(s)}});
      t.parentNode.replaceChild(f,t)});
  });

  /* letter-spaced line: characters brighten one by one */
  document.querySelectorAll('.spaced').forEach(function(el){
    if(reduce)return;var txt=el.textContent;el.setAttribute('aria-label',txt);el.textContent='';
    var cs=txt.split('').map(function(c){var s=document.createElement('span');s.className='c';s.setAttribute('aria-hidden','true');s.textContent=c;el.appendChild(s);return s});
    var k=0;(function step(){if(k<cs.length){cs[k++].classList.add('on');setTimeout(step,22)}})();
  });

  /* scroll-scrubbed paragraphs: words light up as they cross the viewport */
  var scrubs=[];
  document.querySelectorAll('.scrub').forEach(function(el){
    if(reduce)return;var words=el.textContent.trim().split(/\s+/);el.setAttribute('aria-label',el.textContent.trim());el.textContent='';
    var ws=words.map(function(w){var s=document.createElement('span');s.className='sw-word';s.setAttribute('aria-hidden','true');s.textContent=w+' ';el.appendChild(s);return s});
    scrubs.push({el:el,ws:ws});
  });
  function scrub(){scrubs.forEach(function(o){var r=o.el.getBoundingClientRect(),vh=innerHeight;var inH=innerWidth>860&&o.el.closest('.hz-track');var p=inH?(innerWidth*0.95-r.left)/(innerWidth*0.75):(vh*0.85-r.top)/(r.height+vh*0.35);p=Math.max(0,Math.min(1,p));var n=Math.round(p*o.ws.length);o.ws.forEach(function(w,i){w.classList.toggle('on',i<n)})})}
  if(scrubs.length){addEventListener('scroll',scrub,{passive:true});addEventListener('resize',scrub);scrub()}

  /* bento: fast switching between project videos, shuffling brand tiles, live widgets */
  function onScreen(el,cb){if(!('IntersectionObserver' in window)){cb(true);return}new IntersectionObserver(function(es){es.forEach(function(e){cb(e.isIntersecting)})},{rootMargin:'100px 0px'}).observe(el)}
  var URLS={'socialboost-landing':'SocialBoost AI','amc-about':'A&M Immigration Law','sabbir-home':'Sabbir LIVE','trustlayer-landing':'TrustLayer AI','amc-services':'A&M Immigration · Services'};
  document.querySelectorAll('[data-switch]').forEach(function(box){
    var items=[].slice.call(box.querySelectorAll('.sw-item')),i=0,timer=null,ms=+box.getAttribute('data-switch')||1700,url=box.parentNode.querySelector('.url');
    items.forEach(function(v){v.muted=true});
    var dl=box.getAttribute('data-dots')&&box.closest('.cv-media')?box.closest('.cv-media').querySelectorAll('.sw-dots i'):null,dots=dl&&dl.length?[].slice.call(dl):null;if(dots)dots[0].classList.add('on');
    function play(v){var p=v.play();if(p&&p.catch)p.catch(function(){})}
    function step(){
      var cur=items[i];i=(i+1)%items.length;var nx=items[i];
      nx.preload='auto';try{nx.currentTime=0}catch(e){}play(nx);
      cur.classList.remove('on');cur.classList.add('out');nx.classList.remove('out');nx.classList.add('on');
      setTimeout(function(){cur.classList.remove('out');cur.pause()},450);
      if(url){var k=(nx.getAttribute('src')||'').split('/').pop().replace('.mp4','');if(URLS[k])url.textContent=URLS[k]}
      if(dots)dots.forEach(function(d,k){d.classList.toggle('on',k===i)});
      items[(i+1)%items.length].preload='auto';
    }
    onScreen(box,function(vis){if(vis&&!timer){if(!reduce){play(items[i]);timer=setInterval(step,ms)}}else if(!vis&&timer){clearInterval(timer);timer=null;items[i].pause()}});
  });

  var tilesBox=document.getElementById('bxTiles');
  if(tilesBox){
    var G=['M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z','M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10z','M4 4h16v6h-6v10H4z','M12 2l10 10-10 10L2 12z','M3 12a9 9 0 0 1 18 0h-6a3 3 0 0 0-6 0z','M6 3h6a7 7 0 0 1 0 14H10v4H6zm4 4v6h2a3 3 0 0 0 0-6z','M2 6l5-3 5 6 5-6 5 3-6 7 6 7-5 3-5-6-5 6-5-3 6-7z','M12 3l3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z','M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 3.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z','M12 2c5 4 5 16 0 20-5-4-5-16 0-20zM2 12c4-5 16-5 20 0-4 5-16 5-20 0z'];
    var T=[].slice.call(tilesBox.children);
    function svg(k){return '<svg viewBox="0 0 24 24"><path d="'+G[k]+'"/></svg>'}
    T.forEach(function(t,k){t.innerHTML=svg(k%G.length)});
    T[0].classList.add('a');T[7].classList.add('g');
    var tt=null,tick=0;
    function shuffle(){
      tick++;
      var t=T[Math.floor(Math.random()*T.length)];t.classList.add('flip');
      setTimeout(function(){t.innerHTML=svg(Math.floor(Math.random()*G.length));t.classList.remove('flip')},180);
      if(tick%5===0){var a=T.filter(function(x){return!x.classList.contains('g')});var na=a[Math.floor(Math.random()*a.length)];T.forEach(function(x){x.classList.remove('a')});na.classList.add('a')}
      if(tick%7===0){var b=T.filter(function(x){return!x.classList.contains('a')});var nb=b[Math.floor(Math.random()*b.length)];T.forEach(function(x){x.classList.remove('g')});nb.classList.add('g')}
    }
    onScreen(tilesBox,function(v){if(v&&!tt&&!reduce)tt=setInterval(shuffle,320);else if(!v&&tt){clearInterval(tt);tt=null}});
  }

  var cal=document.querySelector('.wg-cal');
  if(cal){
    var ds=[].slice.call(cal.querySelectorAll('.d[data-d]')),ring=document.getElementById('goalRing'),gn=document.getElementById('goalN'),roi=document.getElementById('roiN'),ct=null,ci=3;
    ds[8].classList.add('ev');ds[17].classList.add('ev');ds[24].classList.add('ev');
    function hop(){ds.forEach(function(d){d.classList.remove('sel')});ci=(ci+1+Math.floor(Math.random()*3))%ds.length;ds[ci].classList.add('sel');
      var n=8+Math.floor(Math.random()*8);gn.textContent=n;var pc=Math.round(n/15*100);ring.style.background='conic-gradient(var(--accent) '+pc+'%,#333 0)';ring.firstChild.textContent=pc+'%';
      roi.textContent='+'+(8+Math.floor(Math.random()*14))+'%'}
    ds[ci].classList.add('sel');
    onScreen(cal,function(v){if(v&&!ct&&!reduce)ct=setInterval(hop,900);else if(!v&&ct){clearInterval(ct);ct=null}});
  }

  /* client tiles: play the project video on hover and tilt toward the cursor */
  document.querySelectorAll('.cl').forEach(function(t){
    var v=t.querySelector('.cl-v');if(v)v.muted=true;
    t.addEventListener('mouseenter',function(){if(v&&!reduce){v.preload='auto';var p=v.play();if(p&&p.catch)p.catch(function(){})}});
    t.addEventListener('mouseleave',function(){if(v)v.pause();t.style.removeProperty('--rx');t.style.removeProperty('--ry')});
    t.addEventListener('mousemove',function(e){if(reduce)return;var r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      t.style.setProperty('--ry',(x*8).toFixed(2)+'deg');t.style.setProperty('--rx',(-y*8).toFixed(2)+'deg')});
  });

  /* stats: cards slide/tilt in from below, sit flat mid-screen, and tilt out at the top */
  var scs=document.querySelectorAll('.sc');
  if(scs.length&&!reduce){
    function stats(){
      var vh=innerHeight;
      scs.forEach(function(el){
        var r=el.getBoundingClientRect(),c=r.top+r.height/2;
        var t=Math.max(-1,Math.min(1,(c-vh*0.5)/(vh*0.75)));     // -1 leaving top, 0 centre, +1 entering bottom
        var dir=+el.getAttribute('data-dir')||1,base=parseFloat(getComputedStyle(el).getPropertyValue('--base'))||0;
        var e=t*Math.abs(t);                                        // ease: calm in the middle, faster at the edges
        el.style.setProperty('--sx',(dir*e*90).toFixed(1)+'px');
        el.style.setProperty('--sy',(e*120).toFixed(1)+'px');
        el.style.setProperty('--sr',(base*Math.max(0,t)*2+dir*e*9).toFixed(2)+'deg');
        el.style.setProperty('--ss',(1-Math.abs(e)*0.14).toFixed(3));
        el.style.setProperty('--so',(1-Math.max(0,Math.abs(t)-0.55)*1.6).toFixed(3));
      });
    }
    addEventListener('scroll',stats,{passive:true});addEventListener('resize',stats);stats();
  }

  /* stages: rotate the device wheel with scroll progress; fade text by distance from the middle */
  var split=document.getElementById('stSplit'),wheel=document.getElementById('stWheel');
  if(split&&wheel){
    var sItems=split.querySelectorAll('.st-item');
    function stages(){
      if(innerWidth<=860)return;
      var vh=innerHeight,c=vh/2,p=0;
      sItems.forEach(function(it,i){var r=it.getBoundingClientRect(),mid=r.top+r.height/2,d=(mid-c)/r.height;
        it.style.opacity=(1-Math.min(1,Math.abs(d))*0.8).toFixed(3);
        if(d<=0)p=Math.max(p,i-d);});
      var first=sItems[0].getBoundingClientRect();if(first.top+first.height/2>c)p=-((first.top+first.height/2-c)/first.height);
      p=Math.max(-0.6,Math.min(sItems.length-1+0.6,p));
      wheel.style.setProperty('--p',p.toFixed(4));
    }
    addEventListener('scroll',stages,{passive:true});addEventListener('resize',stages);stages();
  }

  /* projects table: portrait preview glides beside the hovered row; soft chime per row */
  var pv=document.getElementById('pPreview'),ptab=document.querySelector('.ptable');
  if(pv&&ptab){
    var pimg=pv.querySelector('video');pimg.muted=true;
    var ty=0,cy=0,lastY=0,raf=null;
    function loop(){cy+=(ty-cy)*0.18;var vel=ty-cy;pv.style.setProperty('--py',cy.toFixed(1)+'px');pv.style.setProperty('--pr',Math.max(-8,Math.min(8,vel*0.15)).toFixed(2)+'deg');raf=Math.abs(ty-cy)>0.3?requestAnimationFrame(loop):null}
    ptab.addEventListener('mousemove',function(e){var r=ptab.getBoundingClientRect();ty=e.clientY-r.top;pv.style.setProperty('--px',(r.width*0.8)+'px');if(!raf)raf=requestAnimationFrame(loop)});
    document.querySelectorAll('.prow').forEach(function(r,i){
      r.addEventListener('mouseenter',function(){var n=r.getAttribute('data-img');if(pimg.getAttribute('data-n')!==n){pimg.setAttribute('data-n',n);pimg.poster=W+n+'.jpg';pimg.src=V+n+'.mp4'}var pp=pimg.play();if(pp&&pp.catch)pp.catch(function(){});pv.classList.add('on');chime(i)});
    });
    ptab.addEventListener('mouseleave',function(){pv.classList.remove('on');pimg.pause()});
  }

  /* hover sound: a short synthesized two-partial chime (no audio files). Browsers only allow audio after the visitor clicks or taps once. */
  var AC=null,soundOn=true,unlocked=false;
  try{soundOn=localStorage.getItem('zx-sound')!=='off'}catch(e){}
  function unlock(){if(unlocked)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();unlocked=true}catch(e){}}
  ['pointerdown','keydown','touchstart'].forEach(function(ev){addEventListener(ev,unlock,{passive:true})});
  var SCALE=[659.25,739.99,880,987.77,1108.73,1318.51,1479.98,1760];   /* E major pentatonic, bright and soft */
  function chime(i){
    if(!soundOn||!unlocked||!AC||AC.state!=='running')return;
    var t=AC.currentTime,f=SCALE[i%SCALE.length],out=AC.createGain();out.gain.setValueAtTime(0.0001,t);out.connect(AC.destination);
    out.gain.exponentialRampToValueAtTime(0.09,t+0.012);out.gain.exponentialRampToValueAtTime(0.0001,t+0.55);
    [[1,'sine',1],[2.01,'sine',0.25],[3.0,'triangle',0.08]].forEach(function(p){var o=AC.createOscillator(),g=AC.createGain();o.type=p[1];o.frequency.setValueAtTime(f*p[0],t);g.gain.value=p[2];o.connect(g);g.connect(out);o.start(t);o.stop(t+0.6)});
  }
  var sb=document.getElementById('sndBtn');
  function paintSnd(){if(!sb)return;sb.setAttribute('aria-pressed',soundOn?'true':'false');sb.querySelector('.lbl').textContent=soundOn?'Sound on':'Sound off'}
  if(sb){paintSnd();sb.addEventListener('click',function(){soundOn=!soundOn;try{localStorage.setItem('zx-sound',soundOn?'on':'off')}catch(e){}paintSnd();unlock();if(soundOn)setTimeout(function(){chime(2)},30)})}

  /* autoplay videos only while on screen (saves data and battery); posters show when paused */
  function playable(v){v.muted=true;v.setAttribute('muted','');v.playsInline=true}
  var vio='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){
    var v=e.target;if(e.isIntersecting){if(reduce)return;var p=v.play();if(p&&p.catch)p.catch(function(){})}else if(!v.paused)v.pause()})},{rootMargin:'200px 0px'}):null;
  function watch(root){(root.querySelectorAll?root:document).querySelectorAll('video[data-auto]').forEach(function(v){if(v._zx)return;v._zx=1;playable(v);if(vio)vio.observe(v);else if(!reduce)v.play()})}
  watch(document);
  if('MutationObserver' in window)new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.matches&&n.matches('video[data-auto]'))watch(n.parentNode);else watch(n)}})})}).observe(document.body,{childList:true,subtree:true});

  /* hero: device flattens as you scroll; widgets drift with the mouse */
  var dev=document.getElementById('heroDevice');
  if(dev&&!reduce){
    function tilt(){var r=dev.getBoundingClientRect(),p=Math.max(0,Math.min(1,1-(r.top-innerHeight*.15)/(innerHeight*.75)));dev.style.setProperty('--tilt',(18*(1-p)).toFixed(2)+'deg');dev.style.setProperty('--sc',(.96+.04*p).toFixed(3))}
    addEventListener('scroll',tilt,{passive:true});addEventListener('resize',tilt);tilt();
    var fws=document.querySelectorAll('.fw[data-depth]');
    addEventListener('mousemove',function(e){if(scrollY>innerHeight)return;var dx=e.clientX/innerWidth-.5,dy=e.clientY/innerHeight-.5;
      fws.forEach(function(f){var d=+f.getAttribute('data-depth');f.style.setProperty('--mx',(-dx*d).toFixed(1)+'px');f.style.setProperty('--my',(-dy*d).toFixed(1)+'px')})});
  }

  /* ================= services page ================= */
  var cv=document.getElementById('stars');
  if(cv){
    var cx=cv.getContext('2d'),S=[],dpr=Math.min(2,window.devicePixelRatio||1),mx=0,my=0,sraf=null,heroVis=true;
    function sizeStars(){var r=cv.getBoundingClientRect();cv.width=r.width*dpr;cv.height=r.height*dpr;S=[];var n=Math.round(r.width*r.height/9000);
      for(var i=0;i<n;i++)S.push({x:Math.random(),y:Math.random(),r:Math.random()*1.3+.3,p:Math.random()*6.28,s:.5+Math.random()*1.5,d:Math.random()*14+2})}
    function draw(t){cx.clearRect(0,0,cv.width,cv.height);
      S.forEach(function(s){var a=.25+.55*(0.5+0.5*Math.sin(s.p+t*0.001*s.s));cx.globalAlpha=a;cx.fillStyle='#fff';cx.beginPath();
        cx.arc((s.x*cv.width)+mx*s.d*dpr,(s.y*cv.height)+my*s.d*dpr,s.r*dpr,0,6.283);cx.fill()});
      cx.globalAlpha=1;sraf=heroVis&&!reduce?requestAnimationFrame(draw):null}
    sizeStars();draw(0);addEventListener('resize',function(){sizeStars();if(!sraf)draw(0)});
    cv.parentNode.addEventListener('mousemove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
    onScreen(cv,function(v){heroVis=v;if(v&&!sraf&&!reduce)sraf=requestAnimationFrame(draw)});
    var ow=document.getElementById('orbitWord'),words=['Ideation','Strategy','Design','Build','Launch','Growth'],wi=0;
    if(ow&&!reduce)setInterval(function(){ow.classList.add('swap');setTimeout(function(){wi=(wi+1)%words.length;ow.textContent=words[wi];ow.classList.remove('swap')},350)},2600);
  }
  document.querySelectorAll('.sv-vis').forEach(function(v){onScreen(v,function(on){if(on){v.classList.add('in-view');
    v.querySelectorAll('[data-count]').forEach(function(el){if(el._done)return;el._done=1;var to=+el.getAttribute('data-count'),t0=performance.now();
      (function tick(t){var p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)})(t0)})}})});
  /* weekly visitor pills keep breathing */
  var wk=document.querySelectorAll('.wd-week .pills i');
  if(wk.length&&!reduce)setInterval(function(){wk.forEach(function(i){i.style.setProperty('--h',(30+Math.round(Math.random()*62))+'%')})},2200);

  /* development: tech pills switch the editor preview and type a snippet */
  var dd=document.getElementById('devData'),pills=document.querySelectorAll('.dv-pill');
  if(dd&&pills.length){
    var DATA=JSON.parse(dd.textContent),stageV=[].slice.call(document.querySelectorAll('.dv-item')),code=document.getElementById('dvCode'),cur=0,typer=null,auto=null;
    function hl(s){var esc=function(x){return x.replace(/&/g,'&amp;').replace(/</g,'&lt;')};var out='',re=/(\/\/[^\n]*)|("[^"\n]*"?)|\b(import|from|export|default|function|return|const|foreach|as|GET|Route|if)\b/g,last=0,m;
      while((m=re.exec(s))){out+=esc(s.slice(last,m.index));out+='<span class="'+(m[1]?'c':m[2]?'s':'k')+'">'+esc(m[0])+'</span>';last=re.lastIndex}return out+esc(s.slice(last))}
    function type(txt){clearInterval(typer);var n=0;code.innerHTML='';if(reduce){code.innerHTML=hl(txt);return}
      typer=setInterval(function(){n+=2;code.innerHTML=hl(txt.slice(0,n));if(n>=txt.length)clearInterval(typer)},28)}
    function pick(i){cur=i;pills.forEach(function(p,k){p.classList.toggle('on',k===i);p.setAttribute('aria-selected',k===i)});
      stageV.forEach(function(v,k){if(k===i){v.preload='auto';v.muted=true;var pp=v.play();if(pp&&pp.catch)pp.catch(function(){});v.classList.add('on')}else{v.classList.remove('on');v.pause()}});type(DATA[i].code)}
    pills.forEach(function(p,k){p.addEventListener('click',function(){pick(k);clearInterval(auto);auto=null})});
    onScreen(code.parentNode,function(v){if(v&&!auto&&!reduce){pick(cur);auto=setInterval(function(){pick((cur+1)%pills.length)},3600)}else if(!v&&auto){clearInterval(auto);auto=null}});
    pick(0);
  }

  /* marketing assets: a fanned deck that deals the next card to the front */
  var deckEl=document.getElementById('deck');
  if(deckEl){
    var cards=[].slice.call(deckEl.children),front=0,dt=null;
    function layout(){var n=cards.length;cards.forEach(function(c,k){var pos=(k-front+n)%n,v=c.querySelector('video');
      var visible=pos<3;c.style.setProperty('--x',[100,52,0,0,0,0][pos]);c.style.setProperty('--ry',['-8deg','-18deg','-24deg','-24deg','-24deg','-24deg'][pos]);
      c.style.setProperty('--s',[1,.86,.74,.7,.7,.7][pos]);c.style.setProperty('--z',10-pos);c.style.setProperty('--o',visible?1:0);c.style.setProperty('--b',[1,.75,.55,.5,.5,.5][pos]);
      if(v){v.muted=true;if(pos===0){v.preload='auto';var pp=v.play();if(pp&&pp.catch)pp.catch(function(){})}else v.pause()}})}
    layout();
    deckEl.addEventListener('click',function(){front=(front+1)%cards.length;layout()});
    onScreen(deckEl,function(v){if(v&&!dt&&!reduce)dt=setInterval(function(){front=(front+1)%cards.length;layout()},2400);else if(!v&&dt){clearInterval(dt);dt=null}});
  }

  /* approach cards: each stacked card shrinks and dims as the next one slides over it */
  var acs=[].slice.call(document.querySelectorAll('#approach .acard'));
  if(acs.length&&!reduce){
    function stack(){acs.forEach(function(c,i){var nx=acs[i+1];if(!nx){c.style.setProperty('--sc',1);c.style.setProperty('--br',1);return}
      var a=c.getBoundingClientRect(),b=nx.getBoundingClientRect(),p=Math.max(0,Math.min(1,(a.bottom-b.top)/a.height));
      c.style.setProperty('--sc',(1-p*0.06).toFixed(3));c.style.setProperty('--br',(1-p*0.45).toFixed(3))})}
    addEventListener('scroll',stack,{passive:true});addEventListener('resize',stack);stack();
  }

  /* ================= about page ================= */
  /* live local clocks for each team location */
  var clocks=document.querySelectorAll('time[data-tz]');
  if(clocks.length){function tickClocks(){clocks.forEach(function(t){try{t.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:t.getAttribute('data-tz')}).format(new Date())}catch(e){}})}tickClocks();setInterval(tickClocks,15000)}

  /* dotted globe with pins for Canada, USA and Bangladesh (drag to spin) */
  var gc=document.getElementById('globe');
  if(gc){
    var g=gc.getContext('2d'),R=0,rot=-1.2,tilt=0.32,drag=null,vel=0.0022,graf=null,gvis=false,gdpr=Math.min(2,window.devicePixelRatio||1);
    var PINS=[{n:'Canada',lat:43.65,lon:-79.38},{n:'USA',lat:40.71,lon:-74.0},{n:'Bangladesh',lat:23.81,lon:90.41}];
    var PTS=[];for(var i=0;i<1400;i++){var y=1-(i/1399)*2,r=Math.sqrt(1-y*y),th=i*2.39996;PTS.push([Math.cos(th)*r,y,Math.sin(th)*r])}
    function gsize(){var b=gc.getBoundingClientRect();gc.width=b.width*gdpr;gc.height=b.height*gdpr;R=Math.min(gc.width,gc.height)*0.42}
    function proj(x,y,z){var cx=Math.cos(rot),sx=Math.sin(rot);var X=x*cx+z*sx,Z=-x*sx+z*cx;var ct=Math.cos(tilt),st=Math.sin(tilt);var Y=y*ct-Z*st;Z=y*st+Z*ct;return[gc.width/2+X*R,gc.height/2-Y*R,Z]}
    function ll(lat,lon){var a=lat*Math.PI/180,b=lon*Math.PI/180;return[Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b)]}
    function gdraw(){
      g.clearRect(0,0,gc.width,gc.height);
      g.beginPath();g.arc(gc.width/2,gc.height/2,R,0,6.283);g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=1*gdpr;g.stroke();
      PTS.forEach(function(p){var q=proj(p[0],p[1],p[2]);if(q[2]<0)return;g.globalAlpha=0.15+q[2]*0.55;g.fillStyle='#d7d7d7';g.beginPath();g.arc(q[0],q[1],1.3*gdpr,0,6.283);g.fill()});
      g.globalAlpha=1;
      var pp=PINS.map(function(p){var v=ll(p.lat,p.lon);return{p:p,q:proj(v[0],v[1],v[2])}});
      /* arcs between the three locations */
      for(var a=0;a<pp.length;a++)for(var b=a+1;b<pp.length;b++){var A=pp[a].q,B=pp[b].q;if(A[2]<-.1||B[2]<-.1)continue;var mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.hypot(A[0]-B[0],A[1]-B[1])*0.35;
        g.beginPath();g.moveTo(A[0],A[1]);g.quadraticCurveTo(mx,my,B[0],B[1]);g.strokeStyle='rgba(196,241,19,.55)';g.lineWidth=1.6*gdpr;g.setLineDash([5*gdpr,6*gdpr]);g.lineDashOffset=-performance.now()/40;g.stroke();g.setLineDash([])}
      pp.forEach(function(o){var q=o.q;if(q[2]<0)return;var pulse=(performance.now()/1000)%1.6/1.6;
        g.beginPath();g.arc(q[0],q[1],(6+pulse*18)*gdpr,0,6.283);g.fillStyle='rgba(196,241,19,'+(0.35*(1-pulse))+')';g.fill();
        g.beginPath();g.arc(q[0],q[1],5*gdpr,0,6.283);g.fillStyle='#c4f113';g.fill();
        g.font='600 '+(13*gdpr)+'px Urbanist, sans-serif';g.fillStyle='#fff';var dy=o.p.n==='USA'?18:-10,dx=o.p.n==='Canada'?-62:10;g.fillText(o.p.n,q[0]+dx*gdpr,q[1]+dy*gdpr)});
      if(!drag)rot+=reduce?0:vel;graf=gvis?requestAnimationFrame(gdraw):null}
    gsize();addEventListener('resize',gsize);gdraw();
    gc.addEventListener('pointerdown',function(e){drag={x:e.clientX,r:rot};gc.setPointerCapture(e.pointerId);gc.style.cursor='grabbing'});
    gc.addEventListener('pointermove',function(e){if(drag)rot=drag.r+(e.clientX-drag.x)*0.008});
    gc.addEventListener('pointerup',function(){drag=null;gc.style.cursor='grab'});
    onScreen(gc,function(v){gvis=v;if(v&&!graf)graf=requestAnimationFrame(gdraw)});
  }

  /* about: sections open (curtain widens, content rises in order) and close (shrink, dim) with scroll */
  var blks=[].slice.call(document.querySelectorAll('.ab-blk'));
  if(blks.length&&!reduce){
    blks.forEach(function(b){[].forEach.call(b.children,function(c,i){c.style.setProperty('--i',Math.min(i,4))})});
    function abv(){var vh=innerHeight;blks.forEach(function(b,k){var r=b.getBoundingClientRect();
      var e=k===0?1:Math.max(0,Math.min(1,(vh-r.top)/(vh*0.6)));
      var x=Math.max(0,Math.min(1,(vh*0.45-r.bottom)/(vh*0.45)));
      b.style.setProperty('--e',e.toFixed(3));b.style.setProperty('--x',x.toFixed(3))})}
    addEventListener('scroll',abv,{passive:true});addEventListener('resize',abv);abv();
  }

  /* about: pin the story and scroll it sideways */
  var hz=document.getElementById('aboutRide')||document.getElementById('history');
  if(hz){
    var track=document.getElementById('hzTrack'),bar=document.getElementById('hzBar'),panels=[].slice.call(track.children);
    function hzSize(){if(innerWidth<=860){hz.style.removeProperty('--hz-h');return}var extra=track.scrollWidth-innerWidth;hz.style.setProperty('--hz-h',(extra+innerHeight)+'px')}
    function hzMove(){if(innerWidth<=860)return;var r=hz.getBoundingClientRect(),extra=track.scrollWidth-innerWidth,p=Math.max(0,Math.min(1,-r.top/(hz.offsetHeight-innerHeight)));
      var x=-p*extra;track.style.setProperty('--hx',x.toFixed(1)+'px');bar.style.setProperty('--hp',(p*100).toFixed(1)+'%');
      panels.forEach(function(pn,i){var off=(pn.offsetLeft+x)/innerWidth;var l=pn.querySelector('.hz-left')||pn.querySelector('.hz-in');if(l)l.style.setProperty('--tx',(off*-120).toFixed(1)+'px');
        pn.querySelectorAll('.hz-card').forEach(function(cd){cd.style.setProperty('--cs',(1-Math.min(.12,Math.abs(off)*.12)).toFixed(3))})})}
    var hzScroll=hzMove;hzMove=function(){hzScroll();if(typeof scrub==='function')scrub();if(typeof tlp==='function')tlp()};
    function hzJump(){var id=location.hash.slice(1),t=id&&document.getElementById(id);if(!t||innerWidth<=860||!track.contains(t))return;var pn=t.closest('.hz-panel');
      requestAnimationFrame(function(){scrollTo(0,hz.getBoundingClientRect().top+scrollY+pn.offsetLeft)})}
    addEventListener('hashchange',hzJump);addEventListener('load',hzJump);
    hzSize();hzMove();addEventListener('resize',function(){hzSize();hzMove()});addEventListener('scroll',hzMove,{passive:true});addEventListener('load',function(){hzSize();hzMove()});
  }

  /* how-we-work timeline: the line fills and steps light up as you scroll */
  var tl=document.getElementById('abTl');
  if(tl){var line=document.getElementById('abLine'),steps=[].slice.call(tl.querySelectorAll('.ab-step'));
    function tlp(){var r=tl.getBoundingClientRect(),inH=innerWidth>860&&tl.closest('.hz-track'),p=Math.max(0,Math.min(1,inH?(innerWidth*0.9-r.left)/(r.width*0.9):(innerHeight*0.75-r.top)/(r.height+innerHeight*0.15)));if(reduce)p=1;
      line.style.setProperty('--p',(p*100).toFixed(1)+'%');steps.forEach(function(s,i){s.classList.toggle('on',p>=i/steps.length+0.02||p===1)})}
    addEventListener('scroll',tlp,{passive:true});addEventListener('resize',tlp);tlp()}

  /* FAQ: wrap questions so they can fill white from left to right as they scroll in */
  var qs=[];
  document.querySelectorAll('.faq summary').forEach(function(s){if(s.querySelector('.q'))return;var sp=document.createElement('span');sp.className='q';while(s.firstChild)sp.appendChild(s.firstChild);s.appendChild(sp);qs.push(sp)});
  function faqReveal(){var vh=innerHeight;qs.forEach(function(q){var r=q.getBoundingClientRect(),p=(vh*0.98-r.top)/(vh*0.32);p=Math.max(0,Math.min(1,p));q.style.setProperty('--rv',(reduce?100:Math.round(p*100))+'%')})}
  if(qs.length){addEventListener('scroll',faqReveal,{passive:true});addEventListener('resize',faqReveal);faqReveal()}

  /* FAQ: keep one open */
  document.querySelectorAll('.faq').forEach(function(f){var ds=f.querySelectorAll('details');ds.forEach(function(d){d.addEventListener('toggle',function(){if(d.open)ds.forEach(function(o){if(o!==d)o.open=false})})})});
})();
