import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Question {
  id: string;
  domain?: string;
  prompt: string;
}

interface QuestionsData {
  metadata: {
    note: string;
    domains: string[];
  };
  scored: Question[];
  reflective: Question[];
}

const ALLOWED_DOMAINS = ['identity', 'health', 'finances', 'relationships', 'emotions', 'focus'];

export async function GET() {
  const questionsPath = path.join(process.cwd(), 'src', 'content', 'questions.json');
  
  // Check if file exists
  if (!fs.existsSync(questionsPath)) {
    return NextResponse.json({ valid: false, error: 'questions.json not found' }, { status: 400 });
  }

  try {
    const fileContent = fs.readFileSync(questionsPath, 'utf-8');
    const data: QuestionsData = JSON.parse(fileContent);

    const errors: string[] = [];

    // Validate metadata
    if (!data.metadata || !Array.isArray(data.metadata.domains)) {
      errors.push('Missing or invalid metadata.domains array');
    }

    // Validate scored questions
    if (!Array.isArray(data.scored)) {
      errors.push('scored must be an array');
    } else {
      if (data.scored.length !== 15) {
        errors.push(`Expected 15 scored questions, found ${data.scored.length}`);
      }

      data.scored.forEach((question, index) => {
        if (!question.id || typeof question.id !== 'string') {
          errors.push(`scored[${index}]: missing or invalid id`);
        }
        if (!question.domain || typeof question.domain !== 'string') {
          errors.push(`scored[${index}]: missing or invalid domain`);
        } else if (!ALLOWED_DOMAINS.includes(question.domain)) {
          errors.push(`scored[${index}]: domain "${question.domain}" not in allowed list`);
        }
        if (!question.prompt || typeof question.prompt !== 'string' || question.prompt.trim() === '') {
          errors.push(`scored[${index}]: missing or empty prompt`);
        }
        if (question.prompt.includes('<<<VERBATIM FROM DOCS>>>') || question.prompt.includes('TBD – paste verbatim from docs')) {
          errors.push(`scored[${index}]: prompt still contains placeholder text`);
        }
      });
    }

    // Validate reflective questions
    if (!Array.isArray(data.reflective)) {
      errors.push('reflective must be an array');
    } else {
      if (data.reflective.length !== 2) {
        errors.push(`Expected 2 reflective questions, found ${data.reflective.length}`);
      }

      data.reflective.forEach((question, index) => {
        if (!question.id || typeof question.id !== 'string') {
          errors.push(`reflective[${index}]: missing or invalid id`);
        }
        if (!question.prompt || typeof question.prompt !== 'string' || question.prompt.trim() === '') {
          errors.push(`reflective[${index}]: missing or empty prompt`);
        }
        if (question.prompt.includes('<<<VERBATIM FROM DOCS>>>') || question.prompt.includes('TBD – paste verbatim from docs')) {
          errors.push(`reflective[${index}]: prompt still contains placeholder text`);
        }
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Validation failed', 
        details: errors 
      }, { status: 400 });
    }

    return NextResponse.json({ valid: true });

  } catch (error) {
    return NextResponse.json({ 
      valid: false, 
      error: 'Failed to parse questions.json' 
    }, { status: 400 });
  }
}

