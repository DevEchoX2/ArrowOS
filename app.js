(() => {
  const root = document.getElementById('apps-grid');
  if (!root) return;

  const apps = [
    { id: 'music', title: 'Music', icon: 'img/music.png', url: 'apps/music.html' },
    { id: 'gallery', title: 'Gallery', icon: 'img/gallery.png', url: 'apps/gallery.html' },
    { id: 'store', title: 'Store', icon: 'img/store.png', url: 'apps/store.html' }
  ];

  root.innerHTML = apps.map(a => `
    <div class="app-card" data-url="${a.url}" data-title="${a.title}">
      <div class="app-icon"><img src="${a.icon}" alt="${a.title}" /></div>
      <div class="app-title">${a.title}</div>
    </div>
  `).join('');

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
  });
})();
