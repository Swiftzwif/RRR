import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create shared mock function before vi.mock
const mockSendFn = vi.fn();

// Mock Resend module
vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = {
        send: mockSendFn,
      };
    },
  };
});

import {
  sendAssessmentCompleteEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendPaymentReceiptEmail,
  type AssessmentEmailData,
  type EmailVerificationData,
  type PasswordResetEmailData,
  type WelcomeEmailData,
  type PaymentReceiptEmailData,
} from './email';

describe('email.ts - CRITICAL EMAIL FUNCTIONALITY', () => {
  beforeEach(() => {
    mockSendFn.mockClear();
    mockSendFn.mockResolvedValue({ id: 'test-email-id' });
    process.env.RESEND_API_KEY = 'test-api-key';
    process.env.RESEND_FROM_EMAIL = 'Test <test@trajectory.com>';
  });

  describe('sendAssessmentCompleteEmail', () => {
    it('should send assessment email successfully', async () => {
      const data: AssessmentEmailData = {
        to: 'user@example.com',
        userName: 'John Doe',
        avatar: 'Drifter',
        overallScore: 2.5,
        lowestDomains: ['finances', 'health'],
        assessmentUrl: 'https://test.trajectory.com/results/123',
      };

      const result = await sendAssessmentCompleteEmail(data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: 'test-email-id' });
      expect(mockSendFn).toHaveBeenCalledTimes(1);

      const callArgs = mockSendFn.mock.calls[0][0];
      expect(callArgs.to).toBe('user@example.com');
      expect(callArgs.subject).toContain('Drifter');
    });

    it('should handle send errors gracefully', async () => {
      mockSendFn.mockRejectedValueOnce(new Error('Network error'));

      const data: AssessmentEmailData = {
        to: 'user@example.com',
        avatar: 'Architect',
        overallScore: 4.8,
        lowestDomains: ['focus'],
        assessmentUrl: 'https://test.trajectory.com/results/123',
      };

      const result = await sendAssessmentCompleteEmail(data);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('sendEmailVerification', () => {
    it('should send verification email successfully', async () => {
      const data: EmailVerificationData = {
        to: 'newuser@example.com',
        userName: 'Jane Smith',
        verificationUrl: 'https://test.trajectory.com/verify?token=abc123',
      };

      const result = await sendEmailVerification(data);

      expect(result.success).toBe(true);
      expect(mockSendFn).toHaveBeenCalledTimes(1);

      const callArgs = mockSendFn.mock.calls[0][0];
      expect(callArgs.to).toBe('newuser@example.com');
      expect(callArgs.subject).toContain('Verify');
    });

    it('should include verification URL in email content', async () => {
      const data: EmailVerificationData = {
        to: 'user@example.com',
        userName: 'Test User',
        verificationUrl: 'https://test.trajectory.com/verify?token=xyz789',
      };

      const result = await sendEmailVerification(data);

      expect(result.success).toBe(true);
      const callArgs = mockSendFn.mock.calls[0][0];
      expect(callArgs.text).toContain('xyz789');
    });

    it('should handle send errors', async () => {
      mockSendFn.mockRejectedValueOnce(new Error('API Error'));

      const data: EmailVerificationData = {
        to: 'user@example.com',
        userName: 'Test User',
        verificationUrl: 'https://test.trajectory.com/verify?token=abc',
      };

      const result = await sendEmailVerification(data);

      expect(result.success).toBe(false);
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      const data: PasswordResetEmailData = {
        to: 'user@example.com',
        userName: 'John Doe',
        resetUrl: 'https://test.trajectory.com/reset?token=reset123',
      };

      const result = await sendPasswordResetEmail(data);

      expect(result.success).toBe(true);
      expect(mockSendFn).toHaveBeenCalledTimes(1);

      const callArgs = mockSendFn.mock.calls[0][0];
      expect(callArgs.to).toBe('user@example.com');
      expect(callArgs.subject).toContain('password');
    });

    it('should include reset URL in email content', async () => {
      const data: PasswordResetEmailData = {
        to: 'user@example.com',
        userName: 'Test User',
        resetUrl: 'https://test.trajectory.com/reset?token=secret456',
      };

      const result = await sendPasswordResetEmail(data);

      expect(result.success).toBe(true);
      const callArgs = mockSendFn.mock.calls[0][0];
      expect(callArgs.text).toContain('secret456');
    });

    it('should handle send errors', async () => {
      mockSendFn.mockRejectedValueOnce(new Error('Timeout'));

      const data: PasswordResetEmailData = {
        to: 'user@example.com',
        userName: 'Test User',
        resetUrl: 'https://test.trajectory.com/reset',
      };

      const result = await sendPasswordResetEmail(data);

      expect(result.success).toBe(false);
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const data: WelcomeEmailData = {
        to: 'newuser@example.com',
        userName: 'New User',
        verificationUrl: 'https://test.trajectory.com/verify?token=welcome123',
      };

      const result = await sendWelcomeEmail(data);

      expect(result.success).toBe(true);
      expect(mockSendFn).toHaveBeenCalledTimes(1);

      const callArgs = mockSendFn.mock.calls[0][0];
      expect(callArgs.to).toBe('newuser@example.com');
      expect(callArgs.subject).toContain('Welcome');
    });

    it('should work without verification URL', async () => {
      const data: WelcomeEmailData = {
        to: 'user@example.com',
        userName: 'Test User',
      };

      const result = await sendWelcomeEmail(data);

      expect(result.success).toBe(true);
    });

    it('should handle send errors', async () => {
      mockSendFn.mockRejectedValueOnce(new Error('Service unavailable'));

      const data: WelcomeEmailData = {
        to: 'user@example.com',
        userName: 'Test User',
      };

      const result = await sendWelcomeEmail(data);

      expect(result.success).toBe(false);
    });
  });

  describe('sendPaymentReceiptEmail', () => {
    it('should send payment receipt email successfully', async () => {
      const data: PaymentReceiptEmailData = {
        to: 'customer@example.com',
        userName: 'Paying Customer',
        productName: 'Course Access',
        amount: '99.99',
        paymentId: 'pay_123456',
        date: '2025-01-15',
        invoiceUrl: 'https://test.trajectory.com/invoice/123',
      };

      const result = await sendPaymentReceiptEmail(data);

      expect(result.success).toBe(true);
      expect(mockSendFn).toHaveBeenCalledTimes(1);

      const callArgs = mockSendFn.mock.calls[0][0];
      expect(callArgs.to).toBe('customer@example.com');
      expect(callArgs.subject).toContain('Receipt');
    });

    it('should work without invoice URL', async () => {
      const data: PaymentReceiptEmailData = {
        to: 'customer@example.com',
        userName: 'Customer',
        productName: 'Course',
        amount: '99.99',
        paymentId: 'pay_123',
        date: '2025-01-15',
      };

      const result = await sendPaymentReceiptEmail(data);

      expect(result.success).toBe(true);
    });

    it('should include payment details in email', async () => {
      const data: PaymentReceiptEmailData = {
        to: 'customer@example.com',
        userName: 'Customer',
        productName: 'Coaching Application',
        amount: '24.99',
        paymentId: 'pay_789',
        date: '2025-01-15',
      };

      const result = await sendPaymentReceiptEmail(data);

      expect(result.success).toBe(true);
      const callArgs = mockSendFn.mock.calls[0][0];
      expect(callArgs.text).toContain('24.99');
      expect(callArgs.text).toContain('pay_789');
    });

    it('should handle send errors', async () => {
      mockSendFn.mockRejectedValueOnce(new Error('Email service down'));

      const data: PaymentReceiptEmailData = {
        to: 'customer@example.com',
        userName: 'Customer',
        productName: 'Course',
        amount: '99.99',
        paymentId: 'pay_123',
        date: '2025-01-15',
      };

      const result = await sendPaymentReceiptEmail(data);

      expect(result.success).toBe(false);
    });
  });
});
