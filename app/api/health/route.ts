import { NextResponse } from 'next/server';

/**
 * Simple health check endpoint for network connectivity verification
 * Used by client-side utilities to verify actual server connectivity
 */
export async function GET() {
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
} 