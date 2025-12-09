/* Lucide-like inline SVG icons map */
(function() {
  const s = (p) => `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const paths = {
    globe: s('<circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 0 20"></path><path d="M12 2a15.3 15.3 0 0 0 0 20"></path>'),
    gamepad: s('<rect x="2" y="8" width="20" height="8" rx="4"></rect><path d="M8 12h.01"></path><path d="M6 12h4"></path><path d="M16 12h.01"></path><path d="M18 12h-4"></path>'),
    grid: s('<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>'),
    settings: s('<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 0 1 7.04 3.4l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .67.39 1.27 1 1.54V12c-.61.27-1 .87-1 1.46z"></path>'),
    terminal: s('<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M7 8l4 4-4 4"></path><path d="M13 16h4"></path>'),
    file: s('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path>'),
    music: s('<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>'),
    image: s('<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path>'),
    'shopping-bag': s('<path d="M6 2l.01 4H18V2"></path><path d="M3 7h18l-2 13H5z"></path><path d="M9 11v1"></path><path d="M15 11v1"></path>'),
    clock: s('<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>'),
    info: s('<circle cx="12" cy="12" r="10"></circle><path d="M12 8h.01"></path><path d="M11 12h2v4h-2z"></path>')
  };

  const map = new Map(Object.entries(paths));
  window.ARROW_ICONS = {
    get: (name) => map.get(name) || '',
    has: (name) => map.has(name)
  };
})();
