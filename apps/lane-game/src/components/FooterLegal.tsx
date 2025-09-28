'use client';

import { content } from '@/lib/content';
import Link from 'next/link';

interface FooterLegalProps {
  className?: string;
}

export function FooterLegal({ className = '' }: FooterLegalProps) {
  return (
    <footer className={`border-t border-gray-200 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display font-bold text-ink mb-4">Trajectory</h3>
            <p className="text-gray-600 text-sm">
              Professional assessment platform for high-value men ready to level up.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-ink mb-4">Assessment</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/quiz" className="text-gray-600 hover:text-ink transition-colors">
                  Take Assessment
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-gray-600 hover:text-ink transition-colors">
                  View Results
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/story" className="text-gray-600 hover:text-ink transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-600 hover:text-ink transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-ink transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/privacy" className="text-gray-600 hover:text-ink transition-colors">
                  {content.legal.privacy}
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-gray-600 hover:text-ink transition-colors">
                  {content.legal.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            {content.legal.footer}
          </p>
        </div>
      </div>
    </footer>
  );
}
