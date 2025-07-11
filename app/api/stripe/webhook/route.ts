import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { 
  grantUserAccess, 
  createPurchase, 
  updateUserStripeCustomerId,
  getUsersByStripeCustomerId
} from '@/lib/db/queries';
import { config } from '@/lib/config';

const stripe = new Stripe(config.stripe.secretKey);

/**
 * Stripe Webhook Handler
 * 
 * This endpoint receives payment events from Stripe and updates our database.
 * It's called automatically by Stripe when payment events occur.
 * 
 * Security: 
 * - Validates webhook signatures to ensure requests are from Stripe
 * - Uses service role to bypass RLS for database updates
 * - Must be excluded from authentication middleware
 * 
 * Events handled:
 * - checkout.session.completed: Payment successful, grant access
 * - payment_intent.payment_failed: Payment failed, log for debugging
 */
export async function POST(request: NextRequest) {
  console.log('🚀 WEBHOOK CALLED! Request received');

  let event: Stripe.Event;

  try {
    // Get the webhook signature from headers
    const stripeSignature = (await headers()).get('stripe-signature');

    // Verify the webhook signature to ensure it's from Stripe
    // This prevents malicious actors from calling our webhook
    event = stripe.webhooks.constructEvent(
      await request.text(),
      stripeSignature as string,
      config.stripe.webhookSecret
    );
    console.log('✅ Webhook signature verified successfully');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // On error, log and return the error message
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      {message: `Webhook Error: ${errorMessage}`},
      {status: 400}
    );
  }

  console.log('✅ Success:', event.id);

  // Define which events we want to handle
  // For one-time payments, we mainly need checkout.session.completed
  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.payment_failed',
    'payment_intent.created',
    'payment_intent.succeeded'
  ];

  // Ignore events we don't care about
  if (!permittedEvents.includes(event.type)) {
    console.log(`Unhandled event type: ${event.type}`);
    return NextResponse.json({ received: true });
  }

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        // Payment successful - grant user access
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        // Payment failed - log for debugging
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'payment_intent.created':
        // Payment intent created - just log it
        console.log(`💳 Payment intent created: ${event.data.object.id}`);
        break;
      case 'payment_intent.succeeded':
        // Payment intent succeeded - log it (checkout.session.completed handles the access)
        console.log(`✅ Payment intent succeeded: ${event.data.object.id}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

/**
 * Handle successful checkout completion
 * 
 * This is called when a user successfully completes payment.
 * We need to:
 * 1. Grant them access in our database
 * 2. Store their Stripe customer ID for future reference
 * 3. Create a purchase record for their history
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Only process if payment is complete
  if (session.payment_status !== 'paid') {
    console.log(`❌ Payment not completed for session ${session.id}, status: ${session.payment_status}`);
    return;
  }

  // Get the user ID we stored when creating the checkout session
  const userId = session.client_reference_id;
  const paymentIntentId = typeof session.payment_intent === 'string' 
    ? session.payment_intent 
    : session.payment_intent?.id;

  if (!userId) {
    console.error('No user ID found in checkout session client_reference_id');
    return;
  }

  try {
    // 1. Grant user access
    console.log(`🔓 Granting access to user ${userId}...`);
    await grantUserAccess(userId);
    console.log(`✅ Access granted`);

    // 2. Store Stripe customer ID for future payments
    if (session.customer) {
      console.log(`🔄 Updating customer ID: ${session.customer}`);
      await updateUserStripeCustomerId(userId, session.customer as string);
      console.log(`✅ Customer ID updated`);
    }

    // 3. Create purchase record for history/analytics
    console.log(`💾 Creating purchase record...`);
    await createPurchase({
      supabaseUserId: userId,
      stripePaymentIntentId: paymentIntentId || undefined,
      stripeSessionId: session.id,
      amount: session.amount_total || 0,
      currency: session.currency || config.stripe.currency,
      productName: config.stripe.productName,
    });
    console.log(`✅ Purchase record created`);

    console.log(`🎉 Successfully processed checkout for user ${userId}`);
  } catch (error) {
    console.error('❌ Error processing checkout session:', error);
    throw error; // Re-throw to return 500 status
  }
}

/**
 * Handle failed payment attempts
 * 
 * This logs failed payments for debugging and customer support.
 * You might want to:
 * - Send an email to the customer
 * - Track failed payment attempts
 * - Offer alternative payment methods
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const customerId = paymentIntent.customer as string;
  if (!customerId) {
    console.error('No customer ID found in payment intent');
    return;
  }

  try {
    // Find which user this payment belongs to
    const users = await getUsersByStripeCustomerId(customerId);

    if (users.length === 0) {
      console.error('No users found for Stripe customer ID:', customerId);
      return;
    }

    // Log the failure for debugging
    console.log(`💸 Payment failed for users: ${users.map(u => u.supabase_user_id).join(', ')}`);
    console.log(`🔍 Failure reason: ${paymentIntent.last_payment_error?.message || 'Unknown'}`);

  } catch (error) {
    console.error('❌ Error processing failed payment intent:', error);
    throw error;
  }
}
