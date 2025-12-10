/* ArrowOS Browser */
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

  const TLDs = ['com','org','net','io','app','dev','edu','gov','co','us','uk','gg','xyz','site','tech','ai'];

  function isLikelyURL(input) {
    try { new URL(input); return true; } catch {}
    const low = input.trim().toLowerCase();
    const host = low.split('/')[0].split('?')[0];
    const hasDot = host.includes('.');
    const endsTLD = TLDs.some(t => host.endsWith('.' + t) || host.endsWith(t));
    return hasDot && endsTLD;
  }

  function normalizeURL(input) {
    let raw = input.trim();
    if (!raw) return null;
    if (/^javascript:/i.test(raw)) return null;
    if (isLikelyURL(raw) && !/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
    if (!isLikelyURL(raw)) raw = `https://duckduckgo.com/?q=${encodeURIComponent(raw)}`;
    return raw;
  }

  function navigate(input) {
    const url = normalizeURL(input);
    if (!url) { showStatus(); return; }
    pendingURL = url;
    hideStatus();

    if (index < history.length - 1) history.splice(index + 1);
    history.push(url);
    index = history.length - 1;

    urlInput.value = url;
    iframe.src = url;

    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      if (pendingURL === url) showStatus();
    }, 2500);
    updateNavButtons();
  }

  function updateNavButtons() {
    backBtn.disabled = index <= 0;
    forwardBtn.disabled = index >= history.length - 1;
  }

  function showStatus() { statusEl.classList.remove('hidden'); }
  function hideStatus() { statusEl.classList.add('hidden'); }

  iframe.addEventListener('load', () => {
    pendingURL = null;
    clearTimeout(loadTimer);
    hideStatus();
  });

  // Toolbar events
  urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') navigate(urlInput.value); });
  backBtn.addEventListener('click', () => {
    if (index > 0) { index--; urlInput.value = history[index]; iframe.src = history[index]; updateNavButtons(); }
  });
  forwardBtn.addEventListener('click', () => {
    if (index < history.length - 1) { index++; urlInput.value = history[index]; iframe.src = history[index]; updateNavButtons(); }
  });
  reloadBtn.addEventListener('click', () => { if (index >= 0) iframe.src = history[index]; });

  // Tabs (add + close)
  tabsEl.addEventListener('click', e => {
    const addBtn = e.target.closest('.tab-add');
    const tabEl = e.target.closest('.tab');
    const closeBtn = e.target.closest('.tab-close');

    if (addBtn) {
      const newTab = document.createElement('div');
      newTab.className = 'tab';
      newTab.innerHTML = '<i class="fa-regular fa-file"></i><span>New Tab</span><button class="tab-close"><i class="fa-solid fa-xmark"></i></button>';
      tabsEl.insertBefore(newTab, addBtn);
      tabsEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      newTab.classList.add('active');
      history.length = 0; index = -1; updateNavButtons();
      urlInput.value = ''; iframe.src = 'about:blank';
      return;
    }

    if (closeBtn && tabEl) {
      const isActive = tabEl.classList.contains('active');
      tabEl.remove();
      if (isActive) {
        const remaining = tabsEl.querySelector('.tab');
        if (remaining) {
          remaining.classList.add('active');
          urlInput.value = ''; iframe.src = 'about:blank';
        }
      }
      return;
    }

    if (tabEl && !closeBtn) {
      tabsEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tabEl.classList.add('active');
    }
  });

  openExternalBtn.addEventListener('click', () => {
    const current = urlInput.value.trim();
    if (current) window.open(current, '_blank', 'noopener,noreferrer');
  });

  // Default home
  urlInput.value = 'https://example.com';
  navigate(urlInput.value);
})();
