(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const film=document.getElementById('cityFilm');film.muted=true;film.defaultMuted=true;
 const playButton=document.getElementById('filmStart'),filmToggle=document.getElementById('filmToggle'),status=document.getElementById('filmStatus');
 let manuallyPaused=false;
 async function startFilm(){try{film.muted=true;await film.play();playButton.hidden=true;status.textContent='فيديو المدينة';filmToggle.textContent='إيقاف الفيديو Ⅱ';filmToggle.setAttribute('aria-pressed','false');}catch{playButton.hidden=false;status.textContent='اضغط تشغيل الفيديو';}}
 playButton.addEventListener('click',()=>{manuallyPaused=false;startFilm()});
 filmToggle.addEventListener('click',()=>{if(film.paused){manuallyPaused=false;startFilm()}else{manuallyPaused=true;film.pause();filmToggle.textContent='تشغيل الفيديو ▶';filmToggle.setAttribute('aria-pressed','true')}});
 film.addEventListener('error',()=>{status.textContent='تعذر تحميل الفيديو. تأكد من رفع legend-city.mp4 بجانب index.html';playButton.hidden=false});
 film.addEventListener('playing',()=>{playButton.hidden=true;status.textContent='فيديو المدينة'});
 if(reduced){film.pause();filmToggle.textContent='تشغيل الفيديو ▶';manuallyPaused=true;}else startFilm();
 let sound=false,ctx,lastHover=0;
 const toggle=document.getElementById('cinemaSound');
 function tone(type){if(!sound)return;try{ctx??=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();const now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(type==='click'?460:760,now);o.frequency.exponentialRampToValueAtTime(type==='click'?160:540,now+.09);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.035,now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+.12);o.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+.13);}catch{}}
 toggle.addEventListener('click',()=>{sound=!sound;toggle.setAttribute('aria-pressed',String(sound));toggle.textContent=sound?'الصوت: شغال ◉':'الصوت: مغلق ◌';tone('click')});
 document.addEventListener('click',e=>{if(e.target.closest('button,a')&&!e.target.closest('#cinemaSound'))tone('click')});
 document.addEventListener('pointerover',e=>{if(e.pointerType==='mouse'&&e.target.closest('a,button')&&performance.now()-lastHover>160){lastHover=performance.now();tone('hover')}});
 const header=document.querySelector('.topbar');const meter=document.querySelector('.scroll-meter');let scheduled=false;
 function update(){header.classList.toggle('legend-scrolled',scrollY>50);const max=document.documentElement.scrollHeight-innerHeight;meter.style.width=(max>0?scrollY/max*100:0)+'%';scheduled=false}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});update();
 if(false&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('cinema-visible');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section:not(.hidden):not(.rules-locked),.gate-zone,.city-intro').forEach(el=>{el.classList.add('cinema-reveal');io.observe(el)});}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause();else if(!reduced&&!manuallyPaused&&document.body.dataset.page==='home')startFilm()});
})();
