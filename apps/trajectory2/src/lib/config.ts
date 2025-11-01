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

/**
 * Products configuration
 */
export const PRODUCTS = {
  DIGITAL_COURSE: {
    name: "Kill The Boy Digital Course",
    tagline: "Change Your Trajectory by Shifting Lanes",
    regularPrice: 149,
    salePrice: 97,
    saleEndsDate: "2025-11-07T23:59:59-05:00", // November 7, 2025 at 11:59 PM EST
    thinkificUrl: THINKIFIC_COURSE_URL,
    benefits: [
      "10 comprehensive lessons on transformation",
      "Access to all frameworks and worksheets",
      "Lifetime access to course materials",
      "30-day money-back guarantee"
    ],
    impact: "This isn't just a course—it's an operating system upgrade for your life. Learn the frameworks that help you command your attention, energy, and resources. Transform from drifter to architect."
  },
  INNER_MASTERY: {
    name: "Inner Mastery Sessions",
    tagline: "1-on-1 Transformation Coaching",
    pricing: "Custom",
    applicationUrl: "/coaching",
    description: "Work directly with Jean to create a personalized transformation roadmap. Limited to 250 clients per year for maximum impact and attention."
  }
} as const;

/**
 * Check if sale is currently active
 */
export function isSaleActive(): boolean {
  const now = new Date();
  const saleEnd = new Date(PRODUCTS.DIGITAL_COURSE.saleEndsDate);
  return now < saleEnd;
}

/**
 * Get current price (sale or regular)
 */
export function getCurrentPrice(): number {
  return isSaleActive() 
    ? PRODUCTS.DIGITAL_COURSE.salePrice 
    : PRODUCTS.DIGITAL_COURSE.regularPrice;
}

/**
 * Calculate discount percentage
 */
export function getSalePercentage(): number {
  const regular = PRODUCTS.DIGITAL_COURSE.regularPrice;
  const sale = PRODUCTS.DIGITAL_COURSE.salePrice;
  return Math.round(((regular - sale) / regular) * 100);
}
