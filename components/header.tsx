import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleIcon } from 'lucide-react';
import { UserMenuClient, NavigationButtons } from '@/components/header-client';

interface HeaderProps {
  userData: {
    isAuth: boolean;
    userId: string;
    email: string | undefined;
    user: any;
    dbUser: any;
  } | null;
  pathname: string;
}

export function Header({ userData, pathname }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-semibold text-foreground">SaaS Template for AI</span>
        </Link>
        <div className="flex items-center space-x-4">
          {/* Navigation buttons - client-side reactive */}
          <NavigationButtons userData={userData} />
          
          {/* User menu */}
          {userData ? (
            <UserMenuClient 
              user={userData.user} 
              dbUser={userData.dbUser}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 