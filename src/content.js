/**
 * Immediately-invoked function expression (IIFE) to avoid polluting the global scope.
 */
(function() {
    /**
     * Extract the Twitch channel name from the URL.
     * @param {string} url - The URL to extract the channel name from.
     * @returns {string|null} The extracted channel name or null if not found.
     */
    const matchChannelName = url => {
        const match = url.match(/^https?:\/\/(?:www\.)?twitch\.tv\/(\w+)\/?(?:\?.*)?$/);
        return match ? match[1] : null;
    };

    /**
     * Send the current channel information to the background script.
     */
    function sendChannelToBackground() {
        const channel = matchChannelName(window.location.href);
        if (channel) {
            chrome.runtime.sendMessage({ type: "location-updated", channel });
        }
    }

    let lastPath = location.pathname;
    const observer = new MutationObserver(() => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            sendChannelToBackground();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    sendChannelToBackground();
})();
