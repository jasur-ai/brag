'use strict';
// Content remains visible without JavaScript or IntersectionObserver.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('in-view'));
}

// A local checklist is a personal plan, not a claim of measured impact.
const steps = Array.from(document.querySelectorAll('.action-item input'));
const count = document.querySelector('.action-count');
const progress = document.querySelector('.action-progress span');
const message = document.querySelector('.action-message');
const privacy = document.querySelector('.action-privacy');
const storageKey = 'toza-makon-plan-v1';
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) steps.forEach(step => { step.checked = saved.includes(step.value); });
} catch { privacy.textContent = 'Brauzer saqlashga ruxsat bermadi; belgilar faqat shu sahifada qoladi.'; }
function updatePlan(save = true) {
  const selected = steps.filter(step => step.checked).map(step => step.value);
  count.textContent = `${selected.length} / ${steps.length}`;
  progress.style.width = `${selected.length / steps.length * 100}%`;
  const messages = ['Bir qadam tanlashning o‘zi — boshlanish.', 'Yaxshi boshlanish. Davom eting.', 'Ikki qadam — bir odatga yaqinroq.', 'Yana bir qadam qoldi.', 'Reja bajarildi. Bu e’tiborni odatga aylantiring.'];
  message.textContent = messages[selected.length];
  if (save) {
    try { localStorage.setItem(storageKey, JSON.stringify(selected)); }
    catch { privacy.textContent = 'Brauzer saqlashga ruxsat bermadi; belgilar faqat shu sahifada qoladi.'; }
  }
}
steps.forEach(step => step.addEventListener('change', () => updatePlan()));
document.querySelector('.action-reset').addEventListener('click', () => { steps.forEach(step => { step.checked = false; }); updatePlan(); });
updatePlan(false);

// Motion is tied to native scrolling and never blocks reading or interaction.
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const scene = document.querySelector('.reasons-photo');
const sceneImage = scene.querySelector('img');
const stamp = scene.querySelector('.reasons-stamp');
let framePending = false;
function renderScene() {
  framePending = false;
  if (preference.matches) { sceneImage.style.removeProperty('transform'); stamp.style.removeProperty('translate'); return; }
  const rect = scene.getBoundingClientRect(), height = innerHeight;
  if (rect.bottom <= 0 || rect.top >= height) return;
  const p = Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height)));
  sceneImage.style.transform = `scale(1.08) translateY(${((p - .5) * -4).toFixed(2)}%)`;
  stamp.style.translate = `0 ${((p - .5) * -24).toFixed(1)}px`;
}
function scheduleScene() { if (!framePending) { framePending = true; requestAnimationFrame(renderScene); } }
addEventListener('scroll', scheduleScene, { passive: true });
addEventListener('resize', scheduleScene, { passive: true });
if (preference.addEventListener) preference.addEventListener('change', scheduleScene);
else if (preference.addListener) preference.addListener(scheduleScene);
scheduleScene();
