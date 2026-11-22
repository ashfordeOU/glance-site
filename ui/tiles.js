/* Monorail by Ashforde® · "The Island and more" tiles: each one plays what the app does (a file dropped on the shelf and
   made smaller, a share link uploading, the screen recorder counting, a screenshot being marked up, the Song finder
   listening then naming the song, the next hour's rain drawing in, a pod's permissions) when it comes into view, and
   stops when it leaves. With Reduce Motion each tile shows its finished state, still. */
(() => {
  const tiles = [...document.querySelectorAll('[data-t9]')];
  if (!tiles.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // The next hour, minute by minute: dry for 12 minutes, rain for 25 (light, a heavier middle), then dry (RainMinuteBars).
  const rain = el => {
    const box = el.querySelector('.t9-bars'); if (!box || box.childElementCount) return;
    for (let m = 0; m < 60; m++) {
      const wet = m >= 12 && m < 37, t = (m - 12 + .5) / 25, v = wet ? Math.max(.12, Math.pow(Math.sin(Math.PI * t), .6) * (.8 + .2 * Math.sin(t * 11))) : .03;
      const i = document.createElement('i'); if (wet) i.className = 'wet';
      i.dataset.h = Math.max(2, Math.round(34 * Math.min(1, Math.abs(v))));
      box.appendChild(i);
    }
  };
  tiles.filter(t => t.dataset.t9 === 'rain').forEach(rain);
  const drawRain = (el, now) => el.querySelectorAll('.t9-bars i').forEach((i, n) => {
    if (now) i.style.height = i.dataset.h + 'px'; else { i.style.height = '2px'; i.style.transitionDelay = (n * 22) + 'ms'; requestAnimationFrame(() => requestAnimationFrame(() => { i.style.height = i.dataset.h + 'px'; })); }
  });

  // Each tile's script: a list of [ms, step]; the last step's time is how long one round takes before it plays again.
  const SCRIPTS = {
    shelf: el => { const pct = el.querySelector('[data-pct]'); return [[0, () => { pct.textContent = '0'; el.classList.add('play'); }],
      ...Array.from({ length: 21 }, (_, k) => [2300 + k * 100, () => { pct.textContent = String(k * 5); }]), [9000, null]]; },
    share: el => { const f = el.querySelector('.t9-ring .f'); return [[0, () => { f.style.setProperty('--p', 0); el.classList.add('play'); }],
      ...Array.from({ length: 25 }, (_, k) => [300 + k * 90, () => f.style.setProperty('--p', k * 100 / 24)]), [2600, () => el.classList.add('b')], [8000, null]]; },
    rec: el => { const t = el.querySelector('[data-rt]'), n = el.querySelector('[data-rn]');
      return [[0, () => { t.textContent = '0:00'; n.textContent = '2'; }], [700, () => el.classList.add('p1')], [1900, () => { el.classList.remove('p1'); el.classList.add('p2'); }],
        ...Array.from({ length: 18 }, (_, k) => [2100 + k * 230, () => { t.textContent = mmss(k + 1); }]),
        [6400, () => { el.classList.remove('p2'); el.classList.add('p3'); n.textContent = '3'; }], [10500, null]]; },
    shot: el => [[0, () => el.classList.add('play')], [7500, null]],
    song: el => [[0, () => {}], [800, () => el.classList.add('p1')], [4300, () => { el.classList.remove('p1'); el.classList.add('p2'); }], [10000, null]],
    rain: el => [[0, () => drawRain(el, false)], [0, null]],
    pod: el => [[0, () => el.classList.add('play')], [0, null]],
    // Record Screen pressed: the switch turns red with the time as its caption, the Island's Recordings show Pause and
    // Stop counting, then the recording joins the list.
    grec: el => { const t = el.querySelector('[data-rt]'), cap = el.querySelector('[data-gcap]');
      return [[0, () => { t.textContent = '0:00'; cap.textContent = 'Record Screen'; }], [800, () => el.classList.add('p1')], [1100, () => { el.classList.remove('p1'); el.classList.add('p2'); }],
        ...Array.from({ length: 18 }, (_, k) => [1300 + k * 230, () => { t.textContent = cap.textContent = mmss(k + 1); }]),
        [5600, () => { el.classList.remove('p2'); el.classList.add('p3'); cap.textContent = 'Record Screen'; }], [10000, null]]; }
  };
  const CLASSES = ['play', 'done', 'b', 'p1', 'p2', 'p3'];
  const finish = el => {
    el.classList.add('done');
    const k = el.dataset.t9;
    if (k === 'rain') drawRain(el, true);
    if (k === 'share') el.querySelector('.t9-ring .f').style.setProperty('--p', 100);
    if (k === 'shelf') el.querySelector('[data-pct]').textContent = '100';
    if (k === 'rec') { el.querySelector('[data-rt]').textContent = '0:18'; el.querySelector('[data-rn]').textContent = '3'; }
  };
  if (reduce || !('IntersectionObserver' in window)) { tiles.forEach(finish); return; }

  const runs = new Map();
  const stop = el => { (runs.get(el) || []).forEach(clearTimeout); runs.delete(el); };
  const start = el => {
    stop(el);
    CLASSES.forEach(c => el.classList.remove(c)); void el.offsetWidth;
    const steps = SCRIPTS[el.dataset.t9](el), ids = [];
    steps.forEach(([ms, fn], i) => {
      const last = i === steps.length - 1;
      ids.push(setTimeout(() => { if (fn) fn(); if (last && ms) start(el); }, ms));
    });
    runs.set(el, ids);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    const el = e.target, once = el.dataset.t9 === 'rain' || el.dataset.t9 === 'pod';
    if (e.isIntersecting) { if (!(once && el.dataset.seen)) start(el); el.dataset.seen = '1'; if (once) io.unobserve(el); }
    else stop(el);
  }), { threshold: .45 });
  tiles.forEach(t => io.observe(t));
})();
