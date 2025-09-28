'use client';

import { content } from '@/lib/content';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { CTAButton } from './CTAButton';

interface EmailGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export function EmailGate({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    onSubmit(email);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card p-8 max-w-md w-full shadow-elevation-6">
        {/* Header */}
        <h2 className="text-h2 font-display font-semibold text-ink mb-4 text-center">
          {content.email.gate.title}
        </h2>
        
        <p className="text-gray-600 mb-8 text-center">
          {content.email.gate.subtitle}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder={content.email.gate.placeholder}
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors',
                error ? 'border-red' : 'border-gray-300 focus:border-accent'
              )}
              disabled={isLoading}
            />
            {error && (
              <p className="text-red text-sm mt-2">{error}</p>
            )}
          </div>

          <CTAButton
            variant="primary"
            size="lg"
            onClick={() => handleSubmit(new Event('submit') as any)}
            loading={isLoading}
            className="w-full"
          >
            {content.email.gate.cta}
          </CTAButton>
        </form>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 text-center mt-6">
          {content.email.gate.privacy}
        </p>
      </div>
    </div>
  );
}
