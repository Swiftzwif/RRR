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
