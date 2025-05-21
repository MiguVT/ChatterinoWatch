// Mock the chrome object globally
global.chrome = {
    runtime: {
        onMessage: {
            addListener: jest.fn(),
        },
        onInstalled: {
            addListener: jest.fn(),
        },
        sendMessage: jest.fn(),
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
