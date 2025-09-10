'use client';

import { LaneDiagnosticResult, scoreLaneDiagnostic } from '@/lib/lane-diagnostic-scoring';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LaneDiagnosticResultsPage() {
  const [result, setResult] = useState<LaneDiagnosticResult | null>(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadResults = () => {
      try {
        const answersData = sessionStorage.getItem('laneDiagnosticAnswers');
        if (!answersData) {
          router.push('/lane-diagnostic');
          return;
        }

        const answers = JSON.parse(answersData);
        const diagnosticResult = scoreLaneDiagnostic(answers);
        setResult(diagnosticResult);
      } catch (err) {
        setError('Failed to process results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !result) return;

    try {
      // Here you would typically send the email to your backend
      // For now, we'll just mark it as submitted
      setEmailSubmitted(true);
      
      // Store the email submission (you might want to send this to your API)
      console.log('Email submitted:', email, 'Result:', result);
      
    } catch (err) {
      console.error('Error submitting email:', err);
    }
  };

  const getLaneColor = (lane: string) => {
    switch (lane) {
      case 'sidewalk': return 'text-danger';
      case 'slowlane': return 'text-warn';
      case 'fastlane': return 'text-success';
      default: return 'text-sand-200';
    }
  };

  const getLaneGradient = (lane: string) => {
    switch (lane) {
      case 'sidewalk': return 'from-danger to-red-600';
      case 'slowlane': return 'from-warn to-yellow-600';
      case 'fastlane': return 'from-success to-green-600';
      default: return 'from-sunset to-glow';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sunset border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sand-200">Processing your results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-display font-bold text-sand-50 mb-4">
            Error Processing Results
          </h1>
          <p className="text-sand-200 mb-6">{error || 'No results found.'}</p>
          <Link href="/lane-diagnostic" className="strata-button">
            Take Quiz Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-16">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="text-sunset hover:text-glow transition-colors text-sm mb-6 inline-block">
            ← Back to Trajectory
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-sky-800 mb-6">
            Your Lane Diagnostic Results
          </h1>
        </div>

        {/* Lane Result Card */}
        <div className="bg-white p-12 mb-12 rounded-lg border border-sky-200 shadow-sm">
          <div className="text-center mb-8">
            <div className={`inline-block px-8 py-4 rounded-full bg-gradient-to-r ${getLaneGradient(result.lane)} text-white font-bold text-xl mb-6`}>
              {result.laneDescription.name}
            </div>
            <p className="text-sky-600 text-xl leading-relaxed max-w-3xl mx-auto">
              {result.laneDescription.description}
            </p>
          </div>

          {/* Confidence Score */}
          <div className="text-center mb-8">
            <p className="text-sky-600 mb-3 font-medium">Assessment Confidence</p>
            <div className="w-full bg-sky-200/30 rounded-full h-4 mb-3 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-sky-400 to-sky-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
            <p className="text-sm text-sky-500">{Math.round(result.confidence * 100)}% confident</p>
          </div>

          {/* Lane Characteristics */}
          <div className="mb-8">
            <h3 className="text-xl font-display font-semibold text-sky-800 mb-6 text-center">Key Characteristics</h3>
            <ul className="space-y-4 max-w-2xl mx-auto">
              {result.laneDescription.characteristics.map((characteristic, index) => (
                <li key={index} className="flex items-center text-sky-600">
                  <div className="w-3 h-3 bg-sky-400 rounded-full mr-4 flex-shrink-0" />
                  <span className="text-lg">{characteristic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Category Scores */}
        <div className="bg-white p-10 mb-12 rounded-lg border border-sky-200 shadow-sm">
          <h3 className="text-2xl font-display font-semibold text-sky-800 mb-8 text-center">Your Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(result.categoryScores).map(([category, score]) => (
              <div key={category} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sky-600 capitalize font-medium text-lg">
                    {category.replace('_', ' ')}
                  </span>
                  <span className="text-sky-800 font-bold text-lg">
                    {score.toFixed(1)}/5.0
                  </span>
                </div>
                <div className="w-full bg-sky-200/30 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-sky-400 to-sky-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Potential */}
        <div className="bg-white p-10 mb-12 rounded-lg border border-sky-200 shadow-sm text-center">
          <h3 className="text-2xl font-display font-semibold text-sky-800 mb-6">Growth Potential</h3>
          <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold mb-6 ${
            result.growthPotential === 'high' ? 'bg-success/20 text-success' :
            result.growthPotential === 'medium' ? 'bg-warn/20 text-warn' :
            'bg-danger/20 text-danger'
          }`}>
            {result.growthPotential.toUpperCase()} POTENTIAL
          </div>
          <p className="text-sky-600 text-lg leading-relaxed max-w-2xl mx-auto">
            {result.growthPotential === 'high' && "You have strong indicators for rapid growth and lane transition."}
            {result.growthPotential === 'medium' && "You have good potential for growth with focused effort."}
            {result.growthPotential === 'low' && "Focus on building foundational skills and mindset first."}
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white p-10 mb-12 rounded-lg border border-sky-200 shadow-sm">
          <h3 className="text-2xl font-display font-semibold text-sky-800 mb-8 text-center">Your Next Steps</h3>
          <ul className="space-y-6 max-w-3xl mx-auto">
            {result.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start text-sky-600">
                <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4 mt-1 flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-lg leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email Capture for Full Report */}
        {!emailSubmitted ? (
          <div className="bg-white p-10 mb-12 rounded-lg border border-sky-200 shadow-sm">
            <h3 className="text-2xl font-display font-semibold text-sky-800 mb-6 text-center">
              Get Your Complete Lane Diagnostic Report
            </h3>
            <p className="text-sky-600 mb-8 text-center text-lg leading-relaxed max-w-2xl mx-auto">
              Enter your email to receive a detailed analysis, personalized roadmap, and exclusive resources to help you transition to your ideal lane.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="strata-input flex-1 text-lg py-3"
                required
              />
              <button type="submit" className="strata-button px-8 py-3">
                Get Full Report
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-10 mb-12 rounded-lg border border-sky-200 shadow-sm text-center">
            <h3 className="text-2xl font-display font-semibold text-sky-800 mb-6">
              ✅ Report Sent!
            </h3>
            <p className="text-sky-600 mb-8 text-lg">
              Check your email for your complete Lane Diagnostic report and personalized roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/course" className="strata-button px-8 py-3">
                Explore Trajectory Course
              </Link>
              <Link href="/coaching" className="strata-button px-8 py-3">
                Book Coaching Call
              </Link>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-sky-600 mb-8 text-xl">
            Ready to shift lanes? Trajectory can help you accelerate your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/course" className="strata-button px-8 py-3 text-lg">
              Start Your Transformation
            </Link>
            <Link href="/coaching" className="strata-button px-8 py-3 text-lg">
              Get Personal Coaching
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
