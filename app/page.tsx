import { getOptionalUser } from '@/lib/auth/dal';
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';
import { Footer } from '@/components/footer';

// Force dynamic rendering since we use cookies for authentication
export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ access?: string }> }) {
  const userData = await getOptionalUser();
  const user = userData?.dbUser || null;
  const resolvedSearchParams = await searchParams;
  
  return (
    <main className="min-h-screen">
      <div className="transition-element">
        <HeroSection user={user} needsAccess={resolvedSearchParams.access === 'required'} />
      </div>
      <div className="transition-element" style={{ transitionDelay: '0.1s' }}>
        <FeaturesSection />
      </div>

      <Footer />
    </main>
  );
} 