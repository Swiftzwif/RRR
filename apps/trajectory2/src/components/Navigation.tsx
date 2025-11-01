"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import type {
  AuthChangeEvent,
  Session,
  User as SupabaseUser,
} from "@supabase/supabase-js";
import { LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "./LogoMark";
import UserStatus from "./UserStatus";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Determine if we're on a dark page (home) or light page (others)
  const isDarkPage = pathname === "/";

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    supabase.auth.getUser().then((response) => {
      setUser(response.data.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isDarkPage
        ? "bg-elev-1 border-b border-[var(--border-default)]"
        : "bg-white/95 border-b border-gray-200"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <LogoMark className="h-10 w-10" showGlow={false} />
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkPage
                  ? "text-primary group-hover:text-gold"
                  : "text-gray-900 group-hover:text-brand-gold"
              }`}>
                Trajectory
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/story"
              className={`transition-colors duration-200 ${
                isDarkPage
                  ? "text-secondary hover:text-gold"
                  : "text-gray-600 hover:text-brand-gold"
              }`}
            >
              Story
            </Link>
            <Link
              href="/assessment/landing"
              className={`transition-colors duration-200 ${
                isDarkPage
                  ? "text-secondary hover:text-gold"
                  : "text-gray-600 hover:text-brand-gold"
              }`}
            >
              Assessment
            </Link>
            <Link
              href="/products"
              className={`transition-colors duration-200 font-semibold ${
                isDarkPage
                  ? "text-gold hover:text-gold/80"
                  : "text-brand-gold hover:text-brand-gold/80"
              }`}
            >
              Products
            </Link>
            <Link
              href="/experience"
              className={`transition-colors duration-200 ${
                isDarkPage
                  ? "text-secondary hover:text-gold"
                  : "text-gray-600 hover:text-brand-gold"
              }`}
            >
              31-Day Experience
            </Link>
            <Link
              href="/resources"
              className={`transition-colors duration-200 ${
                isDarkPage
                  ? "text-secondary hover:text-gold"
                  : "text-gray-600 hover:text-brand-gold"
              }`}
            >
              Resources
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <UserStatus 
                      user={user} 
                      variant="compact"
                      className="hidden lg:flex"
                      showIcon={true}
                    />
                    <Link
                      href="/account"
                      className={`transition-colors duration-200 flex items-center gap-2 ${
                        isDarkPage
                          ? "text-secondary hover:text-gold"
                          : "text-gray-600 hover:text-brand-gold"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Account
                    </Link>
                    <Button onClick={handleSignOut} variant={isDarkPage ? "outline" : "outlineLight"} size="sm">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant={isDarkPage ? "outline" : "outlineLight"} size="sm">
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
              <X size={24} className={isDarkPage ? "text-secondary" : "text-gray-600"} />
            ) : (
              <Menu size={24} className={isDarkPage ? "text-secondary" : "text-gray-600"} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t ${
              isDarkPage
                ? "bg-elev-2 border-[var(--border-default)]"
                : "bg-white border-gray-200"
            }`}>
              <Link
                href="/story"
                className={`block px-3 py-2 transition-colors ${
                  isDarkPage
                    ? "text-secondary hover:text-gold"
                    : "text-gray-600 hover:text-brand-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Story
              </Link>
              <Link
                href="/assessment/landing"
                className={`block px-3 py-2 transition-colors ${
                  isDarkPage
                    ? "text-secondary hover:text-gold"
                    : "text-gray-600 hover:text-brand-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Assessment
              </Link>
              <Link
                href="/products"
                className={`block px-3 py-2 transition-colors font-semibold ${
                  isDarkPage
                    ? "text-gold hover:text-gold/80"
                    : "text-brand-gold hover:text-brand-gold/80"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/experience"
                className={`block px-3 py-2 transition-colors ${
                  isDarkPage
                    ? "text-secondary hover:text-gold"
                    : "text-gray-600 hover:text-brand-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                31-Day Experience
              </Link>
              <Link
                href="/resources"
                className={`block px-3 py-2 transition-colors ${
                  isDarkPage
                    ? "text-secondary hover:text-gold"
                    : "text-gray-600 hover:text-brand-gold"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="px-3 py-2">
                        <UserStatus 
                          user={user} 
                          variant="default"
                          showIcon={true}
                        />
                      </div>
                      <Link
                        href="/account"
                        className={`block px-3 py-2 transition-colors ${
                          isDarkPage
                            ? "text-secondary hover:text-gold"
                            : "text-gray-600 hover:text-brand-gold"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        Account
                      </Link>
                      <div className="px-3 pt-2">
                        <Button onClick={handleSignOut} variant={isDarkPage ? "outline" : "outlineLight"} className="w-full">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-3 pt-2 space-y-2">
                        <Button asChild variant={isDarkPage ? "outline" : "outlineLight"} className="w-full">
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
