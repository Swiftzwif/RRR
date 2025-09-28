import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if tables exist and are accessible
    const submissions = await prisma.submission.findMany();
    console.log(`✅ Submissions table: ${submissions.length} records`);
    
    const leads = await prisma.lead.findMany();
    console.log(`✅ Leads table: ${leads.length} records`);
    
    await prisma.$disconnect();
    console.log('✅ Database test completed successfully');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
