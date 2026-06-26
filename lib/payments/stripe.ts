import Stripe from 'stripe';
import { config } from '@/lib/config';

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-02-24.acacia'
});
