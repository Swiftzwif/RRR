import 'dotenv/config';
import { closeMongo, getMongo, isConnected } from '../src/lib/mongo';

async function testMongoConnection() {
  console.log('Testing MongoDB connection...');
  
  try {
    const mongo = await getMongo();
    
    if (!mongo) {
      console.error('❌ Failed to connect to MongoDB');
      process.exit(1);
    }
    
    const { client, db } = mongo;
    
    console.log('✅ MongoDB connection established');
    console.log(`Database: ${db.databaseName}`);
    console.log(`Connection status: ${isConnected() ? 'Connected' : 'Disconnected'}`);
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log(`Collections found: ${collections.length}`);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    console.log('✅ MongoDB connection test completed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    process.exit(1);
  } finally {
    await closeMongo();
  }
}

testMongoConnection();
