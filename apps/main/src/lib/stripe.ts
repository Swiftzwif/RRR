// Stripe integration removed - keeping minimal boilerplate
// This file exists to prevent import errors

export const stripe = null;
export const PRODUCTS = {};

export type ProductType = 'course' | 'coaching';

export async function createCheckoutSession(
  _product: ProductType,
  _userId?: string,
  _email?: string
) {
  console.log('Stripe integration removed - coming soon');
  return { url: '#' };
}

export function verifyWebhookSignature(
  _payload: string | Buffer,
  _signature: string
) {
  console.log('Stripe integration removed - coming soon');
  return { type: 'checkout.session.completed', data: { object: { metadata: { product: 'course' } } } };
}
