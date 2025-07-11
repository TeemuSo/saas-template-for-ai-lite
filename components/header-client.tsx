'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth/auth-provider';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

interface UserMenuClientProps {
  user: User;
  dbUser: any;
}

export function NavigationButtons({ userData }: { userData: any }) {
  const pathname = usePathname();
  const isApp = pathname.startsWith('/app');
  
  return (
    <>
      {isApp && (
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            ← Back to Home
          </Link>
        </Button>
      )}
      
      {userData?.dbUser?.has_access && !isApp && (
        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
          <Link href="/app">
            Go to App
          </Link>
        </Button>
      )}
    </>
  );
}

export function UserMenuClient({ user, dbUser }: { user: User; dbUser: any }) {
  const [signOutPending, setSignOutPending] = useState(false);
  const { signOut } = useAuth();

  // Handle sign out
  const handleSignOut = async () => {
    if (signOutPending) return;
    
    setSignOutPending(true);
    await signOut();
    setSignOutPending(false);
  };

  // Simple initials generation
  const getInitials = (user: User) => {
    if (user.user_metadata?.full_name?.trim()) {
      const names = user.user_metadata.full_name.trim().split(/\s+/);
      return names.length >= 2 
        ? (names[0][0] + names[1][0]).toUpperCase()
        : names[0].slice(0, 2).toUpperCase();
    }
    
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.user_metadata?.full_name || user.email} />
          <AvatarFallback>
            {getInitials(user)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <div className="px-2 py-1.5 text-sm text-foreground">
          <div className="font-medium">{user.user_metadata?.full_name || 'User'}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
        <DropdownMenuSeparator />
        
        <button 
          onClick={handleSignOut}
          disabled={signOutPending} 
          className="flex w-full"
        >
          <DropdownMenuItem className="w-full flex-1 cursor-pointer disabled:opacity-50">
            {signOutPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </>
            )}
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}