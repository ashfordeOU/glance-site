/* Glance by Ashforde · the homepage's working copies: rings, the hero's Island, the menu bar panel, the Island,
   the Dashboard, Stay Awake, Evening Mode and Storage. Calm, decelerating motion; numbers roll; a hot leading
   edge cools as each ring lands. Under Reduce Motion every piece is drawn on its finished frame. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const easeOut = t => 1 - Math.pow(1 - t, 4);
  const tween = (ms, fn, done, delay = 0) => {
    let t0 = null, raf = 0, stopped = false;
    const step = now => { if (stopped) return; if (t0 == null) t0 = now + delay; const k = Math.max(0, Math.min(1, (now - t0) / ms)); fn(easeOut(k), k); if (k < 1) raf = requestAnimationFrame(step); else if (done) done(); };
    raf = requestAnimationFrame(step);
    return () => { stopped = true; cancelAnimationFrame(raf); };
  };
  const whenSeen = (el, fn, threshold = 0.35) => {
    if (!el) return;
    if (!('IntersectionObserver' in window)) return fn();
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { threshold });
    io.observe(el);
  };
  // Rolls the number inside `el` (keeping any prefix or suffix) from `from` to its own value.
  const roll = (el, from, ms = 1400, delay = 0) => {
    const txt = el.textContent, m = txt.match(/-?\d+(?:\.\d+)?/); if (!m || reduce) return;
    const to = parseFloat(m[0]), dp = (m[0].split('.')[1] || '').length, pre = txt.slice(0, m.index), post = txt.slice(m.index + m[0].length);
    const put = v => { el.textContent = pre + v.toFixed(dp) + post; };
    put(from);
    tween(ms, e => put(from + (to - from) * e), () => { el.textContent = txt; }, delay);
  };

  /* ---------- Rings: <div class="gr" data-v="86" data-text="86%" data-label="Battery" data-c="#30d158" data-w="9"> */
  function buildRing(el) {
    if (el._ring) return el._ring;
    const w = parseFloat(el.dataset.w || '9'), r = 50 - w / 2 - 1.5, C = 2 * Math.PI * r;
    if (el.dataset.c) el.style.setProperty('--c', el.dataset.c);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('aria-hidden', 'true');
    const mk = (cls, extra) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('class', cls); c.setAttribute('cx', 50); c.setAttribute('cy', 50); Object.entries(extra).forEach(([k, v]) => c.setAttribute(k, v)); svg.appendChild(c); return c; };
    mk('tr', { r, 'stroke-width': w });
    const fg = mk('fg', { r, 'stroke-width': w, 'stroke-dasharray': C.toFixed(2), 'stroke-dashoffset': C.toFixed(2) });
    const hd = mk('hd', { r: (w * 0.5).toFixed(2), cx: 50 + r, cy: 50 });
    el.prepend(svg);
    if (!$('.t', el)) {
      const t = document.createElement('div'); t.className = 't';
      t.innerHTML = '<b></b>' + (el.dataset.label ? '<small></small>' : '');
      $('b', t).textContent = el.dataset.text || (el.dataset.v + '%');
      if (el.dataset.label) $('small', t).textContent = el.dataset.label;
      el.appendChild(t);
    }
    const ring = {
      v: 0,
      set(frac) {
        frac = Math.max(0, Math.min(1, frac)); this.v = frac;
        fg.setAttribute('stroke-dashoffset', (C * (1 - frac)).toFixed(2));
        const a = frac * Math.PI * 2; hd.setAttribute('cx', (50 + r * Math.cos(a)).toFixed(2)); hd.setAttribute('cy', (50 + r * Math.sin(a)).toFixed(2));
      },
      // Draws to `to` (0 to 1) with a hot head that cools as it lands; `label` updates the centre text as it rolls.
      to(to, { ms = 1600, delay = 0, text } = {}) {
        if (this.stop) this.stop();
        const from = this.v, b = $('.t b', el);
        if (text != null && b) b.textContent = text;
        if (reduce) { this.set(to); return; }
        if (b) roll(b, 0, ms, delay);
        el.classList.add('hot');
        this.stop = tween(ms, e => this.set(from + (to - from) * e), () => { el.classList.remove('hot'); }, delay);
      }
    };
    el._ring = ring;
    return ring;
  }
  const target = el => parseFloat(el.dataset.v || '0') / 100;
  // Rings already on the page draw in when they come into view, a little after one another within a group.
  function initRings(scope, { now = false } = {}) {
    $$('.gr', scope).forEach((el, i) => {
      const ring = buildRing(el);
      if (reduce) { ring.set(target(el)); return; }
      const go = () => ring.to(target(el), { delay: 120 + (parseInt(el.dataset.d || i, 10) % 6) * 140 });
      now ? go() : whenSeen(el, go, 0.4);
    });
  }
  initRings(document);

  /* ---------- Hero facts: the numbers roll up */
  const facts = $('.facts');
  if (facts && !reduce) whenSeen(facts, () => $$('b', facts).forEach((b, i) => { if (/\d/.test(b.textContent)) roll(b, 0, 1500, 200 + i * 90); }), 0.5);

  /* ---------- Small glyphs */
  const G = {
    awake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M7 3v2M10 3v2M13 3v2"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
    timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4"/></svg>',
    island: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="3"/><rect x="8" y="4" width="8" height="3.5" rx="1.75" fill="currentColor"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h10l4 4v14H5z"/><path d="M9 11h6M9 15h6"/></svg>',
    conv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
    emoji: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/></svg>',
    clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h4"/></svg>',
    prompt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M7 9h10M7 12h6M9 21h6"/></svg>',
    ask: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4.5 4.5L19 7"/></svg>',
    wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/></svg>'
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ringHTML = (v, text, { c = '', w = 9, label = '' } = {}) => `<div class="gr" data-v="${v}" data-text="${esc(text)}"${c ? ` data-c="${c}"` : ''} data-w="${w}"${label ? ` data-label="${esc(label)}"` : ''}></div>`;

  /* ---------- The hero's Island: what's happening now, one thing after another */
  const live = $('[data-live]');
  if (live) {
    const L = $('.l', live), R = $('.r', live);
    const states = [
      { l: `<span style="color:#ff9f0a">${G.awake}</span>Stay Awake`, r: '52 min', wide: true },
      { l: `<span style="color:#30d158">${G.bolt}</span>Charging`, r: '<i class="mini" style="--v:86;--c:#30d158"></i>86%', wide: true },
      { l: `<span style="color:#5c8fff">${G.cal}</span>Design review`, r: 'in 4 min', wide: true },
      { l: `<span style="color:#ff8a5b">${G.timer}</span>Focus`, r: '24:12', wide: true },
      { l: '', r: '', wide: false }
    ];
    let k = 0;
    const show = s => { L.innerHTML = s.l; R.innerHTML = s.r; live.classList.toggle('wide', s.wide); };
    show(states[0]);
    if (!reduce) setInterval(() => {
      if (document.hidden) return;
      k = (k + 1) % states.length; live.classList.add('swap');
      setTimeout(() => { show(states[k]); live.classList.remove('swap'); }, 380);
    }, 3200);
  }

  /* ---------- The menu bar panel */
  const panel = $('[data-panel]');
  const warmth = $('#warmth');
  if (panel) {
    $$('.sw1', panel).forEach(b => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on));
      if (b.dataset.sw === 'evening' && warmth) warmth.style.opacity = on ? '.16' : '0';
      if (b.dataset.sw === 'awake') { const t = $('[data-awake-time]'); if (t) t.textContent = on ? '52 min' : 'Off'; }
    }));
    const acc = $('.gx-acc', panel);
    if (acc && !reduce) { $$('i', acc).forEach(i => i.style.setProperty('--k', '0')); whenSeen(acc, () => $$('i', acc).forEach((i, n) => setTimeout(() => i.style.setProperty('--k', '1'), 200 + n * 140))); }
    const smart = $('.gx-smart', panel);
    if (smart) { if (reduce) smart.classList.add('on'); else whenSeen(panel, () => setTimeout(() => smart.classList.add('on'), 2200), 0.5); }
  }

  /* ---------- The Island: hover to peek, click to open, a tab for each part */
  const isl = $('[data-isl]');
  if (isl) {
    const wingL = $('.wing .l', isl), wingR = $('.wing .r', isl), body = $('.body', isl);
    const TABS = ['Home', 'Calendar', 'Timer', 'Tasks', 'Insights', 'Tools'];
    const tabs = on => `<div class="tabs">${TABS.map(t => `<span class="${t === on ? 'on' : ''}">${t}</span>`).join('')}</div>`;
    let cleanup = [];
    const later = (ms, fn) => { const id = setTimeout(fn, ms); cleanup.push(() => clearTimeout(id)); };
    const VIEWS = {
      home: { h: 410, html: () => tabs('Home') + `<div class="ib">
        <div class="two stack"><div class="tile"><h6>Switches</h6><div class="sws"><span><i class="on">${G.awake}</i>Awake</span><span><i>${G.moon}</i>Evening</span><span><i>${G.eye}</i>Breaks</span><span><i>${G.island}</i>Island</span></div></div>
        <div class="tile"><h6>Battery <span>3 h 40 m</span></h6><div style="display:grid;grid-template-columns:58px minmax(0,1fr);gap:12px;align-items:center">${ringHTML(86, '86%', { c: '#30d158', w: 11 })}<div style="font-size:12px;color:rgba(255,255,255,.65);line-height:1.5">Next: <b style="color:#fff">Design review</b><br>in 4 min</div></div></div></div>
        <div class="three clocks"><div class="tile clk"><span>London</span><b data-tz="Europe/London">--:--</b><span>Today</span></div><div class="tile clk"><span>New York</span><b data-tz="America/New_York">--:--</b><span>−5 h</span></div><div class="tile clk"><span>Tokyo</span><b data-tz="Asia/Tokyo">--:--</b><span>+9 h</span></div></div>
        <div class="tile"><h6>Weather · Tallinn <span>Partly cloudy</span></h6><div class="hrs"><span>Now<i class="cl"></i><b>4°</b></span><span>13:00<i></i><b>6°</b></span><span>14:00<i></i><b>7°</b></span><span>15:00<i class="cl"></i><b>6°</b></span><span>16:00<i class="cl"></i><b>4°</b></span></div></div>
      </div>`, after: () => tickClocks(body) },
      calendar: { h: 360, html: () => tabs('Calendar') + `<div class="ib">
        <div class="qa">${G.plus}<span data-type></span><i class="caret"></i></div>
        <div class="tile"><h6>Today <span>Sat 14 Nov</span></h6>
          <div class="row" style="--c:#5c8fff"><i></i><span>Design review</span><em>10:00</em></div>
          <div class="row" style="--c:#30d158"><i></i><span>Run with Ana</span><em>12:30</em></div>
          <div class="row added" style="--c:#ff8a5b" data-added><i></i><span>Lunch with Sam</span><em>Fri 13:00</em></div>
        </div></div>`, after: () => {
          const t = $('[data-type]', body), added = $('[data-added]', body), text = 'Lunch with Sam on Friday at 1pm';
          if (reduce) { t.textContent = text; added.classList.add('on'); return; }
          let i = 0; const typeOn = () => { t.textContent = text.slice(0, ++i); if (i < text.length) later(55, typeOn); else later(500, () => added.classList.add('on')); };
          later(700, typeOn);
        } },
      timer: { h: 330, html: () => tabs('Timer') + `<div class="ib"><div class="tile"><div class="timer">${ringHTML(62, '15:30', { c: '#ff8a5b', w: 8, label: 'Focus' })}
        <div><div style="font:600 17px var(--display);letter-spacing:-.02em">Focus session</div><div style="font-size:12.5px;color:rgba(255,255,255,.6);margin:4px 0 12px">25 minutes, then a 5-minute break</div>
        <div class="pills"><span class="on">Focus</span><span>Countdown</span><span>Stopwatch</span></div></div></div></div></div>`,
        after: () => {
          const el = $('.gr', body), ring = buildRing(el), b = $('.t b', el);
          if (reduce) { ring.set(.62); return; }
          ring.to(.62, { ms: 1500, text: '15:30' });
          let s = 930;
          const tick = () => { s--; b.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; ring.set(s / 1500); later(1000, tick); };
          later(1700, tick);
        } },
      tasks: { h: 370, html: () => tabs('Tasks') + `<div class="ib"><div class="two stack">
        <div class="tile"><h6>Reminders <span>3 left</span></h6><div class="task done"><i>${G.check}</i><span>Book the dentist</span></div><div class="task"><i></i><span>Send the slides</span></div><div class="task"><i></i><span>Pay the electricity bill</span></div><div class="task"><i></i><span>Pick up the parcel</span></div></div>
        <div class="tile"><h6>This week</h6><div class="week">${[['M', 40], ['T', 72], ['W', 55], ['T', 88], ['F', 64], ['S', 22], ['S', 12]].map(([d, h], i) => `<span><i style="--h:${h}%;transform-origin:bottom;animation:gxgrow .9s var(--calm) both;animation-delay:${i * 70}ms"></i>${d}</span>`).join('')}</div></div>
      </div></div>`, after: () => {
          $$('.task', body).forEach(t => t.addEventListener('click', () => { t.classList.toggle('done'); $('i', t).innerHTML = t.classList.contains('done') ? G.check : ''; }));
          $$('.task', body).forEach(t => { t.style.cursor = 'pointer'; });
        } },
      insights: { h: 330, html: () => tabs('Insights') + `<div class="ib"><div class="tile"><h6>Yesterday</h6><div class="ins"><span><b data-r>6.4 h</b><small>at your Mac</small></span><span><b data-r>3</b><small>focus sessions</small></span><span><b data-r>5</b><small>breaks taken</small></span></div></div>
        <div class="tile"><h6>This week <span>busiest Thursday</span></h6><div class="week" style="height:56px">${[['M', 52], ['T', 66], ['W', 48], ['T', 90], ['F', 70], ['S', 18], ['S', 10]].map(([d, h], i) => `<span><i style="--h:${h}%;transform-origin:bottom;animation:gxgrow .9s var(--calm) both;animation-delay:${i * 70}ms"></i>${d}</span>`).join('')}</div></div></div>`,
        after: () => $$('[data-r]', body).forEach((b, i) => roll(b, 0, 1300, 250 + i * 120)) },
      tools: { h: 350, html: () => tabs('Tools') + `<div class="ib"><div class="tools"><span>${G.note}Notes</span><span>${G.conv}Converter</span><span>${G.emoji}Emoji</span><span>${G.clip}Clipboard</span><span>${G.prompt}Teleprompter</span><span>${G.ask}Ask AI</span></div>
        <div class="tile"><div class="conv"><span><small>Kilometres</small><span data-r>10</span> km</span><span style="color:var(--l1)">${G.conv.replace('<svg', '<svg width="18" height="18"')}</span><span style="text-align:right"><small>Miles</small><span data-r>6.21</span> mi</span></div></div></div>`,
        after: () => $$('[data-r]', body).forEach((b, i) => roll(b, 0, 1200, 200 + i * 100)) }
    };
    const WINGS = {
      awake: { l: `<span style="color:#ff9f0a">${G.awake}</span>Stay Awake`, r: '52 min' },
      charging: { l: `<span style="color:#30d158">${G.bolt}</span>Charging`, r: '<span style="font-variant-numeric:tabular-nums">86%</span>' },
      meeting: { l: `<span style="color:#5c8fff">${G.cal}</span>Design review`, r: 'in 4 min' }
    };
    function tickClocks(scope) {
      const els = $$('[data-tz]', scope); if (!els.length) return;
      const put = () => els.forEach(el => { try { el.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.tz }).format(new Date()); } catch (e) { el.textContent = '--:--'; } });
      put(); const id = setInterval(put, 15000); cleanup.push(() => clearInterval(id));
    }
    // The open Island is exactly as tall as what it shows
    const fit = () => { const inner = $('.inner', body); if (inner) isl.style.setProperty('--h', Math.ceil(inner.offsetHeight + 34) + 'px'); };
    addEventListener('resize', () => { if (isl.dataset.shape === 'card') fit(); }, { passive: true });
    const buttons = $$('[data-isl-btn]');
    let current = null;
    function show(name) {
      if (name === current) return; current = name;
      cleanup.forEach(f => f()); cleanup = [];
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.islBtn === name)));
      if (VIEWS[name]) {
        const v = VIEWS[name];
        const open = () => {
          body.innerHTML = '<div class="inner">' + v.html() + '</div>'; fit(); isl.dataset.shape = 'card';
          initRings(body, { now: true }); if (v.after) v.after();
        };
        if (isl.dataset.shape === 'card' && !reduce) { body.style.opacity = '0'; later(200, () => { body.style.opacity = ''; open(); }); } else open();
      } else {
        const w = WINGS[name]; wingL.innerHTML = w.l; wingR.innerHTML = w.r;
        if (reduce) { isl.dataset.shape = 'wings'; return; }
        isl.dataset.shape = 'pill'; later(420, () => { isl.dataset.shape = 'wings'; });
      }
    }
    buttons.forEach(b => b.addEventListener('click', () => show(b.dataset.islBtn)));
    // Rest the pointer on the Island to peek (it opens on Home), as on the Mac
    isl.addEventListener('mouseenter', () => { if (isl.dataset.shape !== 'card') show('home'); });
    whenSeen(isl, () => { if (reduce) show('home'); else { show('awake'); setTimeout(() => { if (current === 'awake') show('home'); }, 2600); } }, 0.5);
  }

  /* ---------- The Dashboard */
  const dash = $('[data-dash]');
  if (dash) {
    const main = $('[data-main]', dash);
    let timers = [];
    const spark = (pts, c, h = 44) => {
      const n = pts.length, max = 100, d = pts.map((p, i) => `${i ? 'L' : 'M'}${(i / (n - 1) * 100).toFixed(1)} ${(h - p / max * (h - 4) - 2).toFixed(1)}`).join(' ');
      return `<svg class="spark draw" viewBox="0 0 100 ${h}" preserveAspectRatio="none" style="--c:${c}" aria-hidden="true"><path class="a" d="${d} L100 ${h} L0 ${h} Z"/><path d="${d}" pathLength="1"/></svg>`;
    };
    const wave = (n, base, amp, seed) => Array.from({ length: n }, (_, i) => Math.max(4, Math.min(96, base + Math.sin(i * 0.7 + seed) * amp + Math.sin(i * 1.9 + seed * 2) * amp * 0.45)));
    const PLACES = {
      Tallinn: { tz: 'Europe/Tallinn', t: 4, sky: 'cloud', d: 'Partly cloudy · H 7° L 1°', hrs: [4, 6, 7, 6, 4, 3, 2, 2] },
      London: { tz: 'Europe/London', t: 11, sky: '', d: 'Sunny spells · H 13° L 6°', hrs: [11, 12, 13, 13, 12, 10, 9, 8] },
      Tokyo: { tz: 'Asia/Tokyo', t: 14, sky: 'moon', d: 'Clear night · H 18° L 11°', hrs: [14, 13, 13, 12, 12, 11, 11, 12] }
    };
    const hourLabels = () => { const h = new Date().getHours(); return Array.from({ length: 8 }, (_, i) => i ? String((h + i) % 24).padStart(2, '0') + ':00' : 'Now'); };
    const weather = name => {
      const p = PLACES[name], labels = hourLabels(), lo = Math.min(...p.hrs) - 2, hi = Math.max(...p.hrs) + 1;
      return `<div class="now"><span class="sun ${p.sky}"></span><span><span class="temp" data-r>${p.t}°</span></span><span><b style="font:600 18px var(--display)">${name}</b><br><small style="color:rgba(255,255,255,.6)">${p.d}</small></span></div>
        <div class="tile" style="margin-top:16px"><h6>Next hours</h6><div class="hours">${p.hrs.map((t, i) => `<span>${labels[i]}<div class="bar"><i style="--h:${Math.round((t - lo) / (hi - lo) * 100)}%;--i:${i}"></i></div><b>${t}°</b></span>`).join('')}</div></div>`;
    };
    const PAGES = {
      overview: () => `<div class="pg"><h3>Overview</h3><p class="sub">Every reading at a glance. Point at one to bring it forward.</p>
        <div class="tiles t4 lg">
          <div class="tile"><h6>CPU <span>8 cores</span></h6>${ringHTML(18, '18%', { c: '#ff8a5b' })}${spark(wave(24, 22, 12, 1), '#ff8a5b')}</div>
          <div class="tile"><h6>Memory <span>16 GB</span></h6>${ringHTML(61, '61%', { c: '#e8437a' })}${spark(wave(24, 58, 5, 2), '#e8437a')}</div>
          <div class="tile"><h6>Disk <span>1 TB</span></h6>${ringHTML(59, '59%', { c: '#5c8fff' })}${spark(wave(24, 30, 18, 3), '#5c8fff')}</div>
          <div class="tile"><h6>Battery <span>3 h 40 m</span></h6>${ringHTML(86, '86%', { c: '#30d158' })}${spark(wave(24, 70, 10, 4), '#30d158')}</div>
        </div>
        <div class="tiles t2 lg">
          <div class="tile"><h6>Network <span>Wi-Fi</span></h6><div class="big"><span data-r>108</span><small>Mbit/s down</small></div><div style="font-size:13px;color:rgba(255,255,255,.6);margin-top:2px">↑ <span data-r>26</span> Mbit/s up</div>${spark(wave(32, 45, 30, 5), '#64d2ff')}</div>
          <div class="tile"><h6>Today <span>Sat 14 Nov</span></h6><div class="kv"><span>Design review</span><b>10:00</b></div><div class="kv"><span>Run with Ana</span><b>12:30</b></div><div class="kv"><span>Reminders</span><b>3 left</b></div><div class="kv"><span>Heat</span><b style="color:#30d158">Normal</b></div></div>
        </div></div>`,
      battery: () => `<div class="pg"><h3>Battery</h3><p class="sub">Charge, time left, health and cycles, and your accessories too.</p>
        <div class="tiles t2 lg">
          <div class="tile"><div class="batbig">${ringHTML(86, '86%', { c: '#30d158', w: 8, label: 'charged' })}<div><div class="kv"><span>Time left</span><b>3 h 40 m</b></div><div class="kv"><span>Health</span><b data-r>97%</b></div><div class="kv"><span>Charge cycles</span><b data-r>214</b></div><div class="kv"><span>Power</span><b>Battery</b></div></div></div></div>
          <div class="tile"><h6>Today’s charge</h6>${spark([100, 98, 95, 91, 88, 84, 80, 76, 74, 70, 68, 90, 96, 100, 99, 97, 94, 91, 88, 86], '#30d158', 70)}<div class="kv" style="margin-top:8px"><span>Plugged in</span><b>10:40 – 11:55</b></div></div>
        </div>
        <div class="tile" style="margin-top:12px"><h6>Accessories</h6><div class="acc3"><div>${ringHTML(72, '72%', { c: '#64d2ff', w: 10 })}Mouse</div><div>${ringHTML(90, '90%', { c: '#64d2ff', w: 10 })}Keyboard</div><div>${ringHTML(55, '55%', { c: '#64d2ff', w: 10 })}Trackpad</div></div></div></div>`,
      weather: () => `<div class="pg"><h3>Weather</h3><p class="sub">For the places you choose. No location access needed.</p>
        <div class="places" role="group" aria-label="Places">${Object.keys(PLACES).map((n, i) => `<button type="button" data-place="${n}" aria-pressed="${i === 0}">${n}</button>`).join('')}</div>
        <div class="tiles t2" style="margin-top:14px"><div data-wx>${weather('Tallinn')}</div>
          <div class="tile"><h6>Rain radar <span>while this page is open</span></h6><div class="radar" aria-hidden="true"><i></i><i></i><i></i><b></b></div><p class="attr">A drawing for this page. In Glance the radar is a live map.</p></div></div></div>`,
      time: () => `<div class="pg"><h3>Time</h3><p class="sub">World clocks for the cities you keep, with sun or moon and how far ahead they are.</p>
        <div class="clocks">${[['London', 'Europe/London'], ['Tallinn', 'Europe/Tallinn'], ['New York', 'America/New_York'], ['Tokyo', 'Asia/Tokyo']].map(([c, tz]) => `<div class="clock" data-clock="${tz}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="face" cx="50" cy="50" r="46"/>${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<line class="tick" x1="${50 + Math.sin(a) * 38}" y1="${50 - Math.cos(a) * 38}" x2="${50 + Math.sin(a) * 42}" y2="${50 - Math.cos(a) * 42}"/>`; }).join('')}<line class="hh" x1="50" y1="50" x2="50" y2="28"/><line class="mm" x1="50" y1="50" x2="50" y2="16"/><line class="ss" x1="50" y1="58" x2="50" y2="12"/><circle class="hub" cx="50" cy="50" r="3"/></svg><span><b>${c}</b><small data-dig>--:--</small><small data-off></small></span></div>`).join('')}</div></div>`
    };
    function setClocks() {
      const now = new Date(), mine = now.getTimezoneOffset();
      $$('[data-clock]', main).forEach(el => {
        let parts;
        try { parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23', timeZone: el.dataset.clock }).formatToParts(now).map(p => [p.type, p.value])); } catch (e) { return; }
        const h = +parts.hour, m = +parts.minute, s = +parts.second;
        const rot = (sel, deg) => { const l = $(sel, el); if (l) l.setAttribute('transform', `rotate(${deg} 50 50)`); };
        rot('.hh', (h % 12) * 30 + m * 0.5); rot('.mm', m * 6 + s * 0.1); rot('.ss', s * 6);
        el.classList.toggle('night', h < 7 || h >= 19);
        $('[data-dig]', el).textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 7 || h >= 19 ? '☾' : '☀'}`;
        // How far ahead or behind this city is, from its own wall time
        const local = now.getHours() * 60 + now.getMinutes(); let diff = (h * 60 + m) - local;
        if (diff > 720) diff -= 1440; if (diff < -720) diff += 1440;
        const hrs = Math.round(diff / 30) / 2;
        $('[data-off]', el).textContent = hrs === 0 ? 'Same time as you' : (hrs > 0 ? `+${hrs} h` : `−${-hrs} h`);
        void mine;
      });
    }
    const tabs = $$('[data-page]', dash);
    function open(name, first) {
      timers.forEach(clearInterval); timers = [];
      tabs.forEach(t => { const on = t.dataset.page === name; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      main.innerHTML = PAGES[name]();
      if (reduce) $$('.spark', main).forEach(s => s.classList.remove('draw'));
      initRings(main, { now: !first });
      const rollAll = () => $$('[data-r]', main).forEach((b, i) => roll(b, 0, 1300, 200 + i * 100));
      first ? whenSeen(main, rollAll, 0.3) : rollAll();
      if (name === 'time') { setClocks(); timers.push(setInterval(setClocks, 1000)); }
      if (name === 'weather') $$('[data-place]', main).forEach(b => b.addEventListener('click', () => {
        $$('[data-place]', main).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        const wx = $('[data-wx]', main); wx.innerHTML = weather(b.dataset.place); $$('[data-r]', wx).forEach(r => roll(r, 0, 900));
      }));
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => open(t.dataset.page));
      t.addEventListener('keydown', e => {
        const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); open(n.dataset.page);
      });
    });
    // The first page's sparklines draw only once the Dashboard is on screen
    main.innerHTML = '';
    whenSeen(dash, () => open('overview', true), 0.15);
    if (!('IntersectionObserver' in window)) open('overview', true);
  }

  /* ---------- Stay Awake */
  const awk = $('[data-awk]');
  if (awk) {
    const el = $('.gr', awk), ring = buildRing(el), b = $('.t b', el), small = $('.t small', el);
    const MODES = {
      hour: { v: .87, big: '52 min', small: 'left of 1 hour' },
      until: { v: .64, big: '3 h 10 m', small: 'until 18:00' },
      download: { v: .41, big: '41%', small: 'until the download ends' },
      always: { v: 1, big: 'On', small: 'until you turn it off' }
    };
    $$('[data-awk-mode]', awk).forEach(btn => btn.addEventListener('click', () => {
      $$('[data-awk-mode]', awk).forEach(x => x.setAttribute('aria-pressed', String(x === btn)));
      const m = MODES[btn.dataset.awkMode]; small.textContent = m.small; ring.to(m.v, { ms: 1300, text: m.big });
    }));
    $$('.tog', awk).forEach(t => t.addEventListener('click', () => t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true'))));
    void b;
  }
  $$('.gx-card .tog').forEach(t => { if (!t.closest('[data-awk]')) t.addEventListener('click', () => t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true'))); });

  /* ---------- Evening Mode: the warmth reaches every display */
  const eve = $('[data-eve]');
  if (eve) {
    const slider = $('input[type=range]', eve), pct = $('[data-evepct]', eve), scr = $$('.gx-scr', eve), pre = $$('[data-eve-pre]', eve);
    const set = v => { scr.forEach(s => s.style.setProperty('--w', v / 100)); pct.textContent = v + '%'; slider.value = v; pre.forEach(p => p.setAttribute('aria-pressed', String(+p.dataset.evePre === +v))); };
    slider.addEventListener('input', () => set(+slider.value));
    pre.forEach(p => p.addEventListener('click', () => {
      const from = +slider.value, to = +p.dataset.evePre;
      if (reduce) return set(to);
      tween(700, e => set(Math.round(from + (to - from) * e)));
      pre.forEach(x => x.setAttribute('aria-pressed', String(x === p)));
    }));
    set(+slider.value);
    if (!reduce) whenSeen(eve, () => tween(1600, e => set(Math.round(65 * e)), null, 300), 0.5); else set(65);
  }

  /* ---------- Storage: the bar draws in hot; pointing at a row lights its part of the bar */
  const sto = $('[data-sto]');
  if (sto) {
    const bar = $('.sbar', sto), segs = $$('.sbar i', sto), big = $('[data-stobig]', sto);
    $$('.sleg button', sto).forEach((btn, i) => {
      const on = () => { bar.classList.add('focus'); segs.forEach((s, j) => s.classList.toggle('lit', i === j)); };
      const off = () => { bar.classList.remove('focus'); segs.forEach(s => s.classList.remove('lit')); };
      btn.addEventListener('mouseenter', on); btn.addEventListener('focus', on); btn.addEventListener('mouseleave', off); btn.addEventListener('blur', off);
    });
    if (!reduce) {
      bar.classList.add('pre');
      whenSeen(sto, () => {
        const h = document.createElement('span'); h.className = 'hot on'; bar.appendChild(h);
        requestAnimationFrame(() => { bar.classList.add('drawn'); bar.classList.remove('pre'); });
        tween(1800, e => { h.style.left = (e * 100) + '%'; }, () => { h.classList.remove('on'); setTimeout(() => h.remove(), 900); });
        roll(big, 0, 1800, 0);
      }, 0.4);
    }
  }
})();
