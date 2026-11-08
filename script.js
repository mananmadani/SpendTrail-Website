/* SpendTrail website: header, mobile menu, and the river that runs down the page. */
(function () {
  'use strict';

  /* Header shadow once scrolled */
  var header = document.getElementById('site-header');
  function onScrollHeader() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* Mobile menu */
  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('mobile-nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* The river ------------------------------------------------------------
     The logo is a river, so the page has one: a line that starts at the
     headline, crosses the page at each .bend spacer, and ends at the final
     call to action. It is drawn as you scroll. On narrow screens it shrinks to
     a thin meander along the left edge. Coins mark each section heading. */
  var page   = document.getElementById('page');
  var svg    = document.getElementById('trail-svg');
  var bed    = document.getElementById('trail-bed');
  var flow   = document.getElementById('trail-flow');
  var coinsG = document.getElementById('trail-coins');
  var grad   = document.getElementById('river-grad');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var len = 0, startY = 0, endY = 1, coins = [];

  function top(el) { return el.getBoundingClientRect().top + window.scrollY - page.getBoundingClientRect().top - window.scrollY; }

  function build() {
    var W = page.clientWidth, H = page.scrollHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', W); svg.setAttribute('height', H);
    grad.setAttribute('y2', H);

    var wide = W >= 1240;
    var gutter = (W - 1180) / 2;
    var xL = wide ? Math.max(28, gutter / 2 - 6) : 9;
    var xR = wide ? W - Math.max(28, gutter / 2 - 6) : 22;
    var side = 0; // 0 = left, 1 = right
    var heroH = document.querySelector('.hero h1');
    startY = Math.max(0, top(heroH) - 30);
    var d = 'M' + xL + ' ' + startY;
    var x = xL, y = startY;

    var bends = Array.prototype.slice.call(document.querySelectorAll('[data-bend]'));
    bends.forEach(function (b) {
      var y0 = top(b), y1 = y0 + b.offsetHeight;
      var nx = side === 0 ? xR : xL;
      var mid = (y0 + y1) / 2;
      d += ' L' + x + ' ' + y0 + ' C' + x + ' ' + mid + ' ' + nx + ' ' + mid + ' ' + nx + ' ' + y1;
      x = nx; y = y1; side = 1 - side;
    });
    var endEl = document.querySelector('[data-end]');
    endY = endEl ? top(endEl) + 24 : H - 40;
    d += ' L' + x + ' ' + endY;
    bed.setAttribute('d', d); flow.setAttribute('d', d);
    len = flow.getTotalLength();
    flow.style.strokeDasharray = len + ' ' + len;

    /* coins at each heading, on whichever side the river is on at that height */
    coinsG.innerHTML = ''; coins = [];
    Array.prototype.slice.call(document.querySelectorAll('[data-stop]')).forEach(function (el) {
      var cy = top(el) + 26;
      if (cy < startY || cy > endY) return;
      var lo = 0, hi = len;
      for (var i = 0; i < 24; i++) { var m = (lo + hi) / 2; if (flow.getPointAtLength(m).y < cy) lo = m; else hi = m; }
      var p = flow.getPointAtLength(lo);
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', wide ? 7 : 5);
      c.setAttribute('class', 'coin');
      coinsG.appendChild(c);
      coins.push({ el: c, at: lo });
    });
    draw();
  }

  function draw() {
    if (!len) return;
    var viewY = window.scrollY + window.innerHeight * 0.62;
    var p = reduce ? 1 : Math.min(1, Math.max(0, (viewY - startY) / Math.max(1, endY - startY)));
    var drawn = len * p;
    flow.style.strokeDashoffset = len - drawn;
    coins.forEach(function (c) { c.el.classList.toggle('on', c.at <= drawn); });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { draw(); ticking = false; }); }
  }, { passive: true });

  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 120); });
  window.addEventListener('load', build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  document.querySelectorAll('.faq details').forEach(function (d) { d.addEventListener('toggle', function () { setTimeout(build, 30); }); });
  build();
})();
