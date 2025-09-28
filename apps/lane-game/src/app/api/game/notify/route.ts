import { NextRequest, NextResponse } from 'next/server';
import { addToNotifyList, getSupabaseServiceRole } from '@/lib/supabase';
import { z } from 'zod';

const NotifySchema = z.object({
  email: z.string().email(),
  topic: z.string().optional().default('lane-game'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, topic } = NotifySchema.parse(body);
    
    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const notification = await addToNotifyList(email, topic);
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error adding to notify list:', error);
    return NextResponse.json({ error: 'Failed to add to notify list' }, { status: 500 });
  }
}
