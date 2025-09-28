import { Db, MongoClient } from 'mongodb';
import { defaultMongoConfig, validateMongoConfig } from './mongo-config';

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;

export async function getMongo() {
  const config = defaultMongoConfig;
  const errors = validateMongoConfig(config);
  
  if (errors.length > 0) {
    console.error('MongoDB configuration errors:', errors);
    return null;
  }

  // If we already have a connection, return it
  if (client && db) {
    return { client, db };
  }

  // If we're already connecting, wait
  if (isConnecting) {
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (client && db) {
      return { client, db };
    }
  }

  try {
    isConnecting = true;
    console.log('Connecting to MongoDB...');
    
    client = new MongoClient(config.uri, config.options);
    
    await client.connect();
    db = client.db(config.dbName);
    
    console.log('Successfully connected to MongoDB');
    
    // Test the connection
    await db.admin().ping();
    console.log('MongoDB connection verified');
    
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    client = null;
    db = null;
    return null;
  } finally {
    isConnecting = false;
  }
}

export async function closeMongo() {
  if (client) {
    try {
      await client.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    } finally {
      client = null;
      db = null;
    }
  }
}

export function isConnected() {
  return Boolean(client && db);
}
