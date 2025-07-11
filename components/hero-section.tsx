'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/lib/supabase/types';

interface HeroSectionProps {
  user: User | null;
  needsAccess?: boolean;
}

export function HeroSection({ user, needsAccess = false }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to handle checkout
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        // No headers or body needed - server handles everything
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && data.redirectTo) {
          // User needs to sign in first
          window.location.href = data.redirectTo;
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  // Show success state for users with access
  if (user?.has_access) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-primary/30 to-primary/20 blur-3xl animate-float delay-300"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-opacity ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDuration: 'var(--duration-slow)' }}>
            <div className="badge badge-success mb-8 animate-scale-in delay-100">
              <Shield className="w-4 h-4 mr-2" />
              Access Granted
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up delay-200">
              Welcome
              <span className="block gradient-text animate-gradient">
                Back!
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in delay-300">
              You're all set to access your premium SaaS application. Start building something amazing.
            </p>
            
            <div className="animate-scale-in delay-400">
              <Button asChild size="lg" className="gradient-bg hover-lift group">
                <Link href="/app">
                  Go to Application
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show conversion-optimized state for logged-in users without access
  if (user && !user.has_access) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-primary/30 to-primary/20 blur-3xl animate-float delay-300"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`transition-all ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDuration: 'var(--duration-slow)' }}>
              <div className="badge badge-primary mb-8 animate-scale-in">
                <Sparkles className="w-4 h-4 mr-2" />
                {needsAccess ? 'Access Required!' : 'You\'re Almost There!'}
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up delay-100">
                {needsAccess ? 'Unlock Your' : 'One Step Away'}
                <span className="block gradient-text animate-gradient">
                  {needsAccess ? 'Application' : 'From Building'}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in delay-200">
                {needsAccess 
                  ? 'You tried to access the app, but you need to upgrade first. Get instant access below!'
                  : 'Join 1,000+ developers who chose our template to build faster'
                }
              </p>

              {/* Social Proof */}
              <div className="flex items-center justify-center space-x-8 mb-8 animate-fade-in delay-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">1,000+</div>
                  <div className="text-sm text-muted-foreground">Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">5 min</div>
                  <div className="text-sm text-muted-foreground">Setup Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">30 days</div>
                  <div className="text-sm text-muted-foreground">Money Back</div>
                </div>
              </div>

              {/* Centered Pricing Card */}
              <div className="max-w-md mx-auto animate-scale-in delay-400">
                <div className="bg-background rounded-lg shadow-2xl border border-border overflow-hidden transform hover-scale">
                  <div className="gradient-bg text-primary-foreground px-6 py-4 relative">
                    <h3 className="text-lg font-semibold text-center">Get my SaaS</h3>
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                      Limited Time
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-foreground mb-2">
                        $49
                        <span className="text-lg font-normal text-muted-foreground">/once</span>
                      </div>
                      <p className="text-muted-foreground">Start building in 5 minutes</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {[
                        'Complete authentication system',
                        'Stripe payments integration',
                        'Modern UI components',
                        'Database schema included',
                        'TypeScript & Next.js 15',
                        'Production ready'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={handleCheckout}
                      className="w-full gradient-bg hover-lift group mb-3"
                      size="lg"
                    >
                      Get Instant Access
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      30-day money-back guarantee • Instant download
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-primary/30 to-primary/20 blur-3xl animate-float delay-300"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className={`text-center lg:text-left transition-all ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDuration: 'var(--duration-slow)' }}>
            <div className="badge badge-primary mb-8 animate-scale-in">
              <Sparkles className="w-4 h-4 mr-2" />
              Launch Ready Template
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up delay-100">
              Build Your
              <span className="block gradient-text animate-gradient">
                SaaS Faster
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in delay-200">
              Skip months of development with our production-ready SaaS template. Authentication, payments, and modern UI included.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-scale-in delay-300">
              {user ? (
                <Button 
                  onClick={handleCheckout}
                  size="lg" 
                  className="gradient-bg hover-lift group"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button asChild size="lg" className="gradient-bg hover-lift group">
                  <Link href="/sign-up">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
              
              <Button asChild variant="outline" size="lg" className="hover-scale">
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Pricing Card */}
          <div className={`transition-all delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDuration: 'var(--duration-slow)' }}>
                          <div className="bg-background rounded-lg shadow-2xl border border-border overflow-hidden transform hover-scale">
                <div className="gradient-bg text-primary-foreground px-6 py-4">
                  <h3 className="text-lg font-semibold text-center">Get my SaaS</h3>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    $49
                    <span className="text-lg font-normal text-muted-foreground">/once</span>
                  </div>
                  <p className="text-muted-foreground">Get my SaaS</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    'Complete authentication system',
                    'Stripe payments integration',
                    'Modern UI components',
                    'Database schema included',
                    'TypeScript & Next.js 15',
                    'Production ready'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {user ? (
                  <Button 
                    onClick={handleCheckout}
                    className="w-full gradient-bg hover-lift group"
                  >
                    Get Template Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button asChild className="w-full gradient-bg hover-lift group">
                    <Link href="/sign-up">
                      Get Template Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 