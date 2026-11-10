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
let toastTimer;
function announce(message) {
  const toast = document.querySelector('.eco-toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}
document.querySelectorAll('.copy-pitch').forEach(button => {
  button.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(button.dataset.copy);
      announce('Pitch nusxalandi. Uni o‘z tajribangiz bilan to‘ldiring.');
    } catch {
      announce('Nusxalab bo‘lmadi. Matnni qo‘lda belgilang va nusxalang.');
    }
  });
});
