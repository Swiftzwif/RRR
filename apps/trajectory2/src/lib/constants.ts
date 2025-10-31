// Environment constants for the Trajectory application

export const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY || '';
export const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID || '';

// Validate required environment variables
if (!CONVERTKIT_API_KEY && typeof window === 'undefined') {
  console.warn('CONVERTKIT_API_KEY is not set');
}

if (!CONVERTKIT_FORM_ID && typeof window === 'undefined') {
  console.warn('CONVERTKIT_FORM_ID is not set');
}

