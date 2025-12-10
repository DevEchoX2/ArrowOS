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

  // Track active tab
  let activeTab = null;

  // Basic allowlist of TLDs
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
    hideStatus();
    urlInput.value = url;
    iframe.src = url;
    if (activeTab) {
      activeTab.dataset.url = url;
      activeTab.querySelector('span').textContent = url;
    }
  }

  function showStatus() { statusEl.classList.remove('hidden'); }
  function hideStatus() { statusEl.classList.add('hidden'); }

  iframe.addEventListener('load', () => { hideStatus(); });

  // Toolbar events
  urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') navigate(urlInput.value); });
  backBtn.addEventListener('click', () => { iframe.contentWindow.history.back(); });
  forwardBtn.addEventListener('click', () => { iframe.contentWindow.history.forward(); });
  reloadBtn.addEventListener('click', () => { iframe.src = iframe.src; });

  // Tabs logic
  tabsEl.addEventListener('click', e => {
    const addBtn = e.target.closest('.tab-add');
    const tabEl = e.target.closest('.tab');
    const closeBtn = e.target.closest('.tab-close');

    if (addBtn) {
      const newTab = document.createElement('div');
      newTab.className = 'tab';
      newTab.innerHTML = '<i class="fa-regular fa-file"></i><span>New Tab</span><button class="tab-close"><i class="fa-solid fa-xmark"></i></button>';
      tabsEl.insertBefore(newTab, addBtn);
      setActiveTab(newTab);
      urlInput.value = '';
      iframe.src = 'about:blank';
      return;
    }

    if (closeBtn && tabEl) {
      const isActive = tabEl.classList.contains('active');
      tabEl.remove();
      if (isActive) {
        const remaining = tabsEl.querySelector('.tab');
        if (remaining) {
          setActiveTab(remaining);
          urlInput.value = remaining.dataset.url || '';
          iframe.src = remaining.dataset.url || 'about:blank';
        } else {
          activeTab = null;
          urlInput.value = '';
          iframe.src = 'about:blank';
        }
      }
      return;
    }

    if (tabEl && !closeBtn) {
      setActiveTab(tabEl);
      urlInput.value = tabEl.dataset.url || '';
      iframe.src = tabEl.dataset.url || 'about:blank';
    }
  });

  function setActiveTab(tabEl) {
    tabsEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
    activeTab = tabEl;
  }

  openExternalBtn.addEventListener('click', () => {
    const current = urlInput.value.trim();
    if (current) window.open(current, '_blank', 'noopener,noreferrer');
  });

  // Initialize with one tab
  const firstTab = tabsEl.querySelector('.tab');
  if (firstTab) {
    setActiveTab(firstTab);
    urlInput.value = 'https://example.com';
    navigate(urlInput.value);
  }
})();
