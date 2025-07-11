import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { User } from '@/lib/supabase/types';
import { getUser } from '@/lib/auth/dal';
import { config } from '@/lib/config';

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-02-24.acacia'
});

export async function createCheckoutSession({
  priceId,
  userId
}: {
  priceId: string;
  userId?: string;
}) {
  const userData = await getUser();

  if (!userData) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  const user = userData.dbUser;

  // Create a Stripe customer if one doesn't exist
  let customerId = user.stripe_customer_id;
  if (!customerId) {
    // Use auth user details from DAL
    const authUser = userData.user;
    
    const customer = await stripe.customers.create({
      email: authUser?.email,
      name: authUser?.user_metadata?.full_name || undefined,
    });
    customerId = customer.id;
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
    client_reference_id: user.supabase_user_id, // Use Supabase user ID
    allow_promotion_codes: true,
    payment_intent_data: {
      metadata: {
        userId: user.supabase_user_id // Use Supabase user ID
      }
    }
  });

  redirect(session.url!);
}

export async function handlePaymentSuccess(
  paymentIntent: Stripe.PaymentIntent
) {
  const userId = paymentIntent.metadata.userId;
  
  if (!userId) {
    console.error('No user ID found in payment intent metadata');
    return;
  }
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id
  }));
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'one_time'
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
  }));
}
