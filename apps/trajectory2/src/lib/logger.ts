/**
 * Application-wide logging utility
 * Provides environment-aware logging with Sentry integration
 */

/**
 * Logger interface defining available logging methods
 */
interface Logger {
  info: (message: string, ...args: unknown[]) => void;
  error: (message: string, error?: Error, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}
