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
  error: (message: string, error?: Error | unknown, ...args: unknown[]) => void;
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
 * @param err - Optional Error object or unknown error to capture
 * @param args - Additional context to log
 */
const error = (message: string, err?: Error | unknown, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${message}`, err, ...args);
  } else {
    // Production: Send to Sentry
    if (err) {
      // Convert unknown errors to Error objects for Sentry
      const errorToCapture = err instanceof Error
        ? err
        : new Error(typeof err === 'object' && err !== null && 'message' in err
          ? String(err.message)
          : String(err));

      Sentry.captureException(errorToCapture, {
        extra: { message, args, originalError: err }
      });
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

/**
 * Exported logger object with all logging methods
 */
export const logger: Logger = {
  info,
  error,
  warn,
  debug,
};
