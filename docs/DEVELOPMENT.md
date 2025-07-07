# Cross-Browser Development Guide

This guide covers development, testing, and packaging for both Chrome and Firefox.

## Prerequisites

Install dependencies:

```bash
npm install
```

## Development

### Start Development Mode

```bash
npm run dev
```

This will:

- Build for both Chrome and Firefox
- Watch for file changes
- Automatically rebuild when files change

### Manual Build

```bash
# Build for all browsers
npm run build

# Build for specific browser
npm run build:chrome
npm run build:firefox
```

## Project Structure

```
ChatterinoWatch/
├── src/                    # Source files
│   ├── manifest.json      # Base manifest
│   ├── background.js      # Background script
│   ├── content.js         # Content script
│   └── icons/             # Extension icons
├── dist/                  # Built extensions
│   ├── chrome/           # Chrome-specific build
│   └── firefox/          # Firefox-specific build
├── scripts/              # Build scripts
├── docs/                 # Documentation
└── tests/                # Test files
```

## Testing

### Unit Tests

```bash
npm test
```

### Browser Testing

#### Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist/chrome` folder

#### Firefox

1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `dist/firefox/manifest.json`

### Testing Extension

1. Install Chatterino
2. Load extension in browser
3. Navigate to Twitch channel
4. Check Chatterino for channel updates

## Packaging

### Create Distribution Packages

```bash
# Package both browsers
npm run package:all

# Package specific browser
npm run package:chrome
npm run package:firefox
```

This creates:

- `dist/chatterino-watch-chrome.zip` (for Chrome Web Store)
- `dist/chatterino-watch-firefox.xpi` (for Firefox Add-ons)

### Manual Packaging

#### Chrome (.zip)

```bash
cd dist/chrome
zip -r ../chatterino-watch-chrome.zip .
```

#### Firefox (.xpi)

```bash
cd dist/firefox
zip -r ../chatterino-watch-firefox.xpi .
```

## Browser-Specific Differences

### Manifest Differences

| Feature            | Chrome           | Firefox                               |
| ------------------ | ---------------- | ------------------------------------- |
| Extension ID       | Auto-generated   | Manual in `browser_specific_settings` |
| API Namespace      | `chrome.*`       | `browser.*` (with polyfill)           |
| Background Scripts | `service_worker` | `scripts` array                       |
| Polyfill Required  | No               | Yes (`browser-polyfill.min.js`)       |

### API Differences

| API              | Chrome           | Firefox           | Solution     |
| ---------------- | ---------------- | ----------------- | ------------ |
| Runtime          | `chrome.runtime` | `browser.runtime` | Use polyfill |
| Tabs             | `chrome.tabs`    | `browser.tabs`    | Use polyfill |
| Action           | `chrome.action`  | `browser.action`  | Use polyfill |
| Native Messaging | `chrome.runtime` | `browser.runtime` | Use polyfill |

## Known Issues and Limitations

### Chrome

- ✅ Full MV3 support
- ✅ Native messaging works well
- ✅ Service worker background

### Firefox

- ✅ MV3 support (Firefox 109+)
- ✅ Cross-browser API polyfill
- ⚠️ Background scripts (not service worker)
- ⚠️ Requires webextension-polyfill

### Cross-Browser Considerations

1. **Promise vs Callback APIs**: Use webextension-polyfill for consistent Promise-based APIs
2. **Manifest Format**: Build script handles browser-specific differences
3. **Extension IDs**: Firefox requires manual ID in manifest
4. **API Differences**: Badge/action APIs unified via browserAPI abstraction

## Deployment

### Chrome Web Store

1. Create developer account
2. Upload `chatterino-watch-chrome.zip`
3. Fill out store listing
4. Submit for review

### Firefox Add-ons (AMO)

1. Create developer account at addons.mozilla.org
2. Upload `chatterino-watch-firefox.xpi`
3. Choose signing options
4. Submit for review

### Self-Distribution

- Chrome: Users can install via drag-and-drop (requires developer mode)
- Firefox: Users can install signed .xpi files directly

## Debugging

### Chrome DevTools

```javascript
// Background script console
chrome.runtime.getBackgroundPage(console.log);

// Extension pages
chrome://extensions/ → Details → Inspect views
```

### Firefox DevTools

```javascript
// Background script console
about:debugging → This Firefox → Extension → Inspect

// Console logs
Browser Console (Ctrl+Shift+J)
```

## Performance Considerations

1. **Service Worker Lifecycle**: Chrome background scripts are service workers that may terminate
2. **Memory Usage**: Firefox background scripts persist longer
3. **Event Listeners**: Ensure proper cleanup in both environments
4. **Cross-browser APIs**: Minimal overhead from polyfill layer
