/**
 * Background script for ChatterinoWatch.
 * Handles communication with Chatterino and browser events.
 */

const appName = "com.chatterino.chatterino";
let port = null;

/**
 * Manages the current Twitch channel state.
 */
const ChatterinoState = (() => {
    let currentChannel = null;

    return {
        getCurrentChannel: () => currentChannel,
        setCurrentChannel: (channel) => { currentChannel = channel; },
    };
})();

/**
 * Connect to Chatterino native messaging host.
 * @param {number} [retryCount=3] - Number of retry attempts for connection.
 * @returns {Port|null} The port for communication or null if connection fails.
 */
function connectPort(retryCount = 3) {
    if (port) return port;

    try {
        port = chrome.runtime.connectNative(appName);
        console.info("[ChatterinoWatch] Connected to Chatterino");

        port.onDisconnect.addListener(() => {
            console.info("[ChatterinoWatch] Disconnected from Chatterino", chrome.runtime.lastError);
            port = null;
        });
    } catch (error) {
        console.error("[ChatterinoWatch] Failed to connect to Chatterino:", error);
        port = null;

        if (retryCount > 0) {
            console.info("[ChatterinoWatch] Retrying connection...");
            setTimeout(() => connectPort(retryCount - 1), 1000);
        }
    }

    return port;
}

/**
 * Extract the Twitch channel name from a URL.
 * @param {string} url - The URL to extract the channel name from.
 * @returns {string|null} The extracted channel name or null if not found.
 */
function matchChannelName(url) {
    const regex = /^https?:\/\/(?:www\.)?twitch\.tv\/(?<channel>\w+)\/?(?:\?.*)?$/;
    const match = regex.exec(url);
    return match?.groups?.channel || null;
}

/**
 * Send channel information to Chatterino.
 * @param {string} channel - The channel name to send.
 * @param {number} winId - The window ID.
 */
function sendToChatterino(channel, winId) {
    if (!channel || channel === ChatterinoState.getCurrentChannel()) return;
    ChatterinoState.setCurrentChannel(channel);

    const data = {
        action: "select",
        type: "twitch",
        version: 0,
        winId: String(winId),
        name: channel,
    };

    const activePort = connectPort();
    if (activePort) {
        activePort.postMessage(data);
        console.info("[ChatterinoWatch] Sent to Chatterino:", data);
    }
}

/**
 * Debounce function to limit the rate at which a function can fire.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedSendToChatterino = debounce(sendToChatterino, 300);

/**
 * Initialize the background script.
 */
function initializeBackground() {
    chrome.runtime.onInstalled.addListener((details) => {
        if (details.reason === "install") {
            chrome.tabs.create({ url: "https://github.com/miguVT/ChatterinoWatch?tab=readme-ov-file#installation" });
        }
    });

    chrome.tabs.onActivated.addListener((activeInfo) => {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (chrome.runtime.lastError || !tab?.url) return;

            chrome.windows.get(tab.windowId, {}, (window) => {
                if (window.focused) {
                    const channel = matchChannelName(tab.url);
                    if (channel) {
                        debouncedSendToChatterino(channel, tab.windowId);
                    }
                }
            });
        });
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (!changeInfo.url) return;

        chrome.windows.get(tab.windowId, {}, (window) => {
            if (window.focused) {
                const channel = matchChannelName(changeInfo.url);
                if (channel) {
                    debouncedSendToChatterino(channel, tab.windowId);
                }
            }
        });
    });
}

/**
 * Update the browser action badge.
 * @param {string} text - The badge text.
 * @param {string} color - The badge background color.
 */
function setBadge(text, color) {
    chrome.browserAction.setBadgeText({ text });
    chrome.browserAction.setBadgeBackgroundColor({ color });
}

// Export the functions for testing and external use
module.exports = {
    initializeBackground,
    handleMessage: (message, sender, sendResponse) => {
        if (message.type === "test") {
            sendResponse({ success: true });
        }
    },
    setBadge,
};
