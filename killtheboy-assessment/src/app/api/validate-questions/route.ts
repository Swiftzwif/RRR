import { NextResponse } from 'next/server';
import questionsData from '@/content/questions.json';

export async function GET() {
  try {
    if (!questionsData || !Array.isArray(questionsData.scored)) {
      return NextResponse.json({ ok: false, error: 'missing_questions' }, { status: 400 });
    }
    const hasPlaceholder = questionsData.scored.some((q: any) =>
      typeof q.prompt === 'string' && (q.prompt.includes('TBD') || q.prompt.includes('<<<VERBATIM'))
    );
    if (hasPlaceholder) {
      return NextResponse.json({ ok: false, error: 'placeholder_questions' }, { status: 400 });
    }
    return NextResponse.json({ ok: true, scored: questionsData.scored.length, reflective: questionsData.reflective?.length || 0 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

