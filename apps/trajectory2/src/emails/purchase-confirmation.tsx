import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PurchaseConfirmationEmailProps {
  userName?: string;
  productName: string;
  productType: 'course' | 'coaching';
  amount: string;
  accessUrl: string;
  purchaseDate: string;
}

export const PurchaseConfirmationEmail = ({
  userName = 'Commander',
  productName,
  productType,
  amount,
  accessUrl,
  purchaseDate,
}: PurchaseConfirmationEmailProps) => {
  const previewText = `Your purchase of ${productName} is confirmed`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Trajectory</Heading>
            <Text style={tagline}>Rethink. Redesign. Reignite.</Text>
          </Section>

          {/* Success Message */}
          <Section style={successSection}>
            <Text style={successIcon}>✓</Text>
            <Heading style={h2}>Purchase Confirmed!</Heading>
            <Text style={paragraph}>
              Thank you for your purchase, {userName}. Your payment has been successfully processed.
            </Text>
          </Section>

          {/* Purchase Details */}
          <Section style={detailsSection}>
            <Text style={detailsHeading}>Order Details</Text>
            <table style={detailsTable}>
              <tr>
                <td style={detailLabel}>Product:</td>
                <td style={detailValue}>{productName}</td>
              </tr>
              <tr>
                <td style={detailLabel}>Amount:</td>
                <td style={detailValue}>${amount}</td>
              </tr>
              <tr>
                <td style={detailLabel}>Date:</td>
                <td style={detailValue}>{purchaseDate}</td>
              </tr>
            </table>
          </Section>

          {/* Access Instructions */}
          <Section style={accessSection}>
            <Heading style={h3}>
              {productType === 'course' ? 'Access Your Course' : 'Schedule Your Session'}
            </Heading>
            <Text style={paragraph}>
              {productType === 'course' 
                ? 'Your course is now available! Click the button below to start your transformation journey.'
                : 'You now have access to schedule your coaching interview. Click below to book your session.'}
            </Text>
            <Button href={accessUrl} style={button}>
              {productType === 'course' ? 'Start Course' : 'Schedule Session'} →
            </Button>
          </Section>

          {/* What's Next */}
          <Section style={nextStepsSection}>
            <Heading style={h3}>What's Next?</Heading>
            {productType === 'course' ? (
              <>
                <Text style={listItem}>
                  <strong>1. Access Your Dashboard:</strong> All course materials are waiting for you.
                </Text>
                <Text style={listItem}>
                  <strong>2. Start Module 1:</strong> Begin with "Kill the Boy" to set your foundation.
                </Text>
                <Text style={listItem}>
                  <strong>3. Join the Community:</strong> Connect with other high-performers on their trajectory.
                </Text>
                <Text style={listItem}>
                  <strong>4. Take Action:</strong> This course only works if you implement what you learn.
                </Text>
              </>
            ) : (
              <>
                <Text style={listItem}>
                  <strong>1. Schedule Your Interview:</strong> Pick a time that works for your calendar.
                </Text>
                <Text style={listItem}>
                  <strong>2. Prepare:</strong> Think about your current trajectory and where you want to go.
                </Text>
                <Text style={listItem}>
                  <strong>3. Show Up:</strong> Be ready for an honest conversation about your life.
                </Text>
                <Text style={listItem}>
                  <strong>4. Commit:</strong> If we're a good fit, be ready to take action.
                </Text>
              </>
            )}
          </Section>

          {/* Support */}
          <Section style={supportSection}>
            <Text style={supportText}>
              Questions or issues? Reply to this email or contact us at{' '}
              <Link href="mailto:jsanchez@trajectorygroup.org" style={link}>
                jsanchez@trajectorygroup.org
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Trajectory Group. All rights reserved.
            </Text>
            <Text style={footerText}>
              You're receiving this email because you made a purchase on trajectorygroup.org
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PurchaseConfirmationEmail;

// Styles
const main = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#1a1a1a',
  padding: '30px 40px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
};

const h1 = {
  color: '#d4af37',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  letterSpacing: '1px',
};

const tagline = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  opacity: '0.8',
};

const successSection = {
  backgroundColor: '#ffffff',
  padding: '40px 40px 30px 40px',
  textAlign: 'center' as const,
};

const successIcon = {
  fontSize: '48px',
  margin: '0 0 16px 0',
  color: '#d4af37',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const h3 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const paragraph = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const detailsSection = {
  backgroundColor: '#ffffff',
  padding: '0 40px 30px 40px',
};

const detailsHeading = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const detailLabel = {
  color: '#718096',
  fontSize: '14px',
  padding: '8px 0',
  width: '120px',
};

const detailValue = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  padding: '8px 0',
};

const accessSection = {
  backgroundColor: '#ffffff',
  padding: '30px 40px',
  borderTop: '1px solid #e2e8f0',
};

const button = {
  backgroundColor: '#d4af37',
  borderRadius: '8px',
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  margin: '24px 0 0 0',
};

const nextStepsSection = {
  backgroundColor: '#ffffff',
  padding: '30px 40px',
  borderTop: '1px solid #e2e8f0',
};

const listItem = {
  color: '#4a5568',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 12px 0',
};

const supportSection = {
  backgroundColor: '#ffffff',
  padding: '30px 40px',
  borderTop: '1px solid #e2e8f0',
  borderRadius: '0 0 8px 8px',
};

const supportText = {
  color: '#718096',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  textAlign: 'center' as const,
};

const link = {
  color: '#d4af37',
  textDecoration: 'underline',
};

const footer = {
  padding: '20px 40px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#718096',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 8px 0',
};

