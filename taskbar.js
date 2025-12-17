    const sp = document.querySelectorAll('.sp');
    sp.forEach(btn => {
      btn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const name = btn.dataset.open;
        tm.value = btn.dataset.open; tm.load(e.clientX, e.clientY);
      });
    });

    document.addEventListener('click', (e) => {
        if(so === 't') {
          so = false; 
        } else {
          if (!tm.menu.contains(e.target) && e.target !== document.getElementById('tm-newwindow') && e.target !== document.getElementById('tm-close') && e.target !== document.getElementById('tm-tabs')) {
              tm.menu.style.display = 'none';
          }
        }
    });

    window.addEventListener('blur', (e) => {
        if (document.activeElement.tagName === 'IFRAME') {
            tm.menu.style.display = 'none'; tm.value = null;
        }
    });

    var so = false;

    var tm = {
      menu: document.getElementById('taskbar-menu'),
      value: null,
      load: (x, y, f) => {
        so = f || false;
        const tabs = document.getElementById('tm-tabs');
        tabs.innerHTML = '';
        windows[tm.value].forEach((w) => {
          const a = document.createElement('button'); a.className = 'tm-button';
          a.innerHTML = w.id.replace(/-/g, ' - ');
          a.onclick = () => {
            try {
              bringToFront(document.getElementById(`window-${w.id}`));
              tm.value = null;
              tm.menu.style.display = 'none';
            } catch (e) { console.error(e); }
          };
          tabs.appendChild(a);
        })
        const sw = window.innerWidth; const tw = Number(tm.menu.style.width.replace('px',''));
        const sh = window.innerHeight; const th = Number(tm.menu.style.height.replace('px',''));
        const bot = (sh - th - y + 10); const right = (x + 10);

        tm.menu.style.left = right + 'px'; 
        tm.menu.style.bottom = bot + 'px';
        tm.menu.style.display = 'block';
      },
      new: (ie) => {
        if (tm.value) openWindow(tm.value, true); tm.menu.style.display = 'none';
      },
      close: () => {
        windows[tm.value].forEach((w) => {
          const win = document.getElementById(`window-${w.id}`);
          win.remove();
        });
        windows[tm.value] = [];
        tm.value = null;
        tm.menu.style.display = 'none';
      }
    }
