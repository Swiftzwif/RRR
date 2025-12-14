/**
 * Standardized API response format
 * Provides consistent success/error response types across all API routes
 */

import { NextResponse } from 'next/server';

/**
 * Generic API response type
 * Either success with data, or error with details
 */
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
  status: number = 500
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details }
    },
    { status }
  );
}

/**
 * Common error codes for API responses
 */
export const ErrorCodes = {
  // Authentication (401)
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',

  // Authorization (403)
  FORBIDDEN: 'FORBIDDEN',
  ADMIN_ONLY: 'ADMIN_ONLY',

  // Validation (400)
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // Not Found (404)
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',

  // Conflict (409)
  DUPLICATE: 'DUPLICATE',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // Rate Limiting (429)
  RATE_LIMIT: 'RATE_LIMIT',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  // Server Errors (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

  // Payment Errors (402)
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
} as const;
