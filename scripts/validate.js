#!/usr/bin/env node

/**
 * Quick validation script for ChatterinoWatch cross-browser compatibility
 * Checks that all files are in place and basic functionality works
 */

const fs = require('fs-extra')
const path = require('path')

console.log('🔍 ChatterinoWatch Cross-Browser Validation')
console.log('==========================================')

let allGood = true

// Check required files exist
const requiredFiles = [
  'package.json',
  'src/manifest.json',
  'src/background.js',
  'src/content.js',
  'scripts/build.js',
  'scripts/dev.js',
  'docs/DEVELOPMENT.md',
]

console.log('\n📁 Checking required files...')
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MISSING`)
    allGood = false
  }
}

// Check build output
console.log('\n🏗️  Checking build outputs...')
const buildDirs = ['dist/chrome', 'dist/firefox']
for (const dir of buildDirs) {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`)

    // Check manifest differences
    const manifestPath = path.join(dir, 'manifest.json')
    if (fs.existsSync(manifestPath)) {
      const manifest = fs.readJsonSync(manifestPath)

      if (dir.includes('firefox')) {
        if (manifest.browser_specific_settings && manifest.background.scripts) {
          console.log(`  ✅ Firefox-specific manifest features present`)
        } else {
          console.log(`  ❌ Firefox manifest missing required features`)
          allGood = false
        }

        // Check polyfill exists
        if (fs.existsSync(path.join(dir, 'browser-polyfill.min.js'))) {
          console.log(`  ✅ Browser polyfill present`)
        } else {
          console.log(`  ❌ Browser polyfill missing`)
          allGood = false
        }
      }

      if (dir.includes('chrome')) {
        if (manifest.background.service_worker) {
          console.log(`  ✅ Chrome service worker present`)
        } else {
          console.log(`  ❌ Chrome service worker missing`)
          allGood = false
        }
      }
    }
  } else {
    console.log(`❌ ${dir} - MISSING (run npm run build)`)
    allGood = false
  }
}

// Check for cross-browser API usage
console.log('\n🌐 Checking cross-browser API usage...')
const sourceFiles = ['src/background.js', 'src/content.js']
for (const file of sourceFiles) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8')

    // Check for browserAPI usage
    if (content.includes('browserAPI')) {
      console.log(`✅ ${file} - Uses cross-browser API`)
    } else {
      console.log(`❌ ${file} - Missing cross-browser API usage`)
      allGood = false
    }

    // Check for direct chrome API usage (should be minimal)
    const chromeApiMatches = content.match(/chrome\./g)
    if (chromeApiMatches && chromeApiMatches.length > 2) {
      console.log(`⚠️  ${file} - Has ${chromeApiMatches.length} direct chrome API calls`)
    }
  }
}

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...')
if (fs.existsSync('package.json')) {
  const pkg = fs.readJsonSync('package.json')
  const requiredScripts = ['build', 'build:chrome', 'build:firefox', 'dev', 'validate']

  for (const script of requiredScripts) {
    if (pkg.scripts?.[script]) {
      console.log(`✅ Script: ${script}`)
    } else {
      console.log(`❌ Script: ${script} - MISSING`)
      allGood = false
    }
  }

  // Check dependencies
  if (pkg.dependencies?.['webextension-polyfill']) {
    console.log(`✅ Dependency: webextension-polyfill`)
  } else {
    console.log(`❌ Dependency: webextension-polyfill - MISSING`)
    allGood = false
  }
}

// Check test files
console.log('\n🧪 Checking test files...')
const testFiles = ['tests/background.test.js', 'tests/content.test.js']
for (const testFile of testFiles) {
  if (fs.existsSync(testFile)) {
    console.log(`✅ ${testFile}`)
  } else {
    console.log(`❌ ${testFile} - MISSING`)
    allGood = false
  }
}

// Summary
console.log('\n📊 Summary')
console.log('==========')
if (allGood) {
  console.log('🎉 All checks passed! ChatterinoWatch is ready for cross-browser deployment.')
  console.log('\n📝 Next steps:')
  console.log('1. Test in both Chrome and Firefox')
  console.log('2. Package for distribution: npm run package:all')
  console.log('3. Upload to Chrome Web Store and Firefox Add-ons')
  process.exit(0)
} else {
  console.log('❌ Some issues found. Please review the output above.')
  process.exit(1)
}
