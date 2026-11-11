'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const preference = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.08 });
  $$('.reveal').forEach(element => revealObserver.observe(element));
  const storyObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('active', entry.isIntersecting);
  }), { rootMargin: '-20% 0px -20% 0px', threshold: 0 });
  $$('.story-step').forEach(element => storyObserver.observe(element));
} else {
  $$('.reveal').forEach(element => element.classList.add('in-view'));
  $$('.story-step').forEach(element => element.classList.add('active'));
}

// One rAF per scroll: decorative transforms do not affect document flow.
const art = $('.story-art-frame'), storyLayout = $('.story-layout'), artImage = art.querySelector('img'), artLabel = $('.story-art-label');
const progress = $('.eco-progress span');
const narrative = $('.narrative-track'), narrativePanels = $$('.narrative-panel');
let framePending = false;
function renderScroll() {
  framePending = false;
  const height = innerHeight, max = document.documentElement.scrollHeight - height;
  progress.style.transform = `scaleX(${max > 0 ? Math.max(0, Math.min(1, scrollY / max)) : 0})`;
  const narrativeRect = narrative.getBoundingClientRect();
  if (narrativeRect.bottom > 0 && narrativeRect.top < height) {
    const target = height * .68;
    let closest = 0, distance = Infinity;
    narrativePanels.forEach((panel, index) => {
      const box = panel.getBoundingClientRect();
      const current = Math.abs((box.top + box.bottom) / 2 - target);
      if (current < distance) { distance = current; closest = index; }
    });
    narrative.dataset.storyPhase = String(closest);
  }
  if (preference.matches) { artLabel.style.removeProperty('translate'); return; }
  const rect = storyLayout.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= height) return;
  const p = Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height)));
  artLabel.style.translate = `0 ${((p - .5) * -28).toFixed(1)}px`;
}
function scheduleScroll() { if (!framePending) { framePending = true; requestAnimationFrame(renderScroll); } }
addEventListener('scroll', scheduleScroll, { passive: true });
addEventListener('resize', scheduleScroll, { passive: true });
if (preference.addEventListener) preference.addEventListener('change', scheduleScroll);
else if (preference.addListener) preference.addListener(scheduleScroll);
scheduleScroll();

// A narrated simulation, not a real transaction or a claimed pilot result.
const journey = $('#journey');
const journeyBack = $('#journey-back'), journeyNext = $('#journey-next');
const journeyHeading = $('#ticket-heading'), journeyCopy = $('#ticket-copy');
const journeyReceipt = $('#ticket-receipt'), journeyStatus = $('#ticket-status');
const journeyKicker = $('#ticket-kicker'), journeySteps = $$('.journey-steps li');
const scenes = [
  { kicker: 'DÖKONDA', heading: 'Bir butilka.<br><em>Ikki narx.</em>', copy: 'Içimlik va qaytariladigan garov çekda alohida körsatiladi.', rows: [['Içimlik', '5 000 söm'], ['Qaytariladigan garov', '1 000 söm'], ['Tölov', '6 000 söm']], status: 'Garov — idişni qaytarganingizda qaytariladigan pul.', next: 'BUTILKANI SOTIB OLIŞ' },
  { kicker: 'XARID', heading: 'Içimlik sizda.<br><em>Garov hisobda.</em>', copy: 'Siz içimlik bilan garovni töladingiz. Böş idişdagi belgini saqlang.', rows: [['Tölangan summa', '6 000 söm'], ['Şundan qaytariladi', '1 000 söm']], status: 'Tasviriy xarid yakunlandi. Endi idişni qaytaring.', next: 'BUTILKANI QAYTARIŞ' },
  { kicker: 'QAYTARIŞ', heading: 'Butilka qaytdi.<br><em>Pul ham.</em>', copy: 'Dökon belgilangan böş idişni qabul qiladi va sizga garovni qaytaradi.', rows: [['Qabul qilindi', '1 ta PET idiş'], ['Sizga qaytdi', '1 000 söm']], status: 'Bu bonus emas — avval tölangan garovning qaytişi.', next: 'KEYINGI YÖLINI KÖRIŞ' },
  { kicker: 'QABUL', heading: 'Çiqindiga emas.<br><em>Qabulga.</em>', copy: 'Operator alohida yiğilgan PETni olib ketadi; qayta işlovçi qabulini hujjat bilan tasdiqlaydi.', rows: [['Dökon', 'Alohida yiğadi'], ['Operator', 'Olib ketadi'], ['Qayta işlovçi', 'Qabulni tasdiqlaydi']], status: 'Qabul qiliş — qayta işlaş sodir bölganini anglatmaydi.', next: 'YANA KÖRIŞ' }
];
let journeyPhase = 0;
function renderJourney() {
  const scene = scenes[journeyPhase];
  journey.dataset.phase = String(journeyPhase);
  journeyKicker.textContent = scene.kicker;
  journeyHeading.innerHTML = scene.heading;
  journeyCopy.textContent = scene.copy;
  journeyReceipt.replaceChildren(...scene.rows.map(([label, value], index) => {
    const row = document.createElement('div');
    if (index === scene.rows.length - 1) row.className = 'receipt-total';
    const name = document.createElement('span'), amount = document.createElement('strong');
    name.textContent = label; amount.textContent = value;
    row.append(name, amount); return row;
  }));
  journeyStatus.textContent = scene.status;
  journeyBack.disabled = journeyPhase === 0;
  journeyNext.firstChild.nodeValue = scene.next + ' ';
  journeySteps.forEach((step, index) => {
    if (index === journeyPhase) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
  // Keep text changes immediate for assistive technology; animate only their presentation.
  if (!preference.matches && Element.prototype.animate) {
    [journeyHeading, journeyCopy, journeyStatus].forEach((element, index) => {
      element.getAnimations().forEach(animation => animation.cancel());
      element.animate([{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }],
        { duration: 520, delay: index * 65, easing: 'cubic-bezier(.22,1,.36,1)' });
    });
    journeyReceipt.getAnimations().forEach(animation => animation.cancel());
    journeyReceipt.animate(
      [{ opacity: 0, clipPath: 'inset(0 0 100% 0)', translate: '0 -10px' }, { opacity: 1, clipPath: 'inset(0)', translate: '0 0' }],
      { duration: 640, delay: 120, easing: 'cubic-bezier(.22,1,.36,1)' });
  }

}
journeyNext.addEventListener('click', () => { journeyPhase = (journeyPhase + 1) % scenes.length; renderJourney(); });
journeyBack.addEventListener('click', () => { if (journeyPhase > 0) { journeyPhase--; renderJourney(); } });

// A quiet final reveal: the question and landscape arrive together as the reader reaches them.
const closing = $('.eco-closing');
if ('IntersectionObserver' in window && Element.prototype.animate) {
  const sceneObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    sceneObserver.unobserve(entry.target);
    if (preference.matches) return;
    entry.target.querySelector('h2').animate(
      [{ clipPath: 'inset(0 0 100% 0)', transform: 'translateY(25px)' }, { clipPath: 'inset(0)', transform: 'translateY(0)' }],
      { duration: 1300, easing: 'cubic-bezier(.22,1,.36,1)' }
    );
    entry.target.querySelector('img').animate(
      [{ clipPath: 'inset(0 0 100% 0)', transform: 'scale(1.08)' }, { clipPath: 'inset(0)', transform: 'scale(1)' }],
      { duration: 1600, easing: 'cubic-bezier(.22,1,.36,1)' }
    );
  }), { threshold: .12 });
  sceneObserver.observe(closing);
  const cancelClosingMotion = event => {
    if (event.matches) {
      closing.querySelectorAll('h2, img').forEach(element => element.getAnimations().forEach(animation => animation.cancel()));
      [journeyHeading, journeyCopy, journeyReceipt, journeyStatus].forEach(element => element.getAnimations().forEach(animation => animation.cancel()));
    }
  };
  if (preference.addEventListener) preference.addEventListener('change', cancelClosingMotion);
  else if (preference.addListener) preference.addListener(cancelClosingMotion);
}

// Scroll-scrubbed flight (the message-to-ukraine method): the swipe carries the swallow,
// and the destiny lines are drawn by the reader's own scroll.
const clamp01 = value => Math.min(1, Math.max(0, value));

const heroImage = document.querySelector('.hero-image');
const heroBirds = heroImage ? Array.from(heroImage.querySelectorAll('.fly-bird')) : [];
const forkScene = document.querySelector('.fork-scene');
const forkPaths = forkScene ? Array.from(forkScene.querySelectorAll('.fork-path')) : [];
const forkComets = forkScene ? Array.from(forkScene.querySelectorAll('.fork-comet')) : [];
const forkEnds = forkScene ? Array.from(forkScene.querySelectorAll('.fork-end')) : [];

function moveFlock(){
  if (preference.matches || !heroImage || heroBirds.length === 0) return;
  const h = innerHeight;
  const r = heroImage.getBoundingClientRect();
  if (r.bottom < -80 || r.top > h + 80) return;
  const p = clamp01((h - r.top) / (h + r.height));
  heroBirds.forEach((bird, i) => {
    const q = clamp01(p * 1.16 - 0.08 + (i - 1) * 0.07);
    bird.style.transform = 'translateX(' + (-16 + q * 132) + 'vw) translateY(' +
      (Math.sin((q * 2 + i * 0.7) * Math.PI) * 2.2) + 'vh) rotate(' +
      (Math.sin(q * 7 + i) * 5 - 3) + 'deg)';
  });
}

function scrubFork(){
  if (!forkScene || preference.matches) return;
  const h = innerHeight;
  const r = forkScene.getBoundingClientRect();
  if (r.bottom < 0 || r.top > h) return;
  const p = clamp01((h * 0.8 - r.top) / (r.height * 0.72));
  forkPaths.forEach(path => { path.style.strokeDashoffset = String(1150 * (1 - p)); });
  forkComets.forEach(comet => {
    comet.style.strokeDashoffset = String(1166 - p * 1150);
    comet.style.opacity = p > 0.94 ? '0' : '1';
  });
  const endOn = p > 0.82 ? 1 : 0;
  forkEnds.forEach((glyph, i) => {
    glyph.style.opacity = String(endOn);
    glyph.style.transform = endOn ? 'none' : 'translateY(8px)';
    glyph.style.transition = 'opacity .5s ease ' + (i * 0.12) + 's, transform .5s ease ' + (i * 0.12) + 's';
  });
}

// Paper-theater layers (the message-to-ukraine method): hills, engraving and scraps
// each travel at their own speed — the swipe builds the depth of the scene.
const heroScene = document.querySelector('.hero-image');
const heroImgEl = heroScene ? heroScene.querySelector('img') : null;
const hillFar = document.querySelector('.hill-far');
const hillNear = document.querySelector('.hill-near');
const ecoHero = document.querySelector('.eco-hero');
const heroCopy = document.querySelector('.hero-copy');
const artFrame = document.querySelector('.story-art-frame');
const artImg = artFrame ? artFrame.querySelector('img') : null;
const riverLines = artFrame ? Array.from(artFrame.querySelectorAll('.river-line')) : [];
const driftScraps = artFrame ? Array.from(artFrame.querySelectorAll('.drift-scrap')) : [];
const closingSection = document.querySelector('.eco-closing');
const closingHills = document.querySelector('.closing-hills');

function layerInView(rect, h) { return rect.bottom > -60 && rect.top < h + 60; }

function paperTheater(){
  if (preference.matches) return;
  const h = innerHeight;
  if (heroScene && layerInView(heroScene.getBoundingClientRect(), h)) {
    const r = heroScene.getBoundingClientRect();
    const p = clamp01((h - r.top) / (h + r.height));
    if (heroImgEl) heroImgEl.style.translate = '0 ' + ((p - .5) * 46).toFixed(1) + 'px';
    if (hillFar) hillFar.style.translate = '0 ' + ((p - .5) * -118).toFixed(1) + 'px';
    if (hillNear) hillNear.style.translate = '0 ' + ((p - .5) * -206).toFixed(1) + 'px';
  }
  if (ecoHero && heroCopy && layerInView(ecoHero.getBoundingClientRect(), h)) {
    const r = ecoHero.getBoundingClientRect();
    const p = clamp01((h - r.top) / (h + r.height));
    heroCopy.style.translate = '0 ' + ((p - .5) * 36).toFixed(1) + 'px';
  }
  const layoutEl = (typeof storyLayout !== 'undefined' && storyLayout) ? storyLayout : artFrame;
  if (artFrame && layoutEl && layerInView(layoutEl.getBoundingClientRect(), h)) {
    const r = artFrame.getBoundingClientRect();
    const lr = layoutEl.getBoundingClientRect();
    const q = clamp01((h * 0.85 - lr.top) / (lr.height + h * 0.7));
    if (artImg) artImg.style.translate = '0 ' + ((q - .5) * -64).toFixed(1) + 'px';
    riverLines.forEach((line, i) => {
      line.style.strokeDashoffset = String(430 * (1 - clamp01(q * 1.35 - i * 0.14)));
    });
    driftScraps.forEach((scrap, i) => {
      const x = (-0.05 + q * 0.82 + i * 0.07) * r.width;
      const y = Math.sin((q * 2.4 + i * 0.85) * Math.PI) * 10;
      scrap.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + (q * 44 - 20 + i * 16).toFixed(1) + 'deg)';
    });
  }
  if (closingSection && closingHills && layerInView(closingSection.getBoundingClientRect(), h)) {
    const r = closingSection.getBoundingClientRect();
    const p = clamp01((h - r.top) / (h + r.height));
    closingHills.style.translate = '0 ' + ((p - .5) * -86).toFixed(1) + 'px';
  }
}

let flockTick = false;
function requestFlockTick(){
  if (flockTick) return;
  flockTick = true;
  requestAnimationFrame(() => { flockTick = false; moveFlock(); scrubFork(); paperTheater(); });
}
addEventListener('scroll', requestFlockTick, { passive: true });
addEventListener('resize', requestFlockTick);
requestFlockTick();
if (preference.addEventListener) preference.addEventListener('change', () => {
  heroBirds.forEach(bird => bird.style.removeProperty('transform'));
  [heroImgEl, hillFar, hillNear, heroCopy, artImg, closingHills].forEach(el => el && el.style.removeProperty('translate'));
  driftScraps.forEach(scrap => scrap.style.removeProperty('transform'));
  riverLines.forEach(line => line.style.removeProperty('stroke-dashoffset'));
  requestFlockTick();
});

// Till-roll numbers: the evidence figures roll up like a market scale.
if ('IntersectionObserver' in window && !preference.matches) {
  const numberObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    numberObserver.unobserve(entry.target);
    const strong = entry.target.querySelector('strong');
    if (!strong) return;
    const match = strong.textContent.trim().match(/^(\d+)([.,](\d+))?/);
    if (!match) return;
    const target = parseFloat(match[1] + '.' + (match[3] || '0'));
    const decimals = match[3] ? match[3].length : 0;
    const suffix = strong.textContent.trim().slice(match[0].length);
    const started = performance.now();
    const roll = now => {
      const t = Math.min(1, (now - started) / 1300);
      const eased = 1 - Math.pow(1 - t, 3);
      const shown = (target * eased).toFixed(decimals).replace('.', ',');
      strong.textContent = shown + suffix;
      if (t < 1) requestAnimationFrame(roll);
    };
    requestAnimationFrame(roll);
  }), { threshold: .55 });
  $$('.evidence-card').forEach(card => numberObserver.observe(card));
}
