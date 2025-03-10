// On installation, open installation instructions
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === "install") {
        chrome.tabs.create({ url: "https://github.com/miguVT/ChatterinoWatch?tab=readme-ov-file#installation" });
    }
});


const appName = "com.chatterino.chatterino";
let port = null;
let currentChannel = null; // Cache current channel

// Get the port for communication with Chatterino
function getPort() {
    if (!port) {
        connectPort();
    }
    return port;
}

// Connect to Chatterino
function connectPort() {
    if (port) return port; // Prevent multiple connections
    
    port = chrome.runtime.connectNative(appName);
    console.log("[ChatterinoWatch] Connected to Chatterino");

    port.onDisconnect.addListener(() => {
        console.log("[ChatterinoWatch] Disconnected from Chatterino", chrome.runtime.lastError);
        port = null;
    });

    return port;
}

// Extract the Twitch channel name from the URL
function matchChannelName(url) {
    const match = url.match(/^https?:\/\/(?:www\.)?twitch\.tv\/(\w+)\/?(?:\?.*)?$/);
    return match ? match[1] : null;
}

// Send channel information to Chatterino
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
        
        // Close connection after sending
        setTimeout(() => {
            if (port) {
                port.disconnect();
                port = null;
            }
        }, 100);
    }
}

// Detect active tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        if (!tab || !tab.url) return;

        chrome.windows.get(tab.windowId, {}, window => {
            if (!window.focused) return;
            
            let channel = matchChannelName(tab.url);
            sendToChatterino(channel, tab.windowId);
        });
    });
});

// Detect URL changes in tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) return;
    
    chrome.windows.get(tab.windowId, {}, window => {
        if (!window.focused) return;
        
        let channel = matchChannelName(changeInfo.url);
        sendToChatterino(channel, tab.windowId);
    });
});