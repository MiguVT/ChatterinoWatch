/**
 * Background script for ChatterinoWatch.
 * Handles communication with Chatterino and browser events.
 * Cross-browser compatible using webextension-polyfill.
 */

// Use browser API (works with polyfill for Chrome)
const browserAPI = typeof browser !== 'undefined' ? browser : chrome

const appName = 'com.chatterino.chatterino'
let port = null

/**
 * Manages the current Twitch channel state.
 */
const ChatterinoState = (() => {
  let currentChannel = null

  return {
    getCurrentChannel: () => currentChannel,
    setCurrentChannel: (channel) => {
      currentChannel = channel
    },
  }
})()

/**
 * Connect to Chatterino application.
 * @param {number} [retryCount=3] - Number of retry attempts for connection.
 * @returns {Port|null} The port for communication or null if connection fails.
 */
function connectPort(retryCount = 3) {
  if (port) return port

  try {
    port = browserAPI.runtime.connectNative(appName)
    console.info('[ChatterinoWatch] Connected to Chatterino')

    port.onDisconnect.addListener(() => {
      console.info('[ChatterinoWatch] Disconnected from Chatterino', browserAPI.runtime.lastError)
      port = null
    })
  } catch (error) {
    console.error('[ChatterinoWatch] Failed to connect to Chatterino:', error)
    port = null

    if (retryCount > 0) {
      console.info('[ChatterinoWatch] Retrying connection...')
      setTimeout(() => connectPort(retryCount - 1), 1000)
    }
  }

  return port
}

/**
 * Extract the Twitch channel name from a URL.
 * @param {string} url - The URL to extract the channel name from.
 * @returns {string|null} The extracted channel name or null if not found.
 */
function matchChannelName(url) {
  const regex = /^https?:\/\/(?:www\.)?twitch\.tv\/(?<channel>\w+)\/?(?:\?.*)?$/
  const match = regex.exec(url)
  return match?.groups?.channel || null
}

/**
 * Send channel information to Chatterino.
 * @param {string} channel - The channel name to send.
 * @param {number} winId - The window ID.
 */
function sendToChatterino(channel, winId) {
  if (!channel || channel === ChatterinoState.getCurrentChannel()) return
  ChatterinoState.setCurrentChannel(channel)

  const data = {
    action: 'select',
    type: 'twitch',
    version: 0,
    winId: String(winId),
    name: channel,
  }

  const activePort = connectPort()
  if (activePort) {
    activePort.postMessage(data)
    console.info('[ChatterinoWatch] Sent to Chatterino:', data)
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

const debouncedSendToChatterino = debounce(sendToChatterino, 300)

/**
 * Initialize the background script.
 */
async function initializeBackground() {
  browserAPI.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      browserAPI.tabs.create({
        url: 'https://github.com/miguVT/ChatterinoWatch?tab=readme-ov-file#installation',
      })
    }
  })

  browserAPI.tabs.onActivated.addListener(async (activeInfo) => {
    try {
      const tab = await browserAPI.tabs.get(activeInfo.tabId)
      if (!tab?.url) return

      const window = await browserAPI.windows.get(tab.windowId)
      if (window.focused) {
        const channel = matchChannelName(tab.url)
        if (channel) {
          debouncedSendToChatterino(channel, tab.windowId)
        }
      }
    } catch (error) {
      console.error('[ChatterinoWatch] Error in onActivated:', error)
    }
  })

  browserAPI.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (!changeInfo.url) return

    try {
      const window = await browserAPI.windows.get(tab.windowId)
      if (window.focused) {
        const channel = matchChannelName(changeInfo.url)
        if (channel) {
          debouncedSendToChatterino(channel, tab.windowId)
        }
      }
    } catch (error) {
      console.error('[ChatterinoWatch] Error in onUpdated:', error)
    }
  })
}

// Initialize when the service worker starts
initializeBackground()

// Export the functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeBackground,
    handleMessage: (message, sender, sendResponse) => {
      if (message.type === 'test') {
        sendResponse({ success: true })
      }
    },
  }
}
