'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionPreference.matches;
const photoData = [
 {key:'registan',title:'Registon, Samarqand',category:'architecture',ratio:'.91',message:'Moviy gumbazlar ostida asrlar bir-biri bilan suhbatlashadi.',source:'Unsplash',url:'https://unsplash.com/s/photos/uzbekistan'},
 {key:'mountains',title:'Chorvoq, Toshkent viloyati',category:'nature',ratio:'.77',message:'Tog‘larning sukunati. Suvning moviyligi. Bir nafas xotirjamlik.',source:'Pexels',id:26729708},
 {key:'bukhara',title:'Poyi Kalon, Buxoro',category:'architecture',ratio:'.72',message:'Har bir g‘ishtda vaqtning izi, har bir ko‘chada bir hikoya.',source:'Pexels',id:39411349},
 {key:'khiva',title:'Ichan qal’a, Xiva',category:'architecture',ratio:'.76',message:'Go‘yo ertak kitobining ichiga kirib qolgandek.',source:'Pexels',id:35375813},
 {key:'charvak',title:'Chorvoq sohillari',category:'nature',ratio:'.73',message:'Shoshmasdan qarang. Bu manzara eslab qolishga arziydi.',source:'Pexels',id:30827061},
 {key:'shahi',title:'Shohi Zinda, Samarqand',category:'architecture',ratio:'1.03',message:'Koshinlarda yashiringan ming bir rang, ming bir xotira.',source:'Pexels',id:19439170},
 {key:'tashkent',title:'Hazrati Imom, Toshkent',category:'architecture',ratio:'1.08',message:'Shahar shovqini orasidagi sokin bir olam.',source:'Pexels',id:19227998},
 {key:'bread',title:'Tandir non',category:'food',ratio:'.75',message:'Yangi yopilgan nonning hidi. Uy degan tuyg‘uning eng tanish ifodasi.',source:'Pexels',id:39597532},
 {key:'dome',title:'Samarqand koshinlari',category:'architecture',ratio:'.76',message:'Osmon rangini yerga olib tushgan ustalar xotirasi.',source:'Pexels',id:19439144},
 {key:'samarkand',title:'Shohi Zinda gumbazlari',category:'architecture',ratio:'1.12',message:'Bir-biriga tutashgan asrlar, bir-biriga o‘xshamagan naqshlar.',source:'Pexels',id:16534573},
 {key:'plov',title:'O‘zbek palovi',category:'food',ratio:'.8',message:'Bir dasturxon atrofida notanish inson ham yaqin bo‘lib qoladi.',source:'Pexels',id:32558904},
 {key:'bibi',title:'Bibixonim, Samarqand',category:'architecture',ratio:'.72',message:'Ulug‘vorlikni ko‘rish mumkin. Ruhini esa his qilish kerak.',source:'Pexels',id:19439200},
 {key:'street',title:'Samarqand ko‘chalari',category:'architecture',ratio:'.7',message:'Bu yo‘llardan qancha inson, qancha orzu o‘tgan.',source:'Pexels',id:19839437},
 {key:'art',title:'Hazrati Imomdagi san’at',category:'architecture',ratio:'1.05',message:'Go‘zallikni yaratadigan qo‘llar. Uni asraydigan qalblar.',source:'Pexels',id:19227987},
 {key:'cooking',title:'Toshkent dasturxoni',category:'food',ratio:'.77',message:'Qozon boshida boshlangan suhbat, dasturxon atrofida davom etadi.',source:'Pexels',id:39561317}
];
photoData.forEach(p=>{p.url=p.url||`https://www.pexels.com/photo/${p.id}/`;p.src=`/assets/${p.key}.jpg`;});
let route = location.pathname.startsWith('/gallery') ? 'gallery' : 'home';
let currentFilter = 'all';
let lightboxIndex = 0;
let lightboxSequence = photoData;
let menuReturnFocus = null;
let lastPoemIndex = -1;
let ticking = false;
let toastTimeout;
let aboutCloseTimer;
const dialogStack = [];

function createPhotoCard(photo, index, preview = false) {
 const wrap = document.createElement('article');
 wrap.className = 'gallery-item';
 wrap.dataset.category = photo.category;
 wrap.innerHTML = `<button class="photo-card" style="--ratio:${photo.ratio}" aria-label="${photo.title}: suratning orqa tomonini ko‘rish" aria-pressed="false"><div class="photo-card-inner"><div class="card-front"><img src="${photo.src}" alt="${photo.title}" loading="lazy" decoding="async" width="600" height="760"></div><div class="card-back" aria-hidden="true"><span class="card-location">${photo.title}</span><span class="card-message">${photo.message}</span><span class="card-number">O‘ZBEKISTONGA MAKTUB / ${String(index+1).padStart(2,'0')}</span></div></div></button><div class="gallery-card-tools"><span>${photo.title}</span><button aria-label="${photo.title}: suratni kattalashtirish">Ochish ↗</button></div>`;
 const card=$('.photo-card',wrap);
 card.addEventListener('click',()=>{
  const flipped=card.classList.toggle('flipped');
  card.setAttribute('aria-pressed',String(flipped));
  card.setAttribute('aria-label',`${photo.title}: suratning ${flipped?'old':'orqa'} tomonini ko‘rish`);
  $('.card-back',card).setAttribute('aria-hidden',String(!flipped));
  $('.card-front',card).setAttribute('aria-hidden',String(flipped));
 });
 $('.gallery-card-tools button',wrap).addEventListener('click',()=>{
  lightboxSequence=preview?photoData:photoData.filter(p=>currentFilter==='all'||p.category===currentFilter);
  lightboxIndex=lightboxSequence.findIndex(p=>p.key===photo.key);
  showLightbox();
 });
 return wrap;
}
function renderGallery(filter='all') {
 currentFilter=filter;
 const grid=$('#gallery-grid');
 const list=photoData.filter(p=>filter==='all'||p.category===filter);
 grid.replaceChildren(...list.map(p=>createPhotoCard(p,photoData.indexOf(p))));
 $('#gallery-count').textContent=`${String(list.length).padStart(2,'0')} TA XOTIRA / 1991—2026`;
 $$('.gallery-filters button').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
}
$('#preview-gallery').replaceChildren(...[photoData[1],photoData[0],photoData[2],photoData[3]].map(p=>createPhotoCard(p,photoData.indexOf(p),true)));
renderGallery();
$$('.gallery-filters button').forEach(b=>b.addEventListener('click',()=>renderGallery(b.dataset.filter)));

// Native dialogs provide keyboard focus containment and Escape support.
function openDialog(el){
 if(el.open)return;
 el.showModal();dialogStack.push(el);document.body.classList.add('locked');
}
function closeDialog(el){
 if(el.open)el.close();
 const index=dialogStack.lastIndexOf(el);if(index>=0)dialogStack.splice(index,1);
 if(!dialogStack.length)document.body.classList.remove('locked');
}
function openMenu(){
 clearTimeout(aboutCloseTimer);
 menuReturnFocus=document.activeElement;
 const dialog=$('#site-menu');dialog.classList.remove('about-open');$('.about-panel').hidden=true;
 $('.about-toggle').setAttribute('aria-expanded','false');
 openDialog(dialog);$('.menu-toggle').setAttribute('aria-expanded','true');$('.menu-toggle').setAttribute('aria-label','Menyuni yopish');
}
function closeMenu(){
 closeDialog($('#site-menu'));$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Menyuni ochish');
 if(menuReturnFocus && document.contains(menuReturnFocus))menuReturnFocus.focus({preventScroll:true});
}
$('.menu-toggle').addEventListener('click',()=>$('#site-menu').open?closeMenu():openMenu());
$('.menu-close').addEventListener('click',closeMenu);
$('#site-menu').addEventListener('cancel',e=>{e.preventDefault();if($('#site-menu').classList.contains('about-open'))closeAbout();else closeMenu();});
function showAbout(){
 clearTimeout(aboutCloseTimer);
 const panel=$('.about-panel');panel.hidden=false;
 requestAnimationFrame(()=>$('#site-menu').classList.add('about-open'));
 $('.about-toggle').setAttribute('aria-expanded','true');
 setTimeout(()=>$('.about-back').focus({preventScroll:true}),200);
}
function closeAbout(){
 $('#site-menu').classList.remove('about-open');$('.about-toggle').setAttribute('aria-expanded','false');
 clearTimeout(aboutCloseTimer);
 aboutCloseTimer=setTimeout(()=>{$('.about-panel').hidden=true;if($('#site-menu').open)$('.about-toggle').focus({preventScroll:true});},500);
}
$('.about-toggle').addEventListener('click',showAbout);
$('.about-back').addEventListener('click',closeAbout);

function navigate(next,push=true){
 const changed=route!==next;
 route=next;
 closeMenu();
 $('#home-view').hidden=next!=='home';$('#gallery-view').hidden=next!=='gallery';
 $('.chapter-indicator').style.display=next==='home'?'':'none';
 document.title=next==='gallery'?'Xotiralar galereyasi — O‘zbekistonga maktub':'O‘zbekistonga maktub — Bir yurt. Ming bir hikoya.';
 if(push&&changed)history.pushState({route:next},'',next==='gallery'?'/gallery/':'/');
 if(changed||!push||next==='home')window.scrollTo({top:0,behavior:'instant'});
 if(changed)$('#main').focus({preventScroll:true});
 requestTick();
}
$$('.gallery-link').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();navigate('gallery');}));
$$('.home-link').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();navigate('home');}));
window.addEventListener('popstate',()=>navigate(location.pathname.startsWith('/gallery')?'gallery':'home',false));
// Initialise without changing the URL.
$('#home-view').hidden=route!=='home';$('#gallery-view').hidden=route!=='gallery';
$('.chapter-indicator').style.display=route==='home'?'':'none';
if(route==='gallery')document.title='Xotiralar galereyasi — O‘zbekistonga maktub';

function updateLightbox(){
 const photo=lightboxSequence[lightboxIndex];
 const image=$('#lightbox-image');image.src=photo.src;image.alt=photo.title;
 $('#lightbox-caption').textContent=photo.title;
 $('.lightbox-counter').textContent=`${String(lightboxIndex+1).padStart(2,'0')} / ${String(lightboxSequence.length).padStart(2,'0')}`;
}
function showLightbox(){updateLightbox();openDialog($('#lightbox'));}
function shiftLightbox(direction){lightboxIndex=(lightboxIndex+direction+lightboxSequence.length)%lightboxSequence.length;updateLightbox();}
$('.lightbox-close').addEventListener('click',()=>closeDialog($('#lightbox')));
$('.lightbox-prev').addEventListener('click',()=>shiftLightbox(-1));
$('.lightbox-next').addEventListener('click',()=>shiftLightbox(1));
$('#lightbox').addEventListener('cancel',e=>{e.preventDefault();closeDialog($('#lightbox'));});
$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox'))closeDialog($('#lightbox'));});
$('#lightbox').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();shiftLightbox(-1);}if(e.key==='ArrowRight'){e.preventDefault();shiftLightbox(1);}});
let touchStartX=0;
$('#lightbox').addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].screenX;},{passive:true});
$('#lightbox').addEventListener('touchend',e=>{const difference=e.changedTouches[0].screenX-touchStartX;if(Math.abs(difference)>60)shiftLightbox(difference<0?1:-1);},{passive:true});
$('#photo-credits').innerHTML=photoData.map(p=>`<a href="${p.url}" target="_blank" rel="noopener"><span>${p.title}</span><span>${p.source} ↗</span></a>`).join('');
$$('.credits-trigger').forEach(b=>b.addEventListener('click',()=>openDialog($('#credits-dialog'))));
$('.credits-close').addEventListener('click',()=>closeDialog($('#credits-dialog')));
$('#credits-dialog').addEventListener('cancel',e=>{e.preventDefault();closeDialog($('#credits-dialog'));});
$('#credits-dialog').addEventListener('click',e=>{if(e.target===$('#credits-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(e.target);}});

$$('.word-row').forEach(button=>button.addEventListener('click',()=>{
 const expanded=button.getAttribute('aria-expanded')==='true';
 $$('.word-row').forEach(b=>b.setAttribute('aria-expanded','false'));
 button.setAttribute('aria-expanded',String(!expanded));
}));
$$('.creator-toggle').forEach(button=>button.addEventListener('click',()=>{
 const expanded=button.getAttribute('aria-expanded')==='true';
 const panel=document.getElementById(button.getAttribute('aria-controls'));
 button.setAttribute('aria-expanded',String(!expanded));panel.hidden=expanded;
 $('.toggle-symbol',button).textContent=expanded?'+':'−';button.parentElement.classList.toggle('open',!expanded);
}));
const cityData={
 tashkent:{image:'tashkent',alt:'Toshkentdagi Hazrati Imom majmuasi',caption:'Toshkent. Eski va yangi orasidagi mehr.',coordinate:'41°18′ N · 69°16′ E',copy:'Keng ko‘chalar, soyali chinorlar, tanish mahallalar. Har safar yangilanadigan, ammo mehri o‘zgarmaydigan shahar.'},
 samarkand:{image:'registan',alt:'Samarqanddagi Registon ansambli',caption:'Samarqand. Osmon yerga tushgan shahar.',coordinate:'39°39′ N · 66°58′ E',copy:'Moviy gumbazlar va ulug‘vor peshtoqlar. Buyuk Ipak yo‘lining chorrahasida o‘tmish bilan bugun yonma-yon yuradi.'},
 bukhara:{image:'bukhara',alt:'Buxorodagi Poyi Kalon minorasi',caption:'Buxoro. Vaqt ham sekin yuradigan joy.',coordinate:'39°46′ N · 64°26′ E',copy:'Ko‘hna ko‘chalarda, salqin hovlilarda, minoralar soyasida bir tanish osoyishtalik bor. Buxoro — xotiraning o‘zi.'},
 khiva:{image:'khiva',alt:'Xivadagi Ichan qal’a me’morchiligi',caption:'Xiva. Ertaklar ham shu yerda yashaydi.',coordinate:'41°23′ N · 60°22′ E',copy:'Qal’a devorlari ortida butun bir dunyo. Quyosh botganda g‘ishtlar oltin tusga kiradi, ko‘ngil esa uzoq qolishni istaydi.'}
};
function selectCity(button){
 const city=cityData[button.dataset.city];
 $$('.city-tab').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
 $('#city-panel').setAttribute('aria-labelledby',button.id);
 const image=$('#city-image');image.style.opacity='.35';
 image.onload=()=>{image.style.opacity='1';};image.onerror=()=>{image.style.opacity='1';};image.src=`/assets/${city.image}.jpg`;image.alt=city.alt;
 if(image.complete)image.style.opacity='1';
 $('#city-photo-caption').textContent=city.caption;$('#city-coordinate').textContent=city.coordinate;$('#city-copy').textContent=city.copy;
}
$$('.city-tab').forEach((button,index)=>{
 button.addEventListener('click',()=>selectCity(button));
 button.addEventListener('keydown',e=>{
  const tabs=$$('.city-tab');let next=index;
  if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(index+1)%tabs.length;
  else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
  else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;
  e.preventDefault();tabs[next].focus();selectCity(tabs[next]);
 });
});
function toast(message){const el=$('.toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),3500);}
$('.share-button').addEventListener('click',async()=>{
 const url=location.origin+'/';
 try{
  if(navigator.share){await navigator.share({title:'O‘zbekistonga maktub',text:'Bir yurt. Ming bir hikoya.',url});return;}
  if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);toast('Maktub havolasi nusxalandi. Mehr ulashing!');}
  else{const field=document.createElement('textarea');field.value=url;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const ok=document.execCommand('copy');field.remove();toast(ok?'Maktub havolasi nusxalandi.':url);}
 }catch(err){if(err.name!=='AbortError')toast('Havolani brauzer manzilidan nusxalang.');}
});

// Intersection-based reveals and chapter labels. No animation library or network dependency.
if ('IntersectionObserver' in window) {
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target);}}),{threshold:.1,rootMargin:'0px 0px -25px 0px'});
 $$('.reveal').forEach(el=>revealObserver.observe(el));
} else {
 $$('.reveal').forEach(el=>el.classList.add('in-view'));
}
const chapters=$$('[data-chapter]');
const poem=$('.poem-scene');
const food=$('.food');
const parallaxItems=$$('[data-parallax]');
const poemVerses=[
 ['Tonglaringda quyosh bilan uyg‘ondim,','Tuprog‘ingda o‘zligimni men topdim.','Har yo‘lingda bir hikoya, bir umid.'],
 ['Tuprog‘ingda o‘zligimni men topdim.','Har yo‘lingda bir hikoya, bir umid.','Sen bor joyda ko‘nglim doim yorug‘dir.'],
 ['Har yo‘lingda bir hikoya, bir umid.','Sen bor joyda ko‘nglim doim yorug‘dir.','Mehring bilan dunyo menga yaqindir.'],
 ['Sen bor joyda ko‘nglim doim yorug‘dir.','Mehring bilan dunyo menga yaqindir.','O‘zbekiston — yuragimdagi yurtim.']
];
function clamp(v,min=0,max=1){return Math.min(max,Math.max(min,v));}
// Read layout first, then apply changes together to avoid repeated layout work while scrolling.
const progressBar=$('.reading-progress');
const chapterLabel=$('.chapter-indicator span');
const footer=$('.footer');
const poemLines=[$('.poem-before'),$('.poem-current'),$('.poem-after')];
const poemDots=$$('.poem-dots b');
const plate=$('.food-plate'), bread=$('.food-bread'), foodQuestion=$('.food-question');
let lastChapter='';
function updateScroll(){
 ticking=false;
 const y=window.scrollY, h=window.innerHeight;
 const maxScroll=document.documentElement.scrollHeight-h;
 const footerTop=footer.getBoundingClientRect().top;
 let activeChapter='', poemIndex=null, foodProgress=null, parallax=[];
 if(route==='home'){
  let active=chapters[0];
  for(const chapter of chapters){if(chapter.getBoundingClientRect().top<h*.45)active=chapter;}
  activeChapter=active ? active.dataset.chapter : '';
  const pr=poem.getBoundingClientRect();
  if(pr.bottom>0&&pr.top<h){
   const p=clamp(-pr.top/Math.max(1,pr.height-h));
   poemIndex=Math.min(3,Math.floor(p*4));
  }
  if(!reducedMotion){
   const fr=food.getBoundingClientRect();
   if(fr.bottom>0&&fr.top<h)foodProgress=clamp(-fr.top/Math.max(1,fr.height-h));
   parallax=parallaxItems.map(item=>({item,rect:item.parentElement.getBoundingClientRect()}))
    .filter(({rect})=>rect.bottom>=0&&rect.top<=h)
    .map(({item,rect})=>({item,amount:(rect.top-h*.35)*Number(item.dataset.parallax)}));
  }
 }
 progressBar.style.transform=`scaleX(${maxScroll>0?clamp(y/maxScroll):0})`;
 document.body.classList.toggle('at-footer',footerTop<h*.7);
 if(route!=='home')return;
 if(activeChapter!==lastChapter){chapterLabel.textContent=activeChapter;lastChapter=activeChapter;}
 if(poemIndex!==null&&poemIndex!==lastPoemIndex){
  lastPoemIndex=poemIndex;
  poemLines.forEach((line,i)=>{line.textContent=poemVerses[poemIndex][i];});
  poemDots.forEach((dot,i)=>dot.classList.toggle('active',i===poemIndex));
 }
 if(foodProgress!==null){
  const p=foodProgress;
  plate.style.transform=`translate(${(p-.5)*14}vw,${Math.sin(p*Math.PI)*-25}px) rotate(${-20+p*42}deg)`;
  bread.style.transform=`translate(${(p-.5)*-10}vw,${Math.cos(p*Math.PI)*20}px) rotate(${22-p*28}deg)`;
  foodQuestion.style.transform=`translateX(${(p-.5)*-8}vw)`;
 }
 parallax.forEach(({item,amount})=>{item.style.translate=`0 ${amount.toFixed(1)}px`;});
}
function requestTick(){if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}}
window.addEventListener('scroll',requestTick,{passive:true});window.addEventListener('resize',requestTick,{passive:true});
window.addEventListener('load',requestTick);requestTick();
// Recover gracefully if a photograph fails: keep the caption and paper composition visible.
$$('img').forEach(image=>image.addEventListener('error',()=>{image.style.opacity='.2';image.style.background='#baa17c';}));

// Honour changes to the system motion setting without requiring a reload.
function onMotionPreferenceChange(event){
 reducedMotion=event.matches;
 if(reducedMotion){
  parallaxItems.forEach(item=>item.style.removeProperty('translate'));
  ['.food-plate','.food-bread','.food-question'].forEach(selector=>$(selector).style.removeProperty('transform'));
 }
 requestTick();
}
if (motionPreference.addEventListener) motionPreference.addEventListener('change',onMotionPreferenceChange);
else if (motionPreference.addListener) motionPreference.addListener(onMotionPreferenceChange);
