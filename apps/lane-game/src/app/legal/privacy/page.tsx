import { FooterLegal } from '@/components/FooterLegal';
import { TopNav } from '@/components/TopNav';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-h1 font-display font-bold text-ink mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Complete our assessment questionnaire</li>
              <li>Provide your email address for results</li>
              <li>Contact us for support</li>
              <li>Make a purchase</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Provide and improve our services</li>
              <li>Send you your assessment results</li>
              <li>Communicate with you about our services</li>
              <li>Process payments and transactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Data Security
            </h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@trajectory.com
            </p>
          </section>
        </div>
      </main>

      <FooterLegal />
    </div>
  );
}
