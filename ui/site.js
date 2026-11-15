/* Glance by Ashforde · the site's shared behaviour: appearance, the phone menu, the Mac App Store link, reveals and the footer. */

/* TODO: replace id0000000000 with Glance's real App Store ID once the listing is live.
   While it still ends in id0000000000, every [data-appstore] button reads "Coming soon to the Mac App Store" and links nowhere. */
const GLANCE_APP_STORE_URL = 'https://apps.apple.com/app/glance-by-ashforde/id0000000000';

(() => {
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  };
  const dark = matchMedia('(prefers-color-scheme: dark)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Appearance: automatic, light or dark, kept on this browser only */
  let mode = store.get('glance-mode') || 'auto';
  const apply = () => {
    const scheme = mode === 'auto' ? (dark.matches ? 'dark' : 'light') : mode;
    root.dataset.scheme = scheme;
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', scheme === 'dark' ? '#05081A' : '#FAFBFD'));
    document.querySelectorAll('[data-mode-pick] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  };
  dark.addEventListener('change', () => { if (mode === 'auto') apply(); });
  document.querySelectorAll('[data-mode-pick] button').forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode; store.set('glance-mode', mode === 'auto' ? null : mode); apply();
  }));
  apply();

  const pop = document.getElementById('theme-pop'), popBtn = document.getElementById('theme-btn');
  if (pop && popBtn) {
    const close = () => { pop.hidden = true; popBtn.setAttribute('aria-expanded', 'false'); };
    popBtn.addEventListener('click', e => { e.stopPropagation(); pop.hidden = !pop.hidden; popBtn.setAttribute('aria-expanded', String(!pop.hidden)); });
    document.addEventListener('click', e => { if (!pop.hidden && !pop.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) { close(); popBtn.focus(); } });
  }

  /* ---------- Phone menu */
  const top = document.querySelector('.top'), menuBtn = document.getElementById('menu-btn');
  if (top && menuBtn) {
    menuBtn.addEventListener('click', () => { const open = top.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); });
    top.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => { top.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }));
  }

  /* ---------- The Mac App Store buttons */
  const live = !/id0{10}$/.test(GLANCE_APP_STORE_URL);
  document.querySelectorAll('[data-appstore]').forEach(a => {
    const small = a.querySelector('small'), big = a.querySelector('b');
    if (live) {
      a.href = GLANCE_APP_STORE_URL; a.removeAttribute('aria-disabled'); a.removeAttribute('role');
      if (small) small.textContent = 'Download on the';
      if (big) big.textContent = a.classList.contains('small') ? 'Get Glance' : 'Mac App Store';
      a.setAttribute('aria-label', 'Download Glance on the Mac App Store');
    } else {
      a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.setAttribute('role', 'link');
      if (small) small.textContent = 'Coming soon to the';
      if (big) big.textContent = a.classList.contains('small') ? 'Coming soon' : 'Mac App Store';
      a.setAttribute('aria-label', 'Coming soon to the Mac App Store');
    }
  });

  /* ---------- Reveals: single pieces rise in; groups (.sg) rise child by child */
  document.querySelectorAll('.sg').forEach(g => {
    [...g.children].forEach((c, i) => c.style.setProperty('--i', Math.min(i, 12)));
    if (reduce || !('IntersectionObserver' in window)) { g.classList.add('in'); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { g.classList.add('in'); io.disconnect(); } }), { rootMargin: '0px 0px -10% 0px' });
    io.observe(g);
  });
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(el => io.observe(el));
  } else document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));

  /* ---------- The footer wordmark drifts gently as it scrolls into view */
  const giant = document.querySelector('.foot .giant');
  if (giant && !reduce) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = giant.getBoundingClientRect(), vh = window.innerHeight;
      if (r.top > vh || r.bottom < 0) return;
      const progress = 1 - Math.max(0, Math.min(1, r.top / vh));
      giant.style.setProperty('--foot-drift', ((1 - progress) * 44).toFixed(1) + 'px');
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();
  }

  /* ---------- The year in the footer */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
})();
