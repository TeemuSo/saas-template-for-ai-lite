import { getOptionalUser } from '@/lib/auth/dal';
import { NextRequest, NextResponse } from 'next/server';
import { cache } from 'react';

// Cache the user data for the current request cycle
const getCachedUserData = cache(async () => {
  return await getOptionalUser();
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Use cached DAL function to prevent duplicate database calls
    const userData = await getCachedUserData();
    
    if (!userData) {
      // Return null for unauthenticated users to maintain compatibility
      // with components that check authentication state
      return NextResponse.json(null);
    }
    
    // Return the database user record
    return NextResponse.json(userData.dbUser);
  } catch (error) {
    console.error('Error in /api/user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
