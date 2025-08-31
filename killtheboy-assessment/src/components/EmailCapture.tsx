'use client';

import { useState } from 'react';
import { logLeadSubmit } from '@/lib/events';

interface EmailCaptureProps {
  submissionId: string;
}

export default function EmailCapture({ submissionId }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, email })
      });
      
      if (response.ok) {
        logLeadSubmit(submissionId, email);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Email submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 p-8 rounded-lg shadow-sm text-center">
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Thank you!
        </h3>
        <p className="text-green-700">
          Your scorecard has been sent to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Where can we send your personalized scorecard?
      </h3>
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <p className="text-sm text-gray-500">
          Your answers are private. Your growth is personal.
        </p>
        <button
          type="submit"
          disabled={!email || isSubmitting}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Get My Scorecard'}
        </button>
      </form>
    </div>
  );
}

