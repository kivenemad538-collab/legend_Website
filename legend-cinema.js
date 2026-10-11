(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const film=document.getElementById('cityFilm'),hero=document.getElementById('home');if(!film)return;
 const playButton=document.getElementById('filmStart'),filmToggle=document.getElementById('filmToggle'),status=document.getElementById('filmStatus');
 const lowData=navigator.connection?.saveData||/2g/.test(navigator.connection?.effectiveType||'');
 let manuallyPaused=reduced||lowData,loaded=false,visible=true,ready=false,canLoad=false;
 film.muted=true;film.defaultMuted=true;
 async function startFilm(){if(document.hidden||document.body.dataset.page!=='home')return;try{if(!loaded){const source=film.querySelector('source');source.src=source.dataset.src;loaded=true;film.load();}status.textContent='فيديو المدينة';await film.play();ready=true;film.classList.add('film-ready');playButton.hidden=true;filmToggle.textContent='إيقاف الفيديو Ⅱ';filmToggle.setAttribute('aria-pressed','false');}catch{playButton.hidden=false;status.textContent='اضغط تشغيل الفيديو';}}
 window.legendResumeFilm=()=>{if(canLoad&&visible&&!manuallyPaused)startFilm();};
 playButton.onclick=()=>{manuallyPaused=false;startFilm();};
 filmToggle.onclick=()=>{if(film.paused){manuallyPaused=false;startFilm();}else{manuallyPaused=true;film.pause();filmToggle.textContent='تشغيل الفيديو ▶';filmToggle.setAttribute('aria-pressed','true');}};
 film.addEventListener('error',()=>{status.textContent='تعذر تحميل الفيديو';playButton.hidden=false;});
 film.addEventListener('playing',()=>{ready=true;film.classList.add('film-ready');});
 // Paint the poster and all navigation before fetching any video bytes.
 const begin=()=>{canLoad=true;if(!manuallyPaused&&visible)startFilm();else{filmToggle.textContent='تشغيل الفيديو ▶';playButton.hidden=false;}};
 setTimeout(()=>{if('requestIdleCallback'in window)requestIdleCallback(begin,{timeout:1200});else begin();},1200);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)film.pause();else if(ready&&!manuallyPaused)startFilm();},{threshold:.05}).observe(hero);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause();else window.legendResumeFilm();});
 const header=document.querySelector('.topbar'),meter=document.querySelector('.scroll-meter'),journey=document.getElementById('cityJourney'),paths=document.getElementById('cityPaths'),track=document.querySelector('.paths-track');
 const panels=[...document.querySelectorAll('.journey-panel')],dots=[...document.querySelectorAll('.journey-dots i')];let scheduled=false,last=-1;
 const clamp=x=>Math.min(1,Math.max(0,x));
 function progress(el){const r=el.getBoundingClientRect();return clamp(-r.top/Math.max(1,r.height-innerHeight));}
 function update(){scheduled=false;header?.classList.toggle('legend-scrolled',scrollY>50);const max=document.documentElement.scrollHeight-innerHeight;if(meter)meter.style.width=(max>0?scrollY/max*100:0)+'%';if(document.body.dataset.page!=='home'||reduced)return;
 const hr=hero.getBoundingClientRect();if(hr.bottom>0&&hr.top<innerHeight){hero.style.setProperty('--hero-shift',Math.min(80,Math.max(0,-hr.top)*.16)+'px');hero.style.setProperty('--hero-fade',String(Math.max(.2,1-Math.max(0,-hr.top)/innerHeight)));}
 panels.forEach(el=>el.removeAttribute('aria-hidden'));
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('hashchange',schedule);update();
 if(!reduced&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:.65,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:450,easing:'ease-out'});io.unobserve(e.target);}}),{threshold:.1});document.querySelectorAll('.hub-card,.journey-heading,.paths-heading').forEach(el=>io.observe(el));}
})();
