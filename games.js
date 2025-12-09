(() => {
  const root = document.getElementById('games-grid');
  if (!root) return;

  const games = [
    { id: 'neon-run', title: 'Neon Run', thumb: 'img/neon-run.jpg', url: 'games/neon-run.html' },
    { id: 'pixel-arena', title: 'Pixel Arena', thumb: 'img/pixel-arena.jpg', url: 'games/pixel-arena.html' },
    { id: 'orbit', title: 'Orbit', thumb: 'img/orbit.jpg', url: 'games/orbit.html' }
  ];

  root.innerHTML = games.map(g => `
    <div class="game-card" data-url="${g.url}" data-title="${g.title}">
      <img class="game-thumb" src="${g.thumb}" alt="${g.title}" />
      <div class="game-info">
        <div class="game-title">${g.title}</div>
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
  });
})();
