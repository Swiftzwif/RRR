import 'dotenv/config';

function updateMongoUri() {
  console.log('🔧 MongoDB URI Updater');
  console.log('======================\n');
  
  console.log('Current connection string:');
  console.log(process.env.MONGODB_URI);
  
  console.log('\n⚠️  The current connection string contains "xxxxx" as a placeholder.');
  console.log('You need to replace this with your actual MongoDB Atlas cluster ID.');
  
  console.log('\n📋 Steps to get your cluster ID:');
  console.log('1. Open MongoDB VS Code extension');
  console.log('2. Connect to your MongoDB Atlas cluster');
  console.log('3. Look at the connection string - it should look like:');
  console.log('   mongodb+srv://username:password@cluster0.abc123.mongodb.net/database');
  console.log('4. Copy the part after "cluster0." and before ".mongodb.net"');
  console.log('5. Replace "xxxxx" in your .env.local file with that cluster ID');
  
  console.log('\n🔧 To update manually:');
  console.log('1. Open .env.local file');
  console.log('2. Find the line with MONGODB_URI');
  console.log('3. Replace "xxxxx" with your actual cluster ID');
  console.log('4. Save the file');
  console.log('5. Run: npm run test:mongo');
  
  console.log('\n💡 Example:');
  console.log('If your cluster ID is "abc123", change:');
  console.log('cluster0.xxxxx.mongodb.net');
  console.log('to:');
  console.log('cluster0.abc123.mongodb.net');
}

updateMongoUri();
