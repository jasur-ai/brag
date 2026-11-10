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

// Estimates use the visitor's inputs, not a measured environmental outcome.
const refillForm = $('#refill-form');
const inputIds = ['bottles', 'price', 'refill-cost', 'bottle-cost'];
const inputs = inputIds.map(id => document.getElementById(id));
const formatNumber = number => String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const bottleResult = $('#bottle-result'), moneyResult = $('#money-result');
const moneyLabel = $('#money-label'), calcError = $('.calc-error');
function calculate() {
  const valid = inputs.every(input => input.value !== '' && input.validity.valid && Number.isFinite(input.valueAsNumber));
  if (!valid) {
    bottleResult.textContent = '—'; moneyResult.textContent = '—';
    moneyLabel.textContent = 'BIRINCHI YILDAGI TAXMINIY FARQ';
    calcError.textContent = 'Barcha maydonlarga ruxsat etilgan oraliqda butun son kiriting.';
    return;
  }
  const [bottles, price, refill, container] = inputs.map(input => input.valueAsNumber);
  const difference = (bottles * price - refill) * 52 - container;
  bottleResult.textContent = formatNumber(bottles * 52);
  moneyResult.textContent = formatNumber(Math.abs(difference));
  moneyLabel.textContent = difference < 0 ? 'BIRINCHI YILDAGI QO‘SHIMCHA XARAJAT' : difference === 0 ? 'BIRINCHI YILDA XARAJAT FARQI YO‘Q' : 'BIRINCHI YILDAGI TAXMINIY TEJAM';
  calcError.textContent = '';
}
refillForm.addEventListener('submit', event => event.preventDefault());
inputs.forEach(input => input.addEventListener('input', calculate));
calculate();

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
