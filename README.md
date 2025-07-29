# ChatterinoWatch

**ChatterinoWatch** is a cross-browser extension that reports the Twitch channel you're currently watching to [Chatterino](https://github.com/Chatterino/chatterino2) (or any fork, most common forks are [Chatterino7](https://github.com/SevenTV/chatterino7), [technorino](https://github.com/2547techno/technorino), [dankerino](https://github.com/Mm2PL/dankerino) and [Chatterino Homies](https://chatterinohomies.com/)).
Unlike other extensions, it doesn't modify the Twitch UI in any way — it only sends channel information for seamless integration.

**Now fully compatible with both Chrome and Firefox!**

## Features

- 🌐 **Cross-Browser Support**: Works on Chrome, Firefox, and other Chromium-based browsers
- 🔒 **Manifest V3**: Built with the latest security and performance standards
- 🎯 **Automatic Detection**: Detects the Twitch channel being watched in real time
- ⚡ **Lightweight**: Uses only essential permissions and minimal resources
- 🔄 **Real-time Sync**: Communicates with Chatterino for seamless integration

## Supported Browsers

Any browser that supports Manifest V3 can run this extension - including Chrome, Firefox 109+, and other Chromium-based browsers.

## Installation

### From Browser Stores

- **Chrome Web Store**: [Install ChatterinoWatch](https://chromewebstore.google.com/detail/pnpdojeoploiomepdhikamokjmapkimh)
- **Firefox Add-ons**: [Install ChatterinoWatch](https://addons.mozilla.org/en-US/firefox/addon/chatterinowatch/)

### Manual Installation (Development, advanced users)

1. **Download the extension**:

   ```bash
   git clone https://github.com/miguVT/ChatterinoWatch.git
   cd ChatterinoWatch
   npm install
   npm run build
   ```

2. **Install in Chrome**:

   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/chrome` folder

3. **Install in Firefox**:
   - Open `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select `dist/firefox/manifest.json`

### Chatterino Setup

1. Open **Chatterino** and navigate to **Settings**
2. Go to the **Browser Integration** category
3. Under "Additional extension IDs," add the appropriate ID:

   **For Chrome:**

   ```txt
   pnpdojeoploiomepdhikamokjmapkimh
   ```

   **For Firefox:**

   ```txt
   chatterino-watch@chatterinowatch.miguvt.com
   ```

4. Click **OK** and you're all set!

## Development

See our [Development Guide](docs/DEVELOPMENT.md) for:

- Setting up the development environment
- Building for multiple browsers
- Testing and debugging
- Packaging for distribution

### Quick Start

```bash
# Install dependencies
npm install

# Start development mode (watches for changes)
npm run dev

# Build for all browsers
npm run build

# Run tests
npm test

# Package for distribution
npm run package:all
```

## Browser Compatibility Details

### Chrome/Chromium

- Uses native Chrome extension APIs
- Service worker background script
- Full Manifest V3 support

### Firefox

- Uses webextension-polyfill for API compatibility
- Background scripts (not service worker)
- Requires Firefox 109+ for full MV3 support

### Key Differences Handled

- API namespace (`chrome.*` vs `browser.*`)
- Background script types
- Extension ID formats
- Polyfill integration for Firefox

## Troubleshooting

### Common Issues

1. **Extension not connecting to Chatterino**:

   - Check Chatterino browser integration settings
   - Ensure correct extension ID is added
   - If you are using a unknown browser, check "Attach to any browser" in Chatterino settings

2. **Channel not updating**:

   - Check browser console for errors
   - Verify you're on a Twitch channel page
   - Try refreshing the page

3. **Firefox-specific issues**:
   - Ensure Firefox 109+ is installed
   - Check that the polyfill loaded correctly

### Getting Help

- Check the [Issues](https://github.com/miguVT/ChatterinoWatch/issues) page
- Read our [Development Guide](docs/DEVELOPMENT.md)

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Test on both Chrome and Firefox
4. Submit a pull request

## Acknowledgments

- Thanks to the Chatterino team for supporting additional extension IDs
- Mozilla webextension-polyfill for cross-browser compatibility
- The Twitch and browser extension communities

## License

This project is open-source and aims to enhance Chatterino's functionality for the Twitch community.

---

**Note**: This extension requires Chatterino to be running and properly configured with browser integration enabled.
