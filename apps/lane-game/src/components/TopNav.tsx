'use client';

import Link from 'next/link';

interface TopNavProps {
  className?: string;
  showLogo?: boolean;
  showAuth?: boolean;
}

export function TopNav({ className = '', showLogo = true, showAuth = false }: TopNavProps) {
  return (
    <nav className={`border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {showLogo && (
            <Link href="/" className="text-xl font-display font-bold text-ink">
              Trajectory
            </Link>
          )}

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/story" className="text-gray-600 hover:text-ink transition-colors">
              Story
            </Link>
            <Link href="/assessment" className="text-gray-600 hover:text-ink transition-colors">
              Assessment
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-ink transition-colors">
              Resources
            </Link>
          </div>

          {/* Auth Section */}
          {showAuth && (
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/signin" 
                className="text-gray-600 hover:text-ink transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
