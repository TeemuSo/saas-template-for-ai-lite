import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { config } from '@/lib/config';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  const next = searchParams.get('next') ?? '/app';

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, error_description);
    const errorMessage = encodeURIComponent(
      error_description || 'Authentication failed. Please try again.'
    );
    return NextResponse.redirect(`${origin}${config.auth.paths.signIn}?error=${errorMessage}`);
  }

  if (code) {
    const supabase = await createClient();
    
    try {
      const { error, data } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error && data.user) {
        console.log(`User authenticated: ${data.user.id} (${data.user.email})`);

        // Create user record in database if it doesn't exist using secure RPC
        try {
          const { error: rpcError } = await supabase.rpc('create_user_profile');
          if (rpcError) {
            console.error('Error calling create_user_profile RPC:', rpcError);
            // Don't fail the auth flow for this - user can still sign in
          } else {
            console.log(`Created database record for user: ${data.user.id}`);
          }
        } catch (createError) {
          console.error('Error creating user record:', createError);
          // Don't fail the auth flow for this - user can still sign in
        }

        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = config.app.env === 'development';
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      } else {
        console.error('Session exchange error:', error);
        const errorMessage = encodeURIComponent('Failed to complete authentication. Please try again.');
        return NextResponse.redirect(`${origin}${config.auth.paths.signIn}?error=${errorMessage}`);
      }
    } catch (err) {
      console.error('Unexpected error during auth callback:', err);
      const errorMessage = encodeURIComponent('An unexpected error occurred. Please try again.');
      return NextResponse.redirect(`${origin}${config.auth.paths.signIn}?error=${errorMessage}`);
    }
  }

  // No code and no error - invalid callback
  const errorMessage = encodeURIComponent('Invalid authentication callback. Please try signing in again.');
  return NextResponse.redirect(`${origin}${config.auth.paths.signIn}?error=${errorMessage}`);
} 