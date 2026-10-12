(()=>{
 const box=document.getElementById('liveServerStatus');let busy=false,last=null;
 const t=(a,b)=>window.legendLang==='en'?b:a;
 function render(){if(!box)return;const s=last||{status:'unknown'};box.dataset.status=s.status;box.replaceChildren();const dot=document.createElement('i'),label=document.createElement('span');label.textContent=s.status==='online'?t(`السيرفر متصل • ${s.players} / ${s.maxPlayers} لاعب`,`Server online • ${s.players} / ${s.maxPlayers} players`):s.status==='offline'?t('السيرفر غير متصل','Server offline'):t('حالة السيرفر غير متاحة حاليًا','Server status unavailable');box.append(dot,label);if(s.status==='online'&&s.joinUrl){const link=document.createElement('a');link.href=s.joinUrl;link.target='_blank';link.rel='noopener';link.textContent=t('الدخول للسيرفر ↗','Join server ↗');box.append(link);}}
 async function refresh(){if(busy||document.hidden)return;busy=true;try{const response=await fetch(API+'/api/server-status',{signal:AbortSignal.timeout(6000),cache:'no-store'});if(!response.ok)throw Error();last=await response.json();}catch{last={status:'unknown'};}finally{busy=false;render();}}
 async function saveLanguage(){if(!token)return;try{await api('/api/notification-language',{method:'POST',body:JSON.stringify({language:window.legendLang||'ar'})});}catch{}}
 addEventListener('legend:language',()=>{render();saveLanguage();});addEventListener('legend:data-ready',saveLanguage);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});render();refresh();setInterval(refresh,30000);
})();
