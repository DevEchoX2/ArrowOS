/* ArrowOS main.js */
(() => {
  // Helpers
  const $ = (sel) => document.querySelector(sel);
  const on = (el, type, fn) => el && el.addEventListener(type, fn);

  function gen(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length); result += characters.charAt(randomIndex);
    }
    return result;
  }


  let zIndexCounter = 50;
  const bootOverlay = $('#boot-overlay');
  window.windows = {
    browser: [],
    games: [],
    apps: [],
    settings: [],
    terminal: [],
    iframe: [], 
  }

  // --- Taskbar wiring ---
 document.querySelectorAll('.task-btn[data-open]').forEach(btn => {    
  on(btn, 'click', () => openWindow(btn.dataset.open));

});

  window.openWindow = ((name, force, num) => {
    const win = windows[name];

    if(win.length === 0 || force === true) {
      opentab(name)
    } else if (win.length === 1) {
      bringToFront(win[0].html);
    } else {
      tm.value = name;
      window.tm.load(ex, ey, 't');

    }
  })

  function opentab(name) {
    zIndexCounter += 1;
    let html; // html.style.zIndex = zIndexCounter;  style="z-index: ${zIndexCounter};"
    const g = gen(8);
    const id = `${name}-${g}`;

    switch (name) { //window-hidden
      case 'browser':
        html = `
          <section style="z-index: ${zIndexCounter};" id="window-${id}" class="window ">
            <header class="window-titlebar" data-tab="${id}">
              <div class="window-title"><i class="fa-solid fa-globe"></i><span>Browser - ${g}</span></div>
              <div class="window-actions">
                <button class="btn win-min"><i class="fa-regular fa-window-minimize"></i></button>
                <button class="btn win-max"><i class="fa-regular fa-window-maximize"></i></button>
                <button class="btn win-close"><i class="fa-regular fa-window-close"></i></button>
              </div>
            </header>
            <div class="window-content browser">
              <div class="tabs">
                <div class="tab active">
                  <i class="fa-solid fa-globe"></i><span>Home</span>
                  <button class="tab-close"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <button class="tab-add"><i class="fa-solid fa-plus"></i></button>
              </div>
              <div class="toolbar">
                <button class="btn nav-back"><i class="fa-solid fa-arrow-left"></i></button>
                <button class="btn nav-forward"><i class="fa-solid fa-arrow-right"></i></button>
                <button class="btn nav-reload"><i class="fa-solid fa-rotate-right"></i></button>
                <div class="urlbar">
                  <i class="fa-solid fa-lock"></i>
                  <input id="url-${id}" type="text" placeholder="Search or enter address" />
                </div>
              </div>
              <!-- Status overlay -->
              <div id="status-${id}" class="hidden">
                <div class="status-card">
                  <div class="status-title">This site can’t be embedded</div>
                  <div class="status-sub">It may block framing. Try opening externally.</div>
                  <button id="open-external-${id}" class="btn">Open in new tab</button>
                </div>
              </div>
              <iframe id="view-${id}"
                      class="browser-view"
                      src="about:blank"
                      sandbox="allow-forms allow-scripts allow-same-origin"
                      referrerpolicy="no-referrer"></iframe>
            </div>
          </section>
        `;
        break; 
        case 'games':
          html = `
            <section style="z-index: ${zIndexCounter};" id="window-${id}" class="games-grid window ">
              <header class="window-titlebar" data-tab="${id}">
                <div class="window-title"><i class="fa-solid fa-gamepad"></i><span>Games - ${g}</span></div>
                <div class="window-actions">
                  <button class="btn win-min"><i class="fa-regular fa-window-minimize"></i></button>
                  <button class="btn win-max"><i class="fa-regular fa-window-maximize"></i></button>
                  <button class="btn win-close"><i class="fa-regular fa-window-close"></i></button>
                </div>
              </header>
              <div class="window-content games"><div id="grid-${id}"></div></div>
            </section>
          `;
          break;
          case 'apps':
            html = `
              <section style="z-index: ${zIndexCounter};" id="window-${id}" class="apps-grid window ">
                <header class="window-titlebar" data-tab="${id}">
                  <div class="window-title"><i class="fa-solid fa-grid-2"></i><span>Apps - ${g}</span></div>
                  <div class="window-actions">
                    <button class="btn win-min"><i class="fa-regular fa-window-minimize"></i></button>
                    <button class="btn win-max"><i class="fa-regular fa-window-maximize"></i></button>
                    <button class="btn win-close"><i class="fa-regular fa-window-close"></i></button>
                  </div>
                </header>
                <div class="window-content apps"><div id="grid-${id}"></div></div>
              </section>
            `;
            break;
            case 'settings':
              html = `
                <section style="z-index: ${zIndexCounter};" id="window-${id}" class="window ">
                  <header class="window-titlebar" data-tab="${id}">
                    <div class="window-title"><i class="fa-solid fa-gear"></i><span>Settings - ${g}</span></div>
                    <div class="window-actions">
                      <button class="btn win-min"><i class="fa-regular fa-window-minimize"></i></button>
                      <button class="btn win-max"><i class="fa-regular fa-window-maximize"></i></button>
                      <button class="btn win-close"><i class="fa-regular fa-window-close"></i></button>
                    </div>
                  </header>
                  <div class="window-content settings">
                    <!-- Existing controls -->
                    <label>Accent color <input type="color" id="accent-picker" value="#7f5af0" /></label>
                    <label>Blur strength <input type="range" id="blur-range" min="0" max="30" value="16" /></label>
                    <label>Use video background <input type="checkbox" id="bg-video-toggle" checked /></label>

                    <label>Upload background 
                      <input type="file" id="bg-upload" accept=".jpg,.png,.mp4,.webm" />
                    </label>

                    <label>Stealth mode (about:blank) 
                      <input type="checkbox" id="stealth-toggle" />
                    </label>

                    <label>Favicon 
                      <select id="favicon-select"></select>
                    </label>
                  </div>
                </section>
              `;
              break;
      case 'terminal':
        html = `
          <section 
          style="z-index: ${zIndexCounter};" 
          id="window-${id}" class="window ">
            <header class="window-titlebar" data-tab="${id}">
              <div class="window-title"><i class="fa-solid fa-terminal"></i><span>Terminal - ${g}</span></div>
              <div class="window-actions">
                <button class="btn win-min"><i class="fa-regular fa-window-minimize"></i></button>
                <button class="btn win-max"><i class="fa-regular fa-window-maximize"></i></button>
                <button class="btn win-close"><i class="fa-regular fa-window-close"></i></button>
              </div>
            </header>
            <div class="window-content terminal">
              <div id="output-${id}"></div>
              <div class="terminal-input"><span class="prompt">arrowos $</span><input type="text" id="input-${id}" /></div>
            </div>
          </section>
        `;
        break;
        case 'iframe':
          html = `
            <section style="z-index: ${zIndexCounter};" class="window">
              <header class="window-titlebar" id="titlebar-${id}" data-tab="${id}">
                <div class="window-title"><i class="fa-solid fa-window-maximize"></i><span id="title-${id}">Apii - ${g}</span></div>
                <div class="window-actions">
                  <button class="btn win-min"><i class="fa-regular fa-window-minimize"></i></button>
                  <button class="btn win-max"><i class="fa-regular fa-window-maximize"></i></button>
                  <button class="btn win-close"><i class="fa-regular fa-window-close"></i></button>
                </div>
              </header>
              <div class="window-content">
                <iframe id="view-${id}" src="" frameborder="0" style="width:100%;height:100%;"></iframe>
              </div>
            </section>
          `;
          break;
      }
    document.getElementById('desktop').innerHTML += html;
    html = document.getElementById(`window-${id}`);
    windows[name].push({ html, id });
    const w = html;
    window.rend(id, name)
    // --- Window controls + dragging ---
    const min = w.querySelector('.win-min');
    const max = w.querySelector('.win-max');
    const close = w.querySelector('.win-close');
    min.addEventListener('click', () => minimizeWindow(w));
    max.addEventListener('click', () => maximizeWindow(w));
    close.addEventListener('click', () => closeWindow(w, name, id));

  }


  window.dragging = false; window.curr = null; window.rect = null; window.startX = 0; window.startY = 0;

function closeWindow(win, name, id) { 
    win.remove(); 
    const index = windows[name].findIndex(w => w.id === id);
        
    if (index !== -1) {
        windows[name].splice(index, 1); // Remove 1 item at that index
    }

}

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

  window.bringToFront = ((win) => {
    /*
    const base = 10;
    const zList = Array.from(document.querySelectorAll('.window')).map(w => {
      const z = parseInt(getComputedStyle(w).zIndex || base, 10);
      return Number.isNaN(z) ? base : z;
    });
    const maxZ = zList.length ? Math.max(...zList) : base;
    */
    zIndexCounter += 1;
    win.style.zIndex = zIndexCounter; win.style.display = 'block';
    win.classList.remove('window-hidden');
  })


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
    //openWindow('apps'); // default entry
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
    window.addEventListener('mouseup', () => {
      dragging = false; curr = null; document.body.style.userSelect = '';
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging || !rect) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      curr.style.left = rect.left + dx + 'px';
      curr.style.top = rect.top + dy + 'px';
    });
    var ex , ey;
    window.addEventListener('mousedown', (e) => {
      const titleBars = Array.from(document.querySelectorAll('.window-titlebar'));
      if (!titleBars.includes(e.target)) return;
      const id = e.target.getAttribute('data-tab')
      const w = document.getElementById(`window-${id}`);

      dragging = true; curr = w;
      startX = e.clientX; startY = e.clientY;
      rect = w.getBoundingClientRect();
      document.body.style.userSelect = 'none';
      bringToFront(w);
    })
    window.addEventListener('mousemove', (e) => {
      ex = e.clientX; ey = e.clientY;
    });
    /*
    document.getElementById(`titlebar-${id}`).addEventListener('mousedown', (e) => {
      dragging = true; curr = w;
      startX = e.clientX; startY = e.clientY;
      rect = html.getBoundingClientRect();
      document.body.style.userSelect = 'none';
      bringToFront(html);
    });
    */
