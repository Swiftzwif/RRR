/**
 * Input sanitization utilities
 * Protects against XSS attacks by sanitizing user-generated content
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify to remove potentially malicious code
 *
 * @param dirty - Untrusted HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text by stripping all HTML tags
 * Useful for displaying user input in contexts where HTML is not expected
 *
 * @param dirty - Untrusted string that may contain HTML
 * @returns Plain text with all HTML removed
 */
export function sanitizeText(dirty: string): string {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize email address
 * Validates format and removes potentially dangerous characters
 *
 * @param email - Email address to sanitize
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  // Remove all HTML and trim
  const cleaned = sanitizeText(email).trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  return emailRegex.test(cleaned) ? cleaned : '';
}

/**
 * Sanitize URL to prevent javascript: and data: URLs
 *
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const cleaned = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
  const lowerUrl = cleaned.toLowerCase();

  if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
    return '';
  }

  // Only allow http(s) and relative URLs
  if (!lowerUrl.startsWith('http://') &&
      !lowerUrl.startsWith('https://') &&
      !lowerUrl.startsWith('/')) {
    return '';
  }

  return cleaned;
}

/**
 * Sanitize transformation goal for admin dashboard display
 * Allows basic formatting but prevents XSS
 *
 * @param goal - User's transformation goal text
 * @returns Sanitized goal text safe for display
 */
export function sanitizeTransformationGoal(goal: string): string {
  if (!goal) return '';

  // Allow paragraph breaks but nothing else
  return DOMPurify.sanitize(goal, {
    ALLOWED_TAGS: ['br', 'p'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize object with user-generated content
 * Recursively sanitizes string values in an object
 *
 * @param obj - Object containing user-generated content
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeText(item) :
        typeof item === 'object' && item !== null ? sanitizeObject(item as Record<string, unknown>) :
        item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
