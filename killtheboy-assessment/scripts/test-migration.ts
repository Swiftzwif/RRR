#!/usr/bin/env tsx

/**
 * Test script to validate the MongoDB to Supabase migration setup
 * 
 * Usage: npx tsx scripts/test-migration.ts
 * 
 * This script tests:
 * - Environment variable configuration
 * - Database connections
 * - Schema validation
 * - Basic CRUD operations
 */

import { config } from 'dotenv';
import { getMongo } from '../src/lib/mongo';
import { getSupabaseServiceRole } from '../src/lib/supabase';

// Load environment variables
config({ path: '.env.local' });
config();

interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  message: string;
  details?: any;
}

class MigrationTester {
  private results: TestResult[] = [];

  addResult(name: string, status: 'pass' | 'fail', message: string, details?: any) {
    this.results.push({ name, status, message, details });
    const icon = status === 'pass' ? '✅' : '❌';
    console.log(`${icon} ${name}: ${message}`);
    if (details && status === 'fail') {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
    }
  }

  async testEnvironmentVariables() {
    console.log('\n🔧 Testing Environment Variables...');
    
    const requiredVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE',
      'MONGODB_URI',
      'MONGODB_DB'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length === 0) {
      this.addResult('Environment Variables', 'pass', 'All required variables are set');
    } else {
      this.addResult('Environment Variables', 'fail', `Missing variables: ${missing.join(', ')}`);
    }
  }

  async testSupabaseConnection() {
    console.log('\n🔗 Testing Supabase Connection...');
    
    try {
      const sb = getSupabaseServiceRole();
      if (!sb) {
        this.addResult('Supabase Connection', 'fail', 'Failed to create Supabase client');
        return;
      }

      // Test basic connection
      const { data, error } = await sb.from('submissions').select('count').limit(1);
      
      if (error) {
        this.addResult('Supabase Connection', 'fail', `Connection failed: ${error.message}`, error);
        return;
      }

      this.addResult('Supabase Connection', 'pass', 'Successfully connected to Supabase');
    } catch (error) {
      this.addResult('Supabase Connection', 'fail', `Connection error: ${error}`, error);
    }
  }

  async testMongoDBConnection() {
    console.log('\n🍃 Testing MongoDB Connection...');
    
    try {
      const mongo = await getMongo();
      if (!mongo) {
        this.addResult('MongoDB Connection', 'fail', 'Failed to connect to MongoDB');
        return;
      }

      // Test basic operation
      const collections = await mongo.db.listCollections().toArray();
      
      this.addResult('MongoDB Connection', 'pass', `Connected to ${mongo.db.databaseName}, ${collections.length} collections`);
    } catch (error) {
      this.addResult('MongoDB Connection', 'fail', `Connection error: ${error}`, error);
    }
  }

  async testSupabaseSchema() {
    console.log('\n📋 Testing Supabase Schema...');
    
    try {
      const sb = getSupabaseServiceRole();
      if (!sb) {
        this.addResult('Supabase Schema', 'fail', 'No Supabase client available');
        return;
      }

      // Test submissions table
      const { error: submissionsError } = await sb
        .from('submissions')
        .select('id, module_id, answers, domain_scores, overall, avatar, lowest_domains, created_at')
        .limit(1);

      if (submissionsError) {
        this.addResult('Supabase Schema - Submissions', 'fail', `Submissions table error: ${submissionsError.message}`, submissionsError);
      } else {
        this.addResult('Supabase Schema - Submissions', 'pass', 'Submissions table accessible');
      }

      // Test leads table
      const { error: leadsError } = await sb
        .from('leads')
        .select('id, submission_id, module_id, email, source, created_at')
        .limit(1);

      if (leadsError) {
        this.addResult('Supabase Schema - Leads', 'fail', `Leads table error: ${leadsError.message}`, leadsError);
      } else {
        this.addResult('Supabase Schema - Leads', 'pass', 'Leads table accessible');
      }

    } catch (error) {
      this.addResult('Supabase Schema', 'fail', `Schema test error: ${error}`, error);
    }
  }

  async testBasicOperations() {
    console.log('\n🧪 Testing Basic Operations...');
    
    try {
      const sb = getSupabaseServiceRole();
      if (!sb) {
        this.addResult('Basic Operations', 'fail', 'No Supabase client available');
        return;
      }

      const testId = `test-${Date.now()}`;
      const testData = {
        id: testId,
        module_id: 'ktb',
        answers: { 'q1': 4, 'q2': 3 },
        domain_scores: { 'domain1': 3.5 },
        overall: 3.5,
        avatar: 'test-avatar',
        lowest_domains: ['domain1'],
        created_at: new Date().toISOString()
      };

      // Test insert
      const { error: insertError } = await sb
        .from('submissions')
        .insert(testData);

      if (insertError) {
        this.addResult('Basic Operations - Insert', 'fail', `Insert failed: ${insertError.message}`, insertError);
        return;
      }

      // Test select
      const { data, error: selectError } = await sb
        .from('submissions')
        .select('*')
        .eq('id', testId)
        .single();

      if (selectError) {
        this.addResult('Basic Operations - Select', 'fail', `Select failed: ${selectError.message}`, selectError);
      } else {
        this.addResult('Basic Operations - Select', 'pass', 'Successfully inserted and retrieved data');
      }

      // Test delete
      const { error: deleteError } = await sb
        .from('submissions')
        .delete()
        .eq('id', testId);

      if (deleteError) {
        this.addResult('Basic Operations - Delete', 'fail', `Delete failed: ${deleteError.message}`, deleteError);
      } else {
        this.addResult('Basic Operations - Delete', 'pass', 'Successfully deleted test data');
      }

    } catch (error) {
      this.addResult('Basic Operations', 'fail', `Operations test error: ${error}`, error);
    }
  }

  printSummary() {
    console.log('\n📊 Test Summary:');
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'fail')
        .forEach(r => console.log(`  - ${r.name}: ${r.message}`));
    }

    if (failed === 0) {
      console.log('\n🎉 All tests passed! Migration setup is ready.');
    } else {
      console.log('\n⚠️  Some tests failed. Please fix the issues before proceeding with migration.');
    }
  }
}

async function main() {
  console.log('🚀 Starting Migration Setup Tests...\n');
  
  const tester = new MigrationTester();
  
  await tester.testEnvironmentVariables();
  await tester.testSupabaseConnection();
  await tester.testMongoDBConnection();
  await tester.testSupabaseSchema();
  await tester.testBasicOperations();
  
  tester.printSummary();
}

// Run the tests
if (require.main === module) {
  main().catch(console.error);
}
