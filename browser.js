/* Browser mock interactions */
(() => {
  const win = document.getElementById('window-browser');
  if (!win) return;

  const iframe = win.querySelector('.browser-view');
  const urlInput = win.querySelector('.urlbar input');
  const back = win.querySelector('.nav-back');
  const forward = win.querySelector('.nav-forward');
  const reload = win.querySelector('.nav-reload');
  const tabs = win.querySelector('.tabs');

  const history = [];
  let index = -1;

  function navigate(url) {
    const safe = url.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    iframe.setAttribute('srcdoc', `<h1>${safe}</h1><p>This is a mock browser. Implement real navigation later.</p>`);
    if (index < history.length - 1) history.splice(index + 1);
    history.push(url); index = history.length - 1;
  }

  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') navigate(urlInput.value.trim());
  });
  back.addEventListener('click', () => {
    if (index > 0) { index--; navigate(history[index]); }
  });
  forward.addEventListener('click', () => {
    if (index < history.length - 1) { index++; navigate(history[index]); }
  });
  reload.addEventListener('click', () => {
    if (index >= 0) navigate(history[index]);
  });

  tabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab, .tab-add');
    if (!tab) return;
    if (tab.classList.contains('tab-add')) {
      const newTab = document.createElement('div');
      newTab.className = 'tab';
      newTab.innerHTML = '<i class="fa-regular fa-file"></i><span>New Tab</span>';
      tabs.insertBefore(newTab, tabs.querySelector('.tab-add'));
    } else {
      tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    }
  });
})();
