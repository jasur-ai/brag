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
  if (preference.matches) { artImage.style.removeProperty('transform'); artLabel.style.removeProperty('translate'); return; }
  const rect = storyLayout.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= height) return;
  const p = Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height)));
  artImage.style.transform = `scale(1.08) translateY(${((p - .5) * -5).toFixed(2)}%)`;
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
  { kicker: 'DO‘KONDA', heading: 'Bir butilka.<br><em>Ikki narx.</em>', copy: 'Ichimlik va qaytariladigan garov chekda alohida ko‘rsatiladi.', rows: [['Ichimlik', '5 000 so‘m'], ['Qaytariladigan garov', '1 000 so‘m'], ['To‘lov', '6 000 so‘m']], status: 'Garov — idishni qaytarganingizda qaytariladigan pul.', next: 'BUTILKANI SOTIB OLISH' },
  { kicker: 'XARID', heading: 'Ichimlik sizda.<br><em>Garov hisobda.</em>', copy: 'Siz ichimlik bilan garovni to‘ladingiz. Bo‘sh idishdagi belgini saqlang.', rows: [['To‘langan summa', '6 000 so‘m'], ['Shundan qaytariladi', '1 000 so‘m']], status: 'Tasviriy xarid yakunlandi. Endi idishni qaytaring.', next: 'BUTILKANI QAYTARISH' },
  { kicker: 'QAYTARISH', heading: 'Butilka qaytdi.<br><em>Pul ham.</em>', copy: 'Do‘kon belgilangan bo‘sh idishni qabul qiladi va sizga garovni qaytaradi.', rows: [['Qabul qilindi', '1 ta PET idish'], ['Sizga qaytdi', '1 000 so‘m']], status: 'Bu bonus emas — avval to‘langan garovning qaytishi.', next: 'KEYINGI YO‘LINI KO‘RISH' },
  { kicker: 'QABUL', heading: 'Chiqindiga emas.<br><em>Qabulga.</em>', copy: 'Operator alohida yig‘ilgan PETni olib ketadi; qayta ishlovchi qabulini hujjat bilan tasdiqlaydi.', rows: [['Do‘kon', 'Alohida yig‘adi'], ['Operator', 'Olib ketadi'], ['Qayta ishlovchi', 'Qabulni tasdiqlaydi']], status: 'Qabul qilish — qayta ishlash sodir bo‘lganini anglatmaydi.', next: 'YANA KO‘RISH' }
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
}
journeyNext.addEventListener('click', () => { journeyPhase = (journeyPhase + 1) % scenes.length; renderJourney(); });
journeyBack.addEventListener('click', () => { if (journeyPhase > 0) { journeyPhase--; renderJourney(); } });
