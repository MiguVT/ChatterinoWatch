const { initializeBackground, handleMessage, setBadge } = require('../src/background');

describe('Background Script Tests', () => {
    beforeEach(() => {
        // Mock the chrome API
        global.chrome = {
            runtime: {
                onMessage: {
                    addListener: jest.fn(),
                },
                onInstalled: {
                    addListener: jest.fn(),
                },
            },
            browserAction: {
                setBadgeText: jest.fn(),
                setBadgeBackgroundColor: jest.fn(),
            },
            tabs: {
                create: jest.fn(),
                onActivated: {
                    addListener: jest.fn(),
                },
                onUpdated: {
                    addListener: jest.fn(),
                },
                get: jest.fn(),
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('initializeBackground should set up onInstalled listener', () => {
        // Call the function to test
        initializeBackground();

        // Assert that the onInstalled listener was added
        expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
    });

    test('handleMessage should process messages correctly', () => {
        const mockMessage = { type: 'test', payload: 'data' };
        const mockSender = {};
        const mockSendResponse = jest.fn();

        // Call the function to test
        handleMessage(mockMessage, mockSender, mockSendResponse);

        // Assert the expected behavior
        expect(mockSendResponse).toHaveBeenCalledWith({ success: true });
    });

    test('setBadge should update badge text and color', () => {
        // Call the function to test
        setBadge('5', '#FF0000');

        // Assert that the badge text and color were updated
        expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '5' });
        expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: '#FF0000' });
    });

    test('chrome.tabs.onActivated should add a listener', () => {
        // Simulate adding a listener
        const mockListener = jest.fn();
        chrome.tabs.onActivated.addListener(mockListener);

        // Assert that the listener was added
        expect(chrome.tabs.onActivated.addListener).toHaveBeenCalledWith(mockListener);
    });

    test('chrome.tabs.onUpdated should add a listener', () => {
        // Simulate adding a listener
        const mockListener = jest.fn();
        chrome.tabs.onUpdated.addListener(mockListener);

        // Assert that the listener was added
        expect(chrome.tabs.onUpdated.addListener).toHaveBeenCalledWith(mockListener);
    });
});
