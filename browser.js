/* ArrowOS real browser */
(() => {
  const win = document.getElementById('window-browser');
  if (!win) return;

  const iframe = document.getElementById('browser-view');
  const urlInput = document.getElementById('browser-url');
  const backBtn = win.querySelector('.nav-back');
  const forwardBtn = win.querySelector('.nav-forward');
  const reloadBtn = win.querySelector('.nav-reload');
  const tabsEl = win.querySelector('.tabs');
  const statusEl = document.getElementById('browser-status');
  const openExternalBtn = document.getElementById('browser-open-external');

  const history = [];
  let index = -1;
  let pendingURL = null;
  let loadTimer = null;

  // Basic allowlist of TLDs to help heuristic detection of URLs
  const TLDs = ['com','org','net','io','app','dev','edu','gov','co','us','uk','gg','xyz','site','tech','ai'];

  function isLikelyURL(input) {
    try {
      // If user typed a full URL, this will parse
      new URL(input);
      return true;
    } catch {}
    // Heuristic: contains a dot and a known TLD
    const low = input.trim().toLowerCase();
    const parts = low.split('/');
    const host = parts[0].split('?')[0];
    const hasDot = host.includes('.');
    const endsTLD = TLDs.some(t => host.endsWith('.' + t) || host.endsWith(t));
    return hasDot && endsTLD;
  }

  function normalizeURL(input) {
    let raw = input.trim();
    if (!raw) return null;
    // Block dangerous schemes
    if (/^javascript:/i.test(raw)) return null;
    // If it looks like a URL but lacks scheme, add https://
    if (isLikelyURL(raw) && !/^https?:\/\//i.test(raw)) {
      raw = 'https://' + raw;
    }
    // If it’s not a URL, treat as a search query (DuckDuckGo)
    if (!isLikelyURL(raw)) {
      const q = encodeURIComponent(raw);
      raw = `https://duckduckgo.com/?q=${q}`;
    }
    return raw;
  }

  function navigate(input) {
    const url = normalizeURL(input);
    if (!url) {
      showStatus(`Invalid or blocked address.`);
      return;
    }
    pendingURL = url;
    hideStatus();

    // History management
    if (index < history.length - 1) history.splice(index + 1);
    history.push(url);
    index = history.length - 1;

    urlInput.value = url;
    iframe.src = url;

    // If site blocks framing, we may not get a normal load event; show fallback
    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      // If still pending after timeout, show overlay
      if (pendingURL === url) {
        showStatus('This site can’t be embedded here.');
      }
    }, 2500);
    updateNavButtons();
  }

  function updateNavButtons() {
    backBtn.disabled = index <= 0;
    forwardBtn.disabled = index >= history.length - 1;
  }

  function showStatus(msg) {
    statusEl.classList.remove('hidden');
    // Message already in HTML; keep minimal to avoid redundancy
  }
  function hideStatus() {
    statusEl.classList.add('hidden');
  }

  // Iframe events
  iframe.addEventListener('load', () => {
    // Any load should clear pending
    pendingURL = null;
    clearTimeout(loadTimer);
    hideStatus();
  });

  // Toolbar events
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      navigate(urlInput.value);
    }
  });
  backBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
      urlInput.value = history[index];
      iframe.src = history[index];
      updateNavButtons();
    }
  });
  forwardBtn.addEventListener('click', () => {
    if (index < history.length - 1) {
      index++;
      urlInput.value = history[index];
      iframe.src = history[index];
      updateNavButtons();
    }
  });
  reloadBtn.addEventListener('click', () => {
    if (index >= 0) {
      iframe.src = history[index];
    }
  });

  // Tabs (simple visual; single iframe instance)
  tabsEl.addEventListener('click', (e) => {
    const el = e.target.closest('.tab, .tab-add');
    if (!el) return;
    if (el.classList.contains('tab-add')) {
      const newTab = document.createElement('div');
      newTab.className = 'tab';
      newTab.innerHTML = '<i class="fa-regular fa-file"></i><span>New Tab</span>';
      tabsEl.insertBefore(newTab, tabsEl.querySelector('.tab-add'));
      tabsEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      newTab.classList.add('active');
      // Reset to blank on new tab
      history.length = 0; index = -1; updateNavButtons();
      urlInput.value = '';
      iframe.src = 'about:blank';
    } else {
      tabsEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
    }
  });

  // Open externally when blocked
  openExternalBtn.addEventListener('click', () => {
    const current = urlInput.value.trim();
    if (current) window.open(current, '_blank', 'noopener,noreferrer');
  });

  // Default home
  urlInput.value = 'https://example.com';
  navigate(urlInput.value);
})();
