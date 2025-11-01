/**
 * Environment variable validation
 * Fails fast on startup if required environment variables are missing
 */

const requiredEnvVars = {
  // Supabase configuration
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // Square payment configuration (disabled - preserved for future use)
  SQUARE_WEBHOOK_SIGNATURE_KEY: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY,
  SQUARE_ACCESS_TOKEN: process.env.SQUARE_ACCESS_TOKEN,
  SQUARE_LOCATION_ID: process.env.SQUARE_LOCATION_ID,
  
  // Thinkific integration
  NEXT_PUBLIC_THINKIFIC_COURSE_URL: process.env.NEXT_PUBLIC_THINKIFIC_COURSE_URL,
  
  // Email configuration
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  
  // Cron configuration
  CRON_SECRET: process.env.CRON_SECRET,
  
  // App configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://trajectorygroup.org',
} as const;

type EnvVarKey = keyof typeof requiredEnvVars;

interface ValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validate environment variables
 * Returns validation result without throwing
 */
export function validateEnvVars(): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Critical variables that must be present
  const criticalVars: EnvVarKey[] = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
  ];

  // Optional but recommended for production
  const recommendedVars: EnvVarKey[] = [
    'SQUARE_WEBHOOK_SIGNATURE_KEY',
    'SQUARE_ACCESS_TOKEN',
    'SQUARE_LOCATION_ID',
    'CRON_SECRET',
  ];

  // Check critical variables
  for (const varName of criticalVars) {
    if (!requiredEnvVars[varName]) {
      missing.push(varName);
    }
  }

  // Check recommended variables (warnings only)
  for (const varName of recommendedVars) {
    if (!requiredEnvVars[varName]) {
      warnings.push(varName);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Validate and throw if critical variables are missing
 * Call this at application startup
 */
export function requireEnvVars(): void {
  const result = validateEnvVars();

  if (!result.isValid) {
    const errorMessage = [
      'Missing required environment variables:',
      ...result.missing.map(v => `  - ${v}`),
      '',
      'Please set these in your .env.local file or deployment environment.',
    ].join('\n');

    throw new Error(errorMessage);
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️  Missing recommended environment variables:');
    result.warnings.forEach(v => {
      console.warn(`  - ${v}`);
    });
    console.warn('Some features may not work correctly without these variables.\n');
  }
}

/**
 * Get validated environment variable value
 * Throws if variable is missing
 */
export function getEnvVar(key: EnvVarKey): string {
  const value = requiredEnvVars[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get optional environment variable value
 * Returns undefined if not set
 */
export function getOptionalEnvVar(key: EnvVarKey): string | undefined {
  return requiredEnvVars[key];
}

// Validate on module load (but don't throw in client components)
if (typeof window === 'undefined') {
  // Only validate on server-side
  try {
    requireEnvVars();
  } catch (error) {
    // Log error but don't crash - allows for graceful degradation
    console.error('❌ Environment validation failed:', error);
    console.error('⚠️  Application may not function correctly without required environment variables.');
  }
}
