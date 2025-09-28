'use client';

import { AvatarReveal } from '@/components/AvatarReveal';
import { DomainStatCard } from '@/components/DomainStatCard';
import { OfferStripe } from '@/components/OfferStripe';
import { trackOfferClicked, trackResultsViewed } from '@/lib/analytics';
import { getSevenDayPlay, getThirtyDayPlay } from '@/lib/content';
import { calculateLevel, getNextMilestone } from '@/lib/design-tokens';
import { useQuizStore } from '@/lib/quiz-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ResultsPage() {
  const router = useRouter();
  const { 
    avatar, 
    domainScores, 
    lowestTwoDomains, 
    isCompleted 
  } = useQuizStore();

  // Redirect if quiz not completed
  useEffect(() => {
    if (!isCompleted) {
      router.push('/quiz');
    } else {
      // Track results viewed
      trackResultsViewed(avatar, domainScores, lowestTwoDomains);
    }
  }, [isCompleted, avatar, domainScores, lowestTwoDomains, router]);

  const handleCourseClick = () => {
    trackOfferClicked('course', 'Get the Playbook', 'results-page');
    router.push('/offer/course');
  };

  if (!isCompleted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="container mx-auto px-4 py-8">
        {/* Avatar Reveal */}
        <section className="text-center py-16">
          <AvatarReveal avatar={avatar} onComplete={() => {}} />
        </section>

        {/* Results Header */}
        <section className="text-center mb-12">
          <h2 className="text-h2 font-display font-semibold text-ink mb-4">
            Your Trajectory Snapshot
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here's where you stand and where you're going.
          </p>
        </section>

        {/* Focus Areas */}
        {lowestTwoDomains.length > 0 && (
          <section className="mb-12">
            <h3 className="text-h3 font-display font-semibold text-ink mb-6 text-center">
              Focus Now
            </h3>
            <p className="text-center text-gray-600 mb-8">
              Focus on these two areas to evolve into {avatar}:
            </p>
          </section>
        )}

        {/* Domain Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {Object.entries(domainScores).map(([domain, score]) => {
            const level = calculateLevel(score);
            const nextMilestone = getNextMilestone(domain, level);
            const sevenDayPlay = getSevenDayPlay(domain);
            const isFocusArea = lowestTwoDomains.includes(domain);
            
            return (
              <DomainStatCard
                key={domain}
                domain={domain}
                level={level}
                progress={score}
                nextMilestone={nextMilestone}
                sevenDayPlay={sevenDayPlay}
                isFocusArea={isFocusArea}
              />
            );
          })}
        </section>

        {/* 7-Day Plays Section */}
        <section className="mb-16">
          <h3 className="text-h3 font-display font-semibold text-ink mb-8 text-center">
            7-Day Plays
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowestTwoDomains.map((domain) => (
              <div key={domain} className="bg-gray-50 p-4 rounded-card">
                <h4 className="font-medium text-ink mb-2 capitalize">{domain}</h4>
                <p className="text-sm text-gray-600">
                  {getSevenDayPlay(domain)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 30-Day Systems Section */}
        <section className="mb-16">
          <h3 className="text-h3 font-display font-semibold text-ink mb-8 text-center">
            30-Day Systems
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowestTwoDomains.map((domain) => (
              <div key={domain} className="bg-gray-50 p-4 rounded-card">
                <h4 className="font-medium text-ink mb-2 capitalize">{domain}</h4>
                <p className="text-sm text-gray-600">
                  {getThirtyDayPlay(domain)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Course Offer */}
        <section className="text-center">
          <OfferStripe
            title="Rethink. Redesign. Reignite."
            description="A comprehensive system to transform your trajectory across all six domains."
            cta="Get the Playbook"
            onCTAClick={handleCourseClick}
          />
        </section>
      </div>
    </div>
  );
}
