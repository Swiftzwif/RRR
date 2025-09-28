import 'dotenv/config';
import { readFileSync } from 'fs';
import { defaultMongoConfig, mongoConnectionExamples, validateMongoConfig } from '../src/lib/mongo-config';

function setupMongoConfig() {
  console.log('🔧 MongoDB Setup Helper');
  console.log('======================\n');
  
  // Check current .env.local
  let envContent = '';
  try {
    envContent = readFileSync('.env.local', 'utf8');
    console.log('📁 Found existing .env.local file');
  } catch {
    console.log('📁 No .env.local file found, will create one');
  }
  
  const currentUri = process.env.MONGODB_URI;
  const currentDb = process.env.MONGODB_DB;
  
  console.log('\n📋 Current Configuration:');
  console.log(`MONGODB_URI: ${currentUri ? '✅ Set' : '❌ Not set'}`);
  console.log(`MONGODB_DB: ${currentDb || 'trajectory (default)'}`);
  
  if (currentUri) {
    console.log('\n🔍 Validating current configuration...');
    const config = defaultMongoConfig;
    const errors = validateMongoConfig(config);
    
    if (errors.length > 0) {
      console.log('❌ Configuration errors found:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ Configuration looks valid');
    }
  }
  
  console.log('\n📚 Connection String Examples:');
  console.log('For MongoDB Atlas:');
  console.log(`  ${mongoConnectionExamples.atlas}`);
  console.log('\nFor Local MongoDB:');
  console.log(`  ${mongoConnectionExamples.local}`);
  
  console.log('\n💡 To get your connection string:');
  console.log('1. Open MongoDB VS Code extension');
  console.log('2. Connect to your database');
  console.log('3. Copy the connection string');
  console.log('4. Replace <username>, <password>, <cluster-name>, etc. with your actual values');
  
  console.log('\n🔧 To update your configuration:');
  console.log('1. Edit .env.local file');
  console.log('2. Add or update MONGODB_URI with your connection string');
  console.log('3. Optionally set MONGODB_DB if different from "trajectory"');
  console.log('4. Run: npm run test:mongo');
  
  // Show current .env.local content
  if (envContent) {
    console.log('\n📄 Current .env.local content:');
    console.log('```');
    console.log(envContent);
    console.log('```');
  }
}

setupMongoConfig();
