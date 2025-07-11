# Setup Guide - SaaS Template Lite

This guide will walk you through setting up your SaaS application step by step. Follow these instructions carefully to get your app running locally and deployed to production.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 18 or higher** - [Download here](https://nodejs.org/)
- **pnpm** - Required package manager
  ```bash
  npm install -g pnpm
  ```
- **Git** - For version control
- **Supabase Account** - [Sign up free](https://supabase.com)
- **Stripe Account** - [Sign up free](https://stripe.com)
- **Code Editor** - VS Code recommended

## 🚀 Step 1: Project Setup

### Clone and Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd saas-template-lite

# Install dependencies
pnpm install
```

### Verify Installation
```bash
# Check Node.js version
node --version  # Should be 18.0.0 or higher

# Check pnpm version
pnpm --version  # Should be 8.0.0 or higher
```

## 🗄️ Step 2: Supabase Database Setup

### Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: Your app name
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** and wait ~2 minutes

### Install Supabase CLI
```bash
# Install globally
npm install -g supabase

# Verify installation
supabase --version
```

### Link Your Project
```bash
# Link to your Supabase project
supabase link --project-ref your-project-id

# Find your project ID in the Supabase dashboard URL:
# https://app.supabase.com/project/[YOUR-PROJECT-ID]/...
```

### Apply Database Schema
```bash
# Apply migrations to create tables
supabase db push

# This creates:
# - users table (for user profiles)
# - purchases table (for payment records)
# - RLS policies for security
```

### Generate TypeScript Types
```bash
# Generate types from your database schema
pnpm db:types

# This updates lib/supabase/types.ts with your database schema
```

### Get Your API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

## 💳 Step 3: Stripe Payment Setup

### Create a Product

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add product**
3. Create your product:
   - **Name**: "SaaS Access" (or your product name)
   - **Pricing**: One-time payment
   - **Price**: Set your price (e.g., $49)
4. **Save** and copy the **Price ID** (starts with `price_`)

### Get Your API Keys

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Copy:
   - **Secret key** → `STRIPE_SECRET_KEY`
   - **Publishable key** → Not needed for this template

### Set Up Webhooks

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. **For Local Development**:
   - Use Stripe CLI (we'll set this up later)
3. **For Production**:
   - **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - **Events**: Select these events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
4. **Save** and copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 🔧 Step 4: Environment Variables

### Create Environment File
```bash
cp .env.example .env.local
```

### Fill in Your Values
Open `.env.local` and update with your keys:

```env
# ================================================
# SUPABASE CONFIGURATION
# ================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ================================================
# STRIPE CONFIGURATION
# ================================================
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID=price_your-price-id

# ================================================
# APP CONFIGURATION
# ================================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Environment Variables Explained

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (secret!) | Supabase Dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe secret key | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe Dashboard → Developers → Webhooks |
| `STRIPE_PRICE_ID` | Your product price ID | Stripe Dashboard → Products → Your product |
| `NEXT_PUBLIC_SITE_URL` | Your app URL | `http://localhost:3000` for development |

## 🚀 Step 5: Run the Application

### Start Development Server
```bash
pnpm dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000)!

### What You Should See

1. **Landing Page** - Marketing page with sign-up button
2. **Sign Up** - Create a new account
3. **Sign In** - Login with existing account
4. **Protected App** - Main application area (requires payment)

## 🧪 Step 6: Test Payment Flow

### Set Up Stripe CLI for Local Testing
```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows: Download from https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI will output a webhook signing secret. Copy this and update your `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_new_secret_from_cli
```

### Test the Payment Flow

1. **Create Account**: Sign up at `/sign-up`
2. **Try to Access App**: Go to `/app` - you should be redirected to purchase
3. **Make Test Payment**: Click "Get Access" and use test card:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits
   - **ZIP**: Any 5 digits
4. **Verify Success**: You should be redirected to `/app` with access granted

### Check Your Logs

You should see in your terminal:
- ✅ Stripe webhook received
- ✅ User access granted
- ✅ Purchase recorded

## 🔐 Step 7: Authentication Setup (Optional)

### Enable Google OAuth (Optional)

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Set **Redirect URL**: `https://your-project.supabase.co/auth/v1/callback`

### Configure Auth Settings

In Supabase Dashboard → **Authentication** → **Settings**:
- **Site URL**: `http://localhost:3000` (development)
- **Redirect URLs**: Add your domain for production
- **Email Templates**: Customize signup/reset emails

## 🚀 Step 8: Deploy to Production

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add Environment Variables**:
   - Copy all variables from `.env.local`
   - Update `NEXT_PUBLIC_SITE_URL` to your domain
   - Update `STRIPE_SECRET_KEY` to live key for production

4. **Deploy**!

### Update Stripe Webhook for Production

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Update your webhook endpoint URL to: `https://your-domain.vercel.app/api/stripe/webhook`
3. Copy the new signing secret and update in Vercel environment variables

## 🐛 Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

**Database connection failed**
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure database migrations were applied: `supabase db push`

**Stripe webhook not working**
- Check that Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Verify webhook secret in `.env.local`
- Check webhook events are enabled in Stripe Dashboard

**Authentication not working**
- Verify all Supabase keys are correct
- Check that RLS policies are enabled
- Ensure user table exists: `supabase db push`

**Build errors**
```bash
# Check TypeScript types are generated
pnpm db:types

# Clear Next.js cache
rm -rf .next
pnpm build
```

### Environment Variable Checklist

Before deploying, verify all environment variables are set:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- [ ] `STRIPE_PRICE_ID` - Product price ID
- [ ] `NEXT_PUBLIC_SITE_URL` - Your app URL

### Getting Help

If you're stuck:

1. **Check the logs** - Most issues show clear error messages
2. **Review environment variables** - 90% of issues are env var related
3. **Check Supabase/Stripe dashboards** - Look for error messages there
4. **Open an issue** - Include your error messages and steps to reproduce

## 🎉 Next Steps

Once everything is working:

1. **Customize the design** - Update colors, fonts, and layout
2. **Add your content** - Replace placeholder text and images
3. **Configure analytics** - Add Google Analytics, Mixpanel, etc.
4. **Set up monitoring** - Add error tracking with Sentry
5. **Launch your SaaS** - Start getting users!

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Congratulations!** 🎊 You now have a fully functional SaaS application running locally and ready for production deployment.