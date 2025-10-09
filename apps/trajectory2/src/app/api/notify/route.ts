import { getSupabaseServiceRole } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const notifySchema = z.object({
  email: z.string().email(),
  topic: z.enum(['course', 'assessment', 'experience']),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, topic, metadata } = notifySchema.parse(body);

    // Store email in Supabase for future notifications
    const supabase = getSupabaseServiceRole();
    if (supabase) {
      await supabase
        .from('email_notifications')
        .upsert({
          email,
          topic,
          metadata,
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'email,topic',
        });
    }

    // TODO: Send email via Resend
    // For now, just store the notification request
    console.log(`Email notification stored for ${email} - Topic: ${topic}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to save notification' },
      { status: 500 }
    );
  }
}
