/**
 * Build script for ChatterinoWatch extension
 * Builds for Chrome and Firefox with proper manifest adaptations
 */

const fs = require('fs-extra')
const path = require('path')

const BUILD_TARGETS = {
  chrome: {
    manifestVersion: 3,
    usesAction: true,
    apiNamespace: 'chrome',
    outputDir: 'dist/chrome',
  },
  firefox: {
    manifestVersion: 3,
    usesAction: true,
    apiNamespace: 'browser',
    outputDir: 'dist/firefox',
  },
}

async function buildExtension(target = 'all') {
  const targets = target === 'all' ? Object.keys(BUILD_TARGETS) : [target]

  for (const targetName of targets) {
    if (!BUILD_TARGETS[targetName]) {
      console.error(`Unknown target: ${targetName}`)
      continue
    }

    console.log(`Building for ${targetName}...`)
    await buildForTarget(targetName, BUILD_TARGETS[targetName])
    console.log(`✓ ${targetName} build complete`)
  }
}

async function buildForTarget(targetName, config) {
  const { outputDir } = config

  // Clean and create output directory
  await fs.remove(outputDir)
  await fs.ensureDir(outputDir)

  // Copy source files
  await fs.copy('src', outputDir)

  // Update manifest for target
  await updateManifestForTarget(outputDir, targetName, config)

  // Copy and update JavaScript files
  await updateJavaScriptFiles(outputDir, targetName, config)

  // Copy polyfill for Firefox
  if (targetName === 'firefox') {
    await fs.copy(
      'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
      path.join(outputDir, 'browser-polyfill.min.js'),
    )
  }
}

async function updateManifestForTarget(outputDir, targetName, config) {
  const manifestPath = path.join(outputDir, 'manifest.json')
  const manifest = await fs.readJson(manifestPath)

  // Base manifest updates
  manifest.manifest_version = config.manifestVersion

  if (targetName === 'firefox') {
    // Firefox-specific manifest keys
    manifest.browser_specific_settings = {
      gecko: {
        id: 'chatterino-watch@chatterinowatch.miguvt.com',
        strict_min_version: '109.0',
      },
    }

    // Add polyfill to content scripts and background
    if (manifest.content_scripts) {
      manifest.content_scripts.forEach((script) => {
        script.js = ['browser-polyfill.min.js', ...script.js]
      })
    }

    if (manifest.background) {
      if (manifest.background.service_worker) {
        manifest.background.scripts = [
          'browser-polyfill.min.js',
          manifest.background.service_worker,
        ]
        delete manifest.background.service_worker
      }
    }
  }

  // Update action (replaces browserAction in MV3)
  if (config.usesAction && manifest.browser_action) {
    manifest.action = manifest.browser_action
    delete manifest.browser_action
  }

  await fs.writeJson(manifestPath, manifest, { spaces: 2 })
}

async function updateJavaScriptFiles(outputDir, targetName, config) {
  const files = ['background.js', 'content.js']

  for (const file of files) {
    const filePath = path.join(outputDir, file)
    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, 'utf8')

      // Replace chrome API calls with browser API calls for Firefox
      if (targetName === 'firefox') {
        content = content.replace(/chrome\./g, 'browser.')
      }

      // Update browserAction to action for MV3
      if (config.usesAction) {
        content = content.replace(/chrome\.browserAction/g, 'chrome.action')
        content = content.replace(/browser\.browserAction/g, 'browser.action')
      }

      await fs.writeFile(filePath, content)
    }
  }
}

// Run build if called directly
if (require.main === module) {
  const target = process.argv[2] || 'all'
  buildExtension(target).catch(console.error)
}

module.exports = { buildExtension }
