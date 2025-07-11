'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Code, 
  Database, 
  CreditCard,
  Shield,
  Zap,
  Rocket,
  Users,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const features = [
  {
    title: 'Authentication Ready',
    description: 'Complete auth system with Supabase. Social logins, email verification, and secure sessions built-in.',
    icon: Shield,
    gradient: 'from-primary to-primary/70',
    delay: 'delay-100'
  },
  {
    title: 'Payment Integration',
    description: 'Stripe integration for one-time payments. Secure checkout, webhooks, and customer management included.',
    icon: CreditCard,
    gradient: 'from-primary/90 to-primary/60',
    delay: 'delay-200'
  },
  {
    title: 'Modern Tech Stack',
    description: 'Built with Next.js 15, TypeScript, Tailwind CSS, and the latest web technologies.',
    icon: Code,
    gradient: 'from-primary/80 to-primary/50',
    delay: 'delay-300'
  },
  {
    title: 'Database Schema',
    description: 'PostgreSQL database with Supabase. Auto-generated TypeScript types and simple SQL queries ready to deploy.',
    icon: Database,
    gradient: 'from-primary/70 to-primary/40',
    delay: 'delay-400'
  },
  {
    title: 'Performance Optimized',
    description: 'Optimized for Core Web Vitals with proper caching, lazy loading, and modern performance patterns.',
    icon: Zap,
    gradient: 'from-primary/60 to-primary/30',
    delay: 'delay-500'
  },
  {
    title: 'Production Ready',
    description: 'Deployment configs, monitoring, error handling, and scalability patterns included.',
    icon: Rocket,
    gradient: 'from-primary/80 to-primary',
    delay: 'delay-600'
  }
];

const stats = [
  { value: '10,000+', label: 'Lines of Code', delay: 'delay-100' },
  { value: '50+', label: 'Components', delay: 'delay-200' },
  { value: '3 months', label: 'Development Saved', delay: 'delay-300' },
  { value: '99.9%', label: 'Uptime Ready', delay: 'delay-400' }
];

export function FeaturesSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-20 bg-background" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-20 transition-all ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDuration: 'var(--duration-slow)' }}>
          <div className="badge badge-primary mb-6 animate-scale-in">
            <Sparkles className="w-4 h-4 mr-2" />
            Everything You Need
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up delay-100">
            Launch Your SaaS
            <span className="block gradient-text animate-gradient">
              In Days, Not Months
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in delay-200">
            Complete production-ready template with authentication, payments, modern UI, and everything else you need to build and launch your SaaS.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className={`transition-all ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${feature.delay}`}
                style={{ transitionDuration: 'var(--duration-slow)' }}
              >
                <Card className="h-full group hover-lift">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg mb-4 group-hover:scale-110 transition-transform`} style={{ transitionDuration: 'var(--duration-medium)' }}>
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
} 