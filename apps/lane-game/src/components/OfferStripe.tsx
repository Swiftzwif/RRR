'use client';

import { cn } from '@/lib/utils';
import { CTAButton } from './CTAButton';

interface OfferStripeProps {
  title: string;
  description: string;
  cta: string;
  onCTAClick: () => void;
  className?: string;
}

export function OfferStripe({
  title,
  description,
  cta,
  onCTAClick,
  className = ''
}: OfferStripeProps) {
  return (
    <div className={cn(
      'bg-gradient-to-r from-accent/10 to-accent/5 rounded-card border-2 border-accent/20 p-8 text-center',
      className
    )}>
      <h2 className="text-h2 font-display font-bold text-ink mb-4">
        Ready to raise your floor?
      </h2>
      
      <h3 className="text-h3 font-display font-semibold text-ink mb-4">
        {title}
      </h3>
      
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        {description}
      </p>

      <CTAButton
        variant="primary"
        size="lg"
        onClick={onCTAClick}
      >
        {cta}
      </CTAButton>

      <p className="text-sm text-gray-500 mt-4">
        Join thousands of men transforming their trajectories
      </p>
    </div>
  );
}
