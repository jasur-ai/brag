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

// Suggestions are intentionally general: service availability depends on the locality.
const guides = {
  waste: {
    tag: 'CHIQINDI / 01', title: 'Avval xavfsizlik.',
    intro: 'Kichik va xavfsiz chiqindini qo‘lqop bilan yig‘ish mumkin. O‘tkir buyum yoki noma’lum moddaga tegmang.',
    contact: 'Mahalla, hududga mas’ul obodonlashtirish yoki chiqindi xizmatiga xabar bering.',
    detail: 'Aniq manzil, chiqindi qayerda to‘plangani va xavfli buyum ko‘rinayotganini ko‘rsating.',
    report: 'chiqindi to‘planganini ko‘rdim', request: 'Holatni ko‘rib chiqib, chiqindini xavfsiz olib chiqish choralarini ko‘rishingizni so‘rayman.'
  },
  water: {
    tag: 'SUV / 02', title: 'Sizishni to‘xtatish.',
    intro: 'Agar o‘z uyingizdagi jo‘mrak bo‘lsa va xavfsiz bo‘lsa, uni yoping. Ko‘cha quvuri yoki elektr jihozlariga o‘zingiz tegmang.',
    contact: 'Uydagi nosozlik uchun uy egasi yoki usta, ko‘chadagi quvur uchun mahalliy suv ta’minoti xizmatiga xabar bering.',
    detail: 'Suv qayerdan oqayotgani, manzil va xavfsiz masofadan ko‘ringan belgilarni yozing.',
    report: 'suv sizib oqayotganini ko‘rdim', request: 'Sizish sababini tekshirib, bartaraf etish choralarini ko‘rishingizni so‘rayman.'
  },
  smoke: {
    tag: 'TUTUN / 03', title: 'Tutundan uzoqlashing.',
    intro: 'Tutunni nafasga olmang va olovga yaqinlashmang. Yong‘in xavfi yoki inson hayotiga tahdid bo‘lsa, xavfsiz joyga chiqib, mahalliy tezkor xizmatga darhol murojaat qiling.',
    contact: 'Xavf darajasiga qarab mahalliy tezkor xizmat yoki hududga mas’ul tashkilotga xabar bering.',
    detail: 'Manzil, tutun yoki olov ko‘rinishi va vaziyatni xavfsiz masofadan ta’riflang.',
    report: 'chiqindi yoqilayotganini yoki tutun chiqayotganini ko‘rdim', request: 'Holatni tekshirib, xavfsizlikni ta’minlash choralarini ko‘rishingizni so‘rayman.'
  },
  tree: {
    tag: 'DARAXT / 04', title: 'O‘zingizni xavfga qo‘ymang.',
    intro: 'Qulay masofadan holatni kuzating. Kesish ishlari yoki qulab tushishi mumkin bo‘lgan shoxlar yaqiniga bormang; mojaroga aralashmang.',
    contact: 'Hududga mas’ul mahalla yoki mahalliy obodonlashtirish va ekologiya tashkilotiga xabar bering.',
    detail: 'Manzil, daraxtning joylashuvi va ko‘rgan holatingizni tasvirlang. Ruxsat bor-yo‘qligini taxmin qilmang.',
    report: 'daraxtga zarar yetayotgan bo‘lishi mumkin bo‘lgan holatni ko‘rdim', request: 'Holatni tekshirib, zarur choralar ko‘rishingizni so‘rayman.'
  }
};
const form = $('#eco-form'), result = $('#result'), reportText = $('#report-text'), status = $('.result-status');
function chosenGuide() { return guides[form.elements.issue.value] || guides.waste; }
function updateGuide() {
  const guide = chosenGuide();
  $('#guide-tag').textContent = guide.tag;
  $('#guide-title').textContent = guide.title;
  $('#guide-intro').textContent = guide.intro;
  $('#guide-contact').textContent = guide.contact;
  $('#guide-detail').textContent = guide.detail;
  result.hidden = true;
}
form.elements.issue.forEach(radio => radio.addEventListener('change', updateGuide));
['place', 'details'].forEach(id => $('#' + id).addEventListener('input', () => { result.hidden = true; }));
form.addEventListener('submit', event => {
  event.preventDefault();
  const place = $('#place').value.trim();
  if (!place) { $('#place').setCustomValidity('Manzil yoki mo‘ljalni kiriting.'); $('#place').reportValidity(); return; }
  const details = $('#details').value.trim();
  const guide = chosenGuide();
  reportText.value = `Assalomu alaykum.\n\n${place} manzilida ${guide.report}.${details ? `\n\nQo‘shimcha ma’lumot: ${details}` : ''}\n\n${guide.request}\n\nRahmat.`;
  status.textContent = '';
  result.hidden = false;
  result.scrollIntoView({ behavior: preference.matches ? 'auto' : 'smooth', block: 'start' });
});
$('#place').addEventListener('input', event => event.target.setCustomValidity(''));
$('#copy-report').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(reportText.value);
    status.textContent = 'Matn nusxalandi. Uni tegishli xizmatga o‘zingiz yuboring.';
  } catch {
    reportText.focus(); reportText.select();
    status.textContent = 'Matn belgilandi. Uni qo‘lda nusxalang.';
  }
});
$('#download-report').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([reportText.value], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'ekologik-murojaat.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Matn fayl sifatida saqlandi. Uni tegishli xizmatga o‘zingiz yuboring.';
});

// One rAF per scroll: decorative transforms do not affect document flow.
const art = $('.story-art-frame'), storyLayout = $('.story-layout'), artImage = art.querySelector('img'), artLabel = $('.story-art-label');
const progress = $('.eco-progress span');
let framePending = false;
function renderScroll() {
  framePending = false;
  const height = innerHeight, max = document.documentElement.scrollHeight - height;
  progress.style.transform = `scaleX(${max > 0 ? Math.max(0, Math.min(1, scrollY / max)) : 0})`;
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
