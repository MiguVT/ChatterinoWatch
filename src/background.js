/**
 * On installation, open installation instructions
 */
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === "install") {
        chrome.tabs.create({ url: "https://github.com/miguVT/ChatterinoWatch?tab=readme-ov-file#installation" });
    }
});

const appName = "com.chatterino.chatterino";
let port = null;
let currentChannel = null; // Cache current channel

/**
 * Get the port for communication with Chatterino
 * @returns {Port} The port for communication
 */
function getPort() {
    if (!port) {
        connectPort();
    }
    return port;
}

/**
 * Connect to Chatterino
 * @returns {Port} The port for communication
 */
function connectPort() {
    if (port) return port; // Prevent multiple connections
    
    try {
        port = chrome.runtime.connectNative(appName);
        console.log("[ChatterinoWatch] Connected to Chatterino");

        port.onDisconnect.addListener(() => {
            console.log("[ChatterinoWatch] Disconnected from Chatterino", chrome.runtime.lastError);
            port = null;
        });
    } catch (error) {
        console.error("[ChatterinoWatch] Failed to connect to Chatterino:", error);
        port = null;
    }

    return port;
}

/**
 * Extract the Twitch channel name from the URL
 * @param {string} url - The URL to extract the channel name from
 * @returns {string|null} The extracted channel name or null if not found
 */
function matchChannelName(url) {
    const match = url.match(/^https?:\/\/(?:www\.)?twitch\.tv\/(\w+)\/?(?:\?.*)?$/);
    return match ? match[1] : null;
}

/**
 * Send channel information to Chatterino
 * @param {string} channel - The channel name to send
 * @param {number} winId - The window ID
 */
function sendToChatterino(channel, winId) {
    if (!channel || channel === currentChannel) return; // Skip if same channel
    currentChannel = channel;

    const data = {
        action: "select",
        type: "twitch",
        version: 0,
        winId: String(winId),
        name: channel
    };
    
    const activePort = connectPort();
    if (activePort) {
        activePort.postMessage(data);
        console.log("[ChatterinoWatch] Sent to Chatterino:", data);
    }
}

// Debounce function to limit the rate at which a function can fire
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedSendToChatterino = debounce(sendToChatterino, 300);

// Detect active tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        if (chrome.runtime.lastError) {
            console.error("[ChatterinoWatch] Failed to get tab:", chrome.runtime.lastError);
            return;
        }
        if (!tab || !tab.url) return;

        chrome.windows.get(tab.windowId, {}, window => {
            if (chrome.runtime.lastError) {
                console.error("[ChatterinoWatch] Failed to get window:", chrome.runtime.lastError);
                return;
            }
            if (!window.focused) return;
            
            let channel = matchChannelName(tab.url);
            if (channel) {
                debouncedSendToChatterino(channel, tab.windowId);
            }
        });
    });
});

// Detect URL changes in tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) return;
    
    chrome.windows.get(tab.windowId, {}, window => {
        if (chrome.runtime.lastError) {
            console.error("[ChatterinoWatch] Failed to get window:", chrome.runtime.lastError);
            return;
        }
        if (!window.focused) return;
        
        let channel = matchChannelName(changeInfo.url);
        if (channel) {
            debouncedSendToChatterino(channel, tab.windowId);
        }
    });
});
