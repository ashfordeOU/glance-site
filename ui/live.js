/* Glance's own controls, drawn as the app draws them and playing what they do (styles in live.css):
   - [data-glive="awake"]   the panel's Stay Awake page (AwakeQuickControls): 1 hour is clicked, the switch comes on, the
                           Island gets its Stay Awake ring, the time counts down, Keep the display on is switched on.
   - [data-glive="evening"] the panel's Evening Mode page (EveningQuickControls): the Warmth slider is dragged, which turns
                           it on by hand; the display warms; Turn on is set to Sunset to sunrise.
   - [data-glive="clean"]   Storage's Smart clean-up card (SmartCleanupCard): Looking…, the bar draws in, the kinds
                           arrive, pointing at a colour explains it, then Review and Clean….
   - [data-glive="shelf"]   a file dragged onto the Island: the drop target (NotchLive dropTarget), the shelf
                           (IslandShelfView) and the file's menu with Transform.
   Each plays when it comes into view and stops when it leaves. With Reduce Motion each shows its finished state.
   Also: the Island's running timer counts down, and the panel's Stay Awake switch comes on when first seen. */
(() => {
  const G = window.GM; if (!G) return;
  const ic = (n, cls) => n === 'trayin' ? `<svg class="mi${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M3 14 5.4 8.5H8v1.8H6.6L5 14h4.2l1 2h3.6l1-2H19l-1.6-3.7H16V8.5h2.6L21 14v4.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 2.5v8.5M8.8 7.8 12 11l3.2-3.2"/></svg>`
    : n === 'docs' ? `<svg class="mi${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7V4h8l4 4v10h-4"/><path d="M4 8h8l4 4v8H4z"/></svg>` : G.ic(n, cls);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const PTR = '<svg class="lv-ptr" viewBox="0 0 20 26" aria-hidden="true"><path d="M2 1.5v19.2l4.9-4.6 3.3 7.4 3.1-1.4-3.2-7.2H17z" fill="#000" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  /* ---------- Fitting: each drawing is built at the app's point size and scaled to the width it has */
  const fits = [];
  const fit = f => {
    const inner = f.firstElementChild, w = f.clientWidth, nat = +f.dataset.w;
    const z = Math.min(1, w / nat);
    inner.style.transform = `scale(${z})`;
    f.style.height = Math.ceil(inner.offsetHeight * z) + 'px';
  };
  const fitAll = () => fits.forEach(fit);
  if ('ResizeObserver' in window) fits.ro = new ResizeObserver(fitAll);
  addEventListener('resize', fitAll);
  addEventListener('load', fitAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

  // Where an element sits inside a drawing, in the drawing's own points (before scaling)
  const at = (el, root, fx = .5, fy = .5) => {
    const a = el.getBoundingClientRect(), b = root.getBoundingClientRect(), z = b.width / root.offsetWidth || 1;
    return [(a.left - b.left + a.width * fx) / z, (a.top - b.top + a.height * fy) / z];
  };
  const point = (ptr, root, el, fx, fy, ms = 800) => {
    const [x, y] = at(el, root, fx, fy);
    ptr.style.transitionDuration = ms + 'ms';
    ptr.style.transform = `translate(${x}px, ${y}px)`;
    ptr.style.opacity = 1;
  };
  const press = el => { el.classList.remove('lv-press'); void el.offsetWidth; el.classList.add('lv-press'); };

  /* ---------- The drawings */
  const ring = (p, col) => `<svg class="lv-ring" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12.5" stroke="${col}" stroke-opacity=".28"/><circle class="f" cx="15" cy="15" r="12.5" stroke="${col}" pathLength="100" style="stroke-dasharray:${p} 100"/></svg>`;

  const AWAKE = () => `<div class="lv-bar"><div class="lv-isl"><i class="lv-bub" data-bub>${ring(100, '#0A84FF')}<span>${ic('cup')}</span></i><span class="lv-notch"></span></div></div>
    <div class="mkp lv-pg"><div class="mkp-ph"><span class="bk">${ic('chevl')}Glance</span><b>Stay Awake</b></div>
    <div class="mkp-pg"><div class="mkp-trow"><span><b>Stay Awake</b><small data-st>Off</small></span><span class="mk-tog lv-tog" data-main></span></div>
    <div class="mkp-cap">Keep this Mac awake</div>
    <div class="mkp-chips lv-chips"><span>15 min</span><span>30 min</span><span data-hour>1 hour</span><span>2 hours</span><span>4 hours</span><span>8 hours</span></div>
    <div class="mkp-chips2 lv-chips"><span>Until I end it</span><span>While downloading</span></div>
    <div class="mkp-hr"></div>
    <div class="mkp-line">Keep the display on <span class="mk-tog lv-tog" data-disp></span></div>
    <div class="mkp-line">Keep me Available in Teams and Slack <span class="mk-tog lv-tog"></span></div>
    <div class="mkp-hr"></div><span class="mkp-link">More Stay Awake settings…</span></div></div>${PTR}`;

  const EVENING = () => `<div class="lv-disp"><div class="lv-scr"><i class="w1"></i><i class="w2"></i><span class="lv-win"><b></b><b></b><b></b></span><span class="lv-warm" data-warm></span></div><small>Built-in display</small></div>
    <div class="mkp lv-pg"><div class="mkp-ph"><span class="bk">${ic('chevl')}Glance</span><b>Evening Mode</b></div>
    <div class="mkp-pg"><div class="mkp-trow"><span><b>Evening Mode</b><small data-st>Off</small></span><span class="mk-tog lv-tog" data-main></span></div>
    <div class="mkp-warm">Warmth <span data-pct>30%</span></div>
    <div class="mkp-wsl lv-wsl">${ic('sunline')}<span class="qtr" data-track><i></i><b data-thumb></b></span>${ic('flame')}</div>
    <div class="mkp-pop lv-popw">Turn on <span data-pop><em data-sched>By hand</em>${ic('updown')}</span>
      <ul class="lv-menu" data-menu><li class="ck" data-o="hand">By hand</li><li data-o="day">Every day 20:00–07:00</li><li data-o="sun">Sunset to sunrise</li></ul></div>
    <div class="mkp-chk"><i></i>Red light only</div>
    <div class="mkp-hr"></div><span class="mkp-link">More Evening Mode settings…</span></div></div>${PTR}`;

  // SmartCleanupCard: kinds in StorageClean.Kind order take the app's palette (purple, blue, teal, indigo, orange, pink,
  // green, yellow, brown); the sizes and counts are an example.
  const KINDS = [
    ['App caches', 214, 6.8, '#AF52DE', 'stack', 'Apps rebuild their caches when they need them. Caches of apps that are open, and macOS’s own, are left alone.'],
    ['Xcode build files', 3, 4.1, '#5856D6', 'hammer', 'Rebuilt the next time you build in Xcode. The first build after is slower.'],
    ['Old downloads', 18, 2.4, '#34C759', 'down', 'Things in Downloads you haven’t opened for a while. Installers and files you can usually download again.'],
    ['Package manager caches', 6, 1.9, '#007AFF', 'box', 'Copies of packages npm, Yarn, pnpm, pip, CocoaPods, Swift and Cargo downloaded. They’re fetched again when needed.'],
    ['Old logs', 41, 0.6, '#30B0C7', 'doc', 'Records apps wrote more than a month ago. Nothing reads them back.']
  ];
  const TOTAL = KINDS.reduce((s, k) => s + k[2], 0);
  const pc = v => Math.round(v / TOTAL * 100) + '%';
  const KI = {
    stack: '<path d="M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
    hammer: '<path d="M14 6 5 15l3 3 9-9M12.5 4.5l3-1.5 5 5-1.5 3z"/>',
    down: '<circle cx="12" cy="12" r="9"/><path d="M12 7v9M8 12.5l4 4 4-4"/>',
    box: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
    doc: '<path d="M6 3h8l4 4v14H6zM9 11h6M9 15h6"/>'
  };
  const ki = k => `<svg viewBox="0 0 24 24" class="mi">${KI[k]}</svg>`;
  const CLEAN = () => `<div class="mkp lv-sc"><div class="lv-sch"><span class="lab">SMART CLEAN-UP</span><span class="sp"></span><span class="lv-tot"><b class="fig" data-tot>${TOTAL.toFixed(1)} GB</b><small>to get back</small></span></div>
    <div class="lv-sbar" data-sbar>${KINDS.map((k, i) => `<i style="--c:${k[3]};flex:${k[2]}" data-k="${i}"></i>`).join('')}<b class="lv-edge"></b></div>
    <div class="lv-cap" data-cap></div>
    <div class="lv-rows">${KINDS.map((k, i) => `<div class="lv-row" data-k="${i}" style="--i:${i}"><i style="background:${k[3]}">${ki(k[4])}</i><b>${k[0]}</b><small>${k[1]}</small><span class="sp"></span><span class="fig">${k[2].toFixed(1)} GB</span></div>`).join('')}</div>
    <div class="lv-st" data-stat><span class="lv-spin"></span><span data-stt>Looking…</span></div>
    <div class="lv-btns"><span class="lv-btn" data-review>Review and Clean…</span><span class="lv-btn">Look Again</span><span class="sp"></span><span class="mkp-link">Options</span></div>
    <div class="lv-deep">${ic('docs')}<span>Duplicates and large files</span><span class="sp"></span><span class="mkp-link">Choose Folder…</span></div>
    <p class="lv-foot">Everything goes to the Trash first, so you can put it back. System files and anything macOS protects are never touched.</p></div>${PTR}`;

  // Shelf: IslandShelfView's header (the shelf's name with its dot, Share, AirDrop, Clear) and its row of files; the
  // drop target NotchLive shows while files are dragged over; and a file's menu (IslandShelfView.menu) with Transform
  // for a video (FileTray.offered: Trim clip, Make GIF, Smaller MP4, Fit to size…, Audio to M4A, Zip).
  const file = (k, n) => `<span class="lv-f ${k}"><i></i><small>${n}</small></span>`;
  const SHELF = () => `<div class="lv-sh-desk"><div class="lv-sh-isl" data-isl><span class="lv-sh-cam"></span>
      <div class="lv-sh-body">
        <div class="lv-drop"><span class="ic">${ic('trayin')}</span><b data-dt>Drop files to keep them on the shelf</b><small>Drag them out again to wherever they’re going.</small></div>
        <div class="lv-shelf"><p class="lv-shh"><span class="nm"><i></i>SHELF</span><span class="sp"></span>${ic('share')}<b>AirDrop</b><em>Clear</em></p>
          <div class="lv-files">${file('zip', 'Photos.zip')}${file('img', 'Logo.png')}${file('mov lv-new', 'Walkthrough.mov')}</div></div>
      </div></div>
      <ul class="lv-cm" data-cm><li>Quick Look</li><li>Open</li><li>Show in Finder</li><li class="hr"></li><li>Copy</li><li>Copy Path</li><li>Share…</li><li>AirDrop</li><li class="hr"></li><li>Pin</li><li>Rename…</li><li>New Folder with This Item</li><li class="sub" data-tf>Transform<span>›</span>
        <ul class="lv-cm lv-sub" data-sub><li>Trim clip</li><li>Make GIF</li><li>Smaller MP4</li><li data-fit>Fit to size…</li><li>Audio to M4A</li><li>Zip</li></ul></li><li class="hr"></li><li>Move Left</li><li class="dim">Move Right</li><li class="hr"></li><li>Remove from Shelf</li></ul>
      <span class="lv-drag" data-drag>${file('mov', 'Walkthrough.mov')}</span>${PTR}</div>`;

  /* ---------- Scripts: [ms, step]; the last step's time is one round */
  const SCRIPTS = {
    awake: r => {
      const st = $('[data-st]', r), main = $('[data-main]', r), disp = $('[data-disp]', r), hour = $('[data-hour]', r), bub = $('[data-bub]', r), ptr = $('.lv-ptr', r), f = $('.lv-ring .f', r);
      return [
        [0, () => { st.textContent = 'Off'; main.classList.remove('on'); disp.classList.remove('on'); bub.classList.remove('on'); f.style.strokeDasharray = '100 100'; ptr.style.transitionDuration = '0ms'; ptr.style.opacity = 0; ptr.style.transform = 'translate(330px, 330px)'; }],
        [500, () => point(ptr, r, hour, .55, .6, 900)],
        [1600, () => { press(hour); main.classList.add('on'); st.textContent = 'On for 1 h'; bub.classList.add('on'); }],
        [3600, () => { st.textContent = 'On for 59 min'; f.style.strokeDasharray = (59 / 60 * 100) + ' 100'; }],
        [4200, () => point(ptr, r, disp, .5, .55, 800)],
        [5200, () => { press(disp); disp.classList.add('on'); }],
        [7600, () => { st.textContent = 'On for 58 min'; f.style.strokeDasharray = (58 / 60 * 100) + ' 100'; ptr.style.opacity = 0; }],
        [10500, null]];
    },
    evening: r => {
      const st = $('[data-st]', r), main = $('[data-main]', r), pct = $('[data-pct]', r), track = $('[data-track]', r), thumb = $('[data-thumb]', r), warm = $('[data-warm]', r),
        pop = $('[data-pop]', r), menu = $('[data-menu]', r), sched = $('[data-sched]', r), ptr = $('.lv-ptr', r);
      const set = v => { track.style.setProperty('--v', v + '%'); pct.textContent = v + '%'; warm.style.opacity = (v / 100 * .62).toFixed(3); };
      const drag = [];
      for (let k = 0; k <= 20; k++) drag.push([1700 + k * 70, () => { const v = Math.round(30 + 30 * k / 20); set(v); if (k === 1) { main.classList.add('on'); st.textContent = 'On now, until you turn it off'; } ptr.style.transitionDuration = '70ms'; const [x, y] = at(track, r, v / 100, .5); ptr.style.transform = `translate(${x}px, ${y}px)`; }]);
      return [
        [0, () => { st.textContent = 'Off'; main.classList.remove('on'); set(30); warm.style.opacity = 0; sched.textContent = 'By hand'; menu.classList.remove('open'); $$('li', menu).forEach(l => l.classList.toggle('ck', l.dataset.o === 'hand')); $$('li', menu).forEach(l => l.classList.remove('hl')); ptr.style.transitionDuration = '0ms'; ptr.style.opacity = 0; ptr.style.transform = 'translate(330px, 360px)'; }],
        [500, () => point(ptr, r, thumb, .5, .5, 900)],
        [1500, () => thumb.classList.add('lv-held')],
        ...drag,
        [3300, () => thumb.classList.remove('lv-held')],
        [4300, () => point(ptr, r, pop, .45, .55, 700)],
        [5100, () => { press(pop); menu.classList.add('open'); }],
        [5700, () => point(ptr, r, $('[data-o="sun"]', menu), .4, .5, 500)],
        [6200, () => $('[data-o="sun"]', menu).classList.add('hl')],
        [6800, () => { menu.classList.remove('open'); sched.textContent = 'Sunset to sunrise'; $$('li', menu).forEach(l => l.classList.toggle('ck', l.dataset.o === 'sun')); }],
        [8000, () => { ptr.style.opacity = 0; }],
        [11000, null]];
    },
    clean: r => {
      const bar = $('[data-sbar]', r), cap = $('[data-cap]', r), stt = $('[data-stt]', r), stat = $('[data-stat]', r), tot = $('[data-tot]', r), ptr = $('.lv-ptr', r), rev = $('[data-review]', r);
      const card = $('.lv-sc', r), focus = i => { card.classList.toggle('focus', i != null); $$('[data-k]', r).forEach(e => e.classList.toggle('lit', +e.dataset.k === i));
        cap.innerHTML = i == null ? `Mostly ${KINDS[0][0].toLowerCase()} (${pc(KINDS[0][2])}). Point at a colour to see what it is.`
          : `<b style="color:${KINDS[i][3]}">${KINDS[i][0]} · ${KINDS[i][2].toFixed(1)} GB · ${pc(KINDS[i][2])}</b><span>${KINDS[i][5]}</span>`; };
      const rollTot = [];
      for (let k = 0; k <= 16; k++) rollTot.push([1500 + k * 70, () => { tot.textContent = (TOTAL * (1 - Math.pow(1 - k / 16, 3))).toFixed(1) + ' GB'; }]);
      return [
        [0, () => { r.classList.remove('found'); card.classList.remove('focus'); focus(null); cap.textContent = ''; stat.classList.add('busy'); stt.textContent = 'Looking…'; tot.textContent = '0.0 GB'; ptr.style.transitionDuration = '0ms'; ptr.style.opacity = 0; ptr.style.transform = 'translate(300px, 420px)'; }],
        [500, () => { stt.textContent = 'Looking in Library/Caches…'; }],
        [1100, () => { stt.textContent = 'Looking in Downloads…'; }],
        [1500, () => { r.classList.add('found'); stat.classList.remove('busy'); stt.textContent = 'Checked just now.'; }],
        ...rollTot,
        [2900, () => focus(null)],
        [4200, () => point(ptr, r, $('.lv-sbar [data-k="1"]', r), .5, .6, 900)],
        [5100, () => focus(1)],
        [7400, () => { focus(null); point(ptr, r, rev, .5, .6, 800); }],
        [8400, () => press(rev)],
        [9200, () => { ptr.style.opacity = 0; }],
        [11500, null]];
    },
    shelf: r => {
      const isl = $('[data-isl]', r), drag = $('[data-drag]', r), dt = $('[data-dt]', r), cm = $('[data-cm]', r), sub = $('[data-sub]', r), tf = $('[data-tf]', r), fitI = $('[data-fit]', r), ptr = $('.lv-ptr', r), nf = $('.lv-new', r);
      const desk = $('.lv-sh-desk', r);
      const move = (x, y, ms) => { ptr.style.transitionDuration = drag.style.transitionDuration = ms + 'ms'; ptr.style.transform = `translate(${x + 30}px, ${y + 26}px)`; drag.style.transform = `translate(${x}px, ${y}px)`; };
      return [
        [0, () => { r.className = r.className.replace(/\bs\d\b/g, '').trim(); isl.className = 'lv-sh-isl'; cm.classList.remove('open'); sub.classList.remove('open'); tf.classList.remove('hl'); fitI.classList.remove('hl'); dt.textContent = 'Drop files to keep them on the shelf'; drag.style.opacity = 1; ptr.style.opacity = 1; move(300, 250, 0); }],
        [400, () => move(200, 120, 1100)],
        [900, () => isl.classList.add('open', 'drop')],
        [1500, () => move(175, 70, 600)],
        [2000, () => { dt.textContent = 'Let go to keep it here'; isl.classList.add('over'); }],
        [2900, () => { drag.style.opacity = 0; isl.classList.remove('drop', 'over'); isl.classList.add('shelf'); }],
        [3200, () => nf.classList.add('pop')],
        [4300, () => { const [x, y] = at($('.lv-new i', r), desk); ptr.style.transitionDuration = '700ms'; ptr.style.transform = `translate(${x}px, ${y}px)`; }],
        [5200, () => { const [x, y] = at($('.lv-new i', r), desk); cm.style.left = Math.min(x, desk.offsetWidth - cm.offsetWidth - 146) + 'px'; cm.style.top = Math.min(y, desk.offsetHeight - cm.offsetHeight - 6) + 'px'; cm.classList.add('open'); }],
        [5900, () => { const [x, y] = at(tf, desk, .4, .5); ptr.style.transitionDuration = '600ms'; ptr.style.transform = `translate(${x}px, ${y}px)`; }],
        [6500, () => { tf.classList.add('hl'); sub.classList.add('open'); }],
        [7100, () => { const [x, y] = at(fitI, desk, .35, .5); ptr.style.transitionDuration = '500ms'; ptr.style.transform = `translate(${x}px, ${y}px)`; }],
        [7600, () => fitI.classList.add('hl')],
        [9300, () => { cm.classList.remove('open'); sub.classList.remove('open'); ptr.style.opacity = 0; }],
        [11500, null]];
    }
  };
  // The finished frame (Reduce Motion, or no IntersectionObserver)
  const FINAL = {
    awake: r => { $('[data-st]', r).textContent = 'On for 58 min'; $('[data-main]', r).classList.add('on'); $('[data-disp]', r).classList.add('on'); $('[data-bub]', r).classList.add('on'); $('.lv-ring .f', r).style.strokeDasharray = '96.7 100'; },
    evening: r => { $('[data-st]', r).textContent = 'On now, until you turn it off'; $('[data-main]', r).classList.add('on'); $('[data-track]', r).style.setProperty('--v', '60%'); $('[data-pct]', r).textContent = '60%'; $('[data-warm]', r).style.opacity = .37; $('[data-sched]', r).textContent = 'Sunset to sunrise'; },
    clean: r => { r.classList.add('found'); $('[data-stt]', r).textContent = 'Checked just now.'; $('[data-cap]', r).textContent = `Mostly ${KINDS[0][0].toLowerCase()} (${pc(KINDS[0][2])}). Point at a colour to see what it is.`; },
    shelf: r => { $('[data-isl]', r).classList.add('open', 'shelf'); $('[data-drag]', r).style.opacity = 0; $('.lv-new', r).classList.add('pop');
      requestAnimationFrame(() => { const desk = $('.lv-sh-desk', r), cm = $('[data-cm]', r), [x, y] = at($('.lv-new i', r), desk);
        cm.style.left = Math.min(x, desk.offsetWidth - cm.offsetWidth - 146) + 'px'; cm.style.top = Math.min(y, desk.offsetHeight - cm.offsetHeight - 6) + 'px';
        cm.classList.add('open'); $('[data-sub]', r).classList.add('open'); $('[data-tf]', r).classList.add('hl'); $('[data-fit]', r).classList.add('hl'); }); }
  };

  /* ---------- Docks (DockMoves.swift, DockAppItems.swift, DockAppPickerSheet.swift, DocksSettings.swift): an app dragged
     from one dock onto another; the app's menu with Add to Dock and Move to Dock; "Add <front app> to a Dock…" from the
     command palette, with its menu of docks at the pointer and the Island's notice; and the searchable app picker. */
  const NM = { safari: 'Safari', mail: 'Mail', notes: 'Notes', music: 'Music', calendar: 'Calendar', photos: 'Photos', messages: 'Messages' };
  const di = k => `<span class="lv-di" data-k="${k}">${G.app(k)}</span>`;
  const dockSym = '<svg class="mi" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M6.5 16.5h11"/></svg>';
  const desk = (inner, h = 300) => `<div class="lv-dk-desk" style="height:${h}px">${inner}${PTR}</div>`;
  const DKDRAG = () => desk(`<div class="lv-dock v" data-d="work">${['mail', 'calendar', 'notes'].map(di).join('')}</div>
    <div class="lv-dock h" data-d="apps">${['safari', 'messages', 'photos', 'music'].map(di).join('')}</div><span class="lv-ghost" data-ghost></span>`);
  const DKMENU = () => desk(`<div class="lv-dock v" data-d="work">${['safari', 'calendar', 'mail'].map(di).join('')}</div>
    <div class="lv-dock v r" data-d="design">${['photos', 'notes'].map(di).join('')}</div>
    <div class="lv-dock h" data-d="apps">${['safari', 'messages', 'music', 'mail'].map(di).join('')}</div>
    <ul class="lv-mn" data-mn><li>Open</li><li>Hide</li><li class="hr"></li><li>Remove from Dock</li>
      <li class="sub" data-add>Add to Dock<span>›</span><ul class="lv-mn lv-sub2" data-s1><li class="ck dim">Work</li><li>Design</li></ul></li>
      <li class="sub" data-move>Move to Dock<span>›</span><ul class="lv-mn lv-sub2" data-s2><li>Work</li><li data-to>Design</li></ul></li>
      <li>Show in Finder</li><li class="hr"></li><li>Hide Dock</li><li>Turn Off All Docks</li><li class="hr"></li><li class="sub">Position<span>›</span></li><li class="sub">Size<span>›</span></li><li class="hr"></li><li>Remove Dock…</li><li>Dock Settings…</li></ul>`, 340);
  const DKFRONT = () => desk(`<div class="lv-isl2" data-fl><span class="ic">${dockSym}</span><b data-flt>Added Notes to Work</b></div>
    <div class="lv-win2"><p><i></i><i></i><i></i><b>Notes</b></p><span></span><span></span><span style="width:55%"></span></div>
    <div class="lv-dock v" data-d="work">${['mail', 'calendar'].map(di).join('')}</div>
    <div class="lv-pal" data-pal><p class="q"><span class="cmd">⌘</span><span data-q class="ph">Type a page, a setting, a switch or a sum…</span></p>
      <div class="rows"><div class="row" data-row><span class="ic">${dockSym}</span><span><b>Add Notes to a Dock…</b><small>Choose one of your docks, or make one</small></span></div></div>
      <p class="keys"><span><kbd>↑ ↓</kbd> choose</span><span><kbd>return</kbd> run</span><span><kbd>esc</kbd> close</span></p></div>
    <ul class="lv-mn" data-mn><li class="hd">${G.app('notes')}Add Notes to</li><li data-to>Work</li><li>Design</li><li class="hr"></li><li>New Dock with Notes</li></ul>`, 320);
  const PICK = ['calendar', 'mail', 'messages', 'music', 'notes', 'photos', 'safari'];
  const DKPICK = () => `<div class="mkp lv-sheet"><b class="t">Add Apps to Work</b><p class="lv-search"><span data-q class="ph">Search apps</span></p>
    <div class="lv-list">${PICK.map(k => `<p class="lv-pr${k === 'mail' ? ' in' : ''}" data-k="${k}"><i class="cb"></i>${G.app(k)}<span>${NM[k]}</span>${k === 'mail' ? '<small>In this dock</small>' : ''}</p>`).join('')}<p class="lv-none" data-none></p></div>
    <p class="lv-sbtn"><span class="b">Other…</span><span class="sp"></span><span class="b">Cancel</span><span class="b dis" data-addb>Add</span></p></div>${PTR}`;

  const typeIn = (el, text, t0, step = 160) => [...text].map((c, i) => [t0 + i * step, () => { el.classList.remove('ph'); el.textContent = text.slice(0, i + 1); }]);
  const centre = (el, root) => at(el, root);
  const moveTo = (ptr, root, el, ms, fx = .5, fy = .5) => point(ptr, root, el, fx, fy, ms);
  // An app leaves one dock and arrives in another, the gap closing and opening as it does
  const leave = el => { el.classList.add('out'); setTimeout(() => el.remove(), 400); };
  const arrive = (dock, k, before) => { const n = document.createElement('span'); n.className = 'lv-di out'; n.dataset.k = k; n.innerHTML = G.app(k);
    dock.insertBefore(n, before || null); requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove('out'))); return n; };
  const once = new WeakMap();
  const resetHTML = (r, build) => { const d = r.querySelector('.lv-dk-desk, .lv-sheet'); if (!once.has(r)) once.set(r, r.innerHTML); else r.innerHTML = once.get(r); };

  Object.assign(SCRIPTS, {
    dkdrag: r => [
      [0, () => resetHTML(r)],
      [10, () => { const ptr = $('.lv-ptr', r); ptr.style.transitionDuration = '0ms'; ptr.style.transform = 'translate(380px, 120px)'; ptr.style.opacity = 1; }],
      [500, () => moveTo($('.lv-ptr', r), r, $('[data-d="work"] [data-k="notes"]', r), 800)],
      [1400, () => { const src = $('[data-d="work"] [data-k="notes"]', r), g = $('[data-ghost]', r), [x, y] = centre(src, r);
        g.innerHTML = G.app('notes'); g.style.transitionDuration = '0ms'; g.style.transform = `translate(${x - 22}px, ${y - 22}px)`; g.style.opacity = 1; src.classList.add('lift'); }],
      [1600, () => { const tgt = $('[data-d="apps"] [data-k="photos"]', r), [x, y] = centre(tgt, r), g = $('[data-ghost]', r), ptr = $('.lv-ptr', r);
        g.style.transitionDuration = ptr.style.transitionDuration = '1000ms'; g.style.transform = `translate(${x - 44}px, ${y - 30}px)`; ptr.style.transform = `translate(${x - 22}px, ${y - 8}px)`; }],
      [2300, () => $('[data-d="apps"] [data-k="photos"]', r).classList.add('gap')],
      [2900, () => { const g = $('[data-ghost]', r); g.style.opacity = 0; const tgt = $('[data-d="apps"] [data-k="photos"]', r); tgt.classList.remove('gap');
        leave($('[data-d="work"] [data-k="notes"]', r)); arrive($('[data-d="apps"]', r), 'notes', tgt); }],
      [3600, () => { $('.lv-ptr', r).style.opacity = 0; }],
      [7500, null]],
    dkmenu: r => [
      [0, () => resetHTML(r)],
      [10, () => { const ptr = $('.lv-ptr', r); ptr.style.transitionDuration = '0ms'; ptr.style.transform = 'translate(240px, 120px)'; ptr.style.opacity = 1; }],
      [500, () => moveTo($('.lv-ptr', r), r, $('[data-d="apps"] [data-k="safari"]', r), 800)],
      [1400, () => { const mn = $('[data-mn]', r), dk = $('.lv-dk-desk', r), [x, y] = centre($('[data-d="apps"] [data-k="safari"]', r), r);
        mn.style.left = Math.min(x, dk.offsetWidth - mn.offsetWidth - 120) + 'px'; mn.style.top = Math.max(6, y - mn.offsetHeight - 6) + 'px'; mn.classList.add('open'); }],
      [2000, () => { moveTo($('.lv-ptr', r), r, $('[data-add]', r), 500, .3); }],
      [2500, () => { $('[data-add]', r).classList.add('hl'); $('[data-s1]', r).classList.add('open'); }],
      [3500, () => { moveTo($('.lv-ptr', r), r, $('[data-move]', r), 400, .3); }],
      [3900, () => { $('[data-add]', r).classList.remove('hl'); $('[data-s1]', r).classList.remove('open'); $('[data-move]', r).classList.add('hl'); $('[data-s2]', r).classList.add('open'); }],
      [4400, () => moveTo($('.lv-ptr', r), r, $('[data-s2] [data-to]', r), 500, .4)],
      [4900, () => $('[data-s2] [data-to]', r).classList.add('hl')],
      [5400, () => { $('[data-mn]', r).classList.remove('open'); leave($('[data-d="apps"] [data-k="safari"]', r)); arrive($('[data-d="design"]', r), 'safari'); $('.lv-ptr', r).style.opacity = 0; }],
      [9000, null]],
    dkfront: r => {
      const steps = [
        [0, () => resetHTML(r)],
        [10, () => { const ptr = $('.lv-ptr', r); ptr.style.transitionDuration = '0ms'; ptr.style.transform = 'translate(250px, 170px)'; ptr.style.opacity = 0; }],
        [400, () => $('[data-pal]', r).classList.add('open')],
        [1800, () => $('[data-row]', r).classList.add('on')],
        [2800, () => { press($('[data-row]', r)); }],
        [3100, () => { $('[data-pal]', r).classList.remove('open'); const mn = $('[data-mn]', r); mn.style.left = '250px'; mn.style.top = '170px'; mn.classList.add('open'); $('.lv-ptr', r).style.opacity = 1; }],
        [3700, () => moveTo($('.lv-ptr', r), r, $('[data-mn] [data-to]', r), 500, .35)],
        [4200, () => $('[data-mn] [data-to]', r).classList.add('hl')],
        [4700, () => { $('[data-mn]', r).classList.remove('open'); $('[data-fl]', r).classList.add('on'); arrive($('[data-d="work"]', r), 'notes'); $('.lv-ptr', r).style.opacity = 0; }],
        [7000, () => $('[data-fl]', r).classList.remove('on')],
        [9500, null]];
      return steps.concat(typeIn($('[data-q]', r), 'add', 900)).sort((a, b) => a[0] - b[0]);
    },
    dkpick: r => {
      const q = () => $('[data-q]', r);
      const filter = text => { $$('.lv-pr', r).forEach(p => p.classList.toggle('gone', !NM[p.dataset.k].toLowerCase().includes(text))); };
      return [
        [0, () => resetHTML(r)],
        [10, () => { const ptr = $('.lv-ptr', r); ptr.style.transitionDuration = '0ms'; ptr.style.transform = 'translate(330px, 300px)'; ptr.style.opacity = 1; }],
        [500, () => moveTo($('.lv-ptr', r), r, $('.lv-search', r), 600, .3)],
        [1200, () => { q().classList.remove('ph'); q().textContent = 'm'; filter('m'); }],
        [1600, () => { q().textContent = 'mu'; filter('mu'); }],
        [2200, () => moveTo($('.lv-ptr', r), r, $('[data-k="music"] .cb', r), 600)],
        [2900, () => { $('[data-k="music"]', r).classList.add('on'); const b = $('[data-addb]', r); b.textContent = 'Add 1'; b.classList.remove('dis'); }],
        [3500, () => moveTo($('.lv-ptr', r), r, $('[data-addb]', r), 600)],
        [4200, () => press($('[data-addb]', r))],
        [4800, () => { $('.lv-ptr', r).style.opacity = 0; }],
        [8000, null]];
    }
  });
  Object.assign(FINAL, {
    dkdrag: r => { $('[data-d="work"] [data-k="notes"]', r).remove(); const t = $('[data-d="apps"] [data-k="photos"]', r); const n = document.createElement('span'); n.className = 'lv-di'; n.innerHTML = G.app('notes'); t.before(n); },
    dkmenu: r => { const mn = $('[data-mn]', r); mn.style.left = '150px'; mn.style.top = '6px'; mn.classList.add('open'); $('[data-move]', r).classList.add('hl'); $('[data-s2]', r).classList.add('open'); $('[data-s2] [data-to]', r).classList.add('hl'); },
    dkfront: r => { const mn = $('[data-mn]', r); mn.style.left = '250px'; mn.style.top = '150px'; mn.classList.add('open'); $('[data-mn] [data-to]', r).classList.add('hl'); },
    dkpick: r => { const q = $('[data-q]', r); q.classList.remove('ph'); q.textContent = 'mu'; $$('.lv-pr', r).forEach(p => p.classList.toggle('gone', p.dataset.k !== 'music')); $('[data-k="music"]', r).classList.add('on'); const b = $('[data-addb]', r); b.textContent = 'Add 1'; b.classList.remove('dis'); }
  });
  const BUILD = { awake: AWAKE, evening: EVENING, clean: CLEAN, shelf: SHELF, dkdrag: DKDRAG, dkmenu: DKMENU, dkfront: DKFRONT, dkpick: DKPICK };
  const WIDTH = { awake: 360, evening: 360, clean: 380, shelf: 460, dkdrag: 460, dkmenu: 460, dkfront: 460, dkpick: 400 };

  const els = $$('[data-glive]');
  // Each drawing is built as it comes near the screen; until then it keeps about its height, so nothing moves.
  const HEIGHT = { awake: 396, evening: 415, clean: 365, shelf: 400, dkdrag: 300, dkmenu: 340, dkfront: 320, dkpick: 400 };
  const built = new Set();
  const build = el => {
    if (built.has(el)) return; built.add(el);
    const k = el.dataset.glive;
    el.innerHTML = `<div class="mk lv-in lv-k-${k}" style="width:${WIDTH[k]}px">${BUILD[k]()}</div>`;
    fits.push(el); fit(el); requestAnimationFrame(() => fit(el));
    if (fits.ro) fits.ro.observe(el);
  };
  els.forEach(el => { const k = el.dataset.glive; el.dataset.w = WIDTH[k]; el.style.height = Math.round(HEIGHT[k] * Math.min(1, (el.clientWidth || WIDTH[k]) / WIDTH[k])) + 'px'; });

  const runs = new Map();
  const stop = el => { (runs.get(el) || []).forEach(clearTimeout); runs.delete(el); };
  const start = el => {
    stop(el);
    const r = el.firstElementChild, steps = SCRIPTS[el.dataset.glive](r), ids = [];
    steps.forEach(([ms, fn], i) => ids.push(setTimeout(() => { if (fn) fn(); if (i === steps.length - 1) start(el); }, ms)));
    runs.set(el, ids);
  };
  const still = el => { build(el); const r = el.firstElementChild; r.classList.add('lv-still'); FINAL[el.dataset.glive](r); };
  if (!('IntersectionObserver' in window)) els.forEach(still);
  else {
    const near = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; near.unobserve(e.target); if (reduce) still(e.target); else build(e.target); }), { rootMargin: '900px 0px' });
    els.forEach(el => near.observe(el));
    if (!reduce) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { build(e.target); if (!runs.has(e.target)) start(e.target); } else stop(e.target); }), { threshold: .35 });
      els.forEach(el => io.observe(el));
    }
  }

  /* ---------- The drawn Mac: the running Tea timer counts down, and the panel's Stay Awake switch comes on */
  if (!reduce) {
    let left = 258;
    setInterval(() => {
      if (document.hidden) return;
      left = left > 1 ? left - 1 : 258;
      $$('.mac-stage:not(.mac-rest) .gi-run > b.fig').forEach(b => { b.textContent = mmss(left); });
    }, 1000);
    const panel = $('[data-mac="panel"]');
    if (panel && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return; io.disconnect();
        const c = $('.mkp-sw > span:first-child .c', panel); if (!c) return;
        c.classList.remove('on'); setTimeout(() => { c.classList.add('on', 'lv-pop'); }, 1100);
      }), { threshold: .5 });
      io.observe(panel);
    }
  }
})();
