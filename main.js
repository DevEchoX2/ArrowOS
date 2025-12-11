/* ArrowOS main.js */
(() => {
  // Helpers
  const $ = (sel) => document.querySelector(sel);
  const on = (el, type, fn) => el && el.addEventListener(type, fn);

  const bootOverlay = $('#boot-overlay');
  const windows = {
    browser: $('#window-browser'),
    games: $('#window-games'),
    apps: $('#window-apps'),
    settings: $('#window-settings'),
    terminal: $('#window-terminal'),
    iframe: $('#window-iframe'), // generic iframe window
  };

  // --- Taskbar wiring ---
  document.querySelectorAll('.task-btn[data-open]').forEach(btn => {
    on(btn, 'click', () => openWindow(btn.dataset.open));
  });

  function openWindow(name) {
    Object.values(windows).forEach(w => w?.classList.add('window-hidden'));
    const win = windows[name];
    if (win) {
      win.classList.remove('window-hidden');
      bringToFront(win);
    }
  }

  function closeWindow(win) { win.classList.add('window-hidden'); }
  function minimizeWindow(win) { win.classList.add('window-hidden'); }
  function maximizeWindow(win) {
    if (!win) return;
    const isMax = win.dataset.maximized === 'true';
    if (isMax) {
      win.style.top = '80px';
      win.style.left = '80px';
      win.style.width = '820px';
      win.style.height = '520px';
      win.dataset.maximized = 'false';
    } else {
      win.style.top = '24px';
      win.style.left = '24px';
      win.style.width = (window.innerWidth - 48) + 'px';
      win.style.height = (window.innerHeight - 120) + 'px';
      win.dataset.maximized = 'true';
    }
    bringToFront(win);
  }

  function bringToFront(win) {
    const base = 10;
    const zList = Array.from(document.querySelectorAll('.window')).map(w => {
      const z = parseInt(getComputedStyle(w).zIndex || base, 10);
      return Number.isNaN(z) ? base : z;
    });
    const maxZ = zList.length ? Math.max(...zList) : base;
    win.style.zIndex = maxZ + 1;
  }

  // --- Window controls + dragging ---
  Object.values(windows).forEach(w => {
    if (!w) return;
    const min = w.querySelector('.win-min');
    const max = w.querySelector('.win-max');
    const close = w.querySelector('.win-close');
    on(min, 'click', () => minimizeWindow(w));
    on(max, 'click', () => maximizeWindow(w));
    on(close, 'click', () => closeWindow(w));

    const titlebar = w.querySelector('.window-titlebar');
    let dragging = false, startX = 0, startY = 0, rect = null;
    on(titlebar, 'mousedown', (e) => {
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      rect = w.getBoundingClientRect();
      document.body.style.userSelect = 'none';
      bringToFront(w);
    });
    on(window, 'mouseup', () => {
      dragging = false; document.body.style.userSelect = '';
    });
    on(window, 'mousemove', (e) => {
      if (!dragging || !rect) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      w.style.left = rect.left + dx + 'px';
      w.style.top = rect.top + dy + 'px';
    });
  });

  // --- Show desktop ---
  const showDesktop = $('#show-desktop');
  on(showDesktop, 'click', () => {
    Object.values(windows).forEach(w => w?.classList.add('window-hidden'));
  });

  // --- Clock ---
  const clock = $('#clock');
  function updateClock() {
    if (!clock) return;
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // --- Settings persistence ---
  const accentPicker = $('#accent-picker');
  const blurRange = $('#blur-range');
  const bgVideoToggle = $('#bg-video-toggle');
  const bgVideo = $('#bg-video');
  const bgImage = $('#bg-image');

  // Load saved settings
  try {
    const savedAccent = localStorage.getItem('arrowos-accent');
    if (savedAccent) {
      document.documentElement.style.setProperty('--accent', savedAccent);
      if (accentPicker) accentPicker.value = savedAccent;
    }
    const savedBlur = localStorage.getItem('arrowos-blur');
    if (savedBlur) {
      document.documentElement.style.setProperty('--blur', savedBlur + 'px');
      if (blurRange) blurRange.value = savedBlur;
    }
    const savedBgVideo = localStorage.getItem('arrowos-bg-video');
    if (savedBgVideo !== null) {
      const useVideo = savedBgVideo === 'true';
      if (bgVideoToggle) bgVideoToggle.checked = useVideo;
      if (bgVideo) bgVideo.style.display = useVideo ? 'block' : 'none';
      if (bgImage) bgImage.style.display = useVideo ? 'none' : 'block';
    }
  } catch {}

  // Save settings
  on(accentPicker, 'input', e => {
    const color = e.target.value;
    document.documentElement.style.setProperty('--accent', color);
    try { localStorage.setItem('arrowos-accent', color); } catch {}
  });
  on(blurRange, 'input', e => {
    const blur = e.target.value;
    document.documentElement.style.setProperty('--blur', blur + 'px');
    try { localStorage.setItem('arrowos-blur', blur); } catch {}
  });
  on(bgVideoToggle, 'change', e => {
    const useVideo = e.target.checked;
    if (bgVideo) bgVideo.style.display = useVideo ? 'block' : 'none';
    if (bgImage) bgImage.style.display = useVideo ? 'none' : 'block';
    try { localStorage.setItem('arrowos-bg-video', String(useVideo)); } catch {}
  });

  // --- Terminal ---
  const termInput = $('#terminal-input');
  const termOut = $('#terminal-output');
  function printLine(text) {
    if (!termOut) return;
    const line = document.createElement('div');
    line.textContent = text;
    termOut.appendChild(line);
    termOut.scrollTop = termOut.scrollHeight;
  }
  const commands = {
    help: () => printLine('commands: help, open <app>, theme <hex>, clear'),
    clear: () => { if (termOut) termOut.innerHTML = ''; },
    open: (arg) => {
      if (windows[arg]) { openWindow(arg); printLine(`opened ${arg}`); }
      else printLine(`unknown app: ${arg}`);
    },
    theme: (hex) => {
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
        document.documentElement.style.setProperty('--accent', hex);
        try { localStorage.setItem('arrowos-accent', hex); } catch {}
        printLine(`accent set to ${hex}`);
      } else printLine('invalid hex color');
    }
  };
  on(termInput, 'keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = e.target.value.trim();
      if (!raw) return;
      printLine(`arrowos $ ${raw}`);
      const [cmd, ...rest] = raw.split(/\s+/);
      const arg = rest.join(' ').trim();
      if (commands[cmd]) commands[cmd](arg);
      else printLine(`unknown command: ${cmd}`);
      e.target.value = '';
    }
  });

  // --- Icons initialization ---
  document.querySelectorAll('.icon').forEach(el => {
    try {
      const name = el.getAttribute('data-icon');
      const svg = window.ARROW_ICONS?.get?.(name);
      if (svg) el.innerHTML = svg;
    } catch {}
  });

  // --- Boot sequence (defensive) ---
  function endBootAndStart() {
    if (bootOverlay) bootOverlay.classList.add('hidden'); // ensure .hidden { display:none; }
    openWindow('apps'); // default entry
  }

  // Prefer DOMContentLoaded to avoid waiting for video
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // small delay for polish, but never block boot
      setTimeout(endBootAndStart, 300);
    });
  } else {
    setTimeout(endBootAndStart, 300);
  }
  // === New Settings Features ===

// Background upload
const bgUpload = document.getElementById('bg-upload');
if (bgUpload) {
  bgUpload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    if (file.type.startsWith('image/')) {
      document.body.style.backgroundImage = `url(${url})`;
      document.body.style.backgroundSize = 'cover';
      localStorage.setItem('arrowos-bg-image', url);
    } else if (file.type.startsWith('video/')) {
      const video = document.getElementById('bg-video');
      if (video) {
        video.src = url;
        video.style.display = 'block';
      }
      localStorage.setItem('arrowos-bg-video-file', url);
    }
  });
}

// Stealth mode (about:blank)
const stealthToggle = document.getElementById('stealth-toggle');
if (stealthToggle) {
  stealthToggle.addEventListener('change', e => {
    if (e.target.checked) {
      document.body.innerHTML = '';
      document.title = 'about:blank';
    } else {
      location.reload();
    }
  });
}

// Favicon switcher
const faviconSelect = document.getElementById('favicon-select');
if (faviconSelect) {
  // Populate dynamically (no hardcoding in HTML)
  const favicons = ["default.ico", "blank.ico", "favicon1.ico", "favicon2.ico"];
  favicons.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f.replace(".ico","");
    faviconSelect.appendChild(opt);
  });

  // Restore saved favicon
  const savedFavicon = localStorage.getItem('arrowos-favicon');
  if (savedFavicon) {
    faviconSelect.value = savedFavicon;
    applyFavicon(savedFavicon);
  }

  faviconSelect.addEventListener('change', e => {
    const choice = e.target.value;
    applyFavicon(choice);
    localStorage.setItem('arrowos-favicon', choice);
  });
}

function applyFavicon(choice) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = 'favicon/' + choice;
}
})();
