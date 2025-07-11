/**
 * Simple Auth Logging for SaaS Template
 * - Console logging (automatically captured by Vercel)
 * - Template-friendly and easy to customize
 */

interface LogEvent {
  action: string;
  email?: string;
  userId?: string | number;
  error?: string;
  reason?: string;
  [key: string]: any;
}

/**
 * Simple auth logger that logs to console
 * Logs are automatically captured by Vercel in production
 */
export function logAuth(action: string, data: Partial<LogEvent> = {}) {
  const timestamp = new Date().toISOString();
  const message = `[AUTH] ${action}: ${data.email || data.userId || 'unknown'}`;
  
  if (action.includes('ERROR') || action.includes('FAILED')) {
    console.error(message, { timestamp, action, ...data });
  } else {
    console.info(message, { timestamp, action, ...data });
  }
}

/**
 * Track user events for analytics
 */
export function trackUserEvent(event: string, properties?: Record<string, any>) {
  console.info(`[ANALYTICS] ${event}`, properties);
} 