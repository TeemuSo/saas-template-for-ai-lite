'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/lib/supabase/types';
import { useAuth } from '@/lib/auth/auth-provider';

interface LandingContentProps {
  user: User | null;
}

export function LandingContent({ user: initialUser }: LandingContentProps) {
  const { user, dbUser } = useAuth();
  
  // Use client-side dbUser for access check, fallback to initialUser
  const currentDbUser = dbUser || initialUser;
  const currentUser = user;

  // If user has access, show "Go to Application" 
  if (currentDbUser?.has_access) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground tracking-tight sm:text-5xl md:text-6xl mb-8">
            Welcome back!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            You're all set. Access your SaaS application and start building.
          </p>
                      <Button asChild size="lg" className="text-lg bg-primary hover:bg-primary/90">
              <Link href="/app">
                Go to Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
        </div>
      </section>
    );
  }

  // For authenticated users without access or unauthenticated users
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl font-bold text-foreground tracking-tight sm:text-5xl md:text-6xl">
              Build Your SaaS
              <span className="block text-primary">Faster Than Ever</span>
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Launch your SaaS product in record time with our powerful,
              ready-to-use template. Packed with modern technologies and
              essential integrations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
              {currentUser ? (
                <>
                  {/* Primary action for authenticated user without access */}
                  <Button asChild size="lg" className="text-lg bg-primary hover:bg-primary/90">
                    <Link href="#pricing">
                      Get Access Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  {/* Secondary action - View pricing */}
                  <Button asChild variant="outline" size="lg" className="text-lg border-primary/30 text-primary hover:bg-primary/5">
                    <Link href="#pricing">
                      View Pricing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  {/* Primary action for unauthenticated user */}
                  <Button asChild size="lg" className="text-lg bg-primary hover:bg-primary/90">
                    <Link href="/sign-up">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  {/* Secondary action - Sign in to existing account */}
                  <Button asChild variant="outline" size="lg" className="text-lg border-primary/30 text-primary hover:bg-primary/5">
                    <Link href="/sign-in">
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-background border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                  <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-md mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Ready to Launch
                    </h3>
                    <p className="text-muted-foreground">
                      Complete SaaS template with authentication, payments, and dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 