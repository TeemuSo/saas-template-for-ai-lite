import 'server-only';
import Stripe from 'stripe';
import { requireEnv } from '@/lib/config';

let stripeClient: Stripe | null = null;

// Created on first use so the app builds without Stripe secrets present.
export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24.acacia'
    });
  }
  return stripeClient;
}

export async function getStripeProducts() {
  const products = await getStripe().products.list({
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
  const prices = await getStripe().prices.list({
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
