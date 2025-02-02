(function() {
    const matchChannelName = url => {
        const match = url.match(/^https?:\/\/(?:www\.)?twitch\.tv\/(\w+)\/?(?:\?.*)?$/);
        return match ? match[1] : null;
    };

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
