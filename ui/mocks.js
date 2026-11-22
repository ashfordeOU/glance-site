/* Builds the drawn copies of the app's screens for the "Exactly as it looks" gallery (styles in mocks.css). Each
   [data-mock] figure frame gets its screen at the app's own point size, scaled to fit with CSS zoom so text stays sharp.
   When a screen comes into view its numbers roll, charts and bars draw in behind a glowing edge and the Island opens;
   with Reduce Motion the finished frame is simply there. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Small helpers */
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const walk = (n, base, vol, lo, hi) => { let v = base; return Array.from({ length: n }, () => (v = Math.min(hi, Math.max(lo, v + (rnd() - .5) * vol + (base - v) * .2)))); };
  const A = 'fill="currentColor" stroke="none"';
  const I = {
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3"/>',
    drive: `<path ${A} d="M6.4 5h11.2a2 2 0 0 1 1.9 1.4L21 11H3l1.5-4.6A2 2 0 0 1 6.4 5zM3 12.5h18V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
    disk: '<rect x="3" y="12" width="18" height="7" rx="2"/><path d="M4.5 12 7 6h10l2.5 6M7 15.5h.01"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    bolt: `<path ${A} d="M13.5 2 5 13.5h6L10 22l9-12h-6z"/>`,
    cup: `<path ${A} d="M5 7.5h12v4.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 8.7h1.2a2.6 2.6 0 0 1 0 5.2H17v-1.8h1.1a.8.8 0 0 0 0-1.6H17zM3.5 18.6h16.5c-.6 1.3-2 2.2-3.6 2.2H7.1c-1.6 0-3-.9-3.6-2.2z"/>`,
    moon: `<path ${A} d="M20 14.6A8.5 8.5 0 1 1 9.4 4a7 7 0 0 0 10.6 10.6z"/>`,
    scope: `<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.2" ${A}/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4"/>`,
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 13V9M12 13l2.8 2.8M9.5 2.5h5"/>',
    keep: `<circle cx="11" cy="12" r="8.5"/><circle cx="11" cy="9.6" r="2.8"/><path d="M6.2 17.4c1.2-2.1 2.8-3 4.8-3"/><circle cx="16.8" cy="16.6" r="4" ${A}/><path d="m15 16.7 1.3 1.3 2.4-2.6" stroke="var(--knock, #fff)" stroke-width="1.6"/>`,
    mic: `<rect x="9" y="3" width="6" height="11" rx="3" ${A}/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/>`,
    film: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M7.5 5v14M16.5 5v14M3.5 9.6h4M3.5 14.4h4M16.5 9.6h4M16.5 14.4h4"/>',
    island: `<rect x="4" y="7.5" width="16" height="9" rx="4.5" ${A}/>`,
    docks: '<rect x="3.5" y="5" width="17" height="12" rx="2"/><path d="M12 14V8.5M9.5 11 12 8.5l2.5 2.5M7 20.5h10"/>',
    chev: '<path d="m9 5.5 6.5 6.5L9 18.5"/>', chevl: '<path d="M15 5.5 8.5 12l6.5 6.5"/>', chevd: '<path d="m6 9 6 6 6-6"/>', updown: '<path d="m8 9.5 4-4 4 4M8 14.5l4 4 4-4"/>',
    gear: '<circle cx="12" cy="12" r="2.8"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/><circle cx="12" cy="12" r="6.4"/>',
    grid32: '<rect x="3" y="6" width="5" height="5" rx="1"/><rect x="9.5" y="6" width="5" height="5" rx="1"/><rect x="16" y="6" width="5" height="5" rx="1"/><rect x="3" y="13" width="5" height="5" rx="1"/><rect x="9.5" y="13" width="5" height="5" rx="1"/><rect x="16" y="13" width="5" height="5" rx="1"/>',
    grid22: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    grid4: `<rect x="4" y="4" width="7" height="7" rx="2" ${A}/><rect x="13" y="4" width="7" height="7" rx="2" ${A}/><rect x="4" y="13" width="7" height="7" rx="2" ${A}/><rect x="13" y="13" width="7" height="7" rx="2" ${A}/>`,
    gauge: '<path d="M4.2 17.5a8.5 8.5 0 1 1 15.6 0"/><path d="m12 14.5 4-4.5M7.5 13h.01M8.8 9.2h.01M12 7.8h.01"/><circle cx="12" cy="14.5" r="1.4"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>',
    sliders: '<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/>',
    home: `<path ${A} d="M12 3.2 2.8 11h2.7v9h5v-5.5h3V20h5v-9h2.7z"/>`,
    cal: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M7.5 13h.01M12 13h.01M16.5 13h.01M7.5 16.5h.01M12 16.5h.01" />',
    calplus: '<rect x="3" y="5" width="15" height="14" rx="2.3"/><path d="M3 9.2h15M7 12.5h.01M10.5 12.5h.01M7 15.5h.01"/><circle cx="18" cy="17.5" r="4" fill="#000"/><path d="M18 15.5v4M16 17.5h4"/>',
    spark: `<path ${A} d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8zM18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z"/>`,
    checklist: '<circle cx="5.5" cy="7" r="2"/><circle cx="5.5" cy="16" r="2"/><path d="M10 7h10M10 16h10"/>',
    bars: `<rect x="3" y="11" width="5" height="9" rx="1.2" ${A}/><rect x="9.5" y="7" width="5" height="13" rx="1.2" ${A}/><rect x="16" y="4" width="5" height="16" rx="1.2" ${A}/>`,
    wins: '<rect x="3" y="8" width="13" height="11" rx="2"/><path d="M7.5 8V6.2c0-.9.7-1.7 1.7-1.7h10c.9 0 1.7.8 1.7 1.7v8.6c0 .9-.8 1.7-1.7 1.7H16"/>',
    bat: `<rect x="2.5" y="7.5" width="17" height="9" rx="2.6"/><rect x="4.6" y="9.6" width="10.5" height="4.8" rx="1" ${A}/><path d="M21.6 10.6v2.8"/>`,
    clip: '<rect x="8.5" y="3.5" width="10" height="13" rx="2"/><path d="M6 7.5h-.5A1.5 1.5 0 0 0 4 9v10.5A1.5 1.5 0 0 0 5.5 21h8a1.5 1.5 0 0 0 1.5-1.5V19"/>',
    wave: '<path d="M2.5 12h4l2-5 3.5 11 2.5-8 1.5 2h5.5"/>',
    loc: `<path ${A} d="M20.5 3.5 3.5 10.6l7.2 1.8 1.8 7.2z"/>`,
    pin: `<circle cx="12" cy="6.5" r="3" ${A}/><path d="M12 9.5V21"/>`,
    plus: '<path d="M12 5v14M5 12h14"/>',
    leaf: `<path ${A} d="M19.5 4C10.6 4 5 7.6 5 14c0 1.5.4 2.8 1.1 3.9L4 20l1.1 1.1 2.2-2.2A6.7 6.7 0 0 0 11 20c6.3 0 8.5-6 8.5-16z"/>`,
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    macwin: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 8.5h18"/>',
    ell: `<circle cx="5.5" cy="12" r="1.7" ${A}/><circle cx="12" cy="12" r="1.7" ${A}/><circle cx="18.5" cy="12" r="1.7" ${A}/>`,
    stack: '<path d="m12 3 9 4.5-9 4.5-9-4.5z"/><path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
    wand: '<path d="m4 20 10.5-10.5M14.5 3.5V6M20.5 9.5H18M18.5 5.5l-1.7 1.7M10.5 5.5v1M18.5 13.5h-1"/>',
    pause: `<rect x="7" y="5" width="3.4" height="14" rx="1" ${A}/><rect x="13.6" y="5" width="3.4" height="14" rx="1" ${A}/>`,
    share: '<path d="M12 3v11.5M8.2 6.8 12 3l3.8 3.8M7 10.5H5.5v10h13v-10H17"/>',
    seal: `<circle cx="12" cy="12" r="10" ${A}/><path d="m7.5 12.3 3 3 6-6.3" stroke="#14301c" stroke-width="2.4"/>`,
    mem: '<rect x="3" y="6.5" width="18" height="11" rx="2"/><path d="M7 17.5v2M11 17.5v2M15 17.5v2"/>',
    gpu: '<path d="M12 3 20 7.5v9L12 21 4 16.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
    neural: '<path d="M12 5.5a3 3 0 0 0-5.7 1.2A3 3 0 0 0 4.6 11a3 3 0 0 0 1.6 5A3 3 0 0 0 12 18zM12 5.5a3 3 0 0 1 5.7 1.2 3 3 0 0 1 1.7 4.3 3 3 0 0 1-1.6 5A3 3 0 0 1 12 18z"/>',
    fan: '<circle cx="12" cy="12" r="1.8"/><path d="M12 10.2C11 6 12 3 14.5 3s2.5 4-1 7.2M13.8 12c4.2-1 7.2 0 7.2 2.5s-4 2.5-7.2-1M12 13.8c1 4.2 0 7.2-2.5 7.2s-2.5-4 1-7.2M10.2 12C6 13 3 12 3 9.5s4-2.5 7.2 1"/>',
    sound: '<path d="M4 9.5h3l4.5-4v13L7 14.5H4z"/><path d="M15 9a4 4 0 0 1 0 6M17.6 6.4a7.6 7.6 0 0 1 0 11.2"/>',
    bt: '<path d="M9 8.5a4.5 4.5 0 0 0 0 7M6 6a8 8 0 0 0 0 12"/><circle cx="14" cy="12" r="1.6"/>',
    phones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4" height="6.5" rx="1.5"/>',
    hammer: '<path d="m13.5 9.5-9 9a1.6 1.6 0 0 0 2.3 2.3l9-9M11 6l3-3 7 7-3 3z"/>',
    ai: '<path d="M4 5h16v11H9.5L5 20v-4H4z"/><path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01"/>',
    ports: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.3 7.6 11 16.3M16.7 7.6 13 16.3"/>',
    switches: `<rect x="3" y="4.5" width="18" height="6.5" rx="3.25"/><rect x="3" y="13" width="18" height="6.5" rx="3.25"/><circle cx="16.8" cy="7.75" r="1.7" ${A}/><circle cx="7.2" cy="16.25" r="1.7" ${A}/>`,
    history: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.7"/><path d="M4 4.5v4.2h4.2M12 8v4l2.8 1.8"/>',
    apps: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 9h17"/>',
    ov: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8M12 4v16"/>',
    dropper: '<path d="m14.5 4.5 5 5-2 2-5-5zM12.5 8.5 5 16v3h3l7.5-7.5"/>',
    flame: '<path d="M12 3c1 3.6 5.5 5.4 5.5 10.2a5.5 5.5 0 0 1-11 0C6.5 10.6 8 9 9 8c0 2.2 1 3.2 2.2 3.2C11.2 8 10.4 5.6 12 3z"/><path d="M12 20a2.2 2.2 0 0 1-2.2-2.2c0-1.6 2.2-3.3 2.2-3.3s2.2 1.7 2.2 3.3A2.2 2.2 0 0 1 12 20z"/>',
    sunline: '<circle cx="12" cy="12" r="3.6"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
    sunrise: '<path d="M7.5 15a4.5 4.5 0 0 1 9 0M12 5v3M4.5 15h-2M21.5 15h-2M6.3 9.3 5 8M17.7 9.3 19 8M3 19h18"/>',
    tray: `<path ${A} d="M3 13.5 5.6 6h12.8l2.6 7.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM5 13.5h4.3l1 2h3.4l1-2H19L17.3 8H6.7z"/>`,
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/>',
    cc: '<rect x="3" y="5" width="18" height="6" rx="3"/><rect x="3" y="13" width="18" height="6" rx="3"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/>',
    back: '<path d="M14.5 6 8.5 12l6 6"/>', fwd: '<path d="m9.5 6 6 6-6 6"/>',
    list: '<path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"/>', cols: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 5v14M15 5v14"/>',
    gallery: '<rect x="3" y="5" width="18" height="10" rx="2"/><path d="M5 19h2M9 19h2M13 19h2M17 19h2"/>', tag: '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.4"/>',
    clockr: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5h4"/>', app: '<path d="m6 18 6-13 6 13M8.5 13h7"/>', desk: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 20h8"/>', doc: '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4"/>', dl: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v8M8.5 12l3.5 3.5 3.5-3.5"/>', cloudline: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.6A3.8 3.8 0 0 1 17.2 18.5z"/>',
    zoomin: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5M8 10.5h5M10.5 8v5"/>', zoomout: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5M8 10.5h5"/>', info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>', pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>', rot: '<path d="M5 12a7 7 0 1 0 2-5L5 9M5 4.5V9h4.5"/>',
    play: `<path ${A} d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z"/>`,
    prev: `<path ${A} d="M11.5 6.2v11.6a.7.7 0 0 1-1.1.6L2.8 12.6a.7.7 0 0 1 0-1.2l7.6-5.8a.7.7 0 0 1 1.1.6zM21 6.2v11.6a.7.7 0 0 1-1.1.6l-7.6-5.8a.7.7 0 0 1 0-1.2l7.6-5.8a.7.7 0 0 1 1.1.6z"/>`,
    next: `<path ${A} d="M12.5 6.2v11.6a.7.7 0 0 0 1.1.6l7.6-5.8a.7.7 0 0 0 0-1.2l-7.6-5.8a.7.7 0 0 0-1.1.6zM3 6.2v11.6a.7.7 0 0 0 1.1.6l7.6-5.8a.7.7 0 0 0 0-1.2L4.1 5.6A.7.7 0 0 0 3 6.2z"/>`,
    shuffle: '<path d="M3 7h3.5c4 0 6.5 10 11 10H21M3 17h3.5c1.6 0 2.8-1.6 3.9-3.6M13.6 9.6C14.7 8 15.9 7 17.5 7H21M18.5 4.5 21 7l-2.5 2.5M18.5 14.5 21 17l-2.5 2.5"/>',
    repeat: '<path d="M4 11V9.5A2.5 2.5 0 0 1 6.5 7H19l-2.5-2.5M20 13v1.5a2.5 2.5 0 0 1-2.5 2.5H5l2.5 2.5"/>',
    note: `<path ${A} d="M18.5 3.2v11.3a3 3 0 1 1-2-2.8V7.6L9.5 9.1v7.4a3 3 0 1 1-2-2.8V6.3z"/>`,
    swap: '<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M12 8.5v4M10 11a2 2 0 0 0 4 0"/>',
    track: '<circle cx="11" cy="12" r="8"/><path d="M11 7.5V12l2.6 1.6"/><circle cx="17.6" cy="17.4" r="3.6" fill="currentColor" stroke="none"/><path d="m16 17.5 1.1 1.1 2.1-2.2" stroke="var(--knock, #fff)" stroke-width="1.5"/>',
    notes: '<path d="M4 12h1.5M7 8.5v7M10 5.5v13M13 8v8M16 10v4M19 11.5v1"/>',
    backdrop: '<rect x="3" y="3" width="13" height="13" rx="2.5"/><rect x="8" y="8" width="13" height="13" rx="2.5" fill="currentColor" stroke="none" opacity=".9"/>',
    video: `<rect x="2.5" y="6.5" width="13" height="11" rx="2.5" ${A}/><path ${A} d="m16.5 10.5 5-3v9l-5-3z"/>`,
    camera: '<rect x="2.5" y="6.5" width="13" height="11" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5z"/>',
    recscr: '<rect x="2.5" y="4.5" width="19" height="13" rx="2.5"/><path d="M8 21h8"/><circle cx="12" cy="11" r="3" fill="currentColor" stroke="none"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  };
  const ic = (n, cls = '', style = '') => `<svg class="mi${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true"${style ? ` style="${style}"` : ''}>${I[n] || ''}</svg>`;
  // App icons for the desktop drawing: a rounded tile and a simple white glyph, deliberately unlike any real app's icon
  let gid = 0;
  const tileSvg = (a, b, inner, light) => { const id = 'mkt' + (++gid); return `<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="32" height="32" rx="7.4" fill="url(#${id})"/>${light ? '<rect x=".5" y=".5" width="31" height="31" rx="7" fill="none" stroke="rgba(0,0,0,.12)"/>' : ''}${inner}</svg>`; };
  const APPS = {
    files: ['#eaf5ff', '#c9e3ff', '<path d="M6.5 11.5a2 2 0 0 1 2-2h4.6l2 2h8.4a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" fill="#3a9bff"/><path d="M6.5 14h19v8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" fill="#62b3ff"/>', true],
    safari: ['#62b6ff', '#1d6fe0', '<circle cx="16" cy="16" r="9" fill="none" stroke="#fff" stroke-width="1.9"/><ellipse cx="16" cy="16" rx="4" ry="9" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M7.4 13h17.2M7.4 19h17.2" stroke="#fff" stroke-width="1.6"/>'],
    messages: ['#5fdc8a', '#18a957', '<rect x="6.5" y="8" width="13" height="9.5" rx="3" fill="#fff"/><path d="M9 17.5v3l3.2-3z" fill="#fff"/><rect x="13" y="14" width="12.5" height="9" rx="3" fill="#d6f7e2"/>'],
    mail: ['#5ac8d8', '#1f8fb3', '<path d="M7 17.5 9.2 10a1.5 1.5 0 0 1 1.4-1h10.8a1.5 1.5 0 0 1 1.4 1l2.2 7.5V22a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 7 22z" fill="#fff"/>'],
    photos: ['#ffc85a', '#ff8a3d', '<rect x="6.5" y="8.5" width="19" height="15" rx="2.6" fill="#fff"/><circle cx="12" cy="13.2" r="1.9" fill="#ffb340"/><path d="M8 22l5.4-5.6 3.4 3.4 2.6-2.6L24 22z" fill="#ff8a3d"/>'],
    music: ['#b07cff', '#6a3fe6', '<path d="M9 19v-3a7 7 0 0 1 14 0v3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><rect x="7.5" y="17.5" width="4.5" height="7" rx="1.8" fill="#fff"/><rect x="20" y="17.5" width="4.5" height="7" rx="1.8" fill="#fff"/>'],
    calendar: ['#ff8a7a', '#e5483a', '<rect x="7.5" y="9.5" width="17" height="15" rx="2.4" fill="none" stroke="#fff" stroke-width="1.9"/><path d="M7.5 14h17M12 7.5v4M20 7.5v4" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/>'],
    notes: ['#ffdc6a', '#f5b21c', '<path d="M9.5 7.5h9.2l4.3 4.3v12.7H9.5z" fill="#fff"/><path d="M12 15h8M12 18.2h8M12 21.4h5" stroke="#e0a300" stroke-width="1.3" stroke-linecap="round"/>'],
    settings: ['#b4b4ba', '#6c6c72', '<circle cx="16" cy="16" r="7.4" fill="none" stroke="#fff" stroke-width="3.6" stroke-dasharray="2.9 2.9"/><circle cx="16" cy="16" r="5.6" fill="#fff"/><circle cx="16" cy="16" r="2.4" fill="#8e8e93"/>'],
    terminal: ['#46464c', '#111114', '<path d="m9.5 12 4 4-4 4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 21h7" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>'],
    code: ['#30364f', '#14172a', '<path d="m12 11-5 5 5 5M20 11l5 5-5 5" fill="none" stroke="#8fb3ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>']
  };
  const app = (k, cls = '') => `<i data-app="${k}"${cls ? ` class="${cls}"` : ''}>${APPS[k] ? tileSvg(...APPS[k]) : ''}</i>`;
  const flag = '<svg class="flag" viewBox="0 0 60 30" aria-hidden="true"><rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30M60 0 0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0 0 30" stroke="#C8102E" stroke-width="2"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>';
  // Weather symbols, multicolour as in the app
  const SUNG = '<circle cx="12" cy="12" r="4.4" fill="#FFD60A"/><g stroke="#FFD60A" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></g>';
  const CLOUD = (y = 0, c = '#fff') => `<path transform="translate(0 ${y})" fill="${c}" d="M7 19a4.6 4.6 0 0 1-.6-9.2 6.1 6.1 0 0 1 11.6 1.7A3.8 3.8 0 0 1 17.3 19z"/>`;
  const DROPS = '<g stroke="#5AC8FA" stroke-width="1.9" stroke-linecap="round"><path d="M8.5 18.5l-1.2 2.6M12.5 18.5l-1.2 2.6M16.5 18.5l-1.2 2.6"/></g>';
  const MOONG = '<path fill="#E9E8FF" d="M19 14.6A7.5 7.5 0 1 1 9.4 5a6 6 0 0 0 9.6 9.6z"/>';
  const WX = {
    sun: SUNG, cloud: CLOUD(), rain: CLOUD(-3) + DROPS,
    psun: `<g transform="translate(-3 -4) scale(.8)">${SUNG}</g>` + CLOUD(1.5),
    pmoon: `<g transform="translate(-3 -4) scale(.75)">${MOONG}</g>` + CLOUD(1.5), moon: MOONG
  };
  const wx = (k, cls = 'wxi') => `<span class="${cls}"><svg viewBox="0 0 24 24" aria-hidden="true">${WX[k]}</svg></span>`;

  // Concentric rings (the app's Rings3): values 0…1, outermost first
  const rings = (size, w, gap, vals, cols, d = .1) => {
    const c = size / 2;
    return `<svg class="mk-rings" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">${vals.map((v, i) => {
      const r = c - w / 2 - i * (w + gap);
      return `<circle cx="${c}" cy="${c}" r="${r}" stroke="${cols[i]}" stroke-opacity=".2" stroke-width="${w}"/><circle class="arc" cx="${c}" cy="${c}" r="${r}" pathLength="100" stroke="${cols[i]}" stroke-width="${w}" style="--v:${(v * 100).toFixed(1)};--d:${d + i * .12}s"/>`;
    }).join('')}</svg>`;
  };
  // The dot-matrix bar: segments [{v, c}], out of a total
  const dots = (segs, total, h = 14, opt = {}) => {
    const used = segs.reduce((t, s) => t + s.v, 0), rest = Math.max(0, total - used);
    const parts = segs.map((s, i) => `<i style="--c:${s.c};flex:${s.v}"${i === segs.length - 1 && !rest ? ' class="last"' : ''}></i>`).join('') + (rest ? `<i class="e" style="flex:${rest}"></i>` : '');
    const cell = h >= 18 ? 3.5 : 2.5;
    return `<div class="mk-dw" style="--hc:${segs[segs.length - 1].c};--to:${(used / total * 100).toFixed(1)}%;--d:${opt.d || .2}s"><div class="mk-dots mk-in" style="--h:${h}px;--r:${Math.min(h * .32, 10)}px;--cell:${cell}px;--track:${opt.track || 'var(--p-track)'}"><div class="px">${parts}</div><div class="ol">${parts}</div><span class="qtw"></span></div><i class="mk-hot"></i></div>`;
  };
  // A sparkline chart for a Dashboard tile
  const chart = (arr, max, col, d = .2) => {
    const W = 300, H = 40, p = arr.map((v, i) => [i * W / (arr.length - 1), H - 3 - (v / max) * (H - 8)]);
    let path = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 1; i < p.length; i++) { const [x0, y0] = p[i - 1], [x1, y1] = p[i], mx = (x0 + x1) / 2; path += ` C${mx.toFixed(1)} ${y0.toFixed(1)} ${mx.toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`; }
    const id = 'mkg' + Math.floor(rnd() * 1e9);
    const last = p[p.length - 1];
    return `<div class="ch mk-dw" style="--hc:${col};--d:${d}s"><div class="mk-in" style="height:100%"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".32"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><line class="qbase" x1="0" x2="${W}" y1="${H - 3}" y2="${H - 3}" vector-effect="non-scaling-stroke"/><path d="${path} L${W} ${H} L0 ${H}Z" fill="url(#${id})"/><path d="${path}" fill="none" stroke="${col}" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg></div><i class="mk-hot" style="top:${(last[1] / H * 100 - 15).toFixed(0)}%;bottom:auto;height:12px"></i></div>`;
  };
  const roll = n => `<span class="rl">${n}</span>`;

  /* ---------- The menu-bar panel: Home */
  const card = (inner, cls = '') => `<div class="mkc${cls ? ' ' + cls : ''}">${inner}</div>`;
  const title = (t, icon, col) => `<div class="mk-ct" style="color:${col}">${ic(icon)}${t}<span class="sp"></span>${ic('chev', 'cv')}</div>`;
  const today = () => card(`<div class="mkp-today"><div class="qd"><small>Fri</small><b class="fig">20</b></div><div class="qw"><b>Design review</b><small>17:30 · in 17 min</small></div>${ic('chev', 'cv')}<span class="mk-join">Join</span></div>`);
  const sysCard = () => card(title('SYSTEM', 'cpu', 'var(--blue)') + `<div class="mk-rr">${rings(50, 5.5, 1.5, [.23, .61], ['var(--blue)', 'var(--orange)'])}<div><b class="fig">${roll('23%')}</b><small>Memory low</small></div></div>`);
  const storeSegs = [{ v: 212, c: 'var(--blue)' }, { v: 148, c: 'var(--purple)' }, { v: 96, c: 'var(--yellow)' }, { v: 82, c: 'var(--green)' }, { v: 50, c: 'var(--grey)' }];
  const storeCard = () => card(title('STORAGE', 'drive', 'var(--blue)') + `<b class="fig qbig">${roll('412')} GB<small>free</small></b><span class="s11 qt2" style="margin:5px 0 8px;color:var(--p-2)">588 GB of 1 TB used</span>${dots(storeSegs, 1000, 14, { d: .35 })}`);
  const netCard = wide => card(title('NETWORK', 'globe', 'var(--teal)') + `<b class="fig qbig">↓ ${roll('4.2')} MB/s</b><span class="s11" style="color:var(--p-2);margin-top:5px">↑ 380 KB/s</span><span class="qmono" style="display:block;font-size:10.5px;color:var(--p-3);margin-top:7px;white-space:nowrap">81.2.69.160${wide ? ' · ' : ' '}${flag} London</span>`);
  const batCard = () => card(title('BATTERY', 'bolt', 'var(--green)') + `<div class="mk-rr">${rings(50, 5.5, 1.5, [.86, .62, .45], ['var(--green)', 'var(--blue)', 'var(--orange)'])}<div><b class="fig">${roll('86%')}</b><small>5:12 left</small></div></div><div style="margin-top:8px">${dots([{ v: 86, c: 'var(--green)' }], 100, 14, { d: .3 })}</div>`);
  const sw = (icon, name, on, tint) => `<span><span class="c${on ? ' on' : ''}" style="--tint:${tint || 'var(--blue)'}">${ic(icon)}</span><small>${name}</small></span>`;
  const sliders = () => card(`<div class="mkp-sl">${ic('sound')}<span class="qtr"><i style="--v:72%"></i></span></div><div class="mkp-sl">${ic('sunrise')}<span class="qtr"><i style="--v:55%"></i></span></div>`, '');

  const panelGlance = () => `<div class="mkp" style="height:${PANEL_H}px">
    <div class="mkp-st"><i class="dot" style="background:var(--green)"></i><b>All calm</b><small>· 1:29</small><span class="sp"></span>${ic('gauge')}${ic('gear')}</div>
    <div class="mkp-scroll mk-hv">
      ${today()}
      <div class="mkp-pair">${sysCard()}${storeCard()}</div>
      ${netCard(true)}
      <div class="mkp-sw mk-hv">${sw('cup', 'Stay Awake', true, 'var(--orange)')}${sw('moon', 'Evening')}${sw('timer', 'Focus Session')}${sw('keep', 'Keep Available')}${sw('mic', 'Microphone')}${sw('video', 'Camera')}${sw('notes', 'Meeting Notes')}${sw('recscr', 'Record Screen')}${sw('track', 'Time Tracking')}${sw('film', 'Film')}${sw('island', 'Island', true, 'var(--pink)')}${sw('docks', 'Docks')}</div>
      ${sliders()}
      <div class="mkp-pair">${card(`<div class="mkp-tool"><div style="display:flex"><span class="qic" style="--tint:var(--blue)">${ic('clip')}</span><span class="sp"></span>${ic('chev', 'cv', 'color:var(--p-3);font-size:11px;stroke-width:2.4')}</div><b>Clipboard</b><small>14 items</small></div>`)}${card(`<div class="mkp-tool"><span class="qic" style="--tint:var(--pink)">${ic('dropper')}</span><b>Colour</b><small>Pick from screen</small></div>`)}</div>
    </div>
    <div class="mkp-foot">${ic('sliders')}Customise Home</div></div>`;

  const PANEL_H = 650;
  /* ---------- Stay Awake and Evening Mode pages (Glance) */
  const awake = () => `<div class="mkp" style="height:336px"><div class="mkp-ph"><span class="bk">${ic('chevl')}Glance</span><b>Stay Awake</b></div>
    <div class="mkp-pg"><div class="mkp-trow"><span><b>Stay Awake</b><small>On for ${roll('1')} h 30</small></span><span class="mk-tog on" style="--tint:var(--orange)"></span></div>
    <div class="mkp-cap">Keep this Mac awake</div>
    <div class="mkp-chips mk-hv"><span>15 min</span><span>30 min</span><span>1 hour</span><span>2 hours</span><span>4 hours</span><span>8 hours</span></div>
    <div class="mkp-chips2 mk-hv"><span>Until I end it</span><span>While downloading</span></div>
    <div class="mkp-hr"></div>
    <div class="mkp-line">Keep the display on <span class="mk-tog on" style="--tint:var(--orange)"></span></div>
    <div class="mkp-line">Keep me Available in Teams and Slack <span class="mk-tog"></span></div>
    <div class="mkp-hr"></div><span class="mkp-link">More Stay Awake settings…</span></div></div>`;
  const evening = () => `<div class="mkp" style="height:262px"><div class="mkp-ph"><span class="bk">${ic('chevl')}Glance</span><b>Evening Mode</b></div>
    <div class="mkp-pg"><div class="mkp-trow"><span><b>Evening Mode</b><small>On now, until you turn it off</small></span><span class="mk-tog on" style="--tint:var(--orange)"></span></div>
    <div class="mkp-warm">Warmth <span>${roll('50%')}</span></div>
    <div class="mkp-wsl">${ic('sunline')}<span class="qtr" style="--v:50%"><i></i><b></b></span>${ic('flame')}</div>
    <div class="mkp-pop">Turn on <span>By hand${ic('updown')}</span></div>
    <div class="mkp-chk"><i></i>Red light only</div>
    <div class="mkp-hr"></div><span class="mkp-link">More Evening Mode settings…</span></div></div>`;

  /* ---------- The Island's pieces shared with screens.js (which draws the 1.9.9 Island) */
  const clk = (sun, city, time, off) => `<div><small>${ic(sun ? 'sunline' : 'moon', sun ? 'sun' : 'moon')}${city}</small><b class="fig">${time}</b><em>${off}</em></div>`;
  const ev = (c, t, s, cls = '') => `<div class="mki-ev ${cls}" style="--c:${c}"><i></i><span><b>${t}</b><small>${s}</small></span></div>`;

  /* ---------- The Dashboard and the Overview */
  const tabs = (list, on) => `<div class="mkd-tabs">${list.map(([i, n]) => `<span${n === on ? ' class="on"' : ''}>${ic(i)}${n}</span>`).join('')}</div>`;
  const GROUPS = [['ov', 'Overview'], ['stack', 'Apps', 'AI'], ['bolt', 'Power', 'Battery'], ['gauge', 'Performance', 'CPU'], ['disk', 'Storage', 'Storage'], ['globe', 'Connections', 'Network'], ['sunline', 'Your day', 'Today'], ['history', 'Insights', 'History']];
  const groupTabs = (on, sub) => `<div class="mkd-gt"><div class="mkd-grp">${GROUPS.map(([i, n, s]) => `<span${n === on ? ' class="on"' : ''}>${ic(i)}<b>${n}${s && n !== on ? `<small>${s}</small>` : ''}</b></span>`).join('')}</div><em class="mkd-k">${ic('search')}⌘K</em></div>`
    + (sub ? `<div class="mkd-sub">${sub[0].map(([i, n]) => `<span${n === sub[1] ? ' class="on"' : ''}>${ic(i)}${n}</span>`).join('')}</div>` : '');
  const DAY = [['cal', 'Today'], ['clock', 'Time'], ['cloudline', 'Weather'], ['notes', 'Record']];
  const tile = (icon, name, col, val, sub, arr, max, lo, avg, hi, d) => `<div class="mkd-card mkd-t" style="--c:${col}"><div class="qh">${ic(icon)}${name}${ic('chev', 'cv')}</div><b class="v">${val}</b><small>${sub}</small>${chart(arr, max, col, d)}<div class="ft"><span>Low</span>${lo}<b style="font-weight:400"><span>Average</span>${avg}</b><b style="font-weight:400"><span>High</span>${hi}</b></div></div>`;
  const tiles = mono => { seed = 11; return `<div class="mkd-g3 mk-hv">
      ${tile('cpu', 'CPU', 'var(--acc)', roll('23%'), '14 cores', walk(48, 22, 26, 3, 70), 100, '4%', '19%', '62%', .2)}
      ${tile('mem', 'Memory', 'var(--blue)', roll('61%'), 'pressure low', walk(48, 60, 6, 40, 80), 100, '54%', '60%', '68%', .3)}
      ${tile('gpu', 'GPU', 'var(--purple)', roll('12%'), 'graphics', walk(48, 14, 18, 0, 60), 100, '0%', '11%', '48%', .4)}
      ${tile('globe', 'Network', 'var(--teal)', '↓ ' + roll('4.2') + ' MB/s', '↑ 380 KB/s', walk(48, 3, 5, 0, 12), 12, '0 KB/s', '2.8 MB/s', '11 MB/s', .3)}
      ${tile('disk', 'Disk', 'var(--red)', roll('412') + ' GB', 'free · writing 2.1 MB/s', walk(48, 4, 6, 0, 30), 30, '0 KB/s', '3.4 MB/s', '28 MB/s', .4)}
      ${mono ? tile('bat', 'Battery', 'var(--green)', roll('86%'), '5 h 12 m left', Array.from({ length: 48 }, (_, i) => 100 - i * .32 + Math.sin(i / 3) * .4), 100, '86%', '93%', '100%', .5)
             : tile('bat', 'Battery', 'var(--green)', roll('86%'), '5 h 12 m left', Array.from({ length: 48 }, (_, i) => 100 - i * .32 + Math.sin(i / 3) * .4), 100, '86%', '93%', '100%', .5)}</div>`; };
  const bottom3 = () => `<div class="mkd-g3 mk-hv">
      <div class="mkd-card mkd-b3"><small class="qk">STORAGE</small><b class="qbig">${roll('412')} GB<small>free of 1 TB</small></b>${dots([{ v: 212, c: '#0A84FF' }, { v: 148, c: '#BF5AF2' }, { v: 96, c: '#FFD60A' }, { v: 82, c: '#30D158' }, { v: 50, c: '#98989D' }], 1000, 16, { track: 'rgba(255,255,255,.12)', d: .5 })}<span class="lk">Details</span></div>
      <div class="mkd-card mkd-b3"><small class="qk">CONNECTION</small><p><b>${ic('wifi')} Wi-Fi · Home 5G</b></p><p class="qmono">81.2.69.160 · ${flag} London</p><span class="lk" style="margin-top:2px">Details</span></div>
      <div class="mkd-card mkd-b3"><small class="qk">THIS MAC</small><p><b>MacBook Pro</b><br>M4 Pro · 48 GB memory<br>macOS 26.1 · up 3 days</p></div></div>`;
  const chip = () => `<div class="mkd-chip"><h4>Apple M4 Pro</h4><small>up 3 days</small><em>${ic('share')}Share${ic('chevd', '', 'font-size:9px;stroke-width:3')}</em></div>
    <div class="mkd-card mkd-why">${ic('seal')}<span><small>Why is my Mac slow?</small><b>All good: nothing is slowing your Mac down.</b></span><em>Check again</em></div>`;
  const dashWin = (w, h, tabsHtml, body) => `<div class="mkd navy" style="width:${w}px;height:${h}px"><div class="mkd-tl"><i></i><i></i><i></i><span>Glance Dashboard</span></div><h3>Dashboard</h3>${tabsHtml}<div class="mkd-body">${body}</div><div class="mkd-foot">Glance 0.4% · 77 MB<span class="sp"></span>M4 Pro · up 3 days ${ic('gear')}<b>Settings</b></div></div>`;
  const overviewGlance = (w = 1200, h = 720) => dashWin(w, h, groupTabs('Overview'), chip() + tiles(false) + bottom3());

  /* ---------- Weather */
  const weather = () => {
    const H = [['Now', 'rain', 9, 70], ['18', 'rain', 9, 64], ['19', 'cloud', 9, 40], ['20', 'cloud', 9, 28], ['21', 'pmoon', 8, 15], ['22', 'cloud', 8, 12], ['23', 'pmoon', 8, 8], ['Sat', 'moon', 7, 0], ['01', 'moon', 7, 0], ['02', 'pmoon', 7, 0], ['03', 'cloud', 6, 5], ['04', 'cloud', 6, 10], ['05', 'cloud', 6, 12], ['06', 'cloud', 6, 10], ['07', 'cloud', 6, 8], ['08', 'psun', 7, 5], ['09', 'psun', 8, 0], ['10', 'sun', 9, 0], ['11', 'sun', 10, 0]];
    const y = t => 8 + (11 - t) / 7 * 34, n = H.length;
    const pts = H.map((h, i) => [(i + .5) / n * 1000, y(h[2])]);
    let path = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < n; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], m = (x0 + x1) / 2; path += ` C${m} ${y0} ${m} ${y1} ${x1} ${y1}`; }
    const clouds = [[40, 30, 260, 70], [200, 70, 300, 80], [420, 20, 240, 60], [520, 90, 280, 70], [700, 40, 260, 66], [880, 80, 240, 60]].map(([l, t, w, h]) => `<i class="cl" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px"></i>`).join('');
    // The radar: Britain and the near Continent in small squares, rain over London
    let land = ''; for (let la = 61; la > 47; la -= .32) for (let lo = -12; lo < 22; lo += .5) if (landAmount(la, lo) >= .5) land += `M${((lo + 12) / 34 * 1024).toFixed(0)} ${((61 - la) / 14 * 300).toFixed(0)}h13v5h-13z`;
    return dashWin(1100, 688, groupTabs('Your day', [DAY, 'Weather']), `
      <div class="mkd-places"><span class="on">${ic('loc')}London</span><span>${ic('pin')}Tallinn</span><span>${ic('pin')}New York</span><span class="add">Add a place</span><span class="unit"><i class="on">°C</i><i>°F</i></span></div>
      <div class="mkd-sky">${clouds}<i class="rn"></i><div class="qtx"><div class="pl">${ic('loc')}London</div><div class="qrow"><span class="deg">${roll('9')}°</span><span><b>Drizzle</b><small>H 11°  L 3°</small><small>Feels like 7°</small></span></div><div class="dry">Rain stopping in ~25 min.</div></div>${wx('rain', 'wxi bigi')}<div class="mkd-nh"><div class="mkd-cap">Next hour</div><b>Rain stopping in ~25 min</b><div class="bars">${Array.from({ length: 60 }, (_, i) => { const v = i < 25 ? .35 + .4 * Math.sin(i / 4) ** 2 : 0; return `<i style="--h:${v ? Math.round(v * 100) : 6}%;--i:${i}"${v ? '' : ' class="dr"'}></i>`; }).join('')}</div><div class="ax"><span>Now</span><span>30 min</span><span>60 min</span></div><small class="cr"><b>Apple Weather</b> · <u>Other data sources</u></small></div></div>
      <div class="mkd-card mkd-48"><div class="mkd-cap">Next 48 hours<span>4° – 11°</span></div>
        <div class="qhrs">${H.map((h, i) => `<div class="hc"><small${i === 0 || h[0] === 'Sat' ? ' class="qk"' : ''}>${h[0]}</small>${wx(h[1])}<span class="qtl"></span><span class="qrb"><i style="--h:${h[3]}%;--i:${i}"></i></span><em>${h[3] ? h[3] + '%' : ''}</em></div>`).join('')}
          <i class="day" style="left:${7 / n * 100}%"></i>
          <div class="tl-svg mk-dw" style="--hc:#64D2C8;--d:.3s"><div class="mk-in" style="height:100%"><svg viewBox="0 0 1000 52" preserveAspectRatio="none" aria-hidden="true"><path d="${path}" fill="none" stroke="#64D2C8" stroke-width="1.6" vector-effect="non-scaling-stroke"/>${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2" fill="#fff"/>`).join('')}</svg></div></div>
          <div class="temps">${H.map(h => `<b style="--y:${y(h[2]).toFixed(1)}">${h[2]}°</b>`).join('')}</div></div>
        <div class="ftr">Scroll for the next two days<span>Now</span><i>Tonight</i><i>Tomorrow</i></div></div>
      <div class="mkd-card mkd-radar"><div class="mkd-cap">Radar<span>10 min ago</span></div><div class="map"><svg viewBox="0 0 1024 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><filter id="mkbl"><feGaussianBlur stdDeviation="9"/></filter></defs><path d="${land}" fill="#2c4470"/><g filter="url(#mkbl)" opacity=".85"><ellipse cx="350" cy="150" rx="70" ry="38" fill="#30D158"/><ellipse cx="365" cy="152" rx="34" ry="18" fill="#FFD60A"/><ellipse cx="300" cy="105" rx="46" ry="24" fill="#30D158"/><ellipse cx="560" cy="60" rx="60" ry="22" fill="#30D158" opacity=".7"/></g><circle cx="${((-.13 + 12) / 34 * 1024).toFixed(0)}" cy="${((61 - 51.5) / 14 * 300).toFixed(0)}" r="4" fill="#fff"/></svg></div></div>`);
  };

  /* ---------- Time: the world as dots, lit by day and dim by night */
  const ROWS = ["000000000000000000011000001111000000000001111111111110000000000000000000000000100000000111111111111000000000000000000000","100000000000000000010111100010111111000000111111111110000000000000000000000000100011111111111111111111101111111000000000","000001111111111111111110100001111001100000011111111000000000000000111111100000011101011111111111111111111111111111111111","111000111111111111111111111111100001101000111111000010100000000011111110101111111111111111111111111111111111111111111111","000000111111111111111111111111011000110000011100000001000000000111111111111111111111111111111111111111111111111111111111","000001111111111111111111111110000011000000001100000000000000001111011111111111111111111111111111111111111111111101011100","000000001000001111111111111110000011101000000000000000000000001011001111111111111111111111111111111111111110000001000000","000000000000000011111111111111100011111100000000000000000010000010011111111111111111111111111111111111111100000011000000","000000000000000001111111111111111011111110000000000000000101001111111111111111111111111111111111111111111111000010000000","000000000000000001111111111111111111111100000000000000000011011111111111111111111111111111111111111111111111000000000000","000000000000000000111111111111111111111011000000000000000011111111111111111111111111111111111111111111111111000000000000","000000000000000000011111111111111111111000000000000000000000111111111101011111111111111111111111111111111100000000000000","000000000000000000011111111111111111100000000000000000000101110111111000011111111111111111111111111111111001000000000000","000000000000000000011111111111111110000000000000000000000111000001111011111111111111111111111111111111100000000000000000","000000000000000000011111111111111110000000000000000000000111000000010111111111111111111111111111111000100000000000000000","000000000000000000011111111111111110000000000000000000000000111100000000111111111111111111111111111100100110000000000000","000000000000000000000111111111111100000000000000000000000111111100000000111111111111111111111111111100011000000000000000","000000000000000000000111111111111000000000000000000000000111111111011111111111111111111111111111111110000000000000000000","000000000000000000000001111100001000000000000000000000001111111111111110111101111111111111111111111110000000000000000000","000000000000000000000000111100000000000000000000000000011111111111111110111110011111111111111111111100000000000000000000","000000000000000000000001111000000000000000000000000000011111111111111111011111110001111111111111111000000000000000000000","000000000000000000000000011100100010000000000000000000111111111111111111011111110000111110011111000000000000000000000000","000000000000000000000000011101100001100000000000000000011111111111111111101111100000111100011110100010000000000000000000","000000000000000000000000000001110000000000000000000000111111111111111111101110000000011000000111000010000000000000000000","000000000000000000000000000000110000000000000000000000111111111111111111111000000000011000000011000000000000000000000000","000000000000000000000000000000010001100100000000000000011111111111111111111110000000011000000011000000000000000000000000","000000000000000000000000000000000011111100000000000000001111111111111111111110000000000000000000000001000000000000000000","000000000000000000000000000000000011111111000000000000000111001111111111111100000000000000000100000000000000000000000000","000000000000000000000000000000000011111111100000000000000000000111111111111100000000000000001000001000000000000000000000","000000000000000000000000000000000111111111100000000000000000000111111111111000000000000000000100111011100000000000000000","000000000000000000000000000000000111111111111000000000000000000111111111110000000000000000000010011010001000000000000000","000000000000000000000000000000000111111111111110000000000000000011111111100000000000000000000010000000000111000000000000","000000000000000000000000000000000111111111111111000000000000000011111111100000000000000000000001100000000011100000000000","000000000000000000000000000000000011111111111111000000000000000011111111100000000000000000000000000001000000010000000000","000000000000000000000000000000000011111111111110000000000000000001111111100000000000000000000000000000001101000000000000","000000000000000000000000000000000001111111111110000000000000000011111111110010000000000000000000000000111001000000000000","000000000000000000000000000000000000111111111110000000000000000011111111100110000000000000000000000001111101100000000000","000000000000000000000000000000000000011111111110000000000000000011111111000100000000000000000000000011111111100000000000","000000000000000000000000000000000000011111111100000000000000000001111111001100000000000000000000001111111111110000010000","000000000000000000000000000000000000111111110000000000000000000001111111000100000000000000000000001111111111111000000000","000000000000000000000000000000000000111111110000000000000000000001111110000000000000000000000000001111111111111000000000","000000000000000000000000000000000000111111100000000000000000000000111100000000000000000000000000001111111111111000000000","000000000000000000000000000000000000111111100000000000000000000000111100000000000000000000000000000111101111111000000000","000000000000000000000000000000000000111111000000000000000000000000100000000000000000000000000000000100000011110000000000","000000000000000000000000000000000000111110000000000000000000000000000000000000000000000000000000000000000001110000000010","000000000000000000000000000000000000111000000000000000000000000000000000000000000000000000000000000000000000000000000010","000000000000000000000000000000000001110000000000000000000000000000000000000000000000000000000000000000000000100000000100","000000000000000000000000000000000001110000000000000000000000000000000000000000000000000000000000000000000000000000001000","000000000000000000000000000000000001110000000000000000000000000000000000000000000000000000000000000000000000000000000000","000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000000000000000000000000","000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000000000000000000000000","000000000000000000000000000000000000110000000000000000000000000000000000000000000000000000000000000000000000000000000000"];
  const NORTH = 75, SOUTH = -56, COLS = 120;
  function landAmount(lat, lon) {
    const fy = (NORTH - lat) / (NORTH - SOUTH) * ROWS.length - .5, fx = (lon + 180) / 360 * COLS - .5;
    const r0 = Math.floor(fy), c0 = Math.floor(fx), ty = fy - r0, tx = fx - c0;
    const cell = (r, c) => { const rr = Math.min(Math.max(r, 0), ROWS.length - 1), cc = ((c % COLS) + COLS) % COLS; return ROWS[rr][cc] === '1' ? 1 : 0; };
    return (cell(r0, c0) * (1 - tx) + cell(r0, c0 + 1) * tx) * (1 - ty) + (cell(r0 + 1, c0) * (1 - tx) + cell(r0 + 1, c0 + 1) * tx) * ty;
  }
  const RAD = Math.PI / 180;
  function subsolar(ms) {
    const days = ms / 864e5 + 2440587.5 - 2451545, g = ((357.529 + .98560028 * days) % 360) * RAD, q = (280.459 + .98564736 * days) % 360;
    const l = (q + 1.915 * Math.sin(g) + .02 * Math.sin(2 * g)) * RAD, e = (23.439 - .00000036 * days) * RAD;
    const dec = Math.asin(Math.sin(e) * Math.sin(l)) / RAD, ra = Math.atan2(Math.cos(e) * Math.sin(l), Math.cos(l)) / RAD;
    let eq = (q - ra) % 360; if (eq > 180) eq -= 360; if (eq < -180) eq += 360;
    const utc = (ms % 864e5) / 36e5; let lon = -15 * (utc - 12) - eq; lon = ((lon + 540) % 360) - 180;
    return { lat: dec, lon };
  }
  const elev = (lat, lon, s) => 90 - Math.acos(Math.min(1, Math.max(-1, Math.sin(lat * RAD) * Math.sin(s.lat * RAD) + Math.cos(lat * RAD) * Math.cos(s.lat * RAD) * Math.cos((lon - s.lon) * RAD)))) / RAD;
  const daylight = e => { const t = Math.min(Math.max((e + 12) / (11.17), 0), 1); return t * t * (3 - 2 * t); };
  const timePage = () => {
    const W = 1024, Hm = Math.round(W / (360 / (NORTH - SOUTH))), moment = Date.UTC(2026, 10, 20, 17, 13), sun = subsolar(moment);
    const across = Math.round(W / 5.2), down = Math.round(across / (360 / (NORTH - SOUTH))), sp = W / across, r = sp * .3;
    const shades = ['', '', '', '', ''];
    for (let i = 0; i < down; i++) { const y = (i + .5) / down, lat = NORTH - y * (NORTH - SOUTH);
      for (let j = 0; j < across; j++) { const x = (j + .5) / across, lon = -180 + x * 360; if (landAmount(lat, lon) < .5) continue;
        const k = Math.min(Math.floor(daylight(elev(lat, lon, sun)) * 4.999), 4), cx = x * W, cy = y * Hm;
        shades[k] += `M${(cx - r).toFixed(1)} ${cy.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`; } }
    const dotsSvg = shades.map((d, k) => { const t = k / 4; return `<path d="${d}" fill="rgb(${Math.round(255 * (.44 + .5 * t))},${Math.round(255 * (.52 + .42 * t))},${Math.round(255 * (.86 + .08 * t))})" fill-opacity="${(.3 + .55 * t).toFixed(2)}"/>`; }).join('');
    // The night side and the line between day and night
    const dec = sun.lat, term = [];
    for (let lon = -180; lon <= 180; lon += 3) { const lat = Math.atan(-Math.cos((lon - sun.lon) * RAD) / Math.tan(dec * RAD)) / RAD; term.push([(lon + 180) / 360 * W, (NORTH - lat) / (NORTH - SOUTH) * Hm]); }
    const tline = term.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const night = dec < 0 ? `${tline} L${W} -40 L0 -40Z` : `${tline} L${W} ${Hm + 40} L0 ${Hm + 40}Z`;
    const pos = (lat, lon) => [(lon + 180) / 360 * 100, (NORTH - lat) / (NORTH - SOUTH) * 100];
    const sp0 = pos(sun.lat, sun.lon);
    const pins = [[51.5, -.13, 'London', '17:13', 'here', 'l', 1], [59.44, 24.75, 'Tallinn', '19:13', '+2 hr', 'r'], [40.71, -74, 'New York', '12:13', '−5 hr', 'r'], [35.68, 139.7, 'Tokyo', '02:13', '+9 hr', 'l']];
    const pinHtml = pins.map(([la, lo, c, t, o, side, here]) => { const [x, y] = pos(la, lo); return `<i class="pin${here ? ' here' : ''}" style="left:${x}%;top:${y}%"></i><span class="lab${here ? ' here' : ''}" style="top:${y}%;${side === 'r' ? `left:calc(${x}% + 11px)` : `right:calc(${100 - x}% + 11px)`}"><b>${c}</b> <span>${t}</span> <em>· ${o}</em></span>`; }).join('');
    // The two-day ruler, daylight in amber
    const x0 = 7, span = 46, xh = h => (h - x0) / span * 1000;
    let ticks = ''; for (let h = 8; h <= 52; h++) { const x = xh(h), hr = h % 24, tall = hr === 0 ? 15 : hr % 6 === 0 ? 10 : 5; ticks += `<rect x="${x - .5}" y="14" width="1" height="${tall}" fill="rgba(255,255,255,${hr === 0 ? .6 : hr % 6 === 0 ? .4 : .2})" vector-effect="non-scaling-stroke"/>`; if (hr === 0) ticks += `<text x="${x + 4}" y="36" font-size="10" font-weight="600" fill="rgba(255,255,255,.75)">Sat 21</text>`; else if (hr % 6 === 0) ticks += `<text x="${x}" y="38" font-size="9.5" text-anchor="middle" fill="rgba(255,255,255,.45)">${String(hr).padStart(2, '0')}</text>`; }
    const band = (a, b) => `<rect x="${xh(a)}" y="10" width="${xh(b) - xh(a)}" height="3" rx="1.5" fill="#E8B04A" opacity=".85"/>`;
    return dashWin(1100, 688, groupTabs('Your day', [DAY, 'Time']), `
      <div class="mkd-now"><span><b class="fig">17:13</b><small>Friday 20 November · GMT</small></span><em>${ic('plus')}Add a City</em></div>
      <div class="mkd-card" style="padding:12px 14px 6px"><div class="mkd-cap">World<span>Now</span></div>
        <div class="mkd-map mk-dw" style="--hc:#FFD60A;--d:.25s"><div class="mk-in"><svg viewBox="0 0 ${W} ${Hm}" aria-hidden="true"><defs><filter id="mknt" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="14"/></filter><radialGradient id="mksun"><stop offset="0" stop-color="#FFD60A" stop-opacity=".38"/><stop offset="1" stop-color="#FFD60A" stop-opacity="0"/></radialGradient></defs>
          ${[0, 23.44, -23.44].map(l => `<line x1="0" x2="${W}" y1="${((NORTH - l) / (NORTH - SOUTH) * Hm).toFixed(1)}" y2="${((NORTH - l) / (NORTH - SOUTH) * Hm).toFixed(1)}" stroke="rgba(255,255,255,${l ? .04 : .07})" stroke-dasharray="2 4"/>`).join('')}
          ${dotsSvg}<path d="${night}" fill="#0b0f26" opacity=".5" filter="url(#mknt)"/><path d="${tline}" fill="none" stroke="rgba(255,255,255,.2)"/>
          <circle class="sunh" cx="${sp0[0] / 100 * W}" cy="${sp0[1] / 100 * Hm}" r="26" fill="url(#mksun)"/><circle cx="${sp0[0] / 100 * W}" cy="${sp0[1] / 100 * Hm}" r="5.5" fill="#FFD60A"/></svg>${pinHtml}</div><i class="mk-hot"></i></div>
        <div class="mkd-tline"><svg viewBox="0 0 1000 46" preserveAspectRatio="none" aria-hidden="true">${band(7.5, 16.1)}${band(31.5, 40.1)}${ticks}<path d="M${xh(17.22) - 4} 44h8l-4-5z" fill="rgba(255,255,255,.7)"/><circle cx="${xh(17.22)}" cy="11.5" r="4.5" fill="#FF9F0A" stroke="#fff" stroke-width="1.4"/></svg><span class="nowp" style="left:${xh(17.22) / 10}%;top:-14px">Fri 17:13</span></div></div>`);
  };

  /* ---------- Monorail's strip: windows side by side at full size, sliding along as you move between them */
  const strip = () => `<div class="mks mks-hv">
    <div class="mks-mb"><b>Finder</b><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Window</span><span>Help</span>
      <span class="qr"><span class="rail"><i style="height:7px"></i><i style="height:13px"></i><i style="height:10px"></i></span>${ic('wifi')}${ic('bat', '', 'font-size:20px;stroke-width:1.5')}${ic('search')}${ic('cc')}<span>Sun 15 Nov  10:46</span></span></div>
    <div class="mks-isl">${ic('tray')}<span>2</span></div>
    <div class="mks-track">
    <div class="mks-w in1" style="left:10px;width:770px">
      <div class="mks-side"><div class="mks-tl"><i></i><i></i><i></i></div><b class="h6">Favourites</b><p>${ic('clockr')}Recents</p><p>${ic('app')}Applications</p><p>${ic('desk')}Desktop</p><p class="on">${ic('doc')}Documents</p><p>${ic('dl')}Downloads</p><b class="h6">Locations</b><p>${ic('cloudline')}iCloud Drive</p><b class="h6">Tags</b><p><i class="qt" style="--c:#FF453A"></i>Red</p><p><i class="qt" style="--c:#FF9F0A"></i>Orange</p><p><i class="qt" style="--c:#30D158"></i>Green</p><p><i class="qt" style="--c:#0A84FF"></i>Blue</p></div>
      <div class="mks-main"><div class="mks-bar">${ic('back')}${ic('fwd')}<b>Launch</b><span class="sp"></span><span class="qseg"><i class="on">${ic('grid22')}</i><i>${ic('list')}</i><i>${ic('cols')}</i><i>${ic('gallery')}</i></span>${ic('share')}${ic('tag')}${ic('search')}</div>
        <div class="mks-files"><div><span class="fd"></span>Design</div><div><span class="fd"></span>Press</div><div><span class="fd"></span>Screens</div><div><span class="dc"><b>TXT</b></span>Launch plan.txt</div><div><span class="dc qimg"></span><span class="qsel">Hero.png</span></div><div><span class="dc"><b>MD</b></span>Roadmap.md</div><div><span class="dc"><b>CSV</b></span>Press list.csv</div><div><span class="fd"></span>Archive</div></div></div></div>
    <div class="mks-w mks-pv bg in2" style="left:788px;width:640px">
      <div class="mks-bar"><span class="mks-tl"><i></i><i></i><i></i></span>${ic('cols')}<b>Hero.png</b><span class="sp"></span>${ic('info')}${ic('zoomout')}${ic('zoomin')}${ic('share')}${ic('pen')}${ic('rot')}</div>
      <div class="mks-photo"><div class="pic"></div></div></div>
    <div class="mks-w mks-notes bg" style="left:1436px;width:600px">
      <div class="nl"><div class="mks-tl" style="margin:4px 0 14px 4px"><i></i><i></i><i></i></div><div class="on"><b>Launch checklist</b><small>10:41 · Press list sent</small></div><div><b>Interview notes</b><small>Yesterday</small></div><div><b>Ideas</b><small>Friday</small></div></div>
      <div class="nb"><b class="h5">Launch checklist</b>Press list sent<br>Hero image final<br>Screens for the site<br>Release notes, short and plain</div></div>
    </div>
    <div class="mks-dock">${['files', 'safari', 'messages', 'mail', 'photos', 'music', 'calendar', 'notes', 'settings'].map((k, i) => app(k, i < 2 || k === 'photos' ? 'run' : '')).join('')}<b></b>${['code', 'terminal'].map(k => app(k, 'run')).join('')}</div></div>`;

  /* ---------- Shared with the other drawings (screens.js, mac.js) */
  window.GM = { I, ic, rings, dots, chart, roll, wx, app, flag, walk, setSeed: n => { seed = n; }, card, title, sysCard, storeCard, netCard, sw, sliders,
    panel: panelGlance, awake, evening, overview: overviewGlance, weather, time: timePage, groupTabs, dashWin, clk, landAmount, ROWS, ev,
    add: (name, fn, w, h) => { BUILD[name] = [fn, w, h]; } };

  /* ---------- Build, fit and animate */
  const BUILD = { panel: [panelGlance, 360, 650], strip: [strip, 1280, 720], overview: [overviewGlance, 1200, 720],
    weather: [weather, 1100, 688], time: [timePage, 1100, 688], awake: [awake, 360, 336], evening: [evening, 360, 262] };
  const start = () => {
  const stages = [...document.querySelectorAll('[data-mock]')];
  if (!stages.length) return;
  const zoomOK = CSS.supports && CSS.supports('zoom', '2');
  const fit = st => {
    const f = st.firstElementChild; if (!f) return;
    const w = +f.dataset.w, h = +f.dataset.h, aw = st.clientWidth, ah = st.clientHeight; if (!aw || !ah) return;
    const z = Math.min(aw / w, ah / h);
    if (zoomOK) f.style.zoom = z; else { f.style.transform = `scale(${z})`; f.style.marginRight = (w * z - w) + 'px'; f.style.marginBottom = (h * z - h) + 'px'; }
  };
  const rollAll = st => st.querySelectorAll('.rl').forEach((el, i) => {
    const txt = el.textContent, m = txt.match(/\d+(?:\.\d+)?/); if (!m) return;
    const to = parseFloat(m[0]), dp = (m[0].split('.')[1] || '').length, t0 = performance.now() + 200 + i * 40, ms = 1300;
    const step = now => { const k = Math.min(1, Math.max(0, (now - t0) / ms)), e = 1 - Math.pow(1 - k, 4); el.textContent = txt.replace(m[0], (to * e).toFixed(dp)); if (k < 1) requestAnimationFrame(step); else el.textContent = txt; };
    el.textContent = txt.replace(m[0], (0).toFixed(dp)); requestAnimationFrame(step);
  });
  // Each drawing is built when it comes near the screen (the live panel at once: its page wiring needs it), so the
  // page's first paint doesn't wait for drawings far below.
  const make = st => {
    if (st.dataset.built) return; st.dataset.built = '1';
    const b = BUILD[st.dataset.mock]; if (!b) return;
    st.innerHTML = `<div class="mk mk-fit" data-w="${b[1]}" data-h="${b[2]}" style="width:${b[1]}px;height:${b[2]}px">${b[0]()}</div>`;
    if (window.MR_LOGO && MR_LOGO.fill) MR_LOGO.fill(st);
    fit(st);
  };
  const eager = st => st.dataset.mock === 'panellive' || !('IntersectionObserver' in window);
  stages.filter(eager).forEach(make);
  const near = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { near.unobserve(e.target); make(e.target); } }), { rootMargin: '700px 0px' }) : null;
  if (near) stages.filter(st => !eager(st)).forEach(st => near.observe(st));
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(es => es.forEach(e => fit(e.target))); stages.forEach(st => ro.observe(st)); }
  else addEventListener('resize', () => stages.forEach(fit));
  if (reduce || !('IntersectionObserver' in window)) { stages.forEach(st => { make(st); st.classList.add('mk-on'); }); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); make(e.target); e.target.classList.add('mk-on'); rollAll(e.target); }), { threshold: .35 });
  stages.forEach(st => io.observe(st));
  // Live drawings rest when you can't see them: anything still moving pauses off screen
  const rest = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('mk-rest', !e.isIntersecting)), { threshold: 0 });
  stages.forEach(st => rest.observe(st));
  };
  // Every drawing script has run by DOMContentLoaded (they're deferred), so their screens are all in BUILD
  if (document.readyState === 'complete') start(); else document.addEventListener('DOMContentLoaded', start);
})();
