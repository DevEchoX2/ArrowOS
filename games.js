/* ArrowOS Games */
(() => {
  //if (!root) return;

  // Define your stuff here
  const apps = [
      {
      id: 'partner',
      title: 'partner',
      icon: 'partnerimg/apps/ubyis.png',
      url: 'apps/partner.html'
    },
    {
      id: 'gallery',
      title: 'Gallery',
      icon: 'img/apps/gallery.png',
      url: 'apps/gallery.html'
    },
    {
      id: 'store',
      title: 'Store',
      icon: 'img/apps/store.png',
      url: 'apps/store.html'
    }
  ];

  const games = [
    {
      id: 'super-racing',
      title: 'Super Duper Epic Racing Simulator',
      thumb: 'img/games/super-racing.png',
      url: 'games/super-racing.html'
    },
    {
      id: 'blocky-plane',
      title: 'Blocky Plane Adventure',
      thumb: 'img/games/blocky-plane.png',
      url: 'games/blocky-plane.html'
    },
    {
      id: 'grand-extreme',
      title: 'Grand Extreme Racing',
      thumb: 'img/games/grand-extreme.png',
      url: 'games/grand-extreme.html'
    },
    {
      id: 'highway-traffic',
      title: 'Highway Traffic Racer',
      thumb: 'img/games/highway-traffic.png',
      url: 'games/highway-traffic.html'
    },
    {
      id: 'cookie-clicker',
      title: 'Cookie Clicker',
      thumb: 'img/games/cookie.png',
      url: 'games/cookie.html'
    },
    {
      id: 'snow-rider',
      title: 'Snow Rider 3D',
      thumb: 'img/games/snow-rider.png',
      url: 'games/snow-rider.html'
    }
  ];

  window.rend =(async (id, type) => {
    let root;
    switch (type) {
      case 'games':
        root = document.getElementById('grid-' + id);
        root.innerHTML = games.map(g => `
          <div class="game-card" data-url="${g.url}" data-title="${g.title}">
            <img class="game-thumb" src="${g.thumb}" alt="${g.title}" />
            <div class="game-info">
              <span class="game-title">${g.title}</span>
              <button class="game-launch"><i class="fa-solid fa-play"></i></button>
            </div>
          </div>
        `).join('');
        root.addEventListener('click', e => {
            const card = e.target.closest('.game-card');
            if (!card) return;
            const url = card.dataset.url;
            const title = card.dataset.title;

            const iframeWin = document.getElementById('window-iframe');
            const iframeView = document.getElementById('iframe-view');
            const iframeTitle = document.getElementById('iframe-title');

            iframeView.src = url;
            iframeTitle.textContent = title;
            iframeWin.classList.remove('window-hidden');

            // Bring iframe window to front
            const event = new CustomEvent('arrowos:open', { detail: { name: 'iframe' } });
            window.dispatchEvent(event);
        });
      break;
      case 'apps':
        root = document.getElementById('grid-' + id);

        root.innerHTML = apps.map(a => `
          <div class="app-card" data-url="${a.url}" data-title="${a.title}">
            <div class="app-icon"><img src="${a.icon}" alt="${a.title}" /></div>
            <div class="app-title">${a.title}</div>
          </div>
        `).join('');

        // Click handler
        root.addEventListener('click', e => {
          const card = e.target.closest('.app-card');
          if (!card) return;
          const url = card.dataset.url;
          const title = card.dataset.title;

          const iframeWin = document.getElementById('window-iframe');
          const iframeView = document.getElementById('iframe-view');
          const iframeTitle = document.getElementById('iframe-title');

          iframeView.src = url;
          iframeTitle.textContent = title;
          iframeWin.classList.remove('window-hidden');

          // Bring iframe window to front
          const event = new CustomEvent('arrowos:open', { detail: { name: 'iframe' } });
          window.dispatchEvent(event);
        });
      break;
      case 'browser':

        const win = document.getElementById(`window-${id}`);
        const iframe = document.getElementById(`view-${id}`);
        const urlInput = document.getElementById(`url-${id}`);
        const backBtn = win.querySelector('.nav-back');
        const forwardBtn = win.querySelector('.nav-forward');
        const reloadBtn = win.querySelector('.nav-reload');
        const tabsEl = win.querySelector('.tabs');
        const statusEl = document.getElementById(`status-${id}`);
        const openExternalBtn = document.getElementById(`open-external-${id}`);
        const firstTab = tabsEl.querySelector('.tab');
        let activeTab = null;   const TLDs = ['com','org','net','io','app','dev','edu','gov','co','us','uk','gg','xyz','site','tech','ai'];
        let setActiveTab = (async (tabEl) => {
          tabsEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          tabEl.classList.add('active');
          activeTab = tabEl;
        })
        let navigate = ((input) => {
          const url = normalizeURL(input);
          if (!url) { showStatus(); return; }
          hideStatus();
          urlInput.value = url;
          iframe.src = url;
          if (activeTab) {
            activeTab.dataset.url = url;
            activeTab.querySelector('span').textContent = url;
          }
        })
        let showStatus = (() => { statusEl.classList.remove('hidden'); });
        let hideStatus = (() => { statusEl.classList.add('hidden'); });

        iframe.addEventListener('load', () => { hideStatus(); });
        urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') navigate(urlInput.value); });
        backBtn.addEventListener('click', () => { iframe.contentWindow.history.back(); });
        forwardBtn.addEventListener('click', () => { iframe.contentWindow.history.forward(); });
        reloadBtn.addEventListener('click', () => { iframe.src = iframe.src; });
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
        openExternalBtn.addEventListener('click', () => {
          const current = urlInput.value.trim();
          if (current) window.open(current, '_blank', 'noopener,noreferrer');
        });
        if (firstTab) {
          setActiveTab(firstTab);
          urlInput.value = 'https://example.com';
          navigate(urlInput.value);
        }
        break;

      default:
      return null;
    }
  })

  //Browser functions
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


  
  /* Render game cards
  root.innerHTML = games.map(g => `
    <div class="game-card" data-url="${g.url}" data-title="${g.title}">
      <img class="game-thumb" src="${g.thumb}" alt="${g.title}" />
      <div class="game-info">
        <span class="game-title">${g.title}</span>
        <button class="game-launch"><i class="fa-solid fa-play"></i></button>
      </div>
    </div>
  `).join('');

  // Click handler
  root.addEventListener('click', e => {
    const card = e.target.closest('.game-card');
    if (!card) return;
    const url = card.dataset.url;
    const title = card.dataset.title;

    const iframeWin = document.getElementById('window-iframe');
    const iframeView = document.getElementById('iframe-view');
    const iframeTitle = document.getElementById('iframe-title');

    iframeView.src = url;
    iframeTitle.textContent = title;
    iframeWin.classList.remove('window-hidden');

    // Bring iframe window to front
    const event = new CustomEvent('arrowos:open', { detail: { name: 'iframe' } });
    window.dispatchEvent(event);
  });
  */
})();
