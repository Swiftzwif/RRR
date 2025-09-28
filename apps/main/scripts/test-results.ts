import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function createTestSubmission() {
  try {
    const testSubmission = await prisma.submission.create({
      data: {
        answers: {
          q1: 3, q2: 4, q3: 2, q4: 5, q5: 3, q6: 4,
          q7: 3, q8: 4, q9: 2, q10: 5, q11: 3, q12: 4,
          q13: 3, q14: 4, q15: 2
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

    console.log('Test submission created with ID:', testSubmission.id);
    console.log('Access results at: http://localhost:3000/results?submission=' + testSubmission.id);
    
  } catch (error) {
    console.error('Error creating test submission:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSubmission();
