import { getUserWithAccess } from '@/lib/auth/dal';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { config } from '@/lib/config';

// Force dynamic rendering since we use cookies for authentication
export const dynamic = 'force-dynamic';

// Client component for animations
function AnimatedContent() {
  return (
    <>
      {/* Bouncing Element */}
      <div className="mb-12 relative animate-scale-in">
        <div className="w-20 h-20 gradient-bg rounded-full shadow-2xl shadow-primary/30 animate-float relative">
          <div className="absolute inset-2 bg-gradient-to-br from-primary/80 to-primary rounded-full opacity-60 animate-float"></div>
          <div className="absolute inset-4 bg-background/20 rounded-full animate-float"></div>
        </div>
        
        {/* Ripple effects that don't move */}
        <div className="absolute inset-0 w-20 h-20 border-4 border-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-20 h-20 border-2 border-primary/20 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
          Write Your Next
          <span className="block gradient-text animate-gradient">
            Million Dollar App
          </span>
          <span className="block text-muted-foreground">
            Here
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-200">
          You've got the foundation. Now build something
          <span className="text-primary font-semibold"> extraordinary</span>.
        </p>
      </div>
    </>
  );
}

export default async function AppPage() {
  // Use DAL to verify both authentication AND payment access
  // This will redirect to sign-in if not authenticated
  // This will redirect to home with access=required if no payment
  const userData = await getUserWithAccess();

  // At this point, we know the user is authenticated AND has paid access
  console.log(`[APP] Authorized user accessing app: ${userData.email}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-primary/30 to-primary/20 blur-3xl animate-float delay-300"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6">
        <AnimatedContent />
        
        {/* User info for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p>✅ Authenticated: {userData.email}</p>
            <p>✅ Has Access: {userData.dbUser.has_access ? 'Yes' : 'No'}</p>
            <p>User ID: {userData.userId}</p>
          </div>
        )}
      </div>
    </div>
  );
} 