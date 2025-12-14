/* ArrowOS Games */
(() => {
  const root = document.getElementById('games-grid');
  if (!root) return;

  // Define your games here
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
      thumb: 'img/games/snowrider.png',
      url: 'games/snowrider.html'
    }
  ];

  // Render game cards
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
})();
