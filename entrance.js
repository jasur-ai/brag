'use strict';
// Any intent to navigate skips the visual introduction. It never locks scrolling.
if (document.documentElement.classList.contains('entry-motion')) {
  const skipEntrance = () => document.documentElement.classList.add('entry-skipped');
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(type => {
    addEventListener(type, skipEntrance, { once: true, passive: true });
  });
  addEventListener('pageshow', event => { if (event.persisted) skipEntrance(); });
}
