/**
 * Type definitions for authentication flows
 * Centralizes types used across auth routes and components
 */

/**
 * Login credentials from form data
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup credentials from form data
 */
export interface SignupCredentials {
  email: string;
  password: string;
}

/**
 * Password reset request body
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation body
 */
export interface PasswordResetConfirmation {
  token: string;
  password: string;
}

/**
 * Email verification request body
 */
export interface EmailVerificationRequest {
  email?: string;
  userId?: string;
}

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
