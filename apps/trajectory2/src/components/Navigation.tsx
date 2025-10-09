"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LogoMark } from "./LogoMark";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-elev-1/95 backdrop-blur-sm border-b border-[var(--border-default)] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <LogoMark className="h-10 w-10" showGlow={false} />
              <h1 className="text-2xl font-bold text-primary group-hover:text-gold transition-colors duration-300">
                Trajectory
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/story"
              className="text-secondary hover:text-gold transition-colors duration-200"
            >
              Story
            </Link>
            <Link
              href="/assessment"
              className="text-secondary hover:text-gold transition-colors duration-200"
            >
              Assessment
            </Link>
            <Link
              href="/experience"
              className="text-secondary hover:text-gold transition-colors duration-200"
            >
              31-Day Experience
            </Link>
            <Link
              href="/resources"
              className="text-secondary hover:text-gold transition-colors duration-200"
            >
              Resources
            </Link>
            <Button asChild>
              <Link href="/course">Get Access</Link>
            </Button>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={24} className="text-secondary" />
            ) : (
              <Menu size={24} className="text-secondary" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-elev-2 border-t border-[var(--border-default)]">
              <Link
                href="/story"
                className="block px-3 py-2 text-secondary hover:text-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Story
              </Link>
              <Link
                href="/assessment"
                className="block px-3 py-2 text-secondary hover:text-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Assessment
              </Link>
              <Link
                href="/experience"
                className="block px-3 py-2 text-secondary hover:text-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                31-Day Experience
              </Link>
              <Link
                href="/resources"
                className="block px-3 py-2 text-secondary hover:text-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <div className="px-3 pt-2">
                <Button asChild className="w-full">
                  <Link href="/course" onClick={() => setIsMenuOpen(false)}>
                    Get Access
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
