import { NextRequest, NextResponse } from 'next/server';
import { createGameEvent, getSupabaseServiceRole } from '@/lib/supabase';
import { GameEventSchema } from '@trajectory/lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = GameEventSchema.parse(body);
    
    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const event = await createGameEvent(validatedData);
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating game event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
