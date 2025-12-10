# ArrowOS

A web-based operating system interface with a modern desktop environment, featuring a browser, games, apps, settings, and terminal window system.

## Features

- **Desktop Environment** - A clean, modern OS-like interface with draggable windows
- **Browser** - Built-in web browser with tab management and URL navigation using Ultraviolet proxy
- **Games** - Dedicated games window with game grid display
- **Apps** - Application launcher with customizable apps (Music, Gallery, Store)
- **Settings** - System settings window
- **Terminal** - Terminal emulator window
- **Taskbar** - Quick access buttons to open different windows
- **Boot Animation** - Stylized boot sequence with progress indicator
- **Responsive Design** - Fully responsive layout that adapts to different screen sizes
- **Custom Theming** - Dark theme with customizable color scheme

## Project Structure

```
ArrowOS/
├── index.html              # Main HTML file
├── main.js                 # Core window management and taskbar logic
├── app.js                  # App grid and application launcher
├── bootloader.js           # Boot animation and initialization phases
├── browser.js              # Browser window functionality and tab management
├── games.js                # Games grid and game loading
├── icons.js                # Icon/emoji definitions
├── main.css                # Core styling
├── app.css                 # App window styles
├── browser.css             # Browser window styles
├── games.css               # Games window styles
├── img/                    # Background images and app icons
├── uv/                     # Ultraviolet proxy for web browsing
│   ├── uv.config.js       # Ultraviolet configuration
│   ├── uv.handler.js      # Request handler
│   ├── uv.client.js       # Client-side proxy
│   ├── uv.bundle.js       # Bundled Ultraviolet library
│   ├── uv.sw.js           # Service worker
│   └── sw.js              # Fallback service worker
└── sj/                     # ScramJet library (streaming utilities)
    ├── scramjet.all.js
    ├── scramjet.bundle.js
    └── scramjet.sync.js
```

## Key Components

### Windows System
- **Window Management** - Open, close, minimize, and maximize windows
- **Z-Index Handling** - Bring windows to front when clicked
- **Responsive Positioning** - Windows adapt to screen size

### Browser
- Tab-based browsing with add/close tab functionality
- Navigation buttons (back, forward, reload)
- URL bar with proxy integration
- Sandbox iframe for safety
- External link opener for restricted sites

### Applications
The apps system allows launching custom applications:
- Music player
- Gallery viewer
- App Store

### Boot Sequence
- Stylized loading overlay with spinner
- Progressive initialization phases:
  - Loading core
  - Initializing UI
  - Starting services
  - Applying theme
  - Done

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling and animations
- **JavaScript** - Vanilla JS (no frameworks)
- **Font Awesome** - Icon library
- **Ultraviolet** - Web proxy for browser functionality
- **ScramJet** - Streaming utility library

## Getting Started

1. Clone the repository
2. Serve the files using any static web server (e.g., `python -m http.server 8000`)
3. Open `index.html` in a web browser
4. The boot animation will play, then the desktop will be ready to use

## Customization

### Adding New Apps
Edit `app.js` to add new applications to the apps grid:

```javascript
const apps = [
  {
    id: 'myapp',
    title: 'My App',
    icon: 'img/apps/myapp.png',
    url: 'apps/myapp.html'
  }
];
```

### Adding Games
Edit `games.js` to add new games to the games grid.

### Changing Theme
Modify the CSS variables in the stylesheets to customize colors and appearance.

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
