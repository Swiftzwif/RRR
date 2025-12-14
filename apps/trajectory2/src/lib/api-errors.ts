/**
 * API error handling utilities
 * Provides standardized error responses and error classes for API routes
 */

import { logger } from './logger';
import { NextResponse } from 'next/server';

/**
 * Custom API error class with HTTP status code and optional error code
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Standardized error response format
 */
interface ErrorResponse {
  error: string;
  code?: string;
  timestamp: string;
  details?: unknown;
}

/**
 * Create a standardized error response from any error type
 * Logs unexpected errors and returns appropriate HTTP responses
 *
 * @param error - The error to handle (APIError, Error, or unknown)
 * @returns NextResponse with standardized error format
 */
export function errorResponse(error: unknown): NextResponse<ErrorResponse> {
  // Handle known APIError instances
  if (error instanceof APIError) {
    const response: ErrorResponse = {
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    logger.error('Unexpected API error', error);

    const response: ErrorResponse = {
      error: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 500 });
  }

  // Handle unknown error types
  logger.error('Unknown error type in API', error);

  const response: ErrorResponse = {
    error: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 500 });
}

/**
 * Pre-defined API errors for common scenarios
 */
export const APIErrors = {
  // Authentication errors (401)
  Unauthorized: new APIError(401, 'Authentication required', 'UNAUTHORIZED'),
  InvalidToken: new APIError(401, 'Invalid or expired token', 'INVALID_TOKEN'),

  // Authorization errors (403)
  Forbidden: new APIError(403, 'Access denied', 'FORBIDDEN'),
  AdminOnly: new APIError(403, 'Admin access required', 'ADMIN_ONLY'),

  // Validation errors (400)
  InvalidInput: new APIError(400, 'Invalid input data', 'INVALID_INPUT'),
  MissingField: (field: string) => new APIError(400, `Missing required field: ${field}`, 'MISSING_FIELD'),

  // Not found errors (404)
  NotFound: new APIError(404, 'Resource not found', 'NOT_FOUND'),

  // Rate limiting (429)
  RateLimitExceeded: new APIError(429, 'Too many requests', 'RATE_LIMIT'),

  // Server errors (500)
  DatabaseError: new APIError(500, 'Database operation failed', 'DATABASE_ERROR'),
  ExternalServiceError: new APIError(502, 'External service unavailable', 'EXTERNAL_SERVICE_ERROR'),
};
