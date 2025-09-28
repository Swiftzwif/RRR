#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Temporarily rename postcss config to avoid conflicts
const postcssConfigPath = path.join(__dirname, '..', 'postcss.config.mjs');
const backupPath = path.join(__dirname, '..', 'postcss.config.mjs.bak');

try {
  // Backup the postcss config
  execSync(`mv "${postcssConfigPath}" "${backupPath}"`, { stdio: 'inherit' });
  
  // Run the tests
  execSync('npx vitest run src/lib/scoring.test.ts', { stdio: 'inherit' });
} catch (error) {
  console.error('Test execution failed:', error.message);
  process.exit(1);
} finally {
  // Restore the postcss config
  try {
    execSync(`mv "${backupPath}" "${postcssConfigPath}"`, { stdio: 'inherit' });
  } catch (restoreError) {
    console.warn('Warning: Could not restore postcss.config.mjs:', restoreError.message);
  }
}
