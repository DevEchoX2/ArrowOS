/* ArrowOS main.js */
(() => {
  const bootOverlay = document.getElementById('boot-overlay');
  const windows = {
    browser: document.getElementById('window-browser'),
    games: document.getElementById('window-games'),
    apps: document.getElementById('window-apps'),
    settings: document.getElementById('window-settings'),
    terminal: document.getElementById('window-terminal'),
    iframe: document.getElementById('window-iframe'), // generic iframe window
  };

  // --- Taskbar wiring ---
  document.querySelectorAll('.task-btn[data-open]').forEach(btn => {
    btn.addEventListener('click', () => openWindow(btn.dataset.open));
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
    const maxZ = Math.max(...Array.from(document.querySelectorAll('.window'))
      .map(w => parseInt(getComputedStyle(w).zIndex || base, 10)), base);
    win.style.zIndex = maxZ + 1;
  }

  // --- Window controls + dragging ---
  Object.values(windows).forEach(w => {
    if (!w) return;
    const min = w.querySelector('.win-min');
    const max = w.querySelector('.win-max');
    const close = w.querySelector('.win-close');
    min?.addEventListener('click', () => minimizeWindow(w));
    max?.addEventListener('click', () => maximizeWindow(w));
    close?.addEventListener('click', () => closeWindow(w));

    const titlebar = w.querySelector('.window-titlebar');
    let dragging = false, startX = 0, startY = 0, rect = null;
    titlebar?.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      rect = w.getBoundingClientRect();
      document.body.style.userSelect = 'none';
    });
    window.addEventListener('mouseup', () => {
      dragging = false; document.body.style.userSelect = '';
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      w.style.left = rect.left + dx + 'px';
      w.style.top = rect.top + dy + 'px';
    });
  });

  // --- Show desktop ---
  document.getElementById('show-desktop').addEventListener('click', () => {
    Object.values(windows).forEach(w => w?.classList.add('window-hidden'));
  });

  // --- Clock ---
  const clock = document.getElementById('clock');
  const updateClock = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  updateClock();
  setInterval(updateClock, 1000);

  // --- Settings persistence ---
  const accentPicker = document.getElementById('accent-picker');
  const blurRange = document.getElementById('blur-range');
  const bgVideoToggle = document.getElementById('bg-video-toggle');
  const bgVideo = document.getElementById('bg-video');
  const bgImage = document.getElementById('bg-image');

  // Load saved settings
  const savedAccent = localStorage.getItem('arrowos-accent');
  if (savedAccent) {
    document.documentElement.style.setProperty('--accent', savedAccent);
    accentPicker.value = savedAccent;
  }
  const savedBlur = localStorage.getItem('arrowos-blur');
  if (savedBlur) {
    document.documentElement.style.setProperty('--blur', savedBlur + 'px');
    blurRange.value = savedBlur;
  }
  const savedBgVideo = localStorage.getItem('arrowos-bg-video');
  if (savedBgVideo !== null) {
    const useVideo = savedBgVideo === 'true';
    bgVideoToggle.checked = useVideo;
    bgVideo.style.display = useVideo ? 'block' : 'none';
    bgImage.style.display = useVideo ? 'none' : 'block';
  }

  // Save settings
  accentPicker.addEventListener('input', e => {
    const color = e.target.value;
    document.documentElement.style.setProperty('--accent', color);
    localStorage.setItem('arrowos-accent', color);
  });
  blurRange.addEventListener('input', e => {
    const blur = e.target.value;
    document.documentElement.style.setProperty('--blur', blur + 'px');
    localStorage.setItem('arrowos-blur', blur);
  });
  bgVideoToggle.addEventListener('change', e => {
    const useVideo = e.target.checked;
    bgVideo.style.display = useVideo ? 'block' : 'none';
    bgImage.style.display = useVideo ? 'none' : 'block';
    localStorage.setItem('arrowos-bg-video', useVideo);
  });

  // --- Terminal ---
  const termInput = document.getElementById('terminal-input');
  const termOut = document.getElementById('terminal-output');
  function printLine(text) {
    const line = document.createElement('div');
    line.textContent = text;
    termOut.appendChild(line);
    termOut.scrollTop = termOut.scrollHeight;
  }
  const commands = {
    help: () => printLine('commands: help, open <app>, theme <hex>, clear'),
    clear: () => { termOut.innerHTML = ''; },
    open: (arg) => {
      if (windows[arg]) { openWindow(arg); printLine(`opened ${arg}`); }
      else printLine(`unknown app: ${arg}`);
    },
    theme: (hex) => {
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
        document.documentElement.style.setProperty('--accent', hex);
        localStorage.setItem('arrowos-accent', hex);
        printLine(`accent set to ${hex}`);
      } else printLine('invalid hex color');
    }
  };
  termInput.addEventListener('keydown', (e) => {
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
    const name = el.getAttribute('data-icon');
    const svg = window.ARROW_ICONS?.get(name);
    if (svg) el.innerHTML = svg;
  });

  // --- Boot sequence ---
  setTimeout(() => {
    bootOverlay.classList.add('hidden');
    openWindow('apps'); // default entry
  }, 2600);
})();
