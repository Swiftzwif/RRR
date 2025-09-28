import { FooterLegal } from '@/components/FooterLegal';
import { TopNav } from '@/components/TopNav';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-h1 font-display font-bold text-ink mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-gray-600 mb-4">
              By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Use License
            </h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily use our services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Disclaimer
            </h2>
            <p className="text-gray-600 mb-4">
              The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Limitations
            </h2>
            <p className="text-gray-600 mb-4">
              In no event shall Trajectory or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Accuracy of Materials
            </h2>
            <p className="text-gray-600 mb-4">
              The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Links
            </h2>
            <p className="text-gray-600 mb-4">
              We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Modifications
            </h2>
            <p className="text-gray-600 mb-4">
              We may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-h2 font-display font-semibold text-ink mb-4">
              Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at legal@trajectory.com
            </p>
          </section>
        </div>
      </main>

      <FooterLegal />
    </div>
  );
}
