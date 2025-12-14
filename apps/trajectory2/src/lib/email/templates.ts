import type {
  RaffleConfirmationEmailData,
  GiveawayConfirmationEmailData,
  WelcomeEmailData,
  EmailVerificationData,
  PasswordResetEmailData,
  PaymentReceiptEmailData,
} from './types';

export function createRaffleConfirmationEmail(data: Omit<RaffleConfirmationEmailData, 'to'>): string {
  return `
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
}

export function createGiveawayConfirmationEmail(data: Omit<GiveawayConfirmationEmailData, 'to'>): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://trajectorygroup.org';
  const fullName = `${data.firstName} ${data.lastName}`;

  return `
    Hi ${data.firstName},

    You're officially entered into the ${data.giveawayName}!

    🎯 YOUR GIVEAWAY ENTRY
    Entry Number: #${data.entryNumber}
    Total Participants: ${data.participantCount}
    Name: ${fullName}

    ✅ WHAT YOU'VE COMPLETED
    • Subscribed to Kill The Boy Weekly Newsletter
    • Liked the Instagram post
    • Shared the Instagram post
    • Tagged a friend in the comments

    🎁 WHAT YOU COULD WIN
    We'll be giving away $2,500+ in transformation prizes to multiple winners. Winners will be selected and notified after the giveaway ends.

    💎 OPTIONAL: ACCELERATE YOUR TRANSFORMATION
    Want to start transforming your life right now? Get instant access to "Change Your Trajectory by Shifting Lanes" course at 35% off during our opening week.

    ${baseUrl}/giveaway

    🔍 VERIFICATION NOTE
    Your entry will be manually verified by our team. We'll cross-reference your newsletter subscription and Instagram actions. Only verified entries are eligible to win.

    Thank you for being part of the movement. Your journey from drift to dominion starts with a single decision.

    Kill the boy,
    The Trajectory Team
  `;
}

export function createWelcomeEmail(data: Omit<WelcomeEmailData, 'to'>): string {
  return `
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
}

export function createEmailVerification(data: Omit<EmailVerificationData, 'to'>): string {
  return `
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
}

export function createPasswordResetEmail(data: Omit<PasswordResetEmailData, 'to'>): string {
  return `
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
}

export function createPaymentReceiptEmail(data: Omit<PaymentReceiptEmailData, 'to'>): string {
  return `
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
}
