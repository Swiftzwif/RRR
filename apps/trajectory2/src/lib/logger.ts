/**
 * Application-wide logging utility
 * Provides environment-aware logging with Sentry integration
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Logger interface defining available logging methods
 */
interface Logger {
  info: (message: string, ...args: unknown[]) => void;
  error: (message: string, error?: Error, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

/**
 * Log informational messages (development only)
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
const info = (message: string, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[INFO] ${message}`, ...args);
  }
};

/**
 * Log error messages and send to Sentry in production
 * @param message - The error message
 * @param err - Optional Error object to capture
 * @param args - Additional context to log
 */
const error = (message: string, err?: Error, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${message}`, err, ...args);
  } else {
    // Production: Send to Sentry
    if (err) {
      Sentry.captureException(err, { extra: { message, args } });
    } else {
      Sentry.captureMessage(message, { level: 'error', extra: { args } });
    }
  }
};

/**
 * Log warning messages (development only)
 * @param message - The warning message
 * @param args - Additional arguments to log
 */
const warn = (message: string, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[WARN] ${message}`, ...args);
  }
};

/**
 * Log debug messages (development only)
 * @param message - The debug message
 * @param args - Additional arguments to log
 */
const debug = (message: string, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] ${message}`, ...args);
  }
};
