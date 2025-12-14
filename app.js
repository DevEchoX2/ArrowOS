/* ArrowOS Apps */
(() => {
  const root = document.getElementById('apps-grid');
  if (!root) return;

  // Define your apps here
  const apps = [
    {
      id: 'partner',
      title: 'partner',
      icon: 'partnerimg/apps/ubyis.png',
      url: 'apps/partner.html'
    },
    {
      id: 'silk',
      title: 'silk',
      icon: 'img/apps/silk.png',
      url: 'apps/silk.html'
    },
    {
      id: 'store',
      title: 'Store',
      icon: 'img/apps/store.png',
      url: 'apps/store.html'
    }
  ];

  // Render app cards
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
})();
