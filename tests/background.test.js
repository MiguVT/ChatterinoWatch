describe('Background Script Tests', () => {
  beforeEach(() => {
    // Clear the module cache to ensure fresh imports
    jest.resetModules()

    // Mock the chrome API for cross-browser compatibility
    global.chrome = {
      runtime: {
        onMessage: {
          addListener: jest.fn(),
        },
        onInstalled: {
          addListener: jest.fn(),
        },
        lastError: null,
        connectNative: jest.fn(),
      },
      tabs: {
        create: jest.fn(),
        onActivated: {
          addListener: jest.fn(),
        },
        onUpdated: {
          addListener: jest.fn(),
        },
        get: jest.fn().mockResolvedValue({ url: 'https://www.twitch.tv/test' }),
      },
      windows: {
        get: jest.fn().mockResolvedValue({ focused: true }),
      },
    }

    // Mock browser API for Firefox compatibility
    global.browser = global.chrome

    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'info').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()

    // Now require the module after mocks are set up
    require('../src/background')
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('background script should initialize event listeners', () => {
    // The background script auto-initializes, so just check that listeners were added
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled()
    expect(chrome.tabs.onActivated.addListener).toHaveBeenCalled()
    expect(chrome.tabs.onUpdated.addListener).toHaveBeenCalled()
  })

  test('chrome APIs should be properly mocked', () => {
    // Verify our mocks are working
    expect(chrome.tabs.create).toBeDefined()
    expect(chrome.runtime.onInstalled.addListener).toBeDefined()
  })
})
