import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';
import { logLeadSubmit } from '@/lib/events';

const prisma = new PrismaClient();

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

    // Check if submission exists
    const submission = await prisma.submission.findUnique({
      where: { id: validatedData.submissionId }
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Save lead
    const lead = await prisma.lead.create({
      data: {
        submissionId: validatedData.submissionId,
        email: validatedData.email,
        source: 'assessment'
      }
    });

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
    
    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('prisma')) {
      return NextResponse.json(
        { error: 'db_error' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    );
  }
}
