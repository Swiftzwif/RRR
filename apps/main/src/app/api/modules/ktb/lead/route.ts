import { logLeadSubmit } from '@/lib/events';
import { getMongo } from '@/lib/mongo';
import { getSupabaseServiceRole } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema
const LeadRequestSchema = z.object({
  submissionId: z.string().min(1),
  email: z.string().email()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = LeadRequestSchema.parse(body);
    const moduleId = 'ktb';

    // Check if submission exists (Mongo)
    let submission: any = null;
    const mongo = await getMongo();
    if (!mongo) throw new Error('MongoDB not configured');
    const { ObjectId } = await import('mongodb');
    let query: any = { id: validatedData.submissionId };
    try { query = { _id: new ObjectId(validatedData.submissionId) }; } catch {}
    submission = await mongo.db.collection('submissions').findOne(query);

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Save lead
    await mongo.db.collection('leads').insertOne({
      moduleId,
      submissionId: validatedData.submissionId,
      email: validatedData.email,
      source: 'assessment',
      createdAt: new Date(),
    });

    // Mirror to Supabase if configured
    try {
      const sb = getSupabaseServiceRole();
      if (sb) {
        await sb.from('leads').insert({
          submission_id: validatedData.submissionId,
          email: validatedData.email,
          source: 'assessment',
        });
      }
    } catch (e) {
      console.error('supabase_lead_error', e);
    }

    // Log lead submission
    logLeadSubmit(validatedData.submissionId, validatedData.email);

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Lead submission error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    );
  }
}
