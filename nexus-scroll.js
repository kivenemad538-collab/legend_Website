(()=>{
 'use strict';
 const states=new Map(),portal=document.getElementById('applicationPortal'),body=document.getElementById('applicationPortalBody');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
 const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
 function eligible(stage){return !reduce.matches&&document.documentElement.dataset.motion!=='off'&&innerHeight>=560&&(stage.dataset.scrollDeck!=='characters'||document.documentElement.dataset.cards!=='list');}
 function geometry(state){
  const {stage,sticky,root}=state;const top=Number.parseFloat(getComputedStyle(sticky).top)||0;
  const rootTop=root===window?0:root.getBoundingClientRect().top;
  const travel=Math.max(1,stage.offsetHeight-sticky.offsetHeight);
  return {top,rootTop,travel,start:stage.getBoundingClientRect().top-rootTop-top};
 }
 function paint(state){
  if(!state.stage.isConnected){states.delete(state.stage);return;}
  if(state.stage.closest('.route-hidden,.hidden'))return;
  const enabled=eligible(state.stage);state.stage.classList.toggle('scroll-deck-on',enabled);
  const g=geometry(state);const progress=enabled?clamp(-g.start/g.travel,0,1)*(state.cards.length-1):0;
  const active=Math.round(progress);
  const signature=enabled+'|'+progress.toFixed(4);if(signature===state.signature)return;state.signature=signature;
  state.stage.dataset.scrollProgress=progress.toFixed(3);
  state.cards.forEach((card,i)=>{
   const distance=i-progress,far=Math.abs(distance)>1.5;
   card.classList.toggle('deck-card-active',i===active);
   card.style.setProperty('--deck-distance',String(distance));
   card.style.setProperty('--deck-shift',(distance*104).toFixed(3)+'%');
   card.style.setProperty('--deck-depth',String(Math.max(.85,1-Math.abs(distance)*.055)));
   card.style.setProperty('--deck-rotation',(distance*-3).toFixed(3)+'deg');
   card.style.setProperty('--deck-opacity',far?'0':String(clamp(1-Math.max(0,Math.abs(distance)-.75)*.6,0,1)));
   card.style.zIndex=String(100-Math.round(Math.abs(distance)*10));
   if(enabled){card.setAttribute('aria-hidden',String(i!==active));card.inert=i!==active;if(card.matches('button'))card.tabIndex=i===active?0:-1;}
   else{card.removeAttribute('aria-hidden');card.inert=false;if(card.matches('button'))card.tabIndex=0;}
  });
  const counter=state.stage.querySelector('[data-deck-count]');const label=String(active+1).padStart(2,'0')+' / '+String(state.cards.length).padStart(2,'0');if(counter.textContent!==label)counter.textContent=label;
  state.dots.forEach((dot,i)=>{dot.classList.toggle('active',i===active);dot.setAttribute('aria-current',i===active?'step':'false');});
  state.stage.querySelector('[data-deck-prev]').disabled=active===0;
  state.stage.querySelector('[data-deck-next]').disabled=active===state.cards.length-1;
  state.stage.querySelector('.deck-progress i').style.width=((progress+1)/state.cards.length*100)+'%';
  state.active=active;
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;for(const state of states.values())paint(state);});}
 function jump(state,index){
  const target=clamp(index,0,state.cards.length-1);const g=geometry(state);
  if(!eligible(state.stage)){state.cards[target].scrollIntoView({block:'center',behavior:'instant'});state.cards[target].focus({preventScroll:true});return;}
  const start=state.root===window?scrollY:state.root.scrollTop;
  const top=start+g.start+g.travel*target/Math.max(1,state.cards.length-1);
  state.root.scrollTo({top,behavior:reduce.matches||document.documentElement.dataset.motion==='off'?'instant':'smooth'});
 }
 function setup(){
  for(const stage of document.querySelectorAll('[data-scroll-deck]')){
   if(states.has(stage))continue;
   const cards=[...stage.querySelectorAll('.character-card,[data-scene-card]')];if(!cards.length)continue;
   const state={stage,cards,root:stage.dataset.scrollDeck==='characters'?portal:window,sticky:stage.querySelector('.scroll-sticky'),active:0,dots:[]};
   stage.style.setProperty('--scene-count',cards.length);
   stage.querySelector('[data-deck-prev]').onclick=()=>jump(state,state.active-1);
   stage.querySelector('[data-deck-next]').onclick=()=>jump(state,state.active+1);
   const dots=stage.querySelector('.deck-dots');
   cards.forEach((card,i)=>{const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',stage.dataset.scrollDeck==='characters'?'الشخصية '+(i+1):'الخطوة '+(i+1));dot.onclick=()=>jump(state,i);dots.append(dot);state.dots.push(dot);});
   stage.querySelector('.deck-controls').addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowRight'){event.preventDefault();jump(state,state.active+1);}else if(event.key==='ArrowUp'||event.key==='ArrowLeft'){event.preventDefault();jump(state,state.active-1);}});
   states.set(stage,state);paint(state);
  }
  schedule();
 }
 addEventListener('scroll',schedule,{passive:true});portal.addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule,{passive:true});addEventListener('hashchange',schedule);addEventListener('legend:language',schedule);
 reduce.addEventListener('change',schedule);
 new MutationObserver(setup).observe(body,{childList:true});
 new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-motion','data-cards','data-size','data-density']});
 new MutationObserver(schedule).observe(portal,{attributes:true,attributeFilter:['class']});
 setup();
})();
