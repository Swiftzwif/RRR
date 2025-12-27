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
          Your detailed results have been sent to your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Want to dive deeper into your results?
      </h3>
      <p className="text-gray-600 mb-4">
        Get personalized insights and action steps delivered to your inbox.
      </p>
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <p className="text-sm text-gray-500">
          Your email stays local. No spam. Unsubscribe anytime.
        </p>
        <button
          type="submit"
          disabled={!email || isSubmitting}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Send My Detailed Results'}
        </button>
        <button
          type="button"
          onClick={() => setIsSubmitted(true)}
          className="w-full text-gray-600 py-2 hover:text-gray-800"
        >
          Skip for now
        </button>
      </form>
    </div>
  );
}

