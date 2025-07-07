/**
 * Content script for ChatterinoWatch.
 * Observes Twitch page changes and communicates with the background script.
 * Cross-browser compatible using webextension-polyfill.
 */

// Use browser API (works with polyfill for Chrome)
const browserAPI = typeof browser !== 'undefined' ? browser : chrome

/**
 * Extract the Twitch channel name from the URL.
 * @param {string} url - The URL to extract the channel name from.
 * @returns {string|null} The extracted channel name or null if not found.
 */
function matchChannelName(url) {
  const regex = /^https?:\/\/(?:www\.)?twitch\.tv\/(\w+)\/?(?:\?.*)?$/
  const match = regex.exec(url)
  return match ? match[1] : null
}

/**
 * Send the current channel information to the background script.
 */
async function sendChannelToBackground() {
  const channel = matchChannelName(window.location.href)
  if (channel) {
    try {
      const response = await browserAPI.runtime.sendMessage({
        type: 'location-updated',
        channel,
      })
      console.info('[ChatterinoWatch] Message sent successfully:', response)
    } catch (error) {
      console.error('[ChatterinoWatch] Failed to send message:', error)
    }
  }
}

/**
 * Debounce function to limit the rate at which a function can fire.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const debouncedSendChannelToBackground = debounce(sendChannelToBackground, 300)

/**
 * Initialize the MutationObserver to monitor Twitch page changes.
 */
function initializeObserver() {
  const videoPlayerElement = document.querySelector('[data-a-target="video-player"]')
  if (videoPlayerElement) {
    const observer = new MutationObserver(() => {
      if (location.pathname !== lastPath) {
        lastPath = location.pathname
        debouncedSendChannelToBackground()
      }
    })

    observer.observe(videoPlayerElement, { childList: true, subtree: true })
  } else {
    console.warn('[ChatterinoWatch] Video player element not found. Observer not initialized.')
  }
}

let lastPath = location.pathname
initializeObserver()
sendChannelToBackground()

/**
 * Process the content of the page (mock implementation for testing).
 */
function processContent() {
  const testElement = document.getElementById('test')
  if (testElement) {
    testElement.textContent = 'Processed'
  }
}

/**
 * Send a message to the background script (mock implementation for testing).
 * @param {Object} message - The message to send.
 */
function sendMessageToBackground(message) {
  browserAPI.runtime.sendMessage(message)
}

// Export the functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    processContent,
    sendMessageToBackground,
  }
}
