import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { getApiUser } from '@/lib/auth/dal';
import { updateUserStripeCustomerId } from '@/lib/db/queries';
import { config } from '@/lib/config';

// POST: Create checkout session
export async function POST(request: NextRequest) {
  try {
    // Use DAL for API authentication
    const userData = await getApiUser();
    
    // Use server-side price ID - more secure than client-side
    const priceId = config.stripe.priceId;

    if (!priceId) {
      console.error('STRIPE_PRICE_ID environment variable is not set');
      return NextResponse.json(
        { error: 'Payment configuration error' },
        { status: 500 }
      );
    }

    const { user, dbUser } = userData;

    // Create a Stripe customer if one doesn't exist
    let customerId = dbUser.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || '',
        name: user.user_metadata?.full_name || undefined,
      });
      customerId = customer.id;
      
      // Persist customer ID to avoid creating duplicates
      await updateUserStripeCustomerId(userData.userId, customerId);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${config.app.url}${config.stripe.successUrl}`,
      cancel_url: `${config.app.url}${config.stripe.cancelUrl}`,
      customer: customerId,
      client_reference_id: userData.userId, // Use Supabase user ID
      allow_promotion_codes: true,
      payment_intent_data: {
        metadata: {
          userId: userData.userId // Use Supabase user ID
        }
      }
    });

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Handle authentication errors from DAL
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required', redirectTo: config.auth.paths.signIn },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unable to create checkout session' },
      { status: 500 }
    );
  }
}


