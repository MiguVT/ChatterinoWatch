const { processContent, sendMessageToBackground } = require('../src/content');

describe('Content Script Tests', () => {
    beforeEach(() => {
        // Mock necessary browser APIs
        global.chrome = {
            runtime: {
                sendMessage: jest.fn(), // Mock the sendMessage API
            },
        };

        // Mock the location object to simulate browser navigation
        global.location = {
            pathname: '/initial-path',
        };

        // Set up a mock DOM structure for testing
        document.body.innerHTML = `
            <div data-a-target="video-player">
                <div id="test">Original</div>
            </div>
        `;
    });

    afterEach(() => {
        // Clear all mocks after each test to ensure isolation
        jest.clearAllMocks();
    });

    test('processContent should handle DOM manipulation', () => {
        // Call the function to test
        processContent();

        // Assert the expected DOM changes
        expect(document.getElementById('test').textContent).toBe('Processed');
    });

    test('sendMessageToBackground should send a message to the background script', () => {
        const mockMessage = { type: 'test', payload: 'data' };

        // Call the function to test
        sendMessageToBackground(mockMessage);

        // Assert that the message was sent correctly
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(mockMessage);
    });
});
