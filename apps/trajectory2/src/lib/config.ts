/**
 * Application-wide configuration constants
 */

export const THINKIFIC_COURSE_URL = 
  process.env.NEXT_PUBLIC_THINKIFIC_COURSE_URL || 
  'https://jean-s-site-8b39.thinkific.com/products/courses/trajectory';

export const APP_URL = 
  process.env.NEXT_PUBLIC_APP_URL || 
  'https://trajectorygroup.org';

/**
 * Course configuration
 */
export const COURSE_CONFIG = {
  name: 'Rethink. Redesign. Reignite.',
  price: 97,
  currency: 'USD',
  modules: 6,
  totalHours: 15,
} as const;
