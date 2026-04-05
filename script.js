/* SpendTrail Website — script.js (v2) */

// ── Scroll reveal ──────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Header scroll effect ───────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger ───────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);
});

document.querySelectorAll('.m-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});

// ── Smooth anchor scroll ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    const headerH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--header-h')) || 64;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Screenshot swipe dots (mobile) ────────────
(function () {
  const cluster = document.getElementById('ss-cluster');
  const dotWrapper = document.getElementById('ss-dots');
  if (!cluster || !dotWrapper) return;

  const phones = cluster.querySelectorAll('.phone-mockup');
  const dots   = dotWrapper.querySelectorAll('span');

  // Only wire up when the cluster is scroll-snapping (mobile breakpoint)
  function isMobileScroll() {
    return window.innerWidth < 640;
  }

  function updateDots() {
    if (!isMobileScroll() || phones.length === 0) return;

    const clusterLeft = cluster.getBoundingClientRect().left;
    const clusterCenter = clusterLeft + cluster.offsetWidth / 2;

    let closestIdx = 0;
    let closestDist = Infinity;
    phones.forEach((phone, i) => {
      const rect = phone.getBoundingClientRect();
      const phoneCenter = rect.left + rect.width / 2;
      const dist = Math.abs(phoneCenter - clusterCenter);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    });

    dots.forEach((d, i) => d.classList.toggle('active', i === closestIdx));
  }

  cluster.addEventListener('scroll', updateDots, { passive: true });
  window.addEventListener('resize', updateDots, { passive: true });
  updateDots();
})();
