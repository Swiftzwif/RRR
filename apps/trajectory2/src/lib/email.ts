import { AssessmentCompleteEmail } from '@/emails/assessment-complete';
import { DailyExperienceEmail } from '@/emails/daily-experience';
import { Resend } from 'resend';

let resend: Resend | null = null;

const getResendClient = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Trajectory <hello@trajectory.com>';

export interface AssessmentEmailData {
  to: string;
  userName?: string;
  avatar: 'Drifter' | 'Balancer' | 'Architect';
  overallScore: number;
  lowestDomains: string[];
  assessmentUrl: string;
}

export interface DailyExperienceEmailData {
  to: string;
  userName?: string;
  dayNumber: number;
  dayTitle: string;
  bookSummaries: Array<{
    title: string;
    author: string;
    keyTakeaway: string;
  }>;
  tasks: string[];
  experienceUrl: string;
}

export interface RaffleConfirmationEmailData {
  to: string;
  userName: string;
  productName: string;
  amount: string;
  entryNumber: number;
  warriorCount: number;
  transformationGoal: string;
  accessUrl: string;
}

export interface WelcomeEmailData {
  to: string;
  userName: string;
  verificationUrl?: string;
}

export interface EmailVerificationData {
  to: string;
  userName: string;
  verificationUrl: string;
}

export interface PasswordResetEmailData {
  to: string;
  userName: string;
  resetUrl: string;
}

export interface PaymentReceiptEmailData {
  to: string;
  userName: string;
  productName: string;
  amount: string;
  paymentId: string;
  date: string;
  invoiceUrl?: string;
}

export async function sendAssessmentCompleteEmail(data: AssessmentEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }
    
    const { to, ...emailProps } = data;
    
    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your Trajectory Assessment Results: ${emailProps.avatar}`,
      react: AssessmentCompleteEmail(emailProps),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send assessment email:', error);
    return { success: false, error };
  }
}

export async function sendDailyExperienceEmail(data: DailyExperienceEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }
    
    const { to, ...emailProps } = data;
    
    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Day ${emailProps.dayNumber}: ${emailProps.dayTitle}`,
      react: DailyExperienceEmail(emailProps),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send daily experience email:', error);
    return { success: false, error };
  }
}

export async function sendRaffleConfirmationEmail(data: RaffleConfirmationEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    // For now, create a simple text email (you can create a proper React Email template later)
    const emailContent = `
      Hi ${data.userName},

      Your transformation begins now!

      🎉 PURCHASE CONFIRMED
      Product: ${data.productName}
      Amount: $${data.amount}

      🎯 YOUR RAFFLE ENTRY
      Entry Number: #${data.entryNumber}
      Total Warriors: ${data.warriorCount}
      Your Goal: "${data.transformationGoal}"

      🚀 WHAT'S NEXT
      1. Access your course immediately: ${data.accessUrl}
      2. You're automatically entered to win $2,500+ in prizes
      3. Winners announced 24 hours after raffle ends

      Welcome to the movement. Your journey from drift to dominion starts today.

      Kill the boy,
      The Trajectory Team
    `;

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `🎯 Entry #${data.entryNumber} Confirmed - Your Transformation Begins`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending raffle confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// Schedule daily emails for the 7-day experience
export async function scheduleDailyEmails(email: string, userName?: string) {
  // This would integrate with a job queue like BullMQ or Inngest
  // For now, we'll just send Day 1 immediately and log the schedule
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://trajectory.com';
  
  // Send Day 1 immediately
  await sendDailyExperienceEmail({
    to: email,
    userName,
    dayNumber: 1,
    dayTitle: "Kill the Boy - The Awakening",
    bookSummaries: [
      {
        title: "The Way of the Superior Man",
        author: "David Deida",
        keyTakeaway: "Your edge is where you stop short of your fullest gift."
      },
      {
        title: "The 48 Laws of Power",
        author: "Robert Greene",
        keyTakeaway: "Never outshine the master, but always make those above you feel superior."
      },
      {
        title: "Man's Search for Meaning",
        author: "Viktor Frankl",
        keyTakeaway: "When we can no longer change a situation, we are challenged to change ourselves."
      }
    ],
    tasks: [
      "Write down 3 areas where you're still playing the 'good soldier' role",
      "Identify one decision you've been avoiding and commit to making it today"
    ],
    experienceUrl: `${baseUrl}/experience/day/1`
  });

  // Log schedule for remaining days (would be actual scheduling in production)
  console.log(`Email schedule created for ${email}:
    - Day 1: Sent immediately
    - Day 2-7: Will be sent daily at 6 AM user's timezone
  `);

  return { success: true };
}

// Welcome email for new signups
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const emailContent = `
      Welcome to Kill The Boy, ${data.userName}!

      You've taken the first step toward transformation.

      🔥 YOUR JOURNEY BEGINS
      The path from drift to dominion starts with a single decision.
      You've made that decision today.

      📚 WHAT'S AVAILABLE NOW:
      • Free Assessment: Discover your avatar (Drifter, Balancer, or Architect)
      • Daily Wisdom: 7-day transformation experience
      • Course Access: Transform your life with proven frameworks

      ${data.verificationUrl ? `
      ✅ VERIFY YOUR EMAIL
      Click here to verify your account: ${data.verificationUrl}
      ` : ''}

      🎯 YOUR NEXT STEP:
      Take the assessment to discover your starting point:
      ${process.env.NEXT_PUBLIC_APP_URL || 'https://app.killtheboy.com'}/assessment

      Remember: Comfort is the enemy of growth.
      The boy must die for the man to be born.

      Kill the boy,
      The Trajectory Team
    `;

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Welcome to Kill The Boy - Your Transformation Begins`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// Email verification
export async function sendEmailVerification(data: EmailVerificationData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const emailContent = `
      Hi ${data.userName},

      Please verify your email address to complete your registration.

      ✅ VERIFY YOUR EMAIL
      Click the link below to verify your account:
      ${data.verificationUrl}

      This link will expire in 24 hours.

      If you didn't create an account with Kill The Boy, you can safely ignore this email.

      Kill the boy,
      The Trajectory Team
    `;

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Verify your Kill The Boy account`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// Password reset email
export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const emailContent = `
      Hi ${data.userName},

      We received a request to reset your password.

      🔐 RESET YOUR PASSWORD
      Click the link below to create a new password:
      ${data.resetUrl}

      This link will expire in 1 hour for security reasons.

      If you didn't request a password reset, you can safely ignore this email.
      Your password won't be changed unless you click the link above.

      For security, this request was made from:
      • Time: ${new Date().toISOString()}
      • IP: [Logged for security]

      Kill the boy,
      The Trajectory Team
    `;

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Reset your Kill The Boy password`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// Payment receipt email
export async function sendPaymentReceiptEmail(data: PaymentReceiptEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const emailContent = `
      Hi ${data.userName},

      Thank you for your purchase!

      💳 PAYMENT RECEIPT
      --------------------------------
      Product: ${data.productName}
      Amount: $${data.amount}
      Date: ${data.date}
      Payment ID: ${data.paymentId}
      --------------------------------

      ${data.invoiceUrl ? `
      📄 INVOICE
      Download your invoice here: ${data.invoiceUrl}
      ` : ''}

      🚀 WHAT'S NEXT?
      Access your purchase immediately:
      ${process.env.NEXT_PUBLIC_APP_URL || 'https://app.killtheboy.com'}/course

      If you have any questions about your purchase, reply to this email.

      Welcome to the transformation,
      The Trajectory Team
    `;

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Receipt for ${data.productName} - Kill The Boy`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending payment receipt email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}
