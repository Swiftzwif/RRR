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
 * Products configuration
 */
export const PRODUCTS = {
  DIGITAL_COURSE: {
    name: "Kill The Boy Digital Course",
    tagline: "Change Your Trajectory by Shifting Lanes",
    regularPrice: 149,
    salePrice: 97,
    saleEndsDate: "2025-11-07T23:59:59-05:00", // EST timezone
    currency: "USD",
    thinkificUrl: THINKIFIC_COURSE_URL,
    benefits: [
      "10 Core Lessons + 7 Transformative Conversations",
      "Master The Three Medicines: Fearlessness, Humility, Compassion",
      "From Good Little Soldier → Commander of Your Life",
      "Lifetime access + future updates"
    ],
    impact: "Organize your mind, evolve your consciousness, and discover your infinite worth. This isn't information—it's the operating system upgrade that transforms how you command your attention, energy, and money."
  },
  INNER_MASTERY: {
    name: "Inner Mastery Sessions",
    tagline: "Elite 1-on-1 Transformation Coaching",
    status: "coming_soon",
    pricing: "Custom",
    applicationUrl: "/coaching",
    description: "Personal coaching with Jean. Limited to 250 clients per year. Coming soon."
  }
} as const;

/**
 * Helper functions for sale logic
 */
export const isSaleActive = (): boolean => {
  const now = new Date();
  const saleEnd = new Date(PRODUCTS.DIGITAL_COURSE.saleEndsDate);
  return now < saleEnd;
};

export const getCurrentPrice = (): number => {
  return isSaleActive() 
    ? PRODUCTS.DIGITAL_COURSE.salePrice 
    : PRODUCTS.DIGITAL_COURSE.regularPrice;
};

export const getSalePercentage = (): number => {
  const { regularPrice, salePrice } = PRODUCTS.DIGITAL_COURSE;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

/**
 * Legacy course configuration (deprecated - use PRODUCTS.DIGITAL_COURSE)
 */
export const COURSE_CONFIG = {
  name: 'Rethink. Redesign. Reignite.',
  price: 97,
  currency: 'USD',
  modules: 6,
  totalHours: 15,
} as const;
