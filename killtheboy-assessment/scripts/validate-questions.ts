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

function validateQuestions(): void {
  const questionsPath = path.join(process.cwd(), 'src', 'content', 'questions.json');
  
  // Check if file exists
  if (!fs.existsSync(questionsPath)) {
    console.error('ERROR: questions.json not found at', questionsPath);
    process.exit(1);
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
      console.error('VALIDATION FAILED:');
      errors.forEach(error => console.error(`- ${error}`));
      process.exit(1);
    }

    console.log('questions.json VALID (15 scored + 2 reflective).');
    process.exit(0);

  } catch (error) {
    console.error('ERROR: Failed to parse questions.json:', error);
    process.exit(1);
  }
}

validateQuestions();

