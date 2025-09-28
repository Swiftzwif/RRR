import { NextRequest, NextResponse } from 'next/server';
import { createGameSession, updateGameSession, getSupabaseServiceRole } from '@/lib/supabase';
import { GameSessionSchema } from '@trajectory/lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = GameSessionSchema.parse(body);
    
    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const session = await createGameSession(validatedData);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating game session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }
    
    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const session = await updateGameSession(id, updates);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating game session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}
