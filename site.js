/* Zynexor shared behaviour: chrome (nav, CTA, footer, modals), scroll effects, galleries, blog data. */
(function(){
  var EMAIL='hello@zynexor.com';           // TODO: replace with your real address
  var FORM_ENDPOINT='';                     // TODO: paste a Formspree (or similar) URL to receive messages
  var SOCIAL={instagram:'#',behance:'#',linkedin:'#',facebook:'#',x:'#'}; // TODO: your profile links
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
  var links=[['cases.html','Cases','cases'],['services.html','Service','services'],['blog.html','Blog','blog'],['index.html#about','About us','about']];
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
    '<div><h4>About us</h4><ul><li><a href="index.html#about">Numbers</a></li><li><a href="index.html#stages">How we work</a></li><li><a href="blog.html">Blog</a></li><li><a href="index.html#clients">Clients</a></li></ul></div>';
  var soc='<div class="socials"><a href="'+SOCIAL.instagram+'" aria-label="Instagram" target="_blank" rel="noopener">IG</a><a href="'+SOCIAL.behance+'" aria-label="Behance" target="_blank" rel="noopener">Bē</a><a href="'+SOCIAL.facebook+'" aria-label="Facebook" target="_blank" rel="noopener">f</a><a href="'+SOCIAL.x+'" aria-label="X" target="_blank" rel="noopener">X</a><a href="'+SOCIAL.linkedin+'" aria-label="LinkedIn" target="_blank" rel="noopener">in</a></div>';
  var foot=document.getElementById('foot');
  if(foot){
    if(light){
      foot.innerHTML='<div class="wrap"><div class="foot-light"><span>© '+new Date().getFullYear()+' Zynexor. All rights reserved.</span><a href="index.html">Back to zynexor home →</a></div></div>';
    }else{
      foot.innerHTML='<section class="wrap" style="padding-top:40px"><div class="cta">'+
        '<div><h2>Innovate<br>with us</h2><p>Our creative solutions help businesses launch faster, look credible and grow their reach.</p>'+
        '<div class="btns"><button class="btn btn-accent" data-contact>Write us</button><button class="btn btn-grey" data-contact>Book a call</button></div></div>'+
        '<div class="cta-art">'+vid('crm-reports','','Dashboard designed by Zynexor')+
        '<div class="chip" style="left:4%;top:8%">Designed by Zynexor<b>CRM reports</b></div><div class="chip" style="left:14%;bottom:6%">Shipped<b>7+ products</b></div></div></div></section>'+
        '<footer class="foot"><div class="wrap"><div class="foot-top">'+cols+
        '<div class="foot-mail"><a class="big" href="mailto:'+EMAIL+'">'+EMAIL+'</a>'+soc+'</div></div>'+
        '<div class="foot-bot"><span>Copyright © '+new Date().getFullYear()+' Zynexor. All rights reserved.</span><span>Brand · Web · Product · Social</span></div></div></footer>';
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
    var ws=words.map(function(w){var s=document.createElement('span');s.className='wd';s.setAttribute('aria-hidden','true');s.textContent=w+' ';el.appendChild(s);return s});
    scrubs.push({el:el,ws:ws});
  });
  function scrub(){scrubs.forEach(function(o){var r=o.el.getBoundingClientRect(),vh=innerHeight;var p=(vh*0.85-r.top)/(r.height+vh*0.35);p=Math.max(0,Math.min(1,p));var n=Math.round(p*o.ws.length);o.ws.forEach(function(w,i){w.classList.toggle('on',i<n)})})}
  if(scrubs.length){addEventListener('scroll',scrub,{passive:true});addEventListener('resize',scrub);scrub()}

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

  /* projects table: floating preview follows the cursor */
  var pv=document.getElementById('pPreview');
  if(pv){var pimg=pv.querySelector('video');pimg.muted=true;
    document.querySelectorAll('.prow').forEach(function(r){
      r.addEventListener('mouseenter',function(){var n=r.getAttribute('data-img');pimg.poster=W+n+'.jpg';pimg.src=V+n+'.mp4';var pp=pimg.play();if(pp&&pp.catch)pp.catch(function(){});pv.classList.add('on')});
      r.addEventListener('mouseleave',function(){pv.classList.remove('on');pimg.pause()});
      r.addEventListener('mousemove',function(e){pv.style.left=(e.clientX+130)+'px';pv.style.top=e.clientY+'px'});
    });
  }

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

  /* FAQ: keep one open */
  document.querySelectorAll('.faq').forEach(function(f){var ds=f.querySelectorAll('details');ds.forEach(function(d){d.addEventListener('toggle',function(){if(d.open)ds.forEach(function(o){if(o!==d)o.open=false})})})});
})();
