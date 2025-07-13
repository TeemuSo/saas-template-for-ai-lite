# Setup Guide - SaaS Template Lite

This guide will help you set up your SaaS with payment integration. If you just want to build without payments, see the Quick Start in [README.md](./README.md).

## 🛠️ Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **pnpm** - Install with `npm install -g pnpm`
- **Supabase Account** - [Sign up free](https://supabase.com)
- **Stripe Account** - [Sign up free](https://stripe.com)

## ⚡ Quick Setup

### 1. Clone & Install
```bash
git clone git@github.com:TeemuSo/saas-template-for-ai-lite.git
cd saas-template-lite
pnpm install
```

### 2. Supabase Setup

**Create Project**
1. Go to [Supabase Dashboard](https://app.supabase.com) → **New Project**
2. Choose name, password, and region
3. Wait ~2 minutes for creation

**Link & Setup Database**
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project (find project-id in dashboard URL)
supabase link --project-ref your-project-id

# Apply database schema
supabase db push
```

**Get API Keys**
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Stripe Setup

**Create Product**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Products** → **Add product**
3. Set name, price, and save
4. Copy **Price ID** (starts with `price_`)

**Get API Keys**
1. **Developers** → **API keys**
2. Copy **Secret key** → `STRIPE_SECRET_KEY`

**Set Up Webhook**
1. **Developers** → **Webhooks** → **Add endpoint**
2. **URL**: `https://your-domain.com/api/stripe/webhook`
3. **Events**: Select `checkout.session.completed`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 4. Environment Variables

```bash
# Copy the template
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret
STRIPE_PRICE_ID=price_your-price-id

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Start Development

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) - your SaaS is ready!

## 🧪 Test Payments (Local)

### Setup Stripe CLI
```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Download from: https://stripe.com/docs/stripe-cli

# Login and forward webhooks
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook secret from CLI output to `.env.local`

### Test Payment Flow
1. Sign up at `/sign-up`
2. Try to access `/app` - you'll be redirected to purchase
3. Use test card: `4242 4242 4242 4242`
4. Complete payment - you should get access to `/app`

## 🚀 Deploy to Production

### Vercel Deployment
1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all environment variables
4. Update `NEXT_PUBLIC_SITE_URL` to your domain
5. Deploy!

### Update Stripe Webhook
1. Go to Stripe Dashboard → **Webhooks**
2. Update endpoint to `https://your-domain.com/api/stripe/webhook`
3. Copy new signing secret and update in Vercel

## 🔧 Optional: Development Without Payments

Want to build features without setting up payments? Move the migration file from `optional_migrations` to `migrations` folder, and re-run the migration:

```bash
mv supabase/optional_migrations/20250713170112_allow_access_to_app_without_payment.sql supabase/migrations/
supabase db push
```

This sets `has_access = true` by default for new users, so they can access `/app` without paying.

**Important**: Don't run this in production!

## 🐛 Common Issues

**Database connection failed**
- Check Supabase URL and keys
- Run `supabase db push` to apply migrations

**Stripe webhook not working**
- Ensure Stripe CLI is running locally
- Check webhook secret in `.env.local`

**TypeScript errors**
- Run `pnpm db:types` to generate types
- Clear cache: `rm -rf .next && pnpm build`

**Authentication issues**
- Verify all Supabase keys are correct
- Check RLS policies are enabled

## 📧 Production Checklist

Before going live:
- [ ] Update all environment variables to production values
- [ ] Use Stripe live keys (not test keys)
- [ ] Set up production webhook endpoint
- [ ] Configure custom domain
- [ ] Test payment flow end-to-end

## 🎯 Next Steps

1. **Customize your app** - Edit `app/app/page.tsx`
2. **Update branding** - Change colors in `app/globals.css`
3. **Add features** - Build your core SaaS functionality
4. **Launch** - Share with users!

## 🆘 Need Help?

- **Stuck?** Check error messages in console
- **Payment Issues?** Verify Stripe setup
- **Database Problems?** Check Supabase dashboard
- **Still stuck?** Open an issue with details

---

**You're ready to build!** 🚀

Focus on your unique features - the boring stuff is handled for you.