'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { useAuth } from '@/lib/auth/auth-provider';

export function ConditionalHeader() {
  const pathname = usePathname();
  const { user, dbUser, loading } = useAuth();
  
  // Don't show header on login pages
  const hideHeader = pathname === '/sign-in' || pathname === '/sign-up';
  
  if (hideHeader) {
    return null;
  }
  
  // Show loading state while auth is being determined
  if (loading) {
    return (
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-6 w-6 bg-primary rounded-full" />
            <span className="ml-2 text-xl font-semibold text-foreground">SaaS Template for AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-9 w-32 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
      </header>
    );
  }
  
  // Prepare user data in the format expected by Header
  const userData = user && dbUser ? {
    isAuth: true,
    userId: user.id,
    email: user.email,
    user: user,
    dbUser: dbUser
  } : null;
  
  return <Header userData={userData} pathname={pathname} />;
} 