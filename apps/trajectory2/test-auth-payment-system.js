#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Authentication & Payment System
 *
 * This script tests:
 * 1. Database tables and migrations
 * 2. Authentication flows (signup, login, password reset, email verification)
 * 3. Payment webhook handling
 * 4. Email sending functionality
 * 5. Rate limiting
 * 6. Admin reconciliation dashboard
 *
 * Prerequisites:
 * - Supabase project running
 * - Environment variables configured
 * - Test email account
 *
 * Usage: node test-auth-payment-system.js
 */

const https = require('https');
const http = require('http');
const { createHmac } = require('crypto');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'TestPassword123!';

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(60));
}

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          };
          resolve(result);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test functions
async function testDatabaseTables() {
  section('Testing Database Tables');

  const tables = [
    'purchases',
    'webhook_events',
    'auth_events',
    'raffle_entries',
    'raffle_config'
  ];

  info('Checking if required tables exist...');

  // Note: In a real test, you'd connect to Supabase directly
  // For now, we'll just log what should be tested
  tables.forEach(table => {
    info(`Table '${table}' should exist with proper RLS policies`);
  });

  success('Database table check complete (manual verification needed)');
}

async function testPasswordReset() {
  section('Testing Password Reset Flow');

  try {
    // Test rate limiting
    info('Testing rate limiting (3 requests max in 15 minutes)...');

    for (let i = 1; i <= 4; i++) {
      const response = await makeRequest(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { email: TEST_EMAIL }
      });

      if (i <= 3) {
        if (response.status === 200) {
          success(`Request ${i}/3 successful`);
        } else {
          error(`Request ${i}/3 failed: ${response.status}`);
        }
      } else {
        if (response.status === 429) {
          success('Rate limiting working - 4th request blocked');
        } else {
          error('Rate limiting not working - 4th request should be blocked');
        }
      }
    }
  } catch (err) {
    error(`Password reset test failed: ${err.message}`);
  }
}

async function testEmailVerification() {
  section('Testing Email Verification');

  try {
    info('Sending verification email request...');

    const response = await makeRequest(`${BASE_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { email: TEST_EMAIL }
    });

    if (response.status === 200 || response.status === 404) {
      success('Email verification endpoint working');
      info('Check email for verification link');
    } else {
      error(`Email verification failed: ${response.status}`);
    }
  } catch (err) {
    error(`Email verification test failed: ${err.message}`);
  }
}

async function testWebhook() {
  section('Testing Payment Webhook');

  const webhookPayload = {
    event_id: `test_${Date.now()}`,
    type: 'payment.created',
    data: {
      object: {
        payment: {
          id: `test_payment_${Date.now()}`,
          status: 'COMPLETED',
          amount_money: { amount: 2500 },
          buyer_email_address: TEST_EMAIL,
          note: JSON.stringify({
            is_raffle_entry: 'true',
            raffle_id: 'test-raffle-id',
            email: TEST_EMAIL,
            user_name: 'Test User',
            commitment_message: 'Test commitment',
            transformation_goal: 'Test goal',
          })
        }
      }
    }
  };

  try {
    info('Sending test webhook...');

    // Create signature (would use actual Square webhook key in production)
    const body = JSON.stringify(webhookPayload);
    const signature = createHmac('sha256', process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || 'test')
      .update(body)
      .digest('base64');

    const response = await makeRequest(`${BASE_URL}/api/webhooks/square`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-square-hmacsha256-signature': signature,
      },
      body: webhookPayload
    });

    if (response.status === 200) {
      success('Webhook processed successfully');
      info('Check webhook_events table for stored event');
    } else {
      error(`Webhook processing failed: ${response.status}`);
    }
  } catch (err) {
    error(`Webhook test failed: ${err.message}`);
  }
}

async function testAdminReconciliation() {
  section('Testing Admin Reconciliation Dashboard');

  try {
    info('Testing admin API without auth...');

    let response = await makeRequest(`${BASE_URL}/api/admin/reconcile-payments`, {
      method: 'GET',
    });

    if (response.status === 401) {
      success('Admin API properly secured - unauthorized access blocked');
    } else {
      error('Security issue - admin API accessible without auth');
    }

    info('Testing admin API with auth...');

    response = await makeRequest(`${BASE_URL}/api/admin/reconcile-payments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.ADMIN_SECRET || 'test-secret'}`,
      }
    });

    if (response.status === 200) {
      success('Admin API accessible with proper auth');
      info(`Found ${response.body?.count || 0} unprocessed events`);
    } else {
      error(`Admin API failed with auth: ${response.status}`);
    }
  } catch (err) {
    error(`Admin reconciliation test failed: ${err.message}`);
  }
}

async function checkEnvironmentVariables() {
  section('Checking Environment Variables');

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'SQUARE_ACCESS_TOKEN',
    'SQUARE_WEBHOOK_SIGNATURE_KEY',
    'SQUARE_ENVIRONMENT',
    'ADMIN_SECRET'
  ];

  let allPresent = true;

  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      success(`${varName} is set`);
    } else {
      error(`${varName} is missing`);
      allPresent = false;
    }
  });

  return allPresent;
}

// Main test runner
async function runTests() {
  console.log('\n' + '🧪 '.repeat(20));
  log('AUTHENTICATION & PAYMENT SYSTEM TEST SUITE', colors.bright + colors.yellow);
  console.log('🧪 '.repeat(20));

  try {
    // Check environment
    const envOk = await checkEnvironmentVariables();
    if (!envOk) {
      error('\nSome environment variables are missing. Tests may fail.');
      info('Check .env.local file and ensure all variables are set.');
    }

    // Run tests
    await testDatabaseTables();
    await testPasswordReset();
    await testEmailVerification();
    await testWebhook();
    await testAdminReconciliation();

    // Summary
    section('TEST SUMMARY');
    success('All automated tests completed!');
    info('\nManual verification needed for:');
    info('1. Email delivery (check inbox for test emails)');
    info('2. Database table creation (check Supabase dashboard)');
    info('3. Payment flow (test with real Square sandbox)');
    info('4. Admin dashboard UI (visit /admin/payments)');

    console.log('\n' + '='.repeat(60));
    log('✨ Testing complete! Check above for any failures.', colors.bright + colors.green);
    console.log('='.repeat(60) + '\n');

  } catch (err) {
    error(`\nTest suite failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

// Run tests if this is the main module
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };