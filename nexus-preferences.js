(()=>{
 'use strict';
 const key='nexus_personal_preferences_v6';
 const defaults={theme:'dark',motion:matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on',size:'normal',density:'comfortable',cards:'grid',contrast:'normal'};
 const allowed={theme:['dark','dim','light'],motion:['on','off'],size:['normal','large','larger'],density:['comfortable','compact'],cards:['grid','list'],contrast:['normal','high']};
 let value={...defaults};
 try{const saved=JSON.parse(localStorage.getItem(key)||'{}');for(const k of Object.keys(defaults))if(allowed[k].includes(saved[k]))value[k]=saved[k];}catch{}
 const root=document.documentElement,dialog=document.getElementById('personalSettings'),form=document.getElementById('personalPreferencesForm');
 function apply(){
  for(const [k,v]of Object.entries(value))root.dataset[k]=v;
  document.querySelectorAll('img[data-nexus-motion-src],img[data-turbo-logo],.premium-emblem img').forEach(img=>{
   if(!img.dataset.nexusMotionSrc)img.dataset.nexusMotionSrc=img.getAttribute('src');
   const wanted=value.motion==='off'?'nexus-logo.png?v=6':img.dataset.nexusMotionSrc;
   if(img.getAttribute('src')!==wanted)img.setAttribute('src',wanted);
  });
  const video=document.getElementById('cityFilm');if(value.motion==='off'&&video)video.pause();
  if(value.motion==='off'){document.getElementById('nexusHeroVideo')?.pause();}
 }
 function sync(){for(const k of Object.keys(allowed)){const nodes=form.querySelectorAll(`[name="${k}"]`);for(const n of nodes)n.checked=n.type==='checkbox'?value[k]===(k==='contrast'?'high':'on'):n.value===value[k];}}
 form.addEventListener('change',e=>{
  const n=e.target,k=n.name;if(!allowed[k])return;
  const v=n.type==='checkbox'?(n.checked?(k==='contrast'?'high':'on'):(k==='contrast'?'normal':'off')):n.value;
  if(!allowed[k].includes(v))return;value[k]=v;apply();
  try{localStorage.setItem(key,JSON.stringify(value));document.getElementById('prefsSaved').textContent='اتحفظت عندك ✓';}catch{document.getElementById('prefsSaved').textContent='اتطبقت دلوقتي، بس المتصفح منع الحفظ.';}
 });
 function close(){dialog.close();document.getElementById('personalSettingsButton').focus();}
 document.getElementById('personalSettingsButton').onclick=()=>{sync();dialog.showModal();};
 document.getElementById('closePersonalSettings').onclick=close;
 document.getElementById('donePersonalSettings').onclick=close;
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 document.getElementById('resetPersonalSettings').onclick=()=>{value={...defaults};apply();sync();try{localStorage.removeItem(key);}catch{}document.getElementById('prefsSaved').textContent='رجعت للإعدادات الأصلية ✓';};
 form.addEventListener('submit',e=>e.preventDefault());apply();sync();
 // Pointer tilt is off on touch devices, with reduced motion, and when personally disabled.
 if(matchMedia('(pointer:fine)').matches){let raf=0;document.addEventListener('pointermove',e=>{
  const c=e.target.closest('.character-card,.hub-card');if(!c||value.motion==='off')return;
  cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const r=c.getBoundingClientRect();c.style.setProperty('--tilt-x',((e.clientY-r.top)/r.height-.5)*-6+'deg');c.style.setProperty('--tilt-y',((e.clientX-r.left)/r.width-.5)*6+'deg');});
 });document.addEventListener('pointerout',e=>{const c=e.target.closest('.character-card,.hub-card');if(c&&!c.contains(e.relatedTarget)){c.style.setProperty('--tilt-x','0deg');c.style.setProperty('--tilt-y','0deg');}});}
})();
