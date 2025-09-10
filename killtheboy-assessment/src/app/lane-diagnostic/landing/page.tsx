'use client';

import Link from 'next/link';

export default function LaneDiagnosticLandingPage() {
  return (
    <div className="min-h-screen bg-sky-50 py-16">
      <div className="max-w-6xl mx-auto px-8">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-sky-800 mb-8">
            Discover Which Financial Lane You're Actually In
          </h1>
          <p className="text-xl text-sky-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Take our 2-minute diagnostic to uncover the hidden patterns keeping you from financial freedom. 
            Based on MJ DeMarco's Millionaire Fastlane framework.
          </p>
          <Link href="/lane-diagnostic/quiz" className="strata-button text-lg px-12 py-4">
            Take the Lane Diagnostic
          </Link>
        </div>

        {/* The Three Lanes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          <div className="bg-white p-10 text-center rounded-lg border border-sky-200 shadow-sm">
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-10 h-10 bg-danger rounded-full"></div>
            </div>
            <h3 className="text-2xl font-display font-semibold text-sky-800 mb-6">
              Sidewalk Lane
            </h3>
            <p className="text-sky-600 mb-6 leading-relaxed">
              Living paycheck to paycheck, no financial plan, consumer mindset
            </p>
            <ul className="text-sm text-sky-500 space-y-3">
              <li>• Spends more than earns</li>
              <li>• No emergency fund</li>
              <li>• Consumer-focused mindset</li>
              <li>• No long-term financial plan</li>
            </ul>
          </div>

          <div className="bg-white p-10 text-center rounded-lg border border-sky-200 shadow-sm">
            <div className="w-20 h-20 bg-warn/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-10 h-10 bg-warn rounded-full"></div>
            </div>
            <h3 className="text-2xl font-display font-semibold text-sky-800 mb-6">
              Slowlane
            </h3>
            <p className="text-sky-600 mb-6 leading-relaxed">
              Traditional path (job → save → invest → retire at 65), linear income
            </p>
            <ul className="text-sm text-sky-500 space-y-3">
              <li>• Trades time for money</li>
              <li>• Linear income growth</li>
              <li>• Traditional retirement planning</li>
              <li>• Security over growth</li>
            </ul>
          </div>

          <div className="bg-white p-10 text-center rounded-lg border border-sky-200 shadow-sm">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-10 h-10 bg-success rounded-full"></div>
            </div>
            <h3 className="text-2xl font-display font-semibold text-sky-800 mb-6">
              Fastlane
            </h3>
            <p className="text-sky-600 mb-6 leading-relaxed">
              Entrepreneurial path, building systems/assets, exponential income potential
            </p>
            <ul className="text-sm text-sky-500 space-y-3">
              <li>• Builds systems and assets</li>
              <li>• Exponential income potential</li>
              <li>• Leverage and multiplication</li>
              <li>• Freedom and control</li>
            </ul>
          </div>
        </div>

        {/* Why Take This Diagnostic */}
        <div className="bg-white p-12 mb-24 rounded-lg border border-sky-200 shadow-sm">
          <h2 className="text-3xl font-display font-bold text-sky-800 mb-12 text-center">
            Why Take the Lane Diagnostic?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-display font-semibold text-sky-800 mb-4">
                🎯 Identify Your Current Lane
              </h3>
              <p className="text-sky-600 leading-relaxed">
                Get an accurate assessment of where you currently stand in your financial journey, 
                not where you think you are.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-sky-800 mb-4">
                📊 Understand Your Patterns
              </h3>
              <p className="text-sky-600 leading-relaxed">
                Discover the hidden patterns in your financial mindset, risk tolerance, 
                and systems thinking that are shaping your trajectory.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-sky-800 mb-4">
                🚀 Get Your Roadmap
              </h3>
              <p className="text-sky-600 leading-relaxed">
                Receive personalized next steps and a clear path to transition 
                to your ideal financial lane.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-sky-800 mb-4">
                ⚡ Take Action Fast
              </h3>
              <p className="text-sky-600 leading-relaxed">
                Get immediate insights and actionable steps you can implement 
                today to start shifting your financial trajectory.
              </p>
            </div>
          </div>
        </div>

        {/* The Vehicle Metaphor */}
        <div className="bg-white p-12 mb-24 rounded-lg border border-sky-200 shadow-sm">
          <h2 className="text-3xl font-display font-bold text-sky-800 mb-12 text-center">
            You Are The Vehicle
          </h2>
          <div className="text-center max-w-5xl mx-auto">
            <p className="text-xl text-sky-600 mb-8 leading-relaxed">
              Your habits, your energy, your money, your decisions—this is your engine. 
              And every vehicle needs an audit. Every vehicle deserves upgrades.
            </p>
            <p className="text-xl text-sky-600 mb-8 leading-relaxed">
              The Lane Diagnostic is your financial audit. It shows you exactly where you are, 
              what's holding you back, and how to shift into the Fastlane.
            </p>
            <p className="text-xl text-sky-800 leading-relaxed font-semibold">
              This is your journey. You are the driver. And the Fastlane is waiting.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-display font-bold text-sky-800 mb-6">
            Ready to Discover Your Lane?
          </h2>
          <p className="text-xl text-sky-600 mb-12">
            Take the 2-minute diagnostic and get your personalized financial lane assessment.
          </p>
          <Link href="/lane-diagnostic/quiz" className="strata-button text-lg px-12 py-4">
            Start Your Lane Diagnostic
          </Link>
        </div>
      </div>
    </div>
  );
}
