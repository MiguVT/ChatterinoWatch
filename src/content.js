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
            chrome.runtime.sendMessage({ type: "location-updated", channel }, response => {
                if (chrome.runtime.lastError) {
                    console.error("[ChatterinoWatch] Failed to send message:", chrome.runtime.lastError);
                } else {
                    console.log("[ChatterinoWatch] Message sent successfully:", response);
                }
            });
        }
    }

    /**
     * Debounce function to limit the rate at which a function can fire.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The number of milliseconds to wait before allowing the function to be called again.
     * @returns {Function} The debounced function.
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedSendChannelToBackground = debounce(sendChannelToBackground, 300);

    let lastPath = location.pathname;
    const observer = new MutationObserver(() => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            debouncedSendChannelToBackground();
        }
    });

    observer.observe(document.querySelector('[data-a-target="video-player"]'), { childList: true, subtree: true });
    sendChannelToBackground();
})();
