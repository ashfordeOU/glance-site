/* Glance on a drawn Mac (styles in mac.css). Each [data-mac] stage gets a MacBook with a notch, a wallpaper, the menu
   bar and the Dock, built at the Mac's own point size (a 1512 × 982 screen) and scaled to fit; on narrow screens the
   stage shows the part that matters, larger. On it: the Island hanging from the notch (closed with its split bubbles,
   or open with its tab bar floating below), the panel dropping from Glance's menu bar icon, the Dashboard as a window,
   a full-width app dock, and the welcome tour. The screens themselves come from mocks.js and screens.js.
   Motion follows the app: the Island opens on a spring, numbers roll, charts and rings draw in. With Reduce Motion
   every scene shows its finished frame. Buttons outside each figure change what it shows. */
(() => {
  const G = window.GM, S = window.GS;
  const stages = [...document.querySelectorAll('[data-mac]')];
  if (!G || !S || !stages.length) return;
  const { ic, app } = G;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r) => r.querySelector(s), $$ = (s, r) => [...r.querySelectorAll(s)];

  /* ---------- The Mac: sizes in points */
  const SW = 1512, SH = 982, BZ = 20, BB = 26, LW = SW + BZ * 2, LH = SH + BZ + BB, W = 1690, BH = 30, H = LH + BH, SX = (W - LW) / 2 + BZ, SY = BZ;
  const NOTCH = 190, MB = 34;

  // An original wallpaper: soft dunes under a warm sky (the colours follow the page's light or dark look, in mac.css)
  const wall = `<svg class="gm-wall" viewBox="0 0 1512 982" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
      <linearGradient id="gmsky" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" style="stop-color:var(--w-s1)"/><stop offset=".55" style="stop-color:var(--w-s2)"/><stop offset="1" style="stop-color:var(--w-s3)"/></linearGradient>
      <linearGradient id="gmd1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--w-a1)"/><stop offset="1" style="stop-color:var(--w-a2)"/></linearGradient>
      <linearGradient id="gmd2" x1="0" y1="0" x2="1" y2=".6"><stop offset="0" style="stop-color:var(--w-b1)"/><stop offset="1" style="stop-color:var(--w-b2)"/></linearGradient>
      <linearGradient id="gmd3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--w-c1)"/><stop offset="1" style="stop-color:var(--w-c2)"/></linearGradient>
      <radialGradient id="gmsun" cx=".78" cy=".2" r=".5"><stop offset="0" style="stop-color:var(--w-sun)" stop-opacity=".75"/><stop offset="1" style="stop-color:var(--w-sun)" stop-opacity="0"/></radialGradient></defs>
    <rect width="1512" height="982" fill="url(#gmsky)"/><rect width="1512" height="982" fill="url(#gmsun)"/>
    <path d="M0 420C220 330 420 300 640 360s420 150 620 90 252-150 252-150V982H0z" fill="url(#gmd1)" opacity=".92"/>
    <path d="M0 600c190-90 380-120 600-70s400 130 620 80 292-90 292-90V982H0z" fill="url(#gmd2)"/>
    <path d="M0 790c240-70 470-60 700-20s440 60 640 10l172-40V982H0z" fill="url(#gmd3)"/>
    <path d="M0 600c190-90 380-120 600-70s400 130 620 80 292-90 292-90" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"/></svg>`;

  const glanceIcon = '<svg class="gm-gl" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 8.6A9 9 0 1 1 15.4 3.6" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/><path d="M6 12.6h2.6l1.6-3.8 2.2 6.6 2-5.2 1.3 2.4H18.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const menuBar = () => `<div class="gm-mb"><span class="gm-ml"><b>Finder</b><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Window</span><span>Help</span></span>
    <span class="gm-mr"><span class="gm-gi">${glanceIcon}</span>${ic('wifi')}${ic('bat', 'gm-bat')}${ic('search')}${ic('cc')}<span>Fri 20 Nov&nbsp; 17:13</span></span></div>`;
  const dock = () => `<div class="gm-dock">${['files', 'safari', 'messages', 'mail', 'photos', 'music', 'calendar', 'notes', 'settings'].map((k, i) => app(k, [0, 1, 4, 5].includes(i) ? 'run' : '')).join('')}<b></b>${['code', 'terminal'].map(k => app(k, 'run')).join('')}</div>`;

  /* ---------- The Island: a black shape that grows from the notch, bubbles either side, the tab bar below */
  // What the closed Island shows (Settings ▸ Island ▸ Island style). bubbles, the style for new installs since 2.0.1:
  // the pill hides behind the camera and each live thing floats in its own round bubble, the most important nearest
  // the camera. split: what's playing in the pill, Stay Awake and a timer as rings on the left, charging on the right.
  // pill: everything in one pill, the top item's glyph and its value. Since 2.0.1 the closed Island adds no camera or
  // microphone "in use" dot (IslandSensors.closedList), so none is drawn here.
  const CLOSED = {
    bubbles: { w: NOTCH, l: '', r: '',
      bl: [{ art: true, label: 'Northern Lights, playing' }, { icon: 'cup', tint: 'blue', ring: .75, label: 'Stay Awake, 1:30 left' }],
      br: [{ icon: 'timer', tint: 'orange', ring: .6, label: 'Tea, 4:18 left' }, { icon: 'bolt', tint: 'green', ring: .86, label: 'Charging, 86%' }] },
    split: { w: NOTCH + 88, l: '<i class="gi-art"></i>', r: '<span class="gi-eq"><i></i><i></i><i></i><i></i></span>',
      bl: [{ icon: 'cup', tint: 'blue', ring: .75, label: 'Stay Awake, 1:30 left' }, { icon: 'timer', tint: 'orange', ring: .6, label: 'Tea, 4:18 left' }],
      br: [{ icon: 'bolt', tint: 'green', ring: .86, label: 'Charging, 86%' }] },
    pill: { w: NOTCH + 110, l: `<span class="gi-lead">${S.ringSvg(22, 2, .75, S.TINT.blue)}<span style="color:${S.TINT.blue}">${ic('cup')}</span></span>`, r: '<span class="gi-val"><b class="fig">1:30</b><small>+3</small></span>', bl: [], br: [] },
    // glances: nothing going on, so small glances rest either side of the camera (the time, the battery)
    glances: { w: NOTCH + 120, l: '<span class="gi-gl fig">17:13</span>', r: `<span class="gi-gl">${ic('bat')}<b class="fig">86%</b></span>`, bl: [], br: [] },
    calm: { w: NOTCH, l: '', r: '', bl: [], br: [] }
  };
  const islandHTML = () => `<div class="gi" data-s="closed"><div class="gi-bub l"></div><div class="gi-bub r"></div>
    <div class="gi-shape"><div class="gi-wing"><span class="l"></span><span class="r"></span></div><div class="gi-in"></div></div><div class="gi-barw"></div></div>`;

  function Island(root, scene) {
    const el = $('.gi', root), shape = $('.gi-shape', el), inner = $('.gi-in', el), barw = $('.gi-barw', el);
    let page = null, closedKind = 'bubbles', timers = [];
    const later = (ms, f) => timers.push(setTimeout(f, reduce ? 0 : ms));
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const setClosed = kind => {
      closedKind = kind; const c = CLOSED[kind];
      el.style.setProperty('--cw', c.w + 'px');
      $('.gi-wing .l', el).innerHTML = c.l; $('.gi-wing .r', el).innerHTML = c.r;
      $('.gi-bub.l', el).innerHTML = c.bl.map(b => S.bubble(b)).join('');
      $('.gi-bub.r', el).innerHTML = c.br.map(b => S.bubble(b)).join('');
    };
    const fill = p => {
      inner.innerHTML = `<div class="gi-card mk-a">${S.islTop()}${S.pages[p]()}</div>`;
      barw.innerHTML = S.pageTab[p] === null ? S.shelfBar() : S.tabBar(S.pageTab[p]);
      animate(inner);
      el.style.setProperty('--oh', Math.ceil($('.gi-card', inner).offsetHeight) + 'px');
      $$('[data-gtab]', barw).forEach(t => {
        const to = { home: 'home', calendar: 'calendar', timer: 'timers', tools: 'tools' }[t.dataset.gtab];
        if (to) { t.classList.add('go'); t.addEventListener('click', () => scene.show(to)); }
      });
    };
    return {
      get page() { return page; },
      close(kind = closedKind) { clear(); page = null; setClosed(kind); el.dataset.s = 'closed'; },
      open(p) {
        clear();
        if (el.dataset.s === 'open' && page && !reduce) {
          inner.classList.add('swap'); later(170, () => { fill(p); inner.classList.remove('swap'); });
        } else fill(p);
        page = p; el.dataset.s = 'open';
      }
    };
  }

  /* ---------- Rolling numbers and drawing in, for anything put in after the first look */
  const roll = (scope) => $$('.rl', scope).forEach((el, i) => {
    const txt = el.textContent, m = txt.match(/\d+(?:\.\d+)?/); if (!m || reduce) return;
    const to = parseFloat(m[0]), dp = (m[0].split('.')[1] || '').length, t0 = performance.now() + 260 + i * 50, ms = 1200;
    const step = now => { const k = Math.min(1, Math.max(0, (now - t0) / ms)), e = 1 - Math.pow(1 - k, 4); el.textContent = txt.replace(m[0], (to * (.82 + .18 * e)).toFixed(dp)); if (k < 1) requestAnimationFrame(step); else el.textContent = txt; };
    el.textContent = txt.replace(m[0], (to * .82).toFixed(dp)); requestAnimationFrame(step);
  });
  // Each drawn area is its own `.mk-a`: taking mk-on away and giving it back replays its rings, charts and bars
  function animate(scope) {
    const els = scope.classList.contains('mk-a') ? [scope] : $$('.mk-a', scope);
    els.forEach(a => {
      if (reduce) { a.classList.add('mk-on'); return; }
      a.classList.remove('mk-on'); void a.offsetWidth;
      requestAnimationFrame(() => requestAnimationFrame(() => { a.classList.add('mk-on'); roll(a); }));
    });
  }

  /* ---------- The scenes */
  const PANEL = { home: [G.panel, 650], awake: [G.awake, 336], evening: [G.evening, 262], system: [S.system, 650] };
  const DASH = { overview: () => G.overview(1100, 700), weather: G.weather, time: G.time };
  const dockApps = ['files', 'safari', 'messages', 'mail', 'photos', 'music', 'calendar', 'notes', 'settings', 'code', 'terminal'];
  const SCENES = {
    hero: { dock: true, island: 'bubbles', crop: { m: [520, 0, 660, 600], s: [560, 0, 580, 580] } },
    panel: { dock: true, island: 'bubbles', panel: 'home', crop: { m: [700, 0, 980, 760], s: [1095, 0, 540, 740] } },
    island: { dock: true, island: 'bubbles', crop: { m: [395, 0, 900, 640], s: [575, 0, 540, 600] } },
    dash: { dock: true, island: 'calm', dash: 'overview', crop: { m: [270, 90, 1150, 780], s: [285, 105, 700, 520] } },
    docks: { dock: false, island: 'bubbles', fullDock: true, crop: { m: [89, 420, 1512, 640], s: [330, 700, 700, 370] } },
    tour: { dock: true, island: 'calm', tour: 'hello', crop: { m: [330, 80, 1030, 840], s: [510, 108, 670, 712] } }
  };

  function build(st) {
    const name = st.dataset.mac, cfg = SCENES[name]; if (!cfg) return null;
    const scr = `<div class="gm-scr">${wall}${menuBar()}
      ${cfg.dash ? `<div class="gw mk-a">${DASH[cfg.dash]()}</div>` : ''}
      ${cfg.tour ? `<div class="gtw"><div class="gtw-in"></div></div>` : ''}
      ${cfg.dock ? dock() : ''}
      ${cfg.fullDock ? fullDock() : ''}
      ${cfg.panel ? `<div class="gp" data-open="true"><div class="gp-in mk-a"></div></div>` : ''}
      ${islandHTML()}</div>`;
    st.innerHTML = `<div class="gm mk${cfg.panel ? ' has-panel' : ''}" style="width:${W}px;height:${H}px"><div class="gm-lid" style="left:${(W - LW) / 2}px;width:${LW}px;height:${LH}px">${scr}<i class="gm-cam"></i></div><div class="gm-base" style="width:${W}px;height:${BH}px;top:${LH}px"><i></i></div></div>`;
    const root = st.firstElementChild;
    const scene = { name, root, st };
    scene.island = Island(root, { show: p => scene.show(p) });
    scene.island.close(cfg.island);
    if (cfg.panel) {
      scene.panelShow = p => {
        const host = $('.gp-in', root), [fn, h] = PANEL[p];
        const swap = () => { host.innerHTML = fn(); host.style.height = h + 'px'; animate(host); };
        const gp = $('.gp', root);
        if (reduce || !scene.seen) swap(); else { gp.dataset.open = 'false'; setTimeout(() => { swap(); gp.dataset.open = 'true'; }, 220); }
      };
      scene.panelShow(cfg.panel);
    }
    if (cfg.dash) scene.dashShow = p => { const w = $('.gw', root); w.innerHTML = DASH[p](); animate(w); };
    if (cfg.tour) scene.tourShow = p => {
      const t = $('.gtw-in', root);
      t.innerHTML = p === 'hello' ? S.hello() : S.chapter();
      t.dataset.p = p; t.classList.remove('go'); void t.offsetWidth; requestAnimationFrame(() => t.classList.add('go'));
      if (p === 'chapter') animate(t);
    };
    scene.show = p => { scene.island.open(p); sync(scene, p); };
    return scene;
  }

  /* ---------- Glance's own full-width dock: apps with a dot under the open ones, a folder, and small readings */
  function fullDock() {
    const folder = c => `<i class="gd-fold" style="--c:${c}"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 9.5a2.5 2.5 0 0 1 2.5-2.5h7l2.4 2.6h11.6A2.5 2.5 0 0 1 29 12v12a2.5 2.5 0 0 1-2.5 2.5h-21A2.5 2.5 0 0 1 3 24z" fill="var(--c)"/><path d="M3 13h26v11a2.5 2.5 0 0 1-2.5 2.5h-21A2.5 2.5 0 0 1 3 24z" fill="#fff" opacity=".22"/></svg></i>`;
    return `<div class="gd mk-a"><div class="gd-row">${dockApps.map((k, i) => `<span class="gd-it${[0, 1, 4, 5, 9].includes(i) ? ' run' : ''}">${app(k)}</span>`).join('')}<b class="gd-sep"></b><span class="gd-it">${folder('#4aa3ff')}</span><span class="gd-it">${folder('#7d8cff')}</span><b class="gd-sep"></b>
      <span class="gd-w"><b class="fig">17:13</b><small>Fri 20 Nov</small></span><span class="gd-w gd-r">${S.ringSvg(34, 3.5, .86, '#30D158')}<b class="fig">86%</b></span><span class="gd-w">${G.wx('cloud', 'wxi')}<b class="fig">9°</b><small>London</small></span></div></div>`;
  }
  function sweep(scene) {
    const row = $('.gd-row', scene.root); if (!row || reduce) return;
    const its = $$('.gd-it', row); let t0 = null, raf = 0;
    const centres = () => its.map(i => i.offsetLeft + i.offsetWidth / 2);
    let cs = null;
    const frame = now => {
      if (scene.root.closest('.mac-rest')) { raf = requestAnimationFrame(frame); return; }
      if (t0 == null) t0 = now; cs = cs || centres();
      const k = ((now - t0) / 7000) % 1, span = cs[cs.length - 1] - cs[0] + 160;
      const x = k < .75 ? cs[0] - 80 + span * (k / .75) : -999;
      its.forEach((it, n) => { const d = (x - cs[n]) / 62, s = 1 + .55 * Math.exp(-d * d); it.style.setProperty('--s', s.toFixed(3)); });
      const p = $('.gd-ptr', scene.root); if (p) { p.style.left = x + 'px'; p.style.opacity = x < -500 ? 0 : 1; }
      raf = requestAnimationFrame(frame);
    };
    row.insertAdjacentHTML('beforeend', '<i class="gd-ptr" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 2.5v17l4.4-4.2 2.9 6.4 2.6-1.2-2.8-6.2H18z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></i>');
    raf = requestAnimationFrame(frame);
  }

  /* ---------- Fit: the whole Mac on wide screens; the part that matters, larger, on narrow ones */
  function fit(scene) {
    const st = scene.st, aw = st.clientWidth; if (!aw) return;
    const cfg = SCENES[scene.name];
    const [x, y, w, h] = aw < 560 ? cfg.crop.s : aw < 960 ? cfg.crop.m : [-8, -6, W + 16, H + 26];
    const z = aw / w;
    st.style.height = Math.round(h * z) + 'px';
    scene.root.style.transform = `translate(${(-x * z).toFixed(2)}px, ${(-y * z).toFixed(2)}px) scale(${z.toFixed(5)})`;
    st.classList.toggle('mac-crop', w < W);
    st.classList.toggle('mac-top', y <= 0);
  }

  /* ---------- Buttons outside the figure: [data-mac-btn="scene:what"] */
  const btns = $$('[data-mac-btn]', document);
  function sync(scene, what) {
    btns.forEach(b => { const [n, v] = b.dataset.macBtn.split(':'); if (n === scene.name) b.setAttribute('aria-pressed', String(v === what)); });
  }
  // Each Mac is built when it comes near the screen (the hero at once), so the page's first moments stay light;
  // its stage keeps its height in CSS until then (mac.css), so nothing moves.
  const scenes = {};
  const ro = 'ResizeObserver' in window ? new ResizeObserver(() => Object.values(scenes).forEach(fit)) : null;
  if (!ro) addEventListener('resize', () => Object.values(scenes).forEach(fit));
  const ready = st => {
    if (st._scene) return st._scene;
    const s = build(st); if (!s) return null;
    st._scene = s; scenes[s.name] = s; fit(s); if (ro) ro.observe(st);
    return s;
  };
  const byName = n => scenes[n] || ready(stages.find(st => st.dataset.mac === n) || document.createElement('i'));

  btns.forEach(b => b.addEventListener('click', () => {
    const [n, v] = b.dataset.macBtn.split(':'), sc = byName(n); if (!sc) return;
    stopAuto(sc);
    if (CLOSED[v] && v !== 'calm') { sc.island.close(v); sync(sc, v); return; }
    if (sc.panelShow && PANEL[v]) { sc.panelShow(v); sync(sc, v); return; }
    if (sc.dashShow && DASH[v]) { sc.dashShow(v); sync(sc, v); return; }
    if (sc.tourShow && (v === 'hello' || v === 'chapter')) { sc.tourShow(v); sync(sc, v); return; }
    sc.show(v);
  }));

  /* ---------- What each scene does when it comes into view */
  const auto = {};
  const stopAuto = sc => { (auto[sc.name] || []).forEach(clearTimeout); auto[sc.name] = []; };
  const after = (sc, ms, f) => (auto[sc.name] = auto[sc.name] || []).push(setTimeout(f, ms));
  const START = {
    // The hero: the Island closed with its bubbles, then it opens on Home, then on Tools, and closes again
    hero: sc => {
      if (reduce) { sc.island.open('home'); return; }
      const loop = () => { after(sc, 1800, () => sc.island.open('home')); after(sc, 6200, () => sc.island.open('tools')); after(sc, 10400, () => { sc.island.close('bubbles'); loop(); }); };
      loop();
    },
    panel: sc => { sync(sc, 'home'); },
    // The Island: it peeks on Home a moment after it's seen; hover to peek, the buttons choose
    island: sc => {
      sync(sc, 'bubbles');
      if (reduce) return;
      after(sc, 1600, () => sc.show('home'));
      const el = $('.gi-shape', sc.root);
      el.addEventListener('mouseenter', () => { if (!sc.island.page) { stopAuto(sc); sc.show('home'); } });
    },
    dash: sc => sync(sc, 'overview'),
    docks: sc => sweep(sc),
    tour: sc => {
      sc.tourShow('hello'); sync(sc, 'hello');
      if (!reduce) after(sc, 5200, () => { sc.tourShow('chapter'); sync(sc, 'chapter'); });
    }
  };
  const seen = sc => { if (sc.seen) return; sc.seen = true; animate(sc.root); START[sc.name] && START[sc.name](sc); };
  if (!('IntersectionObserver' in window)) stages.forEach(st => { const sc = ready(st); if (sc) seen(sc); });
  else {
    const hero = stages.find(st => st.dataset.mac === 'hero'); if (hero) ready(hero);
    const near = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { near.unobserve(e.target); ready(e.target); } }), { rootMargin: '700px 0px' });
    stages.forEach(st => near.observe(st));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const sc = ready(e.target); if (sc) seen(sc); } }), { threshold: .3 });
    stages.forEach(st => io.observe(st));
    // Live drawings rest when you can't see them
    const rest = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('mac-rest', !e.isIntersecting)), { threshold: 0 });
    stages.forEach(st => rest.observe(st));
  }
})();
