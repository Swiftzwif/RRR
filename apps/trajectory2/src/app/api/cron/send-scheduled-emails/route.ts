import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { logger } from '@/lib/logger';

/**
 * Lazy-initializes and caches Resend email client.
 * Only instantiates if RESEND_API_KEY is configured.
 *
 * @returns Resend client instance or null if not configured
 */
let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

/**
 * Curated email content for Days 2-7 of the transformation journey.
 *
 * Each day includes a subject line and HTML content with:
 * - Book summary or principle
 * - Key takeaways
 * - Actionable daily challenge or task
 *
 * Day 1 is sent immediately by scheduleDailyEmails(), so begins with Day 2.
 */
const emailContent: Record<number, { subject: string; content: string }> = {
  2: {
    subject: "Day 2: Kill the Boy - Book Summary 📚",
    content: `
      <h2>Day 2: The Power of Killing Your Former Self</h2>

      <h3>📖 Today's Read: "Can't Hurt Me" by David Goggins</h3>

      <p>David Goggins transformed from a 300-pound exterminator to a Navy SEAL through the power of mental callusing. His story teaches us that our minds give up at 40% of our actual capacity.</p>

      <h4>Key Takeaways:</h4>
      <ul>
        <li>The 40% Rule: When your mind tells you you're done, you're only 40% done</li>
        <li>Accountability Mirror: Face your weaknesses head-on</li>
        <li>Taking Souls: Turn doubt into fuel for growth</li>
      </ul>

      <h4>🎯 Today's Challenge:</h4>
      <p>Write down 3 uncomfortable truths about yourself. Face them in the mirror. These are your starting points for transformation.</p>
    `
  },
  3: {
    subject: "Day 3: Command Your Energy 💪",
    content: `
      <h2>Day 3: Mastering Your Energy Systems</h2>

      <h3>📖 Today's Read: "The Power of Now" by Eckhart Tolle</h3>

      <p>Most of our energy drains come from mental resistance to the present moment. Tolle shows us how presence is the gateway to unlimited energy.</p>

      <h4>Key Insights:</h4>
      <ul>
        <li>The pain-body feeds on negative thinking</li>
        <li>Resistance to what is creates suffering</li>
        <li>Presence transforms your relationship with time</li>
      </ul>

      <h4>🎯 Today's Practice:</h4>
      <p>Set 3 phone alarms throughout the day. When they go off, take 3 conscious breaths and fully arrive in the present moment.</p>
    `
  },
  4: {
    subject: "Day 4: Command Your Attention 🎯",
    content: `
      <h2>Day 4: Reclaiming Your Focus</h2>

      <h3>📖 Today's Read: "Deep Work" by Cal Newport</h3>

      <p>In a world of infinite distractions, the ability to focus without distraction on cognitively demanding tasks is becoming increasingly rare—and increasingly valuable.</p>

      <h4>The Deep Work Formula:</h4>
      <ul>
        <li>Work Deeply: Create rituals and routines</li>
        <li>Embrace Boredom: Train your brain to resist distraction</li>
        <li>Quit Social Media: Be intentional with your tools</li>
        <li>Drain the Shallows: Minimize low-value work</li>
      </ul>

      <h4>🎯 Today's Implementation:</h4>
      <p>Block out 90 minutes for deep work. Phone on airplane mode. One task. No exceptions.</p>
    `
  },
  5: {
    subject: "Day 5: Command Your Money 💰",
    content: `
      <h2>Day 5: Breaking Free from Money Scripts</h2>

      <h3>📖 Today's Read: "The Millionaire Fastlane" by MJ DeMarco</h3>

      <p>DeMarco destroys the "get rich slow" dogma and introduces the Fastlane—a business and lifestyle strategy based on creating exponential value.</p>

      <h4>The Three Financial Roadmaps:</h4>
      <ul>
        <li>Sidewalk: Living paycheck to paycheck</li>
        <li>Slowlane: Save 10%, invest, wait 40 years</li>
        <li>Fastlane: Create systems that generate wealth</li>
      </ul>

      <h4>🎯 Today's Audit:</h4>
      <p>List your current income sources. For each one, ask: "Can this make money while I sleep?" If not, start thinking about systems.</p>
    `
  },
  6: {
    subject: "Day 6: The Vehicle Audit 🚗",
    content: `
      <h2>Day 6: Assessing Your Life Vehicle</h2>

      <h3>📖 Today's Read: "Atomic Habits" by James Clear</h3>

      <p>You do not rise to the level of your goals. You fall to the level of your systems. Clear shows us how 1% improvements compound into remarkable results.</p>

      <h4>The Four Laws of Behavior Change:</h4>
      <ul>
        <li>Make it Obvious (Cue)</li>
        <li>Make it Attractive (Craving)</li>
        <li>Make it Easy (Response)</li>
        <li>Make it Satisfying (Reward)</li>
      </ul>

      <h4>🎯 Today's System Check:</h4>
      <p>Audit one area of your life. What's your current system? What's one 1% improvement you can make today?</p>
    `
  },
  7: {
    subject: "Day 7: Your Trajectory Blueprint 🚀",
    content: `
      <h2>Day 7: Commanding Your Future</h2>

      <h3>📖 Today's Read: "The Almanack of Naval Ravikant"</h3>

      <p>Naval teaches us that wealth is assets that earn while you sleep. But more importantly, that the ultimate goal is freedom—freedom to be yourself.</p>

      <h4>The Wealth Equation:</h4>
      <ul>
        <li>Leverage: Code, media, capital, or labor</li>
        <li>Specific Knowledge: What you uniquely know</li>
        <li>Accountability: Skin in the game</li>
        <li>Compound Interest: In wealth, relationships, and knowledge</li>
      </ul>

      <h4>🎯 Your 30-Day Challenge:</h4>
      <p>Based on your lowest-scoring domains from the assessment, create a 30-day transformation plan. One keystone habit. Daily execution. No exceptions.</p>

      <p><strong>Remember:</strong> You've killed the boy. Now it's time to build the commander.</p>
    `
  }
};

/**
 * GET /api/cron/send-scheduled-emails
 *
 * Cron job that sends queued daily experience emails (Days 2-7).
 *
 * Execution flow:
 * 1. Validates CRON_SECRET header for authentication
 * 2. Fetches emails scheduled for today from email_schedule table
 * 3. Sends each email with Day N content and book summary
 * 4. Updates email_schedule status to "sent" or "failed"
 * 5. Returns summary of sent/failed emails
 *
 * Security:
 * - Requires Bearer token matching CRON_SECRET env var
 * - Should be called only by Vercel Cron or authenticated service
 *
 * Scheduling:
 * - Called daily, typically via Vercel Cron Jobs
 * - Sends all emails scheduled for the current date
 *
 * @param request - GET request with Authorization header
 * @returns 200 with send summary, 401 for auth failure, 500 for errors
 *
 * @example Response:
 * ```json
 * {
 *   "message": "Email sending complete",
 *   "sent": 5,
 *   "failed": 0,
 *   "results": [
 *     { "email": "user@example.com", "day": 2, "status": "sent", "id": "..." }
 *   ]
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      logger.error('CRON_SECRET not configured');
      return NextResponse.json({ error: 'Cron secret not configured' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch emails scheduled for today
    const { data: scheduledEmails, error: fetchError } = await supabase!
      .from('email_schedule')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', today.toISOString())
      .order('scheduled_for', { ascending: true });

    if (fetchError) {
      logger.error('Error fetching scheduled emails', fetchError);
      return NextResponse.json({ error: 'Failed to fetch scheduled emails' }, { status: 500 });
    }

    if (!scheduledEmails || scheduledEmails.length === 0) {
      return NextResponse.json({ message: 'No emails to send' });
    }

    // Send emails
    const results = [];
    for (const scheduled of scheduledEmails) {
      const dayContent = emailContent[scheduled.day_number];

      if (!dayContent) {
        // Mark as failed if no content for this day
        await supabase!
          .from('email_schedule')
          .update({
            status: 'failed',
            error_message: `No content defined for day ${scheduled.day_number}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', scheduled.id);
        continue;
      }

      try {
        // Send email via Resend
        const resend = getResend();
        if (!resend) {
          throw new Error('Resend not configured');
        }
        
        const { data, error } = await resend.emails.send({
          from: 'Trajectory <hello@trajectorygroup.org>',
          to: scheduled.email,
          subject: dayContent.subject,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1e293b;">Trajectory</h1>
                <p style="color: #64748b;">Rethink. Redesign. Reignite.</p>
              </div>

              ${dayContent.content}

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="color: #64748b; font-size: 14px;">
                  You're receiving this because you completed the Trajectory assessment.
                  <br />
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(scheduled.email)}" style="color: #3b82f6;">Unsubscribe</a>
                </p>
              </div>
            </div>
          `
        });

        if (error) throw error;

        // Update status to sent
        await supabase!
          .from('email_schedule')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', scheduled.id);

        results.push({ email: scheduled.email, day: scheduled.day_number, status: 'sent', id: data?.id });
      } catch (error) {
        logger.error(`Error sending email to ${scheduled.email}`, error as Error);

        // Update status to failed
        await supabase!
          .from('email_schedule')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            updated_at: new Date().toISOString()
          })
          .eq('id', scheduled.id);

        results.push({ email: scheduled.email, day: scheduled.day_number, status: 'failed', error });
      }
    }

    return NextResponse.json({
      message: 'Email sending complete',
      sent: results.filter(r => r.status === 'sent').length,
      failed: results.filter(r => r.status === 'failed').length,
      results
    });
  } catch (error) {
    logger.error('Cron job error', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}