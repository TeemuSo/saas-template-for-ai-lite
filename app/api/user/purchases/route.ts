import { getUserPurchases } from '@/lib/auth/dal';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use DAL for authentication and data fetching
    const purchases = await getUserPurchases();
    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error in /api/user/purchases:', error);
    
    // Handle authentication errors from DAL
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 