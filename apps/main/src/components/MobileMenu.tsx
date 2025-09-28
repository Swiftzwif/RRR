'use client';

import { getCopy } from '@/lib/copy';
import Link from 'next/link';
import { useState } from 'react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navigationItems = [
    { href: '/about', label: getCopy('nav.about') },
    { href: '/story', label: getCopy('nav.story') },
    { href: '/kill-the-boy', label: getCopy('nav.killTheBoy') },
    { href: '/assessment', label: getCopy('nav.assessment') },
    { href: '/resources', label: getCopy('nav.resources') },
    { href: '/course', label: getCopy('nav.course') },
    { href: '/testimonials', label: getCopy('nav.testimonials') },
  ];

  return (
    <div className="lg:hidden">
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-sky-600 hover:text-sky-800 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-sky-200">
                <h2 className="text-lg font-semibold text-sky-800">Menu</h2>
                <button
                  onClick={toggleMenu}
                  className="p-2 text-sky-600 hover:text-sky-800 transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-4">
                <div className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={toggleMenu}
                      className="block px-4 py-3 text-sky-700 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Footer Actions */}
              <div className="p-6 border-t border-sky-200 space-y-3">
                <Link
                  href="/auth/signin"
                  onClick={toggleMenu}
                  className="block w-full text-center px-4 py-2 text-sky-600 hover:text-sky-800 transition-colors"
                >
                  {getCopy('nav.signin')}
                </Link>
                <Link
                  href="/assessment"
                  onClick={toggleMenu}
                  className="block w-full text-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
                >
                  {getCopy('nav.assessment')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
