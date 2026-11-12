'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionPreference.matches;
const photoData = [
 {key:'registan',title:'Registon, Samarqand',category:'architecture',ratio:'.91',message:'Moviy gumbazlar ostida asrlar bir-biri bilan suhbatlaşadi.',source:'Unsplash',url:'https://unsplash.com/s/photos/uzbekistan'},
 {key:'mountains',title:'Çorvoq, Toşkent viloyati',category:'nature',ratio:'.77',message:'Toğlarning sukunati. Suvning moviyligi. Bir nafas xotirjamlik.',source:'Pexels',id:26729708},
 {key:'bukhara',title:'Poyi Kalon, Buxoro',category:'architecture',ratio:'.72',message:'Har bir ğiştda vaqtning izi, har bir köçada bir hikoya.',source:'Pexels',id:39411349},
 {key:'khiva',title:'Içan qalʼa, Xiva',category:'architecture',ratio:'.76',message:'Göyo ertak kitobining içiga kirib qolgandek.',source:'Pexels',id:35375813},
 {key:'charvak',title:'Çorvoq sohillari',category:'nature',ratio:'.73',message:'Şoşmasdan qarang. Bu manzara eslab qolişga arziydi.',source:'Pexels',id:30827061},
 {key:'shahi',title:'Şohi Zinda, Samarqand',category:'architecture',ratio:'1.03',message:'Koşinlarda yaşiringan ming bir rang, ming bir xotira.',source:'Pexels',id:19439170},
 {key:'tashkent',title:'Hazrati Imom, Toşkent',category:'architecture',ratio:'1.08',message:'Şahar şovqini orasidagi sokin bir olam.',source:'Pexels',id:19227998},
 {key:'bread',title:'Tandir non',category:'food',ratio:'.75',message:'Yangi yopilgan nonning hidi. Uy degan tuyğuning eng taniş ifodasi.',source:'Pexels',id:39597532},
 {key:'dome',title:'Samarqand koşinlari',category:'architecture',ratio:'.76',message:'Osmon rangini yerga olib tuşgan ustalar xotirasi.',source:'Pexels',id:19439144},
 {key:'samarkand',title:'Şohi Zinda gumbazlari',category:'architecture',ratio:'1.12',message:'Bir-biriga tutaşgan asrlar, bir-biriga öxşamagan naqşlar.',source:'Pexels',id:16534573},
 {key:'plov',title:'Özbek palovi',category:'food',ratio:'.8',message:'Bir dasturxon atrofida notaniş inson ham yaqin bölib qoladi.',source:'Pexels',id:32558904},
 {key:'bibi',title:'Bibixonim, Samarqand',category:'architecture',ratio:'.72',message:'Uluğvorlikni köriş mumkin. Ruhini esa his qiliş kerak.',source:'Pexels',id:19439200},
 {key:'street',title:'Samarqand köçalari',category:'architecture',ratio:'.7',message:'Bu yöllardan qança inson, qança orzu ötgan.',source:'Pexels',id:19839437},
 {key:'art',title:'Hazrati Imomdagi sanʼat',category:'architecture',ratio:'1.05',message:'Gözallikni yaratadigan qöllar. Uni asraydigan qalblar.',source:'Pexels',id:19227987},
 {key:'cooking',title:'Toşkent dasturxoni',category:'food',ratio:'.77',message:'Qozon boşida boşlangan suhbat, dasturxon atrofida davom etadi.',source:'Pexels',id:39561317}
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
 wrap.innerHTML = `<button class="photo-card" style="--ratio:${photo.ratio}" aria-label="${photo.title}: suratning orqa tomonini köriş" aria-pressed="false"><div class="photo-card-inner"><div class="card-front"><img src="${photo.src}" alt="${photo.title}" loading="lazy" decoding="async" width="600" height="760"></div><div class="card-back" aria-hidden="true"><span class="card-location">${photo.title}</span><span class="card-message">${photo.message}</span><span class="card-number">ÖZBEKISTONGA MAKTUB / ${String(index+1).padStart(2,'0')}</span></div></div></button><div class="gallery-card-tools"><span>${photo.title}</span><button aria-label="${photo.title}: suratni kattalaştiriş">Oçiş ↗</button></div>`;
 const card=$('.photo-card',wrap);
 card.addEventListener('click',()=>{
  const flipped=card.classList.toggle('flipped');
  card.setAttribute('aria-pressed',String(flipped));
  card.setAttribute('aria-label',`${photo.title}: suratning ${flipped?'old':'orqa'} tomonini köriş`);
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
 openDialog(dialog);$('.menu-toggle').setAttribute('aria-expanded','true');$('.menu-toggle').setAttribute('aria-label','Menyuni yopiş');
}
function closeMenu(){
 closeDialog($('#site-menu'));$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Menyuni oçiş');
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
 document.title=next==='gallery'?'Xotiralar galereyasi — Özbekistonga maktub':'Özbekistonga maktub — Bir yurt. Ming bir hikoya.';
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
if(route==='gallery')document.title='Xotiralar galereyasi — Özbekistonga maktub';

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
 tashkent:{image:'tashkent',alt:'Toşkentdagi Hazrati Imom majmuasi',caption:'Toşkent. Eski va yangi orasidagi mehr.',coordinate:'41°18′ N · 69°16′ E',copy:'Keng köçalar, soyali çinorlar, taniş mahallalar. Har safar yangilanadigan, ammo mehri özgarmaydigan şahar.'},
 samarkand:{image:'registan',alt:'Samarqanddagi Registon ansambli',caption:'Samarqand. Osmon yerga tuşgan şahar.',coordinate:'39°39′ N · 66°58′ E',copy:'Moviy gumbazlar va uluğvor peştoqlar. Buyuk Ipak yölining çorrahasida ötmiş bilan bugun yonma-yon yuradi.'},
 bukhara:{image:'bukhara',alt:'Buxorodagi Poyi Kalon minorasi',caption:'Buxoro. Vaqt ham sekin yuradigan joy.',coordinate:'39°46′ N · 64°26′ E',copy:'Köhna köçalarda, salqin hovlilarda, minoralar soyasida bir taniş osoyiştalik bor. Buxoro — xotiraning özi.'},
 khiva:{image:'khiva',alt:'Xivadagi Içan qalʼa meʼmorçiligi',caption:'Xiva. Ertaklar ham şu yerda yaşaydi.',coordinate:'41°23′ N · 60°22′ E',copy:'Qalʼa devorlari ortida butun bir dunyo. Quyoş botganda ğiştlar oltin tusga kiradi, köngil esa uzoq qolişni istaydi.'}
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
  if(navigator.share){await navigator.share({title:'Özbekistonga maktub',text:'Bir yurt. Ming bir hikoya.',url});return;}
  if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);toast('Maktub havolasi nusxalandi. Mehr ulaşing!');}
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
// Reveal editorial imagery and crop-mask chapter headings as they enter the viewport.
// WAAPI is progressive enhancement: without it all content remains visible.
const editorialAnimations=new Set();
if ('IntersectionObserver' in window && Element.prototype.animate) {
 const cinematicObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if (!entry.isIntersecting) return;
  cinematicObserver.unobserve(entry.target);
  if (reducedMotion) return;
  const isHeading=entry.target.classList.contains('chapter-title');
  const animation=entry.target.animate(isHeading
   ? [{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)'}]
   : [{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)'}],
   {duration:isHeading?1100:950,easing:'cubic-bezier(.22,1,.36,1)'});
  editorialAnimations.add(animation);
  animation.onfinish=()=>editorialAnimations.delete(animation);
  animation.oncancel=()=>editorialAnimations.delete(animation);
 }),{threshold:.12});
 $$('.chapter-title, .intro-photo img, .landscape-card img, .food-story>figure img, .city-photo img, .outro-photo img, .preview-gallery .card-front img').forEach(el=>cinematicObserver.observe(el));
}
const chapters=$$('[data-chapter]');
const poem=$('.poem-scene');
const food=$('.food');
const parallaxItems=$$('[data-parallax]');
const poemVerses=[
 ['Tonglaringda quyoş bilan uyğondim,','Tuproğingda özligimni men topdim.','Har yölingda bir hikoya, bir umid.'],
 ['Tuproğingda özligimni men topdim.','Har yölingda bir hikoya, bir umid.','Sen bor joyda könglim doim yoruğdir.'],
 ['Har yölingda bir hikoya, bir umid.','Sen bor joyda könglim doim yoruğdir.','Mehring bilan dunyo menga yaqindir.'],
 ['Sen bor joyda könglim doim yoruğdir.','Mehring bilan dunyo menga yaqindir.','Özbekiston — yuragimdagi yurtim.']
];
function clamp(v,min=0,max=1){return Math.min(max,Math.max(min,v));}
// Read layout first, then apply changes together to avoid repeated layout work while scrolling.
const progressBar=$('.reading-progress');
const chapterLabel=$('.chapter-indicator span');
const footer=$('.footer');
const poemLines=[$('.poem-before'),$('.poem-current'),$('.poem-after')];
const poemDots=$$('.poem-dots b');
const plate=$('.food-plate'), bread=$('.food-bread'), foodQuestion=$('.food-question');
const mountainScene=$('.mountain-scene'), mountainArt=$('.mountain-engraving'), mountainNote=$('.mountain-note');
const bookScene=$('.book-collage'), bookBack=$('.book-back');
const hero=$('.hero');
const rings=$$('.food-ring'), foodStar=$('.food-star');
const soul=$('.soul'), soulSky=$('.soul-sky'), soulStar=$('.soul-center .little-star');
const outro=$('.outro-collage'), outroNote=$('.outro-note');
const introScene=$('.intro-postcards'), introImages=$$('.intro-photo img');
const poemBird=$('.poem-bird'), bookBird=$('.book-bird'), outroBird=$('.outro-bird');
let lastChapter='';
function updateScroll(){
 ticking=false;
 const y=window.scrollY, h=window.innerHeight;
 const maxScroll=document.documentElement.scrollHeight-h;
 const footerTop=footer.getBoundingClientRect().top;
 let activeChapter='', poemIndex=null, foodProgress=null, mountainProgress=null, bookProgress=null, heroProgress=null, soulProgress=null, outroProgress=null, introProgress=null, poemProgress=null, parallax=[];
 if(route==='home'){
  let active=chapters[0];
  for(const chapter of chapters){if(chapter.getBoundingClientRect().top<h*.45)active=chapter;}
  activeChapter=active ? active.dataset.chapter : '';
  const pr=poem.getBoundingClientRect();
  if(pr.bottom>0&&pr.top<h){
   const p=clamp(-pr.top/Math.max(1,pr.height-h));
   poemIndex=Math.min(3,Math.floor(p*4));
   if(!reducedMotion)poemProgress=p;
  }
  if(!reducedMotion){
   const ir=introScene.getBoundingClientRect();
   if(ir.bottom>0&&ir.top<h)introProgress=clamp((h-ir.top)/(h+ir.height));
   const hr=hero.getBoundingClientRect();
   if(hr.bottom>0&&hr.top<h)heroProgress=clamp(-hr.top/Math.max(1,hr.height));
   const sr=soul.getBoundingClientRect();
   if(sr.bottom>0&&sr.top<h)soulProgress=clamp((h-sr.top)/(h+sr.height));
   const or=outro.getBoundingClientRect();
   if(or.bottom>0&&or.top<h)outroProgress=clamp((h-or.top)/(h+or.height));
   const fr=food.getBoundingClientRect();
   if(fr.bottom>0&&fr.top<h)foodProgress=clamp(-fr.top/Math.max(1,fr.height-h));
   const mr=mountainScene.getBoundingClientRect();
   if(mr.bottom>0&&mr.top<h)mountainProgress=clamp((h-mr.top)/(h+mr.height));
   const br=bookScene.getBoundingClientRect();
   if(br.bottom>0&&br.top<h)bookProgress=clamp((h-br.top)/(h+br.height));
   parallax=parallaxItems.map(item=>({item,rect:item.parentElement.getBoundingClientRect()}))
    .filter(({rect})=>rect.bottom>=0&&rect.top<=h)
    .map(({item,rect})=>({item,amount:clamp((rect.top-h*.35)*Number(item.dataset.parallax), window.innerWidth<651?-10:-18, window.innerWidth<651?10:18)}));
  }
 }
 progressBar.style.transform=`scaleX(${maxScroll>0?clamp(y/maxScroll):0})`;
 document.body.classList.toggle('at-footer',footerTop<h*.7);
 if(route!=='home')return;
 if(activeChapter!==lastChapter){chapterLabel.textContent=activeChapter;lastChapter=activeChapter;}
 if(poemIndex!==null&&poemIndex!==lastPoemIndex){
  const animateChange=lastPoemIndex!==-1&&!reducedMotion;
  lastPoemIndex=poemIndex;
  poemLines.forEach((line,i)=>{
   line.textContent=poemVerses[poemIndex][i];
   if(animateChange && line.animate){
    line.getAnimations().forEach(animation=>animation.cancel());
    line.animate([{opacity:0,translate:'0 12px'},{opacity:i===1?1:.18,translate:'0 0'}],{duration:600,delay:i*55,easing:'cubic-bezier(.22,1,.36,1)'});
   }
  });
  poemDots.forEach((dot,i)=>dot.classList.toggle('active',i===poemIndex));
 }
 if(foodProgress!==null){
  const p=foodProgress;
  plate.style.transform=`translate(${(p-.5)*14}vw,${Math.sin(p*Math.PI)*-25}px) rotate(${-20+p*42}deg)`;
  bread.style.transform=`translate(${(p-.5)*-10}vw,${Math.cos(p*Math.PI)*20}px) rotate(${22-p*28}deg)`;
  foodQuestion.style.transform=`translateX(${(p-.5)*-8}vw)`;
  rings.forEach((ring,i)=>{ring.style.transform=`rotate(${i?25-p*50:-15+p*40}deg) scaleY(.74)`;});
  foodStar.style.rotate=`${(p-.5)*70}deg`;
 }
 if(introProgress!==null)introImages.forEach((image,i)=>{image.style.transform=`scale(1.06) translateY(${((introProgress-.5)*(i?3:-3)).toFixed(2)}%)`;});
 if(poemProgress!==null)poemBird.style.rotate=`${((poemProgress-.5)*25).toFixed(1)}deg`;
 if(soulProgress!==null){soulSky.style.transform=`scale(1.08) translateY(${((soulProgress-.5)*-4).toFixed(2)}%)`;soulStar.style.rotate=`${((soulProgress-.5)*90).toFixed(1)}deg`;}
 if(outroProgress!==null){outroNote.style.translate=`0 ${((outroProgress-.5)*-25).toFixed(1)}px`;outroBird.style.rotate=`${((outroProgress-.5)*28).toFixed(1)}deg`;}
 if(mountainProgress!==null){
  mountainArt.style.transform=`scale(1.04) translateY(${((mountainProgress-.5)*-3).toFixed(2)}%)`;
  mountainNote.style.translate=`0 ${((mountainProgress-.5)*-24).toFixed(1)}px`;
 }
 if(bookProgress!==null){bookBack.style.translate=`0 ${((bookProgress-.5)*-24).toFixed(1)}px`;bookBird.style.rotate=`${((bookProgress-.5)*30).toFixed(1)}deg`;}
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
  editorialAnimations.forEach(animation=>animation.cancel());
  introImages.forEach(image=>image.style.removeProperty('transform'));
  [poemBird,bookBird,outroBird].forEach(bird=>bird.style.removeProperty('rotate'));
  rings.forEach(ring=>ring.style.removeProperty('transform'));foodStar.style.removeProperty('rotate');
  soulSky.style.removeProperty('transform');soulStar.style.removeProperty('rotate');outroNote.style.removeProperty('translate');
  mountainArt.style.removeProperty('transform');mountainNote.style.removeProperty('translate');bookBack.style.removeProperty('translate');
  poemLines.forEach(line=>line.getAnimations?.().forEach(animation=>animation.cancel()));
  ['.food-plate','.food-bread','.food-question'].forEach(selector=>$(selector).style.removeProperty('transform'));
 }
 requestTick();
}
if (motionPreference.addEventListener) motionPreference.addEventListener('change',onMotionPreferenceChange);
else if (motionPreference.addListener) motionPreference.addListener(onMotionPreferenceChange);

// Scroll-scrubbed flocks (the message-to-ukraine method): the swipe carries the birds.
// Wings flap because the birds are alive; their flight is the reader's scroll.
const flockScenes = Array.from(document.querySelectorAll('.hero, .poem-scene, .mountain-scene')).map(scene => ({
  scene,
  birds: Array.from(scene.querySelectorAll('.fly-bird'))
}));
function marqueeScrub(){
  const track = document.querySelector('.eco-marquee-track');
  if (!track || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const period = track.scrollWidth / 2;
  if (period > 0) track.style.transform = 'translateX(' + (-((window.scrollY * 0.3) % period)).toFixed(1) + 'px)';
}
function moveFlocks(){
  if (reducedMotion) return;
  const h = window.innerHeight;
  for (const entry of flockScenes) {
    const r = entry.scene.getBoundingClientRect();
    if (r.bottom < -80 || r.top > h + 80) continue;
    const p = clamp((h - r.top) / (h + r.height));
    entry.birds.forEach((bird, i) => {
      const q = clamp(p * 1.16 - 0.08 + (i - 1) * 0.07);
      bird.style.transform = 'translateX(' + (-16 + q * 132) + 'vw) translateY(' +
        (Math.sin((q * 2 + i * 0.7) * Math.PI) * 2.2) + 'vh) rotate(' +
        (Math.sin(q * 7 + i) * 5 - 3) + 'deg)';
    });
  }
}
let flockTick = false;
function requestFlockTick(){
  if (flockTick) return;
  flockTick = true;
  requestAnimationFrame(() => { flockTick = false; moveFlocks(); marqueeScrub(); });
}
window.addEventListener('scroll', requestFlockTick, { passive: true });
window.addEventListener('resize', requestFlockTick);
requestFlockTick();
if (motionPreference.addEventListener) motionPreference.addEventListener('change', () => {
  flockScenes.forEach(entry => entry.birds.forEach(bird => bird.style.removeProperty('transform')));
  requestFlockTick();
});
