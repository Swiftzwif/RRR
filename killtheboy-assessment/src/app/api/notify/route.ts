import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseServiceRole } from '@/lib/supabase';

const notifySchema = z.object({
  email: z.string().email(),
  topic: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, topic } = notifySchema.parse(body);

    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    // Create a simple notification record
    // You could also use a dedicated notifications table
    const { error } = await supabase
      .from('assessments')
      .insert({
        email,
        answers: {},
        domain_scores: {},
        avatar: 'Drifter',
        score: 0,
        // Store topic in a custom field or separate table
      });

    if (error) {
      console.error('Error saving notification:', error);
      throw new Error('Failed to save notification');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save notification' },
      { status: 500 }
    );
  }
}
