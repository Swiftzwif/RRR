import { AssessmentCompleteEmail } from '@/emails/assessment-complete';
import { DailyExperienceEmail } from '@/emails/daily-experience';
import { getResendClient, FROM_EMAIL } from './config';
import {
  createRaffleConfirmationEmail,
  createGiveawayConfirmationEmail,
  createWelcomeEmail,
  createEmailVerification,
  createPasswordResetEmail,
  createPaymentReceiptEmail,
} from './templates';
import type {
  AssessmentEmailData,
  DailyExperienceEmailData,
  RaffleConfirmationEmailData,
  GiveawayConfirmationEmailData,
  WelcomeEmailData,
  EmailVerificationData,
  PasswordResetEmailData,
  PaymentReceiptEmailData,
} from './types';

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

    const emailContent = createRaffleConfirmationEmail(data);

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

export async function sendGiveawayConfirmationEmail(data: GiveawayConfirmationEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const emailContent = createGiveawayConfirmationEmail(data);

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `✅ Giveaway Entry #${data.entryNumber} Confirmed - You're In!`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending giveaway confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const emailContent = createWelcomeEmail(data);

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

export async function sendEmailVerification(data: EmailVerificationData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const emailContent = createEmailVerification(data);

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

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const emailContent = createPasswordResetEmail(data);

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

export async function sendPaymentReceiptEmail(data: PaymentReceiptEmailData) {
  try {
    const resendClient = getResendClient();
    if (!resendClient) {
      console.warn('Email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const emailContent = createPaymentReceiptEmail(data);

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

export async function scheduleDailyEmails(email: string, userName?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://trajectory.com';

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

  const { getSupabaseServiceRole } = await import('../supabase');
  const supabase = getSupabaseServiceRole();

  if (supabase) {
    const schedulePromises = [];
    const today = new Date();

    for (let day = 2; day <= 7; day++) {
      const scheduledDate = new Date(today);
      scheduledDate.setDate(scheduledDate.getDate() + (day - 1));
      scheduledDate.setHours(11, 0, 0, 0);

      schedulePromises.push(
        supabase.from('email_schedule').upsert({
          email,
          user_name: userName,
          day_number: day,
          scheduled_for: scheduledDate.toISOString(),
          status: 'pending',
          metadata: {
            baseUrl,
            createdAt: new Date().toISOString()
          }
        }, {
          onConflict: 'email,day_number'
        })
      );
    }

    await Promise.all(schedulePromises);

    console.log(`Email schedule created for ${email}:
      - Day 1: Sent immediately
      - Days 2-7: Scheduled for daily delivery at 11 AM UTC
    `);
  }

  return { success: true };
}
