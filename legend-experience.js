(()=>{
 const titles={home:'المدينة',about:'عن Legend',jobs:'الوظائف',apply:'تصريح دخول المدينة',store:'المتجر والطلبات',rules:'دليل المدينة',news:'أخبار المدينة',team:'فريق Legend',creators:'صناع المحتوى',admin:'مركز الإدارة'};
 const main=document.querySelector('main'),heading=document.getElementById('pageHeading'),film=document.getElementById('cityFilm');
 function route(){let id=location.hash.slice(1);if(!titles[id])id='home';if(id==='admin'&&document.getElementById('admin').classList.contains('hidden'))id='home';
 document.body.classList.toggle('hub-view',id==='home');document.body.dataset.page=id;
 main.querySelectorAll(':scope > section').forEach(s=>{const visible=id==='home'?['home','cityHub'].includes(s.id):s.id===id;s.classList.toggle('route-hidden',!visible);if(visible){s.classList.remove('page-in');requestAnimationFrame(()=>s.classList.add('page-in'));}});
 heading.hidden=id==='home';document.getElementById('pageName').textContent=titles[id];document.title=titles[id]+' • LEGEND';
 document.querySelectorAll('#nav a').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.getElementById('nav').classList.remove('open');
 if(id!=='home')film.pause();else if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&document.getElementById('filmToggle').getAttribute('aria-pressed')!=='true')film.play().catch(()=>{document.getElementById('filmStart').hidden=false});
 scrollTo({top:0,behavior:'instant'});
 }
 addEventListener('hashchange',route);route();
 let refreshing=false;
 async function refreshAccount(){if(refreshing||!token||!pub||document.hidden||document.body.dataset.page!=='apply')return;refreshing=true;try{const data=await api('/api/me');me=data;renderApply();}catch{}finally{refreshing=false;}}
 addEventListener('focus',refreshAccount);addEventListener('hashchange',refreshAccount);setInterval(refreshAccount,15000);

 // Store section arrives from the existing store module; keep its original API handlers.
 let adminTab='requests';
 function setupAdmin(){const dashboard=document.querySelector('#adminBox .admin-dashboard');if(!dashboard||dashboard.querySelector('.admin-tabs'))return;
 const tabs=document.createElement('div');tabs.className='admin-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','أقسام الإدارة');
 const labels={requests:'التقديمات',access:'الوظائف والمواعيد',content:'الأخبار والفريق',brand:'الهوية والإعدادات',staff:'الإدارة والصلاحيات'};
 const cards=[...dashboard.querySelectorAll('.admin-grid>.card,.staff-directory-card')];
 const group=c=>c.classList.contains('applications-card')?'requests':c.classList.contains('job-access-admin')||c.classList.contains('admin-workshops-card')||c.querySelector('#slotForm')?'access':c.classList.contains('admin-public-team-card')||c.querySelector('#newsForm')||c.querySelector('#creatorForm')?'content':c.classList.contains('manager-only-card')||c.classList.contains('staff-directory-card')?'staff':'brand';
 function select(k){adminTab=k;cards.forEach(c=>c.hidden=group(c)!==k);tabs.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b.dataset.tab===k);b.setAttribute('aria-pressed',String(b.dataset.tab===k))});}
 for(const [k,v]of Object.entries(labels)){const b=document.createElement('button');b.type='button';b.textContent=v;b.dataset.tab=k;b.onclick=()=>select(k);tabs.append(b)}
 const anchor=dashboard.querySelector('.admin-grid');if(anchor)anchor.before(tabs);else dashboard.prepend(tabs);select(adminTab);
 }
 function setupRules(){document.querySelectorAll('#rulesList .rule-group').forEach((g,i)=>{if(g.dataset.accordion)return;g.dataset.accordion='1';const title=g.querySelector('.rule-group-title'),items=g.querySelector('.rule-group-items');const b=document.createElement('button');b.type='button';b.className='rule-group-toggle';b.textContent=title.textContent.trim()+' −';b.setAttribute('aria-expanded','true');items.id='rule-group-'+i;b.setAttribute('aria-controls',items.id);b.onclick=()=>{items.hidden=!items.hidden;b.setAttribute('aria-expanded',String(!items.hidden));b.textContent=title.dataset.label+(items.hidden?' +':' −')};title.dataset.label=title.textContent.trim();title.replaceChildren(b)});}
 const search=document.getElementById('ruleSearch');search.addEventListener('input',()=>{const q=search.value.trim().toLocaleLowerCase();let count=0;document.querySelectorAll('#rulesList .rule-group').forEach(g=>{let n=0;g.querySelectorAll('.rule').forEach(r=>{r.hidden=!r.textContent.toLocaleLowerCase().includes(q);if(!r.hidden){n++;count++}});g.hidden=n===0;if(q&&n){g.querySelector('.rule-group-items').hidden=false;g.querySelector('button').setAttribute('aria-expanded','true')}});document.getElementById('ruleSearchStatus').textContent=q?count+' قانون مطابق':'';});
 function setupWizard(){const form=document.getElementById('applyForm');if(!form||form.dataset.wizard)return;form.dataset.wizard='1';const original=form.onsubmit;const sections=[...form.querySelectorAll('.vision-form-section')];if(sections.length!==3)return;
 let step=0;const progress=document.createElement('div');progress.className='wizard-progress';progress.setAttribute('aria-label','مراحل التقديم');const labels=['بياناتك','قصة الشخصية','أسئلة الرول بلاي','المراجعة'];labels.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.textContent=(i+1)+' / '+t;b.onclick=()=>{if(i<=step)show(i);else if(validate())show(step+1)};progress.append(b)});form.prepend(progress);
 const review=document.createElement('div');review.className='wizard-review';form.querySelector('.vision-submit').before(review);
 const controls=document.createElement('div');controls.className='wizard-controls';controls.innerHTML='<button type="button" data-back>رجوع</button><button type="button" class="primary" data-next>الخطوة الجاية ←</button>';form.querySelector('.vision-submit').before(controls);
 const submit=form.querySelector('.vision-submit');form.noValidate=true;
 function validate(){const inputs=sections[step]?.querySelectorAll('input,textarea,select')||[];for(const el of inputs)if(!el.checkValidity()){el.reportValidity();return false}return true}
 function show(n){step=n;sections.forEach((s,i)=>s.hidden=i!==n);review.hidden=n!==3;submit.hidden=n!==3;controls.querySelector('[data-next]').hidden=n===3;controls.querySelector('[data-back]').disabled=n===0;progress.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-current',i===n?'step':'false')});if(n===3){const rows=[];for(const input of form.querySelectorAll('input[name],textarea[name]')){const label=input.closest('.field')?.querySelector('label')?.textContent||input.closest('.vision-question')?.querySelector('strong')?.textContent||(input.name==='story'?'قصة الشخصية':input.name);rows.push(label+'\n'+input.value)}review.textContent='راجع تقديمك قبل الإرسال\n\n'+rows.join('\n\n');}const portal=form.closest('.application-portal');if(portal){portal.scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>portal.scrollTo({top:0,behavior:'instant'}));}else{progress.scrollIntoView({block:'start',behavior:'instant'});}}
 controls.querySelector('[data-back]').onclick=()=>show(Math.max(0,step-1));controls.querySelector('[data-next]').onclick=()=>{if(validate())show(Math.min(3,step+1))};
 form.onsubmit=e=>{e.preventDefault();for(let i=0;i<sections.length;i++){for(const el of sections[i].querySelectorAll('input,textarea,select'))if(!el.checkValidity()){show(i);el.reportValidity();return}}const button=submit.querySelector('[type=submit]');button.disabled=true;Promise.resolve(original(e)).finally(()=>button.disabled=false);};show(0);
 }
 const observer=new MutationObserver(es=>{if(es.some(e=>e.addedNodes.length)){setupAdmin();setupRules();setupWizard();}});observer.observe(main,{childList:true,subtree:true});observer.observe(document.getElementById('applicationPortalBody'),{childList:true});setupAdmin();setupRules();setupWizard();
 // A light pointer highlight on the hub replaces the old cursor and video transforms.
 if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){document.querySelectorAll('.hub-card').forEach(c=>{let pending=0;c.addEventListener('pointermove',e=>{cancelAnimationFrame(pending);pending=requestAnimationFrame(()=>{const r=c.getBoundingClientRect();c.style.setProperty('--px',(e.clientX-r.left)+'px');c.style.setProperty('--py',(e.clientY-r.top)+'px')})});});}
})();
