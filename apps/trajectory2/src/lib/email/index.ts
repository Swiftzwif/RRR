export {
  sendAssessmentCompleteEmail,
  sendDailyExperienceEmail,
  sendRaffleConfirmationEmail,
  sendGiveawayConfirmationEmail,
  scheduleDailyEmails,
  sendWelcomeEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendPaymentReceiptEmail,
} from './sender';

export type {
  AssessmentEmailData,
  DailyExperienceEmailData,
  RaffleConfirmationEmailData,
  GiveawayConfirmationEmailData,
  WelcomeEmailData,
  EmailVerificationData,
  PasswordResetEmailData,
  PaymentReceiptEmailData,
} from './types';

export { getResendClient, FROM_EMAIL } from './config';
