'use client';

import { Analytics } from '@vercel/analytics/react';
import { useEffect, useState } from 'react';
import { useCookieConsent } from '@/components/ui/cookie-banner';

export function AnalyticsWrapper() {
  const [mounted, setMounted] = useState(false);
  const { isAllowed, loading } = useCookieConsent();

  useEffect(() => {
    // Delay analytics loading for better LCP
    const timer = setTimeout(() => {
      setMounted(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Don't render analytics until:
  // 1. Component is mounted
  // 2. Cookie consent is loaded
  // 3. Analytics are allowed
  if (!mounted || loading || !isAllowed('analytics')) {
    return null;
  }

  return <Analytics />;
} 