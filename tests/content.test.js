describe('Content Script Tests', () => {
  beforeEach(() => {
    // Clear the module cache to ensure fresh imports
    jest.resetModules()

    // Mock necessary browser APIs
    global.chrome = {
      runtime: {
        sendMessage: jest.fn().mockResolvedValue(), // Make it return a promise
      },
    }

    // Mock browser API for Firefox compatibility
    global.browser = global.chrome

    // Mock the location object to simulate browser navigation
    global.location = {
      pathname: '/initial-path',
      href: 'https://www.twitch.tv/testchannel',
    }

    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'info').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()

    // Set up a mock DOM structure for testing
    document.body.innerHTML = `
            <div data-a-target="video-player">
                <div id="test">Original</div>
            </div>
        `
  })

  afterEach(() => {
    // Clear all mocks after each test to ensure isolation
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('content script should handle DOM manipulation', () => {
    // Import the module which will execute initialization code
    const { processContent } = require('../src/content')

    // Call the function to test
    processContent()

    // Assert that DOM was manipulated correctly
    expect(document.getElementById('test').textContent).toBe('Processed')
  })

  test('content script should use cross-browser API', () => {
    const { sendMessageToBackground } = require('../src/content')
    const mockMessage = { type: 'test', payload: 'data' }

    // Call the function to test
    sendMessageToBackground(mockMessage)

    // Assert that the message was sent correctly
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(mockMessage)
  })

  test('content script should initialize without errors', () => {
    // Simply requiring the module should not throw errors
    expect(() => {
      require('../src/content')
    }).not.toThrow()
  })
})
