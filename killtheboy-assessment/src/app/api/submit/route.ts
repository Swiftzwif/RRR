import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';
import { 
  computeDomainAverages, 
  overallAverage, 
  avatarFromOverall, 
  lowestTwoDomains,
  type Domain 
} from '@/lib/scoring';
import { logAssessmentComplete } from '@/lib/events';
import questionsData from '@/content/questions.json';

const prisma = new PrismaClient();

// Zod schemas
const SubmitRequestSchema = z.object({
  answers: z.record(z.string(), z.number().min(1).max(5)),
  reflective: z.record(z.string(), z.string()).optional()
});

// Load domain mapping from questions.json
function loadDomainMapping(): Record<string, Domain> {
  try {
    if (!questionsData.scored || !Array.isArray(questionsData.scored)) {
      throw new Error('scored questions missing from questions.json');
    }
    
    const domainMapping: Record<string, Domain> = {};
    questionsData.scored.forEach((question: any) => {
      if (question.id && question.domain) {
        domainMapping[question.id] = question.domain as Domain;
      }
    });
    
    if (Object.keys(domainMapping).length === 0) {
      throw new Error('No valid domain mappings found in questions.json');
    }
    
    return domainMapping;
  } catch (error) {
    throw new Error('TBD – paste verbatim questions and run npm run validate:questions');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = SubmitRequestSchema.parse(body);
    
    // Load domain mapping
    const domainMapping = loadDomainMapping();

    // Compute domain averages
    const domainScores = computeDomainAverages(validatedData.answers, domainMapping);
    
    // Compute overall average
    const overall = overallAverage(domainScores);
    
    // Determine avatar
    const avatar = avatarFromOverall(overall);
    
    // Find lowest two domains
    const lowestDomains = lowestTwoDomains(domainScores);

    // Log completion event
    logAssessmentComplete(overall, avatar, lowestDomains);

    // Save to database
    const submission = await prisma.submission.create({
      data: {
        answers: validatedData.answers,
        reflective: validatedData.reflective || undefined,
        domainScores,
        overall,
        avatar,
        lowestDomains: lowestDomains.map(d => d.toString())
      }
    });

    return NextResponse.json({ 
      id: submission.id,
      overall,
      avatar,
      domainScores,
      lowestDomains: lowestDomains.map(d => d.toString())
    });

  } catch (error) {
    console.error('Submission error:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 }
      );
    }
    
    // Handle questions.json errors
    if (error instanceof Error && error.message.includes('TBD')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('prisma')) {
      return NextResponse.json(
        { error: 'db_error' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
