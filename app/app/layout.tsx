import { ReactNode } from 'react';
import { getUserWithAccess } from '@/lib/auth/dal';

interface AppLayoutProps {
  children: ReactNode;
}

// Guard every /app/* route by default. This verifies authentication AND paid
// access, redirecting to sign-in or the access page when needed. Because
// getUserWithAccess() is memoized via React cache(), child pages that call it
// again reuse this result instead of triggering a second check/redirect.
export default async function AppLayout({ children }: AppLayoutProps) {
  await getUserWithAccess();

  return <>{children}</>;
}
