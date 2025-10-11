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
    Text
} from '@react-email/components';

interface AssessmentCompleteEmailProps {
  userName?: string;
  avatar: 'Drifter' | 'Balancer' | 'Architect';
  overallScore: number;
  lowestDomains: string[];
  assessmentUrl: string;
}

export const AssessmentCompleteEmail = ({
  userName = 'Commander',
  avatar,
  overallScore,
  lowestDomains,
  assessmentUrl,
}: AssessmentCompleteEmailProps) => {
  const previewText = `Your Trajectory Assessment Results: ${avatar} (${overallScore}/100)`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Heading style={h1}>Trajectory</Heading>
          </Section>

          <Heading style={h2}>Your Assessment Results Are Ready</Heading>
          
          <Text style={text}>Hey {userName},</Text>
          
          <Text style={text}>
            You&apos;ve taken the first step toward commanding your life. Your assessment reveals you&apos;re currently a <strong>{avatar}</strong> with an overall score of <strong>{overallScore}/100</strong>.
          </Text>

          <Section style={resultBox}>
            <Text style={resultTitle}>Your Avatar: {avatar}</Text>
            <Text style={resultScore}>Overall Score: {overallScore}/100</Text>
            <Text style={resultText}>
              Focus Areas: {lowestDomains.join(' & ')}
            </Text>
          </Section>

          <Text style={text}>
            But here&apos;s the truth: knowing where you are is only the beginning. The real transformation happens when you take action.
          </Text>

          <Text style={text}>
            That&apos;s why I&apos;m giving you access to the <strong>7-Day Trajectory Transformation Experience</strong> – completely free.
          </Text>

          <Section style={ctaBox}>
            <Button style={button} href={assessmentUrl}>
              Start Your 7-Day Experience
            </Button>
          </Section>

          <Text style={text}>
            Each day, you&apos;ll receive:
          </Text>
          <ul>
            <li>3 curated book summaries from transformational texts</li>
            <li>2 action tasks to implement immediately</li>
            <li>Printable worksheets to track your progress</li>
          </ul>

          <Text style={text}>
            This isn&apos;t about consuming more content. It&apos;s about commanding your trajectory.
          </Text>

          <Text style={text}>
            Ready to stop drifting and start commanding?
          </Text>

          <Text style={signature}>
            - Tyler
            <br />
            Founder, Trajectory
          </Text>

          <Text style={footer}>
            P.S. The first 7 days are free. If you want the full 31-day experience, you can unlock it anytime for $99.99.
          </Text>

          <Section style={footerLinks}>
            <Link href="https://trajectory.com/unsubscribe" style={footerLink}>
              Unsubscribe
            </Link>
            {' · '}
            <Link href="https://trajectory.com/privacy" style={footerLink}>
              Privacy Policy
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#0A0B0D',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#0E0F12',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const h1 = {
  color: '#C89B3C',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  padding: '0',
  letterSpacing: '-1px',
};

const h2 = {
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: '600',
  margin: '30px 0 20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#B8BCC8',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const resultBox = {
  backgroundColor: '#15171C',
  border: '1px solid rgba(200, 155, 60, 0.3)',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const resultTitle = {
  color: '#C89B3C',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const resultScore = {
  color: '#FFFFFF',
  fontSize: '28px',
  fontWeight: '700',
  margin: '8px 0',
};

const resultText = {
  color: '#B8BCC8',
  fontSize: '14px',
  margin: '8px 0 0',
};

const ctaBox = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#C89B3C',
  borderRadius: '8px',
  color: '#000000',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '48px',
  padding: '0 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const signature = {
  color: '#B8BCC8',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '32px 0 16px',
};

const footer = {
  color: '#71758A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '24px 0',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  paddingTop: '24px',
};

const footerLinks = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const footerLink = {
  color: '#71758A',
  fontSize: '12px',
  textDecoration: 'underline',
};

export default AssessmentCompleteEmail;
