/* Glance's own screens, drawn in HTML and SVG at the app's point sizes (styles in mac.css): the Island's pages
   with the tab bar floating below, the closed Island's split bubbles, the Tools tab's illustrated icons, the player,
   the panel's System page and the tour. Built from the helpers in mocks.js (window.GM); mac.js puts them on a Mac,
   and the gallery shows some of them up close. Nothing here is a picture of the app: it is all drawn. */
(() => {
  const G = window.GM; if (!G) return;
  const { ic, rings, roll, wx, dots, clk, ev } = G;
  const S = window.GS = {};

  /* ---------- Small glyphs the Island needs that the shared set doesn't have */
  const svg = (inner, vb = '0 0 24 24', cls = 'mi') => `<svg class="${cls}" viewBox="${vb}" aria-hidden="true">${inner}</svg>`;
  const P = {
    jot: '<path d="M4.5 6.5v11a2 2 0 0 0 2 2h11"/><path d="M19.5 4.5 11 13l-1 3 3-1 8.5-8.5z"/>',
    calsm: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 13.5h2M12 13.5h2M16 13.5h.01M8 16.5h2M12 16.5h2"/>',
    clockt: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    map: '<path d="M3.5 6.5 9 4.5l6 2 5.5-2v13l-5.5 2-6-2-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
    ell: '<circle cx="12" cy="12" r="8.5"/><path d="M8 12h.01M12 12h.01M16 12h.01" stroke-width="2.6"/>'
  };
  const g = (n, cls = '') => svg(P[n], '0 0 24 24', 'mi' + (cls ? ' ' + cls : ''));

  /* ---------- A ring for a bubble or a row: a track and an arc, the symbol inside */
  const ringSvg = (d, w, v, col) => {
    const r = d / 2 - w / 2 - .5, c = 2 * Math.PI * r;
    return `<svg class="gring" width="${d}" height="${d}" viewBox="0 0 ${d} ${d}" aria-hidden="true"><circle cx="${d / 2}" cy="${d / 2}" r="${r}" fill="none" stroke="${col}" stroke-opacity=".25" stroke-width="${w}"/><circle class="arc" cx="${d / 2}" cy="${d / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${(c * v).toFixed(2)} ${c.toFixed(2)}" transform="rotate(-90 ${d / 2} ${d / 2})"/></svg>`;
  };
  S.ringSvg = ringSvg;

  /* ---------- The closed Island's bubbles (IslandBubbleButton): a ring for a timer, Stay Awake, the battery or an AI
     limit with the symbol inside; a small glowing dot for a microphone or camera in use. Never the word "Awake". */
  const TINT = { blue: '#0A84FF', orange: '#FF9F0A', green: '#30D158', purple: '#BF5AF2', amber: '#FFB340', red: '#FF453A', pink: '#FF375F' };
  S.TINT = TINT;
  S.bubble = (b, d = 30) => {
    const t = TINT[b.tint] || b.tint;
    const face = b.art ? '<i class="gi-art gb-art"></i><span class="gi-eq gb-eq"><i></i><i></i><i></i></span>' : b.dot ? `<i class="gb-dot" style="--t:${t}"></i>`
      : (b.ring != null ? ringSvg(d * .62 + 4, 2.5, b.ring, t) : '') + `<span class="gb-ic" style="color:${t};font-size:${(b.ring != null ? d * .3 : d * .42).toFixed(1)}px">${ic(b.icon)}</span>`;
    return `<span class="gb" style="--d:${d}px" title="${b.label}">${face}</span>`;
  };

  /* ---------- The open Island's top row, either side of the camera: the live item's glyph and its value */
  S.islTop = (live = true) => `<div class="gi-top">${live ? `<span class="l">${ringSvg(22, 2, .75, TINT.blue)}<span style="color:${TINT.blue}">${ic('cup')}</span></span><span class="r"></span>` : ''}</div>`;

  /* ---------- The tab bar floating just below the open Island (IslandFloatingTabBar): icons only, in groups */
  const TABS = [['home', 'Home'], '|', ['cal', 'Calendar'], ['timer', 'Timer'], ['checklist', 'Tasks'], '|', ['bars', 'Insights'], ['drive', 'Storage'], ['bat', 'Battery'], '|', ['grid4', 'Tools']];
  S.TABS = TABS.filter(t => t !== '|');
  S.tabBar = on => `<div class="gi-bar" role="presentation">${TABS.map(t => t === '|' ? '<i class="sep"></i>' : `<span data-gtab="${t[1].toLowerCase()}" class="${t[1] === on ? 'on' : ''}" title="${t[1]}">${ic(t[0])}</span>`).join('')}<i class="sep"></i><span class="pl">${ic('plus')}</span><span class="pl">${ic('wins')}</span></div>`;

  /* ---------- Home */
  const hours = [['Now', 'cloud', 9], ['18', 'pmoon', 9], ['19', 'cloud', 9], ['20', 'cloud', 8], ['21', 'cloud', 8], ['22', 'cloud', 8]];
  const home = (o = {}) => `<div class="gi-pg">
    <div class="mki-hd"><b>Friday 20 November</b><span>${ic('bat')}86%</span></div>
    <div class="mki-sw gi-sw">${[['cup', 'Awake', true], ['moon', 'Evening'], ['scope', 'Focus'], ['clip', 'Clipboard'], ['wave', 'Live']].map(([i, n, on]) => `<span><span class="c${on ? ' on' : ''}">${ic(i)}</span><small>${n}</small></span>`).join('')}</div>
    <div class="gi-jot">${g('jot')}<span>Jot a note, task or sum…</span>${g('calsm')}</div>
    ${o.music ? player() : `<div class="gi-chip"><span style="color:${TINT.blue}">${ic('cup')}</span>Awake for 1 h 30<em>Turn Off</em></div>`}
    ${o.music ? '' : `<div class="mki-wx gi-wx"><div class="qtop">${wx('cloud')}<span><b>9°  Cloudy</b><small>London · H 11° L 3°</small></span><span class="sp"></span>${ic('chev', 'cv')}<span class="gi-seg"><i class="on">${g('clockt')}</i><i>${g('map')}</i></span></div>
      <div class="mki-hrs">${ic('chevl')}${hours.map(([t, k, d], i) => `<div><small${i ? '' : ' class="qnow"'}>${t}</small>${wx(k)}<b>${d}°</b></div>`).join('')}${ic('chev')}</div></div>`}
    <div class="mki-clk gi-clk">${clk(0, 'London', '17:13', '0h')}${clk(0, 'Tallinn', '19:13', '+2h')}${clk(1, 'New York', '12:13', '−5h')}</div>
    <div class="mki-clk gi-clk gi-clk1">${clk(0, 'Tokyo', '02:13', '<span style="color:#FFB340">+9h · Tomorrow</span>')}<span></span><span></span></div></div>`;

  /* ---------- The player (IslandBubblesPlayer): artwork, the title with its badges, the scrubber, then what's next,
     previous, play or pause, next, shuffle and repeat */
  const player = () => `<div class="gi-np"><div class="row"><span class="art"><i></i></span><div class="qm">
      <div class="qt"><b>Northern Lights</b><span class="bdg">L</span></div><small>The Harbour Trio · Tidewater</small>
      <div class="qs"><small class="fig">1:48</small><span class="bar"><i style="--v:46%"></i></span><small class="fig">−2:06</small></div></div></div>
    <div class="qc"><span class="q">${ic('list')}</span><span class="mid">${ic('prev')}<span class="pp">${ic('pause')}</span>${ic('next')}</span><span class="q r">${ic('shuffle', 'on')}${ic('repeat')}</span></div></div>`;

  /* ---------- Calendar */
  const cal = () => {
    const evDays = [2, 3, 9, 11, 17, 20, 24, 26];
    let gg = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<small>${d}</small>`).join('') + '<span></span>'.repeat(6);
    for (let d = 1; d <= 30; d++) gg += `<span class="${d === 20 ? 'td' : ''}${evDays.includes(d) ? ' ev' : ''}">${d}</span>`;
    return `<div class="gi-pg">
      <div class="mki-add"><span>Add an event: lunch with Sam tomorrow 13:00</span><em>Add</em>${ic('calplus')}</div>
      <div class="mki-cal"><div class="mki-ag"><b class="h6">TODAY</b>${ev('#FF9F0A', 'Team stand-up', '09:30 – 09:45', 'past')}${ev('#0A84FF', 'Design review', '17:30 – 18:00 · in 17 min')}${ev('#30D158', 'Dinner with Sam', '19:30 – 21:00')}<b class="h6">TOMORROW</b>${ev('#FF453A', 'Flight to Tallinn', '08:15 · LHR Terminal 2')}${ev('#BF5AF2', 'Run in Kadriorg', '17:00 – 18:00')}</div>
      <div class="mki-mo"><b>November 2026</b><div class="qg">${gg}</div></div></div></div>`;
  };

  /* ---------- Timers */
  const timers = () => `<div class="gi-pg">
    <div class="gi-segt"><span class="on">Timers</span><span>Focus</span><span>Stopwatch</span></div>
    <div class="gi-field">25m tea · 17:30 standup · every 45m stretch</div>
    <div class="gi-pre"><span>5m</span><span>10m</span><span>25m</span><span>1h</span></div>
    <div class="gi-run"><span class="rg">${ringSvg(30, 3, .6, TINT.orange)}<span style="color:${TINT.orange}">${ic('cup')}</span></span><span class="nm"><b>Tea</b><small>Ends at 17:17</small></span><b class="fig">${roll('4')}:18</b><span class="bt">${ic('pause')}</span><span class="bt">${ic('plus', 'x')}</span></div>
    <p class="gi-hint">Several can run at once. Each shows in the Island with a ring, soonest first.</p></div>`;

  /* ---------- Tools: large illustrated icons (IslandToolIcon), each on a dark tile with a lit top edge */
  let tid = 0;
  const tool = (key, label, top, bottom, accent, accHex, glyph) => {
    const id = 'gt' + (++tid);
    const grad = `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#${top}"/><stop offset="1" stop-color="#${bottom}"/></linearGradient>`;
    const acc = `#${accHex}`;
    let back = '', front = '';
    if (accent[0] === 'ring') { const r = 19.8, c = 2 * Math.PI * r; back = `<circle cx="30" cy="30" r="${r}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="3.4"/><circle class="arc" cx="30" cy="30" r="${r}" fill="none" stroke="url(#${id})" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="${(c * accent[1]).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 30 30)"/>`; }
    if (accent === 'orbs') back = `<circle cx="24" cy="25" r="13.8" fill="${acc}" opacity=".5" filter="url(#gtb)"/><circle cx="38" cy="36" r="10.2" fill="#${top}" opacity=".38" filter="url(#gtb)"/>`;
    if (accent === 'sheets') back = `<rect x="20" y="13" width="25" height="31" rx="4.2" fill="${acc}" transform="rotate(10 32 28)"/><rect x="16" y="14" width="25" height="31" rx="4.2" fill="url(#gts)"/><path d="M21 22h15M21 26.5h15M21 31h15M21 35.5h9" stroke="#8c8c94" stroke-width="1.8" stroke-linecap="round"/>`;
    if (accent === 'bubble') back = `<path d="M33 12h14a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6h-2l-4 4v-4h-8a6 6 0 0 1-6-6v-6a6 6 0 0 1 6-6z" fill="${acc}" opacity=".45"/>`;
    if (accent === 'badge') front = `<circle cx="42" cy="16.5" r="5.4" fill="${acc}" stroke="#151517" stroke-width="1.6"/>`;
    if (accent === 'sheets') front = `<circle cx="40" cy="40" r="9.6" fill="${acc}"/>` + `<g transform="translate(34 34) scale(.5)" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${glyph.badge || ''}</g>`;
    const main = accent === 'sheets' ? '' : `<g fill="url(#${id})" stroke="url(#${id})">${glyph.art}</g>`;
    return `<span class="gtl" data-tool="${key}"><svg viewBox="0 0 60 60" aria-hidden="true"><defs>${grad}</defs><rect x=".5" y=".5" width="59" height="59" rx="15.5" fill="url(#gtile)" stroke="url(#gtedge)"/>${back}${main}${front}</svg><small>${label}</small></span>`;
  };
  // Glyphs in a 60-point box, filled or stroked with the tool's gradient
  const F = 'stroke="none"', N = 'fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"';
  const GL = {
    system: { art: `<rect x="22.5" y="22.5" width="15" height="15" rx="3" ${N} stroke-width="2.6"/><rect x="26.5" y="26.5" width="7" height="7" rx="1.2" ${F}/><path d="M26 19.5v2.5M34 19.5v2.5M26 38v2.5M34 38v2.5M19.5 26h2.5M19.5 34h2.5M38 26h2.5M38 34h2.5" ${N} stroke-width="2"/>` },
    ai: { art: `<path d="M30 18.5c1 5.6 3.6 8.4 9.2 9.6-5.6 1.2-8.2 4-9.2 9.6-1-5.6-3.6-8.4-9.2-9.6 5.6-1.2 8.2-4 9.2-9.6z" ${F}/><path d="M39 17.5c.4 2.2 1.4 3.2 3.6 3.6-2.2.4-3.2 1.4-3.6 3.6-.4-2.2-1.4-3.2-3.6-3.6 2.2-.4 3.2-1.4 3.6-3.6z" ${F}/>` },
    clip: { badge: '<rect x="8" y="5" width="9" height="13" rx="2"/><path d="M10.5 5V3.6h4V5"/>' },
    notes: { badge: '<path d="M5 19l2.5-.6L18 8l-2-2L5.6 16.4z"/>' },
    conv: { art: `<path d="M20 25h20l-6-6M40 35H20l6 6" ${N}/>` },
    shelf: { art: `<path d="M15 33.5 19.5 20h21L45 33.5V41a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3z" ${F}/><path d="M15 33.5h9.5l2 3.5h7l2-3.5H45" fill="none" stroke="#141416" stroke-width="2.4" stroke-linejoin="round"/><path d="M22.5 25.5h15M21.5 29.5h17" fill="none" stroke="#141416" stroke-width="2" stroke-linecap="round" opacity=".55"/>` },
    music: { art: `<path d="M38.5 16v18.5a5.5 5.5 0 1 1-3.4-5.1V22.6l-10.6 2.6v13.3a5.5 5.5 0 1 1-3.4-5.1V20.4z" ${F}/>` },
    timers: { art: `<circle cx="30" cy="32" r="9" ${N} stroke-width="2.8"/><path d="M30 32v-4.6M27 20.5h6" ${N} stroke-width="2.8"/>` },
    bell: { art: `<path d="M30 15.5a9 9 0 0 1 9 9v6.5l3.5 5.5h-25L21 31v-6.5a9 9 0 0 1 9-9zM26 39.5h8a4 4 0 0 1-8 0z" ${F}/>` },
    breaks: { art: `<path d="M17.5 26h21v6.5a8.5 8.5 0 0 1-8.5 8.5h-4a8.5 8.5 0 0 1-8.5-8.5zM38.5 28h2a4 4 0 0 1 0 8h-2.6M15 43.5h27" ${F}/><path d="M38.5 28h2a4 4 0 0 1 0 8h-2.6M15.5 44.5h26" ${N} stroke-width="2.6"/><path d="M23 18c-1.4 1.6 1.4 2.4 0 4.2M28.5 17c-1.4 1.6 1.4 2.4 0 4.2M34 18c-1.4 1.6 1.4 2.4 0 4.2" ${N} stroke-width="1.8" opacity=".8"/>` },
    cues: { art: `<path d="M16 22a6 6 0 0 1 6-6h14a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6h-8.5L21 41.5V36a6 6 0 0 1-5-6z" ${F}/><path d="M22.5 23.5h13M22.5 28.5h9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>` },
    emoji: { art: `<circle cx="30" cy="30" r="12.5" ${N} stroke-width="3"/><circle cx="25.8" cy="27.2" r="1.9" ${F}/><circle cx="34.2" cy="27.2" r="1.9" ${F}/><path d="M24.5 33c1.4 2.2 3.3 3.3 5.5 3.3s4.1-1.1 5.5-3.3" ${N} stroke-width="2.6"/>` },
    jot: { badge: '<path d="M5 19l2.5-.6L18 8l-2-2L5.6 16.4z"/>' },
    song: { art: `<path d="M21 30h2M25.5 24v12M30 19v22M34.5 25v10M39 28v4" ${N} stroke-width="3"/>` },
    calc: { art: `<rect x="19" y="15" width="22" height="30" rx="4.5" ${F}/><rect x="22.5" y="18.5" width="15" height="6" rx="1.5" fill="#141416" stroke="none" opacity=".7"/><path d="M24 30h.01M30 30h.01M36 30h.01M24 35h.01M30 35h.01M36 35h.01M24 40h.01M30 40h.01M36 40h.01" fill="none" stroke="#141416" stroke-width="3.4" stroke-linecap="round"/>` }
  };
  const TOOLS = [
    ['system', 'System', '7CF0D0', '1FA88A', ['ring', .68], '34D3A6', GL.system],
    ['ai', 'AI usage', 'FFE07A', 'FF9F2E', ['ring', .82], 'FF9F2E', GL.ai],
    ['clip', 'Clipboard', 'F2F2F7', 'B8C4D6', 'sheets', '5ED3B8', GL.clip],
    ['notes', 'Notes', 'FFFFFF', 'D9D9DE', 'sheets', 'FFD24A', GL.notes],
    ['conv', 'Converter', '7AD7FF', '2D7CF6', 'orbs', '2D7CF6', GL.conv],
    ['shelf', 'Shelf', '8BF0E0', '18A0B5', 'none', '', GL.shelf],
    ['music', 'Now Playing', '9C8CFF', '5B4BE0', 'orbs', '7B6CF6', GL.music],
    ['timers', 'Timers', 'FFC27A', 'FF7A2E', ['ring', .6], 'FF8A3D', GL.timers],
    ['bell', 'Reminders', 'FFD978', 'FF9F0A', 'badge', 'FF453A', GL.bell],
    ['breaks', 'Breaks', 'F5C9A0', 'C27A45', 'orbs', 'E8A86C', GL.breaks],
    ['cues', 'Cues', 'FFB4A0', 'FF7051', 'bubble', 'FF9F6E', GL.cues],
    ['emoji', 'Emoji', 'FFE680', 'FFB300', 'none', '', GL.emoji],
    ['jot', 'Jot', 'FFD0A0', 'FF8A3D', 'sheets', 'FFB067', GL.jot],
    ['song', 'Song finder', '7AC8FF', '2F6BFF', 'orbs', '3D8BFF', GL.song],
    ['calc', 'Calculator', 'D8D8DE', '8E8E96', 'none', '', GL.calc]
  ];
  const toolDefs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="gtile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#363638"/><stop offset="1" stop-color="#171718"/></linearGradient><linearGradient id="gtedge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".04"/></linearGradient><linearGradient id="gts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d6d6da"/></linearGradient><filter id="gtb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2"/></filter></defs></svg>`;
  const tools = () => `<div class="gi-pg">${toolDefs}
    <div class="gi-th"><span class="all">${ic('grid22')}All</span><span class="sp"></span><span class="rb">${ic('list')}</span><span class="more">${g('ell')}More</span></div>
    <div class="gi-tools">${TOOLS.map(t => tool(...t)).join('')}</div></div>`;

  /* ---------- The shelf (IslandShelfView): the shelf's name with its dot, Share, AirDrop and Clear, then its files in a row.
     With the tabs hidden, the shelf button opens Home at the shelf. Each file's actions are in its right-click menu. */
  const shelfFile = (k, n) => `<span class="gs-f ${k}"><i></i><small>${n}</small></span>`;
  const shelf = () => `<div class="gi-pg">
    <div class="gs-shelf"><p class="gs-sh"><span class="nm"><i></i>SHELF</span><span class="sp"></span>${ic('share')}<b>AirDrop</b><em>Clear</em></p>
    <div class="gs-files">${shelfFile('zip', 'Photos.zip')}${shelfFile('img', 'Logo.png')}${shelfFile('mov', 'Walkthrough.mov')}</div></div></div>`;
  S.shelfBar = () => `<div class="gi-bar gi-bar1" role="presentation"><span class="on" title="Shelf">${ic('tray')}<b>3</b></span></div>`;

  S.pages = { home: () => home(), music: () => home({ music: true }), calendar: cal, timers, tools, shelf };
  S.pageTab = { home: 'Home', music: 'Home', calendar: 'Calendar', timers: 'Timer', tools: 'Tools', shelf: null };

  /* ---------- The open Island on its own, for the gallery: the Island and its tab bar below it */
  const solo = (page, tab) => `<div class="gi-solo"><div class="gi-card">${S.islTop()}${S.pages[page]()}</div>${S.tabBar(tab)}</div>`;

  /* ---------- The panel's System page (as Monorail's): rings, each core, memory and processor time */
  const system = () => {
    const cores = [14, 9, 22, 6, 11, 4, 8, 3, 5, 2, 7, 3, 2, 1];
    const mem = [['Apps', 9.8, '#0A84FF'], ['Wired', 3.4, '#BF5AF2'], ['Compressed', 1.2, '#FF9F0A'], ['Cached', 6.1, '#8E8E93']];
    return `<div class="mkp gs" style="height:650px"><div class="mkp-ph"><span class="bk">${ic('chevl')}Glance</span><b>System</b></div>
      <div class="gs-pg">
        <div class="gs-top">${rings(96, 9, 3, [.18, .46], ['#30D158', '#0A84FF'], .15)}<div class="gs-kv">
          <p style="--c:#30D158"><small>PROCESSOR</small><b class="fig">${roll('18')}%<em>14 cores</em></b></p>
          <p style="--c:#0A84FF"><small>MEMORY</small><b class="fig">${roll('20.5')} GB<em>pressure low</em></b></p>
          <p style="--c:#30D158"><small>HEAT</small><b>Cool</b></p></div></div>
        <div class="gs-chip"><b>Apple M4 Pro</b><small>load per core</small><b class="h6">CORES</b><div class="gs-cores">${cores.map((v, i) => `<i style="--v:${v}"><b>${i + 1}</b><small>${v}%</small></i>`).join('')}</div></div>
        <div class="gs-card"><div class="gs-h"><small>MEMORY</small><span>20.5 GB of 48 GB</span></div>${dots(mem.map(([, v, c]) => ({ v, c })), 48, 14, { d: .4 })}
          <div class="gs-leg">${mem.map(([n, v, c]) => `<span><i style="background:${c}"></i>${n}<b>${v} GB</b></span>`).join('')}<span><i style="background:rgba(127,127,127,.35)"></i>Free<b>27.5 GB</b></span></div></div>
        <div class="gs-card"><div class="gs-h"><small>PROCESSOR TIME</small></div><div class="gs-pt"><i style="flex:11;background:#0A84FF"></i><i style="flex:7;background:#FF453A"></i><i style="flex:82" class="e"></i></div>
          <div class="gs-leg gs-leg3"><span><i style="background:#0A84FF"></i>Apps<b>11%</b></span><span><i style="background:#FF453A"></i>macOS<b>7%</b></span><span><i class="e"></i>Idle<b>82%</b></span></div>
          <div class="gs-st"><p><small>Load (1, 5, 15 min)</small><b>2.1 · 2.4 · 2.2</b></p><p><small>Processes</small><b>612</b></p><p><small>Heat</small><b style="color:#30D158">Cool</b></p></div></div>
      </div></div>`;
  };
  S.system = system;

  /* ---------- The tour (TourView): the "hello" moment, then a chapter page */
  const HELLO = [[0.086, 0.640], [[0.207, 0.580], [0.459, 0.360], [0.522, 0.180]], [[0.560, 0.070], [0.389, 0.060], [0.365, 0.200]], [[0.307, 0.400], [0.250, 0.600], [0.215, 0.700]], [[0.297, 0.500], [0.402, 0.450], [0.478, 0.450]], [[0.565, 0.450], [0.553, 0.520], [0.518, 0.620]], [[0.490, 0.700], [0.536, 0.710], [0.629, 0.660]], [[0.718, 0.620], [0.839, 0.560], [0.860, 0.500]], [[0.885, 0.430], [0.772, 0.430], [0.732, 0.510]], [[0.688, 0.600], [0.699, 0.710], [0.802, 0.700]], [[0.878, 0.700], [0.942, 0.660], [1.012, 0.600]], [[1.130, 0.480], [1.282, 0.260], [1.317, 0.160]], [[1.348, 0.070], [1.214, 0.060], [1.184, 0.180]], [[1.107, 0.400], [1.043, 0.620], [1.060, 0.680]], [[1.083, 0.720], [1.153, 0.700], [1.231, 0.620]], [[1.355, 0.480], [1.506, 0.260], [1.542, 0.160]], [[1.573, 0.070], [1.439, 0.060], [1.409, 0.180]], [[1.333, 0.400], [1.268, 0.620], [1.284, 0.680]], [[1.308, 0.720], [1.379, 0.660], [1.432, 0.580]], [[1.485, 0.500], [1.552, 0.450], [1.615, 0.450]], [[1.552, 0.450], [1.460, 0.500], [1.429, 0.590]], [[1.393, 0.690], [1.470, 0.720], [1.566, 0.660]], [[1.663, 0.600], [1.705, 0.480], [1.624, 0.460]], [[1.669, 0.510], [1.782, 0.510], [1.960, 0.430]]];
  const helloPath = (k = 160) => { const f = v => (v * k).toFixed(1); return `M${f(HELLO[0][0])} ${f(HELLO[0][1])}` + HELLO.slice(1).map(([a, b, c]) => `C${f(a[0])} ${f(a[1])} ${f(b[0])} ${f(b[1])} ${f(c[0])} ${f(c[1])}`).join(''); };
  S.hello = () => `<div class="gt gt-hello"><i class="gt-blob" style="--x:18%;--y:30%;--c:#5d7fb5"></i><i class="gt-blob" style="--x:52%;--y:22%;--c:#b58a9a"></i><i class="gt-blob" style="--x:80%;--y:55%;--c:#3d5a48"></i><i class="gt-blob" style="--x:40%;--y:80%;--c:#8a6a3a"></i><i class="gt-grain"></i>
    <svg class="gt-word" viewBox="0 0 320 120" aria-hidden="true"><defs><filter id="gthg" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="3.5"/></filter></defs><path class="glow" d="${helloPath()}" pathLength="1" filter="url(#gthg)"/><path class="ink" d="${helloPath()}" pathLength="1"/></svg>
    <small class="gt-ret">Press Return to begin</small></div>`;

  const stars = Array.from({ length: 26 }, (_, i) => `<i style="left:${(i * 37.3) % 100}%;top:${(i * 23.7) % 62}%;--o:${.25 + (i % 5) * .12}"></i>`).join('');
  S.chapter = () => `<div class="gt gt-ch"><div class="gt-stars">${stars}</div><svg class="gt-hills" viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70C120 40 220 60 330 52s210-30 330-8 180 30 240 20V120H0z" fill="#3d3566" opacity=".55"/><path d="M0 92c140-20 260-6 380-14s250-26 380-6 100 14 140 10V120H0z" fill="#2a2450"/></svg>
    <div class="gt-nav"><span class="gt-back">${ic('chevl')}</span><div class="gt-chs">${['You', 'Island', 'Panel', 'Your day', 'Done'].map((c, i) => `<span class="${i === 1 ? 'on' : ''}${i < 1 ? ' done' : ''}">${c}<i></i></span>`).join('')}</div><span class="gt-x">${ic('plus', 'x')}</span></div>
    <p class="gt-left">2 of 5 · about 2 min left</p>
    <div class="gt-prev"><div class="gt-pw"></div><div class="gt-pmb"><b>Finder</b><span>File</span><span>Edit</span><span class="sp"></span><span>Fri 09:41</span></div>
      <div class="gt-pi"><div class="gt-pt"><span class="on">${ic('home')}Home</span>${['cal', 'timer', 'checklist', 'bars', 'drive', 'bat', 'grid4'].map(i => `<span>${ic(i)}</span>`).join('')}</div>
        <div class="mki-hd"><b>Friday 20 November</b><span>${ic('bat')}86%</span></div>
        <div class="mki-sw">${[['cup', 'Awake'], ['moon', 'Evening'], ['scope', 'Focus', 1], ['clip', 'Clipboard'], ['wave', 'Live']].map(([i, n, on]) => `<span><span class="c${on ? ' on' : ''}">${ic(i)}</span><small>${n}</small></span>`).join('')}</div>
        <div class="gt-tea"><span style="color:#FF9F0A">${ic('cup')}</span><b>Tea</b><i><b></b></i><span class="fig">4:18</span></div></div></div>
    <h4>What’s happening, one glance up.</h4>
    <p class="gt-body">The Island shows music, timers, calls and AI limits while they matter, and rests when nothing is going on. Rest the pointer on it to peek, click to keep it open, and drag any card out to keep it floating.</p>
    <p class="gt-try">Try it: rest the pointer on the Island at the top of your screen</p>
    <div class="gt-opt"><span>${ic('island')}Grow the Island from the camera on a MacBook</span><i class="mk-tog on" style="--tint:#0A84FF"></i></div>
    <div class="gt-opt"><span>${ic('sunline')}Weather and world clocks on the Island’s Home</span><i class="mk-tog on" style="--tint:#0A84FF"></i></div>
    <span class="gt-go">Continue</span></div>`;

  /* ---------- Up close in the gallery */
  G.add('island', () => solo('home', 'Home'), 500, 528);
  G.add('tools', () => solo('tools', 'Tools'), 500, 406);
  G.add('calendar', () => solo('calendar', 'Calendar'), 500, 388);
  G.add('system', system, 360, 650);
})();
