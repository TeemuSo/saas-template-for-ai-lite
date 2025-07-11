# SaaS Template Lite

A production-ready SaaS starter template built with Next.js 15, TypeScript, and modern web technologies. Perfect for building your first SaaS application or learning modern full-stack development.

## 🚀 Features

- **🔐 Complete Authentication** - Supabase Auth with email/password and OAuth providers
- **💳 Payment Processing** - Stripe integration for one-time payments
- **🗄️ Database** - PostgreSQL with Supabase and auto-generated TypeScript types
- **🎨 Modern UI** - Tailwind CSS 4 with custom design system
- **🛡️ Security** - Row Level Security (RLS) and proper auth patterns
- **⚡ Performance** - Optimized for Core Web Vitals with server-side rendering
- **🔧 Developer Experience** - TypeScript, ESLint, and comprehensive documentation

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **pnpm** - Required package manager
  ```bash
  npm install -g pnpm
  ```
- **Supabase Account** - [Sign up free](https://supabase.com)
- **Stripe Account** - [Sign up free](https://stripe.com)

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd saas-template-lite
pnpm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your keys (see SETUP.md for details)
```

### 3. Database Setup
```bash
# Link to your Supabase project
supabase link --project-ref your-project-id

# Apply database migrations
supabase db push

# Generate TypeScript types
pnpm db:types
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🏗️ Architecture

### Core Structure
```
saas-template-lite/
├── app/                    # Next.js 15 App Router
│   ├── (login)/           # Auth pages (sign-in, sign-up)
│   ├── api/               # API routes
│   ├── app/               # Protected app area
│   └── page.tsx           # Landing page
├── lib/                   # Core utilities
│   ├── auth/              # Authentication (DAL pattern)
│   ├── db/                # Database operations
│   ├── payments/          # Stripe integration
│   └── supabase/          # Supabase client config
├── components/            # React components
│   └── ui/               # Reusable UI components
└── middleware.ts          # Route protection & rate limiting
```

### Key Patterns

**Authentication Flow:**
- **Server-Side**: Use DAL functions (`getUser()`, `getUserWithAccess()`)
- **Client-Side**: Use `useAuth()` hook for reactive UI
- **API Routes**: Use `getApiUser()` for protected endpoints

**Database Operations:**
- **User Operations**: Use DAL functions from `lib/auth/dal.ts`
- **Service Operations**: Use functions from `lib/db/queries.ts`

## 🎯 Development

### Available Commands
```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:types         # Generate TypeScript types from Supabase
supabase db push      # Apply migrations
supabase db reset     # Reset database (careful!)

# Testing
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Adding New Features

1. **Protected Pages**: Add to `app/app/` directory
2. **API Routes**: Add to `app/api/` directory
3. **Database Changes**: Create new migration files
4. **UI Components**: Add to `components/` directory

## 🔧 Customization

### Branding (30 seconds)
Open `app/globals.css` and update these variables:
```css
--primary: 220 91% 60%;    /* Your brand color */
--neutral: 220 9% 45%;     /* Gray shade */
```

### Key Customization Areas
- **Landing Page**: `app/page.tsx` and `components/hero-section.tsx`
- **App Dashboard**: `app/app/page.tsx`
- **Design System**: `app/globals.css`
- **Configuration**: `lib/config.ts`

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Detailed setup instructions
- **[Styling Guide](./STYLING.md)** - Design system and customization
- **[Authentication](./lib/auth/README.md)** - Auth patterns and usage
- **[Database](./lib/db/README.md)** - Database operations and schema
- **[Claude AI Guide](./CLAUDE.md)** - For AI-assisted development

## 🛡️ Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Zod schemas for data validation
- **Session Management** - Secure cookie-based sessions
- **Webhook Verification** - Stripe webhook signature validation

## 💻 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Package Manager**: pnpm

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_live_your-live-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID=price_your-price-id

# App
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📈 What's Next?

After getting the template running, you can:

1. **Customize the design** - Update colors, fonts, and layout
2. **Add new features** - User profiles, settings, dashboard
3. **Integrate services** - Email, analytics, monitoring
4. **Scale up** - Add subscription plans, team features
5. **Deploy** - Get your SaaS live for users

## 🆘 Getting Help

- **Setup Issues**: Check [SETUP.md](./SETUP.md) troubleshooting section
- **Code Questions**: Review the inline documentation
- **Bugs**: Open an issue with reproduction steps
- **Feature Requests**: Open an issue with detailed requirements

## Frequently Asked Questions (debug here)
### My Stripe checkout fails!
If you are running the app **locally**, make sure you have the stripe webhook emulation running with `stripe listen --forward-to localhost:3000/api/stripe/webhook`. You will get STRIPE_WEBHOOK_SECRET, fill it to `.env.local`. 


## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Happy Building!** 🎉

This template gives you a solid foundation to build your SaaS application. Focus on your unique features while we handle the authentication, payments, and infrastructure.