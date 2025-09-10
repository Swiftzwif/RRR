export interface MongoConfig {
  uri: string;
  dbName: string;
  options?: {
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
    socketTimeoutMS?: number;
  };
}

// Default configuration
export const defaultMongoConfig: MongoConfig = {
  uri: process.env.MONGODB_URI || '',
  dbName: process.env.MONGODB_DB || 'trajectory',
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

// Common MongoDB Atlas connection string formats
export const mongoConnectionExamples = {
  atlas: 'mongodb+srv://<username>:<password>@<cluster-name>.<unique-id>.mongodb.net/<database>?retryWrites=true&w=majority',
  local: 'mongodb://<username>:<password>@localhost:27017/<database>',
  docker: 'mongodb://<username>:<password>@localhost:27017/<database>',
};

export function validateMongoConfig(config: MongoConfig): string[] {
  const errors: string[] = [];
  
  if (!config.uri) {
    errors.push('MONGODB_URI is required');
  }
  
  if (!config.dbName) {
    errors.push('MONGODB_DB is required');
  }
  
  if (config.uri && !config.uri.includes('mongodb://') && !config.uri.includes('mongodb+srv://')) {
    errors.push('MONGODB_URI must be a valid MongoDB connection string');
  }
  
  return errors;
}
