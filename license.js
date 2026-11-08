(function () {
  var h = document.getElementById('site-header');
  function f() { h.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', f, { passive: true }); f();
})();
