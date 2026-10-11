(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const film=document.getElementById('cityFilm');film.muted=true;film.defaultMuted=true;
 const playButton=document.getElementById('filmStart'),filmToggle=document.getElementById('filmToggle'),status=document.getElementById('filmStatus');
 let manuallyPaused=false;
 async function startFilm(){try{film.muted=true;await film.play();playButton.hidden=true;status.textContent='فيديو المدينة';filmToggle.textContent='إيقاف الفيديو Ⅱ';filmToggle.setAttribute('aria-pressed','false');}catch{playButton.hidden=false;status.textContent='اضغط تشغيل الفيديو';}}
 playButton.addEventListener('click',()=>{manuallyPaused=false;startFilm()});
 filmToggle.addEventListener('click',()=>{if(film.paused){manuallyPaused=false;startFilm()}else{manuallyPaused=true;film.pause();filmToggle.textContent='تشغيل الفيديو ▶';filmToggle.setAttribute('aria-pressed','true')}});
 film.addEventListener('error',()=>{status.textContent='تعذر تحميل الفيديو. تأكد من رفع legend-city-lite.mp4 بجانب index.html';playButton.hidden=false});
 film.addEventListener('playing',()=>{playButton.hidden=true;status.textContent='فيديو المدينة'});
 if(reduced){film.pause();filmToggle.textContent='تشغيل الفيديو ▶';manuallyPaused=true;}else startFilm();
 const header=document.querySelector('.topbar');const meter=document.querySelector('.scroll-meter');let scheduled=false;
 function update(){header.classList.toggle('legend-scrolled',scrollY>50);const max=document.documentElement.scrollHeight-innerHeight;meter.style.width=(max>0?scrollY/max*100:0)+'%';scheduled=false}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});update();
 if(false&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('cinema-visible');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section:not(.hidden):not(.rules-locked),.gate-zone,.city-intro').forEach(el=>{el.classList.add('cinema-reveal');io.observe(el)});}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause();else if(!reduced&&!manuallyPaused&&document.body.dataset.page==='home')startFilm()});
})();
