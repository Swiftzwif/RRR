import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function checkLeads() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        submission: true
      }
    });

    console.log('Leads in database:');
    leads.forEach(lead => {
      console.log(`- ID: ${lead.id}`);
      console.log(`  Email: ${lead.email}`);
      console.log(`  Submission ID: ${lead.submissionId}`);
      console.log(`  Avatar: ${lead.submission.avatar}`);
      console.log(`  Created: ${lead.createdAt}`);
      console.log('');
    });

    if (leads.length === 0) {
      console.log('No leads found in database.');
    }
    
  } catch (error) {
    console.error('Error checking leads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLeads();
