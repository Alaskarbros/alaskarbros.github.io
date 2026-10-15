// Alaskarbros home page: small progressive enhancements. The page works without this file.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;

  // Nav: solid background once the page is scrolled.
  var nav = document.querySelector('.nav');
  function onScroll() { if (nav) nav.classList.toggle('is-solid', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('anim'); // starts the hero wall's drift and shows the pause buttons

  function setToggle(btn, paused, what) {
    btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    btn.setAttribute('aria-label', (paused ? 'Play ' : 'Pause ') + what);
  }

  // Hero wall: pause button, and paused anyway while the hero is off screen.
  var hero = document.querySelector('.hero');
  var heroBtn = hero && hero.querySelector('.toggle');
  var heroPaused = false, heroVisible = true;
  function heroState() { hero.classList.toggle('is-paused', heroPaused || !heroVisible); }
  if (hero) {
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; heroState(); }).observe(hero);
    if (heroBtn) heroBtn.addEventListener('click', function () {
      heroPaused = !heroPaused; setToggle(heroBtn, heroPaused, 'background animation'); heroState();
    });
  }

  // Orbitown gameplay loop: fetched only when the phone scrolls into view,
  // never with reduced motion or Save-Data (the poster image stays instead).
  var video = document.querySelector('video[data-src]');
  var vidBtn = document.querySelector('.phone .toggle');
  if (!video) return;
  if (saveData) { if (vidBtn) vidBtn.hidden = true; return; }
  var vidPaused = false, vidVisible = false;
  function vidState() {
    if (vidVisible && !vidPaused) {
      if (!video.getAttribute('src')) video.src = video.getAttribute('data-src');
      var p = video.play(); if (p && p.catch) p.catch(function () {});
    } else if (video.getAttribute('src')) {
      video.pause();
    }
  }
  new IntersectionObserver(function (e) { vidVisible = e[0].isIntersecting; vidState(); }, { threshold: 0.2 }).observe(video);
  if (vidBtn) vidBtn.addEventListener('click', function () {
    vidPaused = !vidPaused; setToggle(vidBtn, vidPaused, 'gameplay video'); vidState();
  });
})();
