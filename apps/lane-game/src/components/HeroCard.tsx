'use client';

import { content } from '@/lib/content';
import { CTAButton } from './CTAButton';

interface HeroCardProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function HeroCard({
  title = content.landing.hero.title,
  subtitle = content.landing.hero.subtitle,
  primaryCTA = content.landing.hero.primaryCTA,
  secondaryCTA = content.landing.hero.secondaryCTA,
  onPrimaryClick,
  onSecondaryClick
}: HeroCardProps) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-h1 font-display font-bold text-ink mb-6 leading-tight">
        {title}
      </h1>
      <p className="text-xl text-gray-600 mb-12 leading-relaxed">
        {subtitle}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <CTAButton
          variant="primary"
          size="lg"
          onClick={onPrimaryClick || (() => window.location.href = '/quiz')}
        >
          {primaryCTA}
        </CTAButton>
        
        {secondaryCTA && (
          <CTAButton
            variant="secondary"
            size="lg"
            onClick={onSecondaryClick || (() => window.location.href = '/story')}
          >
            {secondaryCTA}
          </CTAButton>
        )}
      </div>
    </div>
  );
}
