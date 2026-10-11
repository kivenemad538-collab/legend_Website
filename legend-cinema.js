(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const film=document.getElementById('cityFilm');film.muted=true;film.defaultMuted=true;
 if(reduced)film.pause();
 let sound=false,ctx,lastHover=0;
 const toggle=document.getElementById('cinemaSound');
 function tone(type){if(!sound)return;try{ctx??=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();const now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(type==='click'?460:760,now);o.frequency.exponentialRampToValueAtTime(type==='click'?160:540,now+.09);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.035,now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+.12);o.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+.13);}catch{}}
 toggle.addEventListener('click',()=>{sound=!sound;toggle.setAttribute('aria-pressed',String(sound));toggle.textContent=sound?'الصوت: شغال ◉':'الصوت: مغلق ◌';tone('click')});
 document.addEventListener('click',e=>{if(e.target.closest('button,a')&&!e.target.closest('#cinemaSound'))tone('click')});
 document.addEventListener('pointerover',e=>{if(e.pointerType==='mouse'&&e.target.closest('a,button')&&performance.now()-lastHover>160){lastHover=performance.now();tone('hover')}});
 const meter=document.querySelector('.scroll-meter');let scheduled=false;
 function update(){const max=document.documentElement.scrollHeight-innerHeight;meter.style.width=(max>0?scrollY/max*100:0)+'%';scheduled=false}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});update();
 if(!reduced&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('cinema-visible');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section:not(.hidden):not(.rules-locked),.gate-zone,.city-intro').forEach(el=>{el.classList.add('cinema-reveal');io.observe(el)});}
 if(!reduced&&matchMedia('(pointer:fine)').matches){let frame=0;document.querySelector('.cinema-hero').addEventListener('pointermove',e=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{film.style.setProperty('--film-x',((e.clientX/innerWidth-.5)*14)+'px');film.style.setProperty('--film-y',((e.clientY/innerHeight-.5)*10)+'px')})});}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause();else if(!reduced)film.play().catch(()=>{})});
})();
