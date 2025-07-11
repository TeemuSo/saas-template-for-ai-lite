'use client';

import Link from 'next/link';
import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">SaaS Template for AI</h3>
            <p className="text-background/70 mb-4 max-w-md">
              A complete SaaS Template For AI built with Next.js, PostgreSQL, and Stripe.
              Launch your SaaS product faster with modern technologies.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com" 
                className="text-background/70 hover:text-background transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com" 
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:contact@example.com" 
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-background/90 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="#features" 
                  className="text-background/70 hover:text-background transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('features')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/sign-up" 
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-background/70 hover:text-background transition-colors">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-background/90 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-background/70 hover:text-background transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-background/70 hover:text-background transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/70 text-sm">
            © {currentYear} SaaS template for AI. All rights reserved.
          </p>
          <p className="text-background/50 text-xs mt-2 md:mt-0">
            Built with Next.js • Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
} 