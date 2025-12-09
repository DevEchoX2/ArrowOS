/* Optional: granular boot phases separated from main.js */
(() => {
  const bootOverlay = document.getElementById('boot-overlay');
  const sub = bootOverlay.querySelector('.boot-sub');

  const phases = [
    'Loading core...',
    'Initializing UI...',
    'Starting services...',
    'Applying theme...',
    'Done.'
  ];
  let i = 0;
  const tick = () => {
    sub.textContent = phases[i];
    i++;
    if (i < phases.length) setTimeout(tick, 500);
    else setTimeout(() => bootOverlay.classList.add('hidden'), 400);
  };
  tick();
})();
