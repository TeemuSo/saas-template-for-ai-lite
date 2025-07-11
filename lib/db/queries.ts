import { createServiceClient } from '@/lib/supabase/server';
import { User, Purchase } from '@/lib/supabase/types';

/**
 * Database operations for webhook handlers and service-role contexts
 * 
 * These functions use the service role client to bypass RLS for system operations.
 * For user-facing operations, use the Data Access Layer (DAL) functions instead.
 */

/**
 * Grant user access after successful payment
 * 
 * ⚠️ SERVICE ROLE ONLY - This bypasses RLS for webhook operations
 * Only call this from secure server-side contexts (webhooks)
 * 
 * @param supabaseUserId - The user's Supabase auth ID
 * @returns Updated user record
 * @throws Error if user not found
 */
export async function grantUserAccess(supabaseUserId: string): Promise<User> {
  try {
    // Use service role client to bypass RLS
    const supabase = await createServiceClient();
    
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ 
        has_access: true,
        updated_at: new Date().toISOString(),
      })
      .eq('supabase_user_id', supabaseUserId)
      .select()
      .single();

    if (error) {
      console.error('Error granting user access:', error);
      throw new Error('User not found');
    }

    console.log(`Granted access to user ${supabaseUserId}`);
    return updatedUser;
  } catch (error) {
    console.error('Error granting user access:', error);
    throw error;
  }
}

/**
 * Revoke user access (e.g., for refunds or subscription cancellation)
 * 
 * ⚠️ SERVICE ROLE ONLY - This bypasses RLS for webhook operations
 * 
 * @param supabaseUserId - The user's Supabase auth ID
 * @returns Updated user record
 * @throws Error if user not found
 */
export async function revokeUserAccess(supabaseUserId: string): Promise<User> {
  try {
    const supabase = await createServiceClient();
    
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ 
        has_access: false,
        updated_at: new Date().toISOString(),
      })
      .eq('supabase_user_id', supabaseUserId)
      .select()
      .single();

    if (error) {
      console.error('Error revoking user access:', error);
      throw new Error('User not found');
    }

    console.log(`Revoked access for user ${supabaseUserId}`);
    return updatedUser;
  } catch (error) {
    console.error('Error revoking user access:', error);
    throw error;
  }
}

/**
 * Create a purchase record after successful payment
 * 
 * ⚠️ SERVICE ROLE ONLY - Called from Stripe webhooks
 * 
 * This function:
 * 1. Looks up the user by their Supabase ID
 * 2. Creates a purchase record with payment details
 * 3. Used for tracking payment history
 * 
 * @param data - Purchase details from Stripe
 * @returns Created purchase record
 * @throws Error if user not found or creation fails
 */
export async function createPurchase(data: {
  supabaseUserId: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  amount: number;
  currency: string;
  productName: string;
}): Promise<Purchase> {
  try {
    const supabase = await createServiceClient();
    
    // First get the internal user ID (not the Supabase auth ID)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('supabase_user_id', data.supabaseUserId)
      .single();

    if (userError || !user) {
      throw new Error('User not found');
    }

    // Create the purchase record
    const { data: purchase, error } = await supabase
      .from('purchases')
      .insert({
        user_id: user.id, // Use internal ID for foreign key
        stripe_payment_intent_id: data.stripePaymentIntentId,
        stripe_session_id: data.stripeSessionId || null,
        amount: data.amount,
        currency: data.currency,
        status: 'completed',
        product_name: data.productName,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating purchase:', error);
      throw error;
    }

    return purchase;
  } catch (error) {
    console.error('Error creating purchase:', error);
    throw error;
  }
}

/**
 * Update user's Stripe customer ID after first payment
 * 
 * ⚠️ SERVICE ROLE ONLY - Called from Stripe webhooks
 * 
 * Stripe creates a customer ID on first payment. We store it
 * to link future payments to the same customer.
 * 
 * @param supabaseUserId - The user's Supabase auth ID
 * @param stripeCustomerId - The Stripe customer ID to store
 * @returns Updated user record
 * @throws Error if user not found
 */
export async function updateUserStripeCustomerId(
  supabaseUserId: string, 
  stripeCustomerId: string
): Promise<User> {
  try {
    const supabase = await createServiceClient();
    
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ 
        stripe_customer_id: stripeCustomerId,
        updated_at: new Date().toISOString(),
      })
      .eq('supabase_user_id', supabaseUserId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user Stripe customer ID:', error);
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error updating user Stripe customer ID:', error);
    throw error;
  }
}

/**
 * Find users by their Stripe customer ID
 * 
 * ⚠️ SERVICE ROLE ONLY - Used in webhooks to identify users
 * 
 * When Stripe sends webhooks, they include the customer ID.
 * We use this to find which user the payment belongs to.
 * 
 * @param stripeCustomerId - The Stripe customer ID
 * @returns Array of users (should be 0 or 1)
 */
export async function getUsersByStripeCustomerId(stripeCustomerId: string): Promise<User[]> {
  try {
    const supabase = await createServiceClient();
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', stripeCustomerId);

    if (error) {
      console.error('Error finding users by Stripe customer ID:', error);
      throw error;
    }

    return users || [];
  } catch (error) {
    console.error('Error finding users by Stripe customer ID:', error);
    throw error;
  }
}