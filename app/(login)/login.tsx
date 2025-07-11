'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
// Using semantic Tailwind classes and @apply helpers
import { useAuth } from '@/lib/auth/auth-provider';
import { config } from '@/lib/config';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setError('');
    setSuccess('');

    try {
      const result = mode === 'signin' 
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password);

      if (result.success) {
        if (mode === 'signup' && 'requiresConfirmation' in result && result.requiresConfirmation) {
          setSuccess('Account created! Please check your email to confirm your account before signing in.');
        } else {
          // Redirect will be handled by the auth provider
          if (redirect) {
            window.location.href = `/${redirect}`;
          } else {
            window.location.href = '/app';
          }
        }
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setPending(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    if (googleLoading) return;
    
    setGoogleLoading(true);
    setError('');
    
    try {
      const result = await signInWithGoogle(redirect || 'app');
      
      if (!result.success) {
        setError(result.error || 'Failed to sign in with Google');
        setGoogleLoading(false);
      }
      // On success, OAuth will redirect, so no need to reset loading state
    } catch (error) {
      setError('An unexpected error occurred');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg-subtle relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-primary/15 to-primary/10 blur-3xl animate-float delay-200"></div>
      </div>

      <div className="relative min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-90"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-background/5 to-transparent"></div>
          </div>
        
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-primary-foreground animate-slide-up">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-background/20 backdrop-blur-sm rounded-2xl mb-6 animate-scale-in">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold mb-4 animate-fade-in delay-100 text-foreground">
                Welcome to the Future
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed animate-fade-in delay-200">
                Join thousands of developers building amazing SaaS applications with our production-ready template.
              </p>
            </div>
            
            <div className="space-y-4 animate-fade-in delay-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-foreground rounded-full mr-3"></div>
                <span className="text-primary-foreground/80">Complete authentication system</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-foreground rounded-full mr-3"></div>
                <span className="text-primary-foreground/80">Stripe payments integration</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-foreground rounded-full mr-3"></div>
                <span className="text-primary-foreground/80">Modern UI components</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md mx-auto animate-slide-up delay-100">
            {/* Back to home link */}
            <div className="mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors group hover-scale"
                style={{ transitionDuration: 'var(--duration-fast)' }}
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" style={{ transitionDuration: 'var(--duration-fast)' }} />
                Back to home
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8 animate-fade-in delay-200">
              <div className="flex items-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 gradient-bg rounded-xl shadow-lg hover-scale">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {mode === 'signin' ? 'Welcome back' : 'Get started'}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {mode === 'signin' 
                      ? 'Sign in to your account to continue' 
                      : 'Create your account to get started'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in delay-300">
              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary hover-scale"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary pr-12 hover-scale"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover-scale"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least {config.auth.passwordMinLength} characters with uppercase, lowercase, number, and special character (!@#$%^&*)
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-xl animate-scale-in">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-success/10 border border-success rounded-xl animate-scale-in">
                  <p className="text-success text-sm">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={pending}
                className="w-full h-12 gradient-bg hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover-lift disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:opacity-70"
                style={{ transitionDuration: 'var(--duration-fast)' }}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  mode === 'signin' ? 'Sign in' : 'Create account'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 animate-fade-in delay-400">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 gradient-bg-subtle text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || pending}
              className="w-full h-12 mb-6 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-all hover:border-gray-300 hover:shadow-md disabled:opacity-70 hover-scale animate-fade-in delay-500"
              style={{ transitionDuration: 'var(--duration-fast)' }}
            >
              {googleLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {/* Switch mode */}
            <div className="text-center mt-6 animate-fade-in delay-600">
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                {' '}
                <Link 
                  href={mode === 'signin' ? '/sign-up' : '/sign-in'}
                  className="font-semibold text-primary hover:opacity-80 transition-opacity hover-scale"
                  style={{ transitionDuration: 'var(--duration-fast)' }}
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </Link>
              </p>
            </div>

            {/* Trust indicator */}
            <div className="text-center mt-8 animate-fade-in delay-700">
              <p className="text-xs text-muted-foreground">
                Protected by industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
