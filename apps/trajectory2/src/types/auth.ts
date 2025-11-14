/**
 * Type definitions for authentication flows
 * Centralizes types used across auth routes and components
 */

import { z } from 'zod';

/**
 * Zod schema for email validation
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Zod schema for password validation
 * Requires: 8+ chars, 1 uppercase, 1 lowercase, 1 number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Zod schema for login credentials
 */
export const loginCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Login credentials from form data
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginCredentialsInput = z.infer<typeof loginCredentialsSchema>;

/**
 * Zod schema for signup credentials
 */
export const signupCredentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Signup credentials from form data
 */
export interface SignupCredentials {
  email: string;
  password: string;
}

export type SignupCredentialsInput = z.infer<typeof signupCredentialsSchema>;

/**
 * Zod schema for password reset request
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset request body
 */
export interface PasswordResetRequest {
  email: string;
}

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

/**
 * Zod schema for password reset confirmation
 */
export const passwordResetConfirmationSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
});

/**
 * Password reset confirmation body
 */
export interface PasswordResetConfirmation {
  token: string;
  password: string;
}

export type PasswordResetConfirmationInput = z.infer<typeof passwordResetConfirmationSchema>;

/**
 * Zod schema for email verification request
 */
export const emailVerificationRequestSchema = z.object({
  email: emailSchema.optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
}).refine(
  (data) => data.email || data.userId,
  'Either email or userId must be provided'
);

/**
 * Email verification request body
 */
export interface EmailVerificationRequest {
  email?: string;
  userId?: string;
}

export type EmailVerificationRequestInput = z.infer<typeof emailVerificationRequestSchema>;

/**
 * Auth event types for logging
 */
export type AuthEventType =
  | 'password_reset_requested'
  | 'password_reset_completed'
  | 'email_verified'
  | 'login_success'
  | 'login_failed'
  | 'signup_success'
  | 'signup_failed';

/**
 * Auth event record for database
 */
export interface AuthEvent {
  user_id: string;
  event_type: AuthEventType;
  metadata: Record<string, unknown>;
}

/**
 * User data for responses (safe to expose)
 */
export interface SafeUserData {
  email: string | undefined;
  id: string;
}

/**
 * Standard error response shape
 */
export interface AuthErrorResponse {
  error: string;
}

/**
 * Standard success message response
 */
export interface AuthSuccessResponse {
  message: string;
}

/**
 * Password reset response with user data
 */
export interface PasswordResetSuccessResponse extends AuthSuccessResponse {
  user: SafeUserData;
}

/**
 * Email verification response
 */
export interface EmailVerificationResponse {
  message: string;
  email?: string;
  verified?: boolean;
}
