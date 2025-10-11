"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LogoMark } from "./LogoMark";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    // Create a form and submit it to sign out
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/auth/signout';
    document.body.appendChild(form);
    form.submit();
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
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/account"
                      className="text-secondary hover:text-gold transition-colors duration-200 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Account
                    </Link>
                    <Button onClick={handleSignOut} variant="outline" size="sm">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/course">Get Access</Link>
                    </Button>
                  </>
                )}
              </>
            )}
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
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/account"
                        className="block px-3 py-2 text-secondary hover:text-gold transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        Account
                      </Link>
                      <div className="px-3 pt-2">
                        <Button onClick={handleSignOut} variant="outline" className="w-full">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-3 pt-2 space-y-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href="/course" onClick={() => setIsMenuOpen(false)}>
                            Get Access
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
