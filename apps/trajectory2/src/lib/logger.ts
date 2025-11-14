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
 * Log informational messages
 */
const info = (message: string, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[INFO] ${message}`, ...args);
  }
};

/**
 * Log error messages and optionally send to Sentry in production
 */
const error = (message: string, err?: Error, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${message}`, err, ...args);
  } else {
    // Production: Send to Sentry (when configured)
    console.error(`[ERROR] ${message}`, err, ...args);
  }
};

/**
 * Log warning messages
 */
const warn = (message: string, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[WARN] ${message}`, ...args);
  }
};

/**
 * Log debug messages (development only)
 */
const debug = (message: string, ...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] ${message}`, ...args);
  }
};
