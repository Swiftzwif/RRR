import { notFound } from 'next/navigation';
import { PrismaClient } from '@/generated/prisma';
import { labelForScore } from '@/lib/scoring';
import DomainMeter from '@/components/DomainMeter';
import EmailCapture from '@/components/EmailCapture';

const prisma = new PrismaClient();

interface ResultsPageProps {
  searchParams: Promise<{ submission?: string }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { submission: submissionId } = await searchParams;

  if (!submissionId) {
    notFound();
  }

  // Fetch submission from database
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId }
  });

  if (!submission) {
    notFound();
  }

  const domainScores = submission.domainScores as Record<string, number>;
  const lowestDomains = submission.lowestDomains as string[];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Trajectory Assessment Results
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your honesty. Here's your personalized scorecard.
          </p>
        </div>

        {/* Avatar */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Avatar: {submission.avatar}
          </h2>
          {submission.avatar === 'Drifter' && (
            <p className="text-lg text-gray-700 mb-4">
              You're letting the noise steer your life. But awareness is your first win. You now see the game you're playing — and you can choose a different one.
            </p>
          )}
          {submission.avatar === 'Balancer' && (
            <p className="text-lg text-gray-700 mb-4">
              You're walking the line between average and excellent. You've begun raising the floor, but there's still noise keeping you stuck. The next level requires intentional systems.
            </p>
          )}
          {submission.avatar === 'Architect' && (
            <p className="text-lg text-gray-700 mb-4">
              You're building your life by design. You've raised your floor high, and you're moving on an upward trajectory. Now it's about mastery, consistency, and playing long games.
            </p>
          )}
          <p className="text-lg font-semibold text-gray-900">
            Kill the boy so the man may rise.
          </p>
        </div>

        {/* Domain Scorecard */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Domain Scorecard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(domainScores).map(([domain, score]) => (
              <DomainMeter
                key={domain}
                label={domain}
                value={score}
                bandLabel={labelForScore(score)}
              />
            ))}
          </div>
        </div>

        {/* Areas for Focus */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Areas for Focus
          </h3>
          <p className="text-gray-600 mb-4">
            Your lowest-scoring areas represent your greatest opportunities for growth:
          </p>
          <div className="flex gap-4">
            {lowestDomains.map((domain, index) => (
              <div key={domain} className="flex items-center">
                <span className="text-2xl mr-2">
                  {domain === 'identity' ? '🧭' : 
                   domain === 'health' ? '⚡' : 
                   domain === 'finances' ? '💰' : 
                   domain === 'relationships' ? '🤝' : 
                   domain === 'emotions' ? '🌊' : '🎯'}
                </span>
                <span className="font-medium capitalize">{domain}</span>
                {index < lowestDomains.length - 1 && <span className="mx-2">•</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Rethink • Redesign • Reignite Reference */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Rethink • Redesign • Reignite
          </h3>
          <p className="text-gray-600">
            Powered by the Rethink • Redesign • Reignite methodology
          </p>
        </div>

        {/* Email Capture */}
        <EmailCapture submissionId={submission.id} />
      </div>
    </div>
  );
}
