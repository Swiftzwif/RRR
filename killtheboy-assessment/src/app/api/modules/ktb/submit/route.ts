import questionsData from '@/content/questions.json';
import { logAssessmentComplete } from '@/lib/events';
import { getMongo } from '@/lib/mongo';
import {
  avatarFromOverall,
  computeDomainAverages,
  getLowestTwoDomains,
  overallAverage,
  type Domain
} from '@/lib/scoring';
import { getSupabaseServiceRole } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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
    const moduleId = 'ktb';

    // Load domain mapping
    const domainMapping = loadDomainMapping();

    // Compute domain averages
    const domainScores = computeDomainAverages(validatedData.answers);

    // Compute overall average
    const overall = overallAverage(domainScores);

    // Determine avatar
    const avatar = avatarFromOverall(overall);

    // Find lowest two domains
    const lowestDomains = getLowestTwoDomains(domainScores);

    // Log completion event
    logAssessmentComplete(overall, avatar, lowestDomains);

    const mongo = await getMongo();
    if (!mongo) throw new Error('MongoDB not configured');

    const doc = {
      moduleId,
      answers: validatedData.answers,
      reflective: validatedData.reflective || undefined,
      domainScores,
      overall,
      avatar,
      lowestDomains: lowestDomains.map(d => d.toString()),
      createdAt: new Date(),
    };
    const res = await mongo.db.collection('submissions').insertOne(doc);
    const submission = { id: res.insertedId.toString(), ...doc };

    // Optionally mirror into Supabase (if configured)
    try {
      const sb = getSupabaseServiceRole();
      if (sb && submission?.id) {
        await sb.from('submissions').insert({
          id: submission.id,
          answers: submission.answers,
          reflective: submission.reflective,
          domain_scores: submission.domainScores,
          overall: submission.overall,
          avatar: submission.avatar,
          lowest_domains: submission.lowestDomains,
          created_at: (submission.createdAt || new Date()) as any,
        });
      }
    } catch (e) {
      console.error('supabase_mirror_error', e);
    }

    return NextResponse.json({
      id: submission.id,
      moduleId,
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

    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
