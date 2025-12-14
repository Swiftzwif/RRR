import { Resend } from 'resend';

let resend: Resend | null = null;

export function getResendClient(): Resend | null {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Trajectory <hello@trajectory.com>';
