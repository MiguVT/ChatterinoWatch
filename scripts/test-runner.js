#!/usr/bin/env node

/**
 * Professional test runner for ChatterinoWatch
 * Provides comprehensive testing with multiple configurations
 */

const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')

console.log('🧪 ChatterinoWatch Professional Test Suite')
console.log('==========================================')

const testConfigs = {
  unit: {
    name: 'Unit Tests',
    config: 'jest.config.js',
    pattern: 'tests/**/*.test.js',
  },
  professional: {
    name: 'Professional Tests',
    config: 'jest.config.professional.js',
    pattern: 'tests/**/*.test.professional.js',
  },
  integration: {
    name: 'Integration Tests',
    config: 'jest.config.js',
    pattern: 'tests/**/*.integration.test.js',
  },
}

async function runTests(configName = 'all') {
  const configs = configName === 'all' ? Object.keys(testConfigs) : [configName]

  for (const config of configs) {
    if (!testConfigs[config]) {
      console.error(`❌ Unknown test configuration: ${config}`)
      continue
    }

    const { name, config: configFile, pattern } = testConfigs[config]

    console.log(`\n🔬 Running ${name}...`)
    console.log(`Configuration: ${configFile}`)
    console.log(`Pattern: ${pattern}`)

    try {
      const configPath = path.resolve(configFile)
      if (!fs.existsSync(configPath)) {
        console.log(`⚠️  Config file not found: ${configFile}, using default`)
        execSync(`npx jest --testPathPattern="${pattern}" --verbose`, { stdio: 'inherit' })
      } else {
        execSync(`npx jest --config=${configFile} --testPathPattern="${pattern}" --verbose`, {
          stdio: 'inherit',
        })
      }
      console.log(`✅ ${name} completed successfully`)
    } catch (error) {
      console.error(`❌ ${name} failed:`, error.message)
      process.exit(1)
    }
  }
}

async function generateCoverageReport() {
  console.log('\n📊 Generating Coverage Report...')

  try {
    execSync('npx jest --coverage --collectCoverageFrom="src/**/*.js"', { stdio: 'inherit' })
    console.log('✅ Coverage report generated')

    if (fs.existsSync('coverage/lcov-report/index.html')) {
      console.log('📖 Coverage report available at: coverage/lcov-report/index.html')
    }
  } catch (error) {
    console.error('❌ Coverage generation failed:', error.message)
  }
}

async function runLinting() {
  console.log('\n🔍 Running Code Quality Checks...')

  try {
    // Check if ESLint is available
    if (
      fs.existsSync('node_modules/.bin/eslint') ||
      fs.existsSync('node_modules/.bin/eslint.cmd')
    ) {
      execSync('npx eslint src/ tests/ --ext .js', { stdio: 'inherit' })
      console.log('✅ Linting completed')
    } else {
      console.log('⚠️  ESLint not found, skipping linting')
    }
  } catch (error) {
    console.warn('⚠️  Linting issues found:', error.message)
  }
}

async function runSecurityAudit() {
  console.log('\n🔒 Running Security Audit...')

  try {
    execSync('npm audit --audit-level=moderate', { stdio: 'inherit' })
    console.log('✅ Security audit completed')
  } catch (error) {
    console.warn('⚠️  Security audit found issues:', error.message)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'all'

  console.log(`Starting test suite with command: ${command}\n`)

  switch (command) {
    case 'unit':
    case 'professional':
    case 'integration':
    case 'all':
      await runTests(command)
      break

    case 'coverage':
      await generateCoverageReport()
      break

    case 'quality':
      await runLinting()
      await runSecurityAudit()
      break

    case 'full':
      await runTests('all')
      await generateCoverageReport()
      await runLinting()
      await runSecurityAudit()
      break

    default:
      console.log('Available commands:')
      console.log('  unit         - Run unit tests only')
      console.log('  professional - Run professional tests only')
      console.log('  integration  - Run integration tests only')
      console.log('  all          - Run all tests')
      console.log('  coverage     - Generate coverage report')
      console.log('  quality      - Run linting and security audit')
      console.log('  full         - Run everything')
      break
  }

  console.log('\n🎉 Test suite completed!')
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { runTests, generateCoverageReport, runLinting, runSecurityAudit }
