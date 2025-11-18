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

export interface GiveawayConfirmationEmailData {
  to: string;
  firstName: string;
  lastName: string;
  entryNumber: number;
  participantCount: number;
  giveawayName: string;
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
