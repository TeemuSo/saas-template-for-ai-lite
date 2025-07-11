'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Cookie, Shield, BarChart3, CreditCard } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'functional';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

const defaultPreferences: CookiePreferences = {
  essential: true, // Always required
  analytics: false,
  marketing: false,
  functional: false,
};

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    
    if (!hasConsent) {
      // Delay banner show to improve LCP - reduce initial render blocking
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
    
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    // Essential cookies are always required
    const finalPreferences = { ...newPreferences, essential: true };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(finalPreferences));
    setPreferences(finalPreferences);
    
    // Apply preferences to actual tracking services
    applyPreferences(finalPreferences);
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // Handle Vercel Analytics
    if (!prefs.analytics) {
      // Disable Vercel Analytics if user opted out
      if (typeof window !== 'undefined' && (window as any).va) {
        (window as any).va.track = () => {};
      }
    }
    
    // Add any other analytics/marketing service controls here
    // For example, Google Analytics, Facebook Pixel, etc.
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    savePreferences(allAccepted);
  };

  const acceptEssentialOnly = () => {
    savePreferences(defaultPreferences);
  };

  const togglePreference = (category: CookieCategory) => {
    if (category === 'essential') return; // Can't disable essential cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!mounted || !showBanner) return null;

  const cookieCategories = [
    {
      id: 'essential' as CookieCategory,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly. These include authentication, security, and basic functionality.',
      icon: Shield,
      examples: 'User sessions, CSRF protection, form submissions',
      required: true,
    },
    {
      id: 'functional' as CookieCategory,
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization, such as payment processing.',
      icon: CreditCard,
      examples: 'Stripe payment processing, user preferences',
      required: false,
    },
    {
      id: 'analytics' as CookieCategory,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting and reporting information.',
      icon: BarChart3,
      examples: 'Vercel Analytics, page views, user behavior',
      required: false,
    },
    {
      id: 'marketing' as CookieCategory,
      title: 'Marketing Cookies',
      description: 'Track visitors across websites to display relevant and engaging advertisements.',
      icon: Cookie,
      examples: 'Advertising networks, social media pixels (currently none active)',
      required: false,
    },
  ];

  // Use CSS transitions for performance - no framer-motion needed
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity duration-[var(--duration-slow)]"
        onClick={() => !showSettings && acceptEssentialOnly()}
      />
      
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-[var(--duration-slow)] ease-out animate-slide-up">
        <Card className="max-w-4xl mx-auto bg-background border shadow-2xl">
          {!showSettings ? (
            // Main banner
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    We value your privacy
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    We use cookies to enhance your browsing experience, provide personalized content, 
                    and analyze our traffic. Some cookies are essential for the website to function, 
                    while others help us improve our services and understand how you use our site.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={acceptAll}
                      className="bg-primary hover:bg-primary/80 text-primary-foreground px-6"
                    >
                      Accept All Cookies
                    </Button>
                    <Button 
                      onClick={acceptEssentialOnly}
                      variant="outline"
                      className="px-6"
                    >
                      Essential Only
                    </Button>
                    <Button 
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                      className="px-6"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={acceptEssentialOnly}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            // Settings panel
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Cookie Preferences</h3>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-6 text-sm">
                Manage your cookie preferences. You can enable or disable different types of cookies below.
              </p>

              <div className="space-y-4 mb-6">
                {cookieCategories.map((category) => {
                  const IconComponent = category.icon;
                  const isEnabled = preferences[category.id];
                  
                  return (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            <IconComponent className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-foreground">{category.title}</h4>
                              {category.required && (
                                <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {category.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Examples:</strong> {category.examples}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 ml-4">
                          <Button
                            onClick={() => togglePreference(category.id)}
                            variant={isEnabled ? "default" : "outline"}
                            size="sm"
                            disabled={category.required}
                            className={`min-w-[60px] ${
                              isEnabled 
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                                : 'hover:bg-muted'
                            }`}
                          >
                            {isEnabled ? 'On' : 'Off'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button 
                  onClick={() => savePreferences(preferences)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                >
                  Save Preferences
                </Button>
                <Button 
                  onClick={acceptAll}
                  variant="outline"
                  className="flex-1"
                >
                  Accept All
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

// Hook for other components to check cookie consent
export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
        setPreferences(defaultPreferences);
      }
    } else {
      setPreferences(defaultPreferences);
    }
    setLoading(false);
  }, []);

  const isAllowed = (category: CookieCategory): boolean => {
    if (loading || !preferences) return category === 'essential';
    return preferences[category];
  };

  return {
    preferences,
    isAllowed,
    loading
  };
} 