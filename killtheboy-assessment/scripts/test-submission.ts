import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function testSubmission() {
  try {
    console.log('🧪 Testing assessment submission...');
    
    // Create a test submission
    const testSubmission = await prisma.submission.create({
      data: {
        answers: {
          Q1: 3, Q2: 4, Q3: 2, Q4: 5, Q5: 3, Q6: 4,
          Q7: 3, Q8: 4, Q9: 2, Q10: 5, Q11: 3, Q12: 4,
          Q13: 3, Q14: 4, Q15: 2
        },
        domainScores: {
          identity: 3.0,
          health: 4.0,
          finances: 2.0,
          relationships: 5.0,
          emotions: 3.0,
          focus: 4.0
        },
        overall: 3.5,
        avatar: 'Balancer',
        lowestDomains: ['finances', 'identity']
      }
    });

    console.log('✅ Test submission created successfully');
    console.log(`📝 Submission ID: ${testSubmission.id}`);
    console.log(`🎭 Avatar: ${testSubmission.avatar}`);
    console.log(`📊 Overall Score: ${testSubmission.overall}`);
    
    // Clean up - delete the test submission
    await prisma.submission.delete({
      where: { id: testSubmission.id }
    });
    
    console.log('✅ Test submission cleaned up');
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Test submission failed:', error);
    process.exit(1);
  }
}

testSubmission();
