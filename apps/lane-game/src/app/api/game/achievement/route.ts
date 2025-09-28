import { NextRequest, NextResponse } from 'next/server';
import { createGameAchievement, getSupabaseServiceRole } from '@/lib/supabase';
import { AchievementSchema } from '@trajectory/lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = AchievementSchema.parse(body);
    
    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const achievement = await createGameAchievement(validatedData);
    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Error creating game achievement:', error);
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}
