/**
 * Development script for ChatterinoWatch extension
 * Watches for changes and rebuilds automatically
 */

const chokidar = require('chokidar')
const { buildExtension } = require('./build')

async function startDevelopment() {
  console.log('Starting development mode...')

  // Initial build
  await buildExtension('all')

  // Watch for changes
  const watcher = chokidar.watch('src/**/*', {
    ignored: /(^|[/\\])\../,
    persistent: true,
  })

  watcher.on('change', async (path) => {
    console.log(`File changed: ${path}`)
    try {
      await buildExtension('all')
      console.log('✓ Rebuild complete')
    } catch (error) {
      console.error('Build error:', error)
    }
  })

  console.log('Watching for changes... Press Ctrl+C to stop')
}

if (require.main === module) {
  startDevelopment().catch(console.error)
}

module.exports = { startDevelopment }
