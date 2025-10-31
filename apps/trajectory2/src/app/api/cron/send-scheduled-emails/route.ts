import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceRole } from '@/lib/supabase';
import { sendDailyExperienceEmail } from '@/lib/email';

// Vercel Cron configuration
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This will run daily at 6 AM UTC (configurable in vercel.json)
export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel Cron job
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get emails scheduled for today that haven't been sent
    const now = new Date();
    const { data: scheduledEmails, error } = await supabase
      .from('email_schedule')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now.toISOString())
      .limit(50); // Process up to 50 emails per run

    if (error) {
      console.error('Error fetching scheduled emails:', error);
      return NextResponse.json(
        { error: 'Failed to fetch scheduled emails' },
        { status: 500 }
      );
    }

    if (!scheduledEmails || scheduledEmails.length === 0) {
      return NextResponse.json({
        message: 'No emails to send',
        processed: 0
      });
    }

    // Process each scheduled email
    const results = [];
    for (const scheduled of scheduledEmails) {
      try {
        // Get content for the specific day
        const emailContent = getDayContent(scheduled.day_number);

        // Send the email
        await sendDailyExperienceEmail({
          to: scheduled.email,
          userName: scheduled.user_name || scheduled.email.split('@')[0],
          dayNumber: scheduled.day_number,
          dayTitle: emailContent.title,
          dayDescription: emailContent.description,
          bookSummaries: emailContent.bookSummaries,
          dailyTasks: emailContent.tasks,
          worksheetUrl: emailContent.worksheetUrl
        });

        // Update status to sent
        await supabase
          .from('email_schedule')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', scheduled.id);

        results.push({
          email: scheduled.email,
          day: scheduled.day_number,
          status: 'sent'
        });
      } catch (emailError) {
        console.error(`Failed to send email to ${scheduled.email}:`, emailError);

        // Update status to failed
        await supabase
          .from('email_schedule')
          .update({
            status: 'failed',
            error_message: emailError instanceof Error ? emailError.message : 'Unknown error'
          })
          .eq('id', scheduled.id);

        results.push({
          email: scheduled.email,
          day: scheduled.day_number,
          status: 'failed',
          error: emailError instanceof Error ? emailError.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      message: 'Email processing complete',
      processed: results.length,
      results
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get content for each day
function getDayContent(dayNumber: number) {
  const dayContents: Record<number, any> = {
    1: {
      title: "Kill the Boy - The Awakening",
      description: "Today marks the beginning of your transformation journey. It's time to let go of who you were to become who you're meant to be.",
      bookSummaries: [
        {
          title: "Can't Hurt Me",
          author: "David Goggins",
          summary: "Transform your mindset through extreme ownership and mental toughness.",
          keyTakeaway: "You are capable of far more than you think. The only way out is through."
        },
        {
          title: "The War of Art",
          author: "Steven Pressfield",
          summary: "Overcome the resistance that keeps you from achieving your true potential.",
          keyTakeaway: "The amateur waits for inspiration; the professional shows up every day."
        },
        {
          title: "Extreme Ownership",
          author: "Jocko Willink",
          summary: "Take complete responsibility for your life and lead yourself to victory.",
          keyTakeaway: "There are no bad teams, only bad leaders. Lead yourself first."
        }
      ],
      tasks: [
        {
          title: "Morning Declaration",
          description: "Write and speak aloud your commitment to change. Record yourself if needed."
        },
        {
          title: "Identify Your Dragons",
          description: "List 3 habits or beliefs that are holding you back. Be brutally honest."
        }
      ],
      worksheetUrl: "/worksheets/day1-kill-the-boy.pdf"
    },
    2: {
      title: "The Mirror of Truth",
      description: "Face yourself without filters or excuses. True change begins with radical self-honesty.",
      bookSummaries: [
        {
          title: "Radical Acceptance",
          author: "Tara Brach",
          summary: "Embrace your whole self, including the parts you've been hiding from.",
          keyTakeaway: "The boundary to what we can accept is the boundary to our freedom."
        },
        {
          title: "The Body Keeps the Score",
          author: "Bessel van der Kolk",
          summary: "Understanding how past experiences shape your present reactions.",
          keyTakeaway: "You can't heal what you don't acknowledge."
        },
        {
          title: "Rising Strong",
          author: "Brené Brown",
          summary: "The physics of vulnerability and the power of owning your story.",
          keyTakeaway: "You can't skip the middle part - the messy middle is where the magic happens."
        }
      ],
      tasks: [
        {
          title: "The Accountability Mirror",
          description: "Stand in front of a mirror and have a real conversation with yourself about where you are vs where you want to be."
        },
        {
          title: "Write Your Origin Story",
          description: "Document the events that shaped you - both triumphs and traumas. This is for your eyes only."
        }
      ],
      worksheetUrl: "/worksheets/day2-mirror-of-truth.pdf"
    },
    3: {
      title: "Embrace the Suck",
      description: "Comfort is the enemy of growth. Today, we lean into discomfort deliberately.",
      bookSummaries: [
        {
          title: "The Comfort Crisis",
          author: "Michael Easter",
          summary: "Why seeking discomfort is the key to a fulfilling life.",
          keyTakeaway: "2% of people seek discomfort regularly. They're also the most successful."
        },
        {
          title: "The Obstacle Is the Way",
          author: "Ryan Holiday",
          summary: "Ancient Stoic wisdom for turning trials into triumphs.",
          keyTakeaway: "What stands in the way becomes the way."
        },
        {
          title: "Antifragile",
          author: "Nassim Taleb",
          summary: "How to thrive in chaos and uncertainty.",
          keyTakeaway: "Wind extinguishes a candle but energizes fire. Be the fire."
        }
      ],
      tasks: [
        {
          title: "Cold Exposure Challenge",
          description: "End your shower with 60 seconds of cold water. Breathe through the discomfort."
        },
        {
          title: "The Hard Conversation",
          description: "Have one difficult conversation you've been avoiding. Set a boundary or speak a truth."
        }
      ],
      worksheetUrl: "/worksheets/day3-embrace-the-suck.pdf"
    },
    4: {
      title: "The Warrior's Discipline",
      description: "Freedom comes through discipline. Structure creates spontaneity.",
      bookSummaries: [
        {
          title: "Discipline Equals Freedom",
          author: "Jocko Willink",
          summary: "Field manual for achieving freedom through disciplined action.",
          keyTakeaway: "The easy path leads to a hard life. The hard path leads to an easy life."
        },
        {
          title: "Atomic Habits",
          author: "James Clear",
          summary: "Tiny changes that deliver remarkable results.",
          keyTakeaway: "You don't rise to the level of your goals, you fall to the level of your systems."
        },
        {
          title: "The Power of Now",
          author: "Eckhart Tolle",
          summary: "Breaking free from the tyranny of thought through presence.",
          keyTakeaway: "Realize deeply that the present moment is all you ever have."
        }
      ],
      tasks: [
        {
          title: "Design Your Battle Rhythm",
          description: "Create a morning routine that you'll follow for the next 30 days. Start with just 3 non-negotiable actions."
        },
        {
          title: "The 4:30 AM Club",
          description: "Set your alarm for 4:30 AM tomorrow. No snooze. Document how you feel."
        }
      ],
      worksheetUrl: "/worksheets/day4-warriors-discipline.pdf"
    },
    5: {
      title: "The Phoenix Protocol",
      description: "Burn away what doesn't serve you. Rise from your own ashes.",
      bookSummaries: [
        {
          title: "Man's Search for Meaning",
          author: "Viktor Frankl",
          summary: "Finding purpose in the most challenging circumstances.",
          keyTakeaway: "When we can no longer change a situation, we are challenged to change ourselves."
        },
        {
          title: "The Alchemist",
          author: "Paulo Coelho",
          summary: "The journey to your personal legend.",
          keyTakeaway: "When you want something, all the universe conspires in helping you achieve it."
        },
        {
          title: "Breaking the Habit of Being Yourself",
          author: "Joe Dispenza",
          summary: "How to lose your mind and create a new one.",
          keyTakeaway: "Your personality creates your personal reality."
        }
      ],
      tasks: [
        {
          title: "The Purge",
          description: "Remove 10 things from your life today - physical objects, digital subscriptions, or toxic relationships."
        },
        {
          title: "Write Your Phoenix Story",
          description: "Describe in detail who you'll be 1 year from now. Write in present tense as if it's already true."
        }
      ],
      worksheetUrl: "/worksheets/day5-phoenix-protocol.pdf"
    },
    6: {
      title: "The Brotherhood Code",
      description: "No man succeeds alone. Build your tribe deliberately.",
      bookSummaries: [
        {
          title: "Tribe",
          author: "Sebastian Junger",
          summary: "Why we need community for mental health and meaning.",
          keyTakeaway: "Modern society has perfected the art of making people not feel necessary."
        },
        {
          title: "The Like Switch",
          author: "Jack Schafer",
          summary: "Building rapport and influence authentically.",
          keyTakeaway: "People like people who make them feel good about themselves."
        },
        {
          title: "Never Eat Alone",
          author: "Keith Ferrazzi",
          summary: "The power of relationships in achieving success.",
          keyTakeaway: "Success breeds success, and connecting breeds connection."
        }
      ],
      tasks: [
        {
          title: "Reach Out",
          description: "Contact 3 men you respect. Suggest meeting for coffee or a workout. Be vulnerable about your journey."
        },
        {
          title: "Join or Create",
          description: "Find a men's group, martial arts gym, or create your own accountability circle."
        }
      ],
      worksheetUrl: "/worksheets/day6-brotherhood-code.pdf"
    },
    7: {
      title: "The King's Coronation",
      description: "Step into your sovereignty. Claim your throne.",
      bookSummaries: [
        {
          title: "King, Warrior, Magician, Lover",
          author: "Robert Moore",
          summary: "Rediscovering the archetypes of mature masculinity.",
          keyTakeaway: "The King archetype in its fullness possesses the qualities of order, of reasonable and rational patterning, of integration and integrity."
        },
        {
          title: "The Way of the Superior Man",
          author: "David Deida",
          summary: "A spiritual guide to mastering the challenges of women, work, and sexual desire.",
          keyTakeaway: "Live as if your father were dead. Give your gift to the world as though you had no fear."
        },
        {
          title: "Mastery",
          author: "Robert Greene",
          summary: "The path to mastery in life and work.",
          keyTakeaway: "The future belongs to those who learn more skills and combine them in creative ways."
        }
      ],
      tasks: [
        {
          title: "Your Coronation Speech",
          description: "Write and record a 3-minute video declaring your commitment to your new life. Share it with someone who matters."
        },
        {
          title: "The First Royal Decree",
          description: "Make one significant decision you've been postponing. Execute it today."
        }
      ],
      worksheetUrl: "/worksheets/day7-kings-coronation.pdf"
    }
  };

  return dayContents[dayNumber] || dayContents[1]; // Default to day 1 if not found
}