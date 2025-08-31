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
            Your Trajectory Snapshot
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

        {/* Lowest Domains */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Your Biggest Opportunity
          </h3>
          <p className="text-gray-600 mb-4">
            Lowest two domains: {lowestDomains.join(', ')}
          </p>
        </div>

        {/* Rethink • Redesign • Reignite Reference */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Rethink • Redesign • Reignite
          </h3>
        </div>

        {/* Email Capture */}
        <EmailCapture submissionId={submission.id} />
      </div>
    </div>
  );
}
