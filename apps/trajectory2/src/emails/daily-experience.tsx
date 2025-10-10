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

interface DailyExperienceEmailProps {
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

export const DailyExperienceEmail = ({
  userName = 'Commander',
  dayNumber,
  dayTitle,
  bookSummaries,
  tasks,
  experienceUrl,
}: DailyExperienceEmailProps) => {
  const previewText = `Day ${dayNumber}: ${dayTitle} - Your daily transformation awaits`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Trajectory</Text>
            <Text style={dayBadge}>Day {dayNumber} of 31</Text>
          </Section>

          <Heading style={h1}>{dayTitle}</Heading>
          
          <Text style={greeting}>Morning, {userName}.</Text>
          
          <Text style={text}>
            Today marks Day {dayNumber} of your transformation. Remember: every commander started as a soldier. The difference? They chose to wake up.
          </Text>

          <Section style={contentSection}>
            <Heading style={h2}>📚 Today&apos;s Book Summaries</Heading>
            
            {bookSummaries.map((book, index) => (
              <Section key={index} style={bookCard}>
                <Text style={bookTitle}>
                  {index + 1}. &ldquo;{book.title}&rdquo; by {book.author}
                </Text>
                <Text style={bookTakeaway}>
                  <strong>Key Takeaway:</strong> {book.keyTakeaway}
                </Text>
              </Section>
            ))}
          </Section>

          <Section style={contentSection}>
            <Heading style={h2}>✓ Today&apos;s Action Tasks</Heading>
            
            {tasks.map((task, index) => (
              <Section key={index} style={taskItem}>
                <Text style={taskText}>
                  <strong>Task {index + 1}:</strong> {task}
                </Text>
              </Section>
            ))}
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href={experienceUrl}>
              Access Full Day {dayNumber} Content
            </Button>
            <Text style={ctaSubtext}>
              Includes full summaries, worksheets, and implementation guides
            </Text>
          </Section>

          <Text style={quote}>
            &ldquo;The distance between who you are and who you could be is measured in the actions you take today.&rdquo;
          </Text>

          <Text style={signature}>
            Command your day,<br />
            Tyler
          </Text>

          {dayNumber === 7 && (
            <Section style={upgradeBox}>
              <Text style={upgradeTitle}>Ready for the Full Experience?</Text>
              <Text style={upgradeText}>
                You&apos;ve completed the free 7-day experience. Unlock all 31 days and continue your transformation for just $99.99.
              </Text>
              <Button style={upgradeButton} href={`${experienceUrl}?upgrade=true`}>
                Unlock Full Access
              </Button>
            </Section>
          )}

          <Section style={footer}>
            <Link href="https://trajectory.com/unsubscribe" style={footerLink}>
              Unsubscribe
            </Link>
            {' · '}
            <Link href="https://trajectory.com/privacy" style={footerLink}>
              Privacy
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

const header = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const logo = {
  color: '#C89B3C',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 8px',
};

const dayBadge = {
  color: '#71758A',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0',
};

const h1 = {
  color: '#FFFFFF',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px',
  textAlign: 'center' as const,
  lineHeight: '36px',
};

const h2 = {
  color: '#C89B3C',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const greeting = {
  color: '#B8BCC8',
  fontSize: '16px',
  margin: '0 0 16px',
};

const text = {
  color: '#B8BCC8',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const contentSection = {
  margin: '32px 0',
  padding: '24px 0',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
};

const bookCard = {
  backgroundColor: '#15171C',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  padding: '16px',
  margin: '12px 0',
};

const bookTitle = {
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const bookTakeaway = {
  color: '#B8BCC8',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const taskItem = {
  borderLeft: '3px solid #C89B3C',
  paddingLeft: '16px',
  margin: '12px 0',
};

const taskText = {
  color: '#B8BCC8',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '24px 0',
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
};

const ctaSubtext = {
  color: '#71758A',
  fontSize: '14px',
  margin: '12px 0 0',
};

const quote = {
  color: '#71758A',
  fontSize: '14px',
  fontStyle: 'italic' as const,
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '0 20px',
};

const signature = {
  color: '#B8BCC8',
  fontSize: '16px',
  margin: '24px 0',
};

const upgradeBox = {
  backgroundColor: 'rgba(200, 155, 60, 0.1)',
  border: '1px solid rgba(200, 155, 60, 0.3)',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const upgradeTitle = {
  color: '#C89B3C',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const upgradeText = {
  color: '#B8BCC8',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const upgradeButton = {
  backgroundColor: 'transparent',
  border: '2px solid #C89B3C',
  borderRadius: '8px',
  color: '#C89B3C',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '44px',
  padding: '0 32px',
  textDecoration: 'none',
};

const footer = {
  textAlign: 'center' as const,
  margin: '32px 0 0',
  paddingTop: '24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
};

const footerLink = {
  color: '#71758A',
  fontSize: '12px',
  textDecoration: 'underline',
};

export default DailyExperienceEmail;
