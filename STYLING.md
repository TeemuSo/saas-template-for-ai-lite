# 🎨 Styling Guide

Complete guide to customizing and extending the design system in this SaaS template.

## 📋 Table of Contents

- [Quick Rebranding](#-quick-rebranding)
- [Design System Overview](#-design-system-overview)
- [Custom CSS Variables](#-custom-css-variables)
- [Enhanced shadcn/ui Components](#-enhanced-shadcnui-components)
- [Animation System](#-animation-system)
- [Utility Classes](#-utility-classes)
- [Color System](#-color-system)
- [Typography](#-typography)
- [Best Practices](#-best-practices)

## 🚀 Quick Rebranding

Transform your entire app in 30 seconds by changing just 2 variables in `app/globals.css`:

```css
/* 🎨 YOUR BRAND IN 2 LINES */
--primary: 24 85% 53.1%;    /* Brand color */
--neutral: 0 0% 45%;        /* Gray shade */
```

### Popular Brand Combinations

```css
/* Blue Tech */
--primary: 220 91% 60%;  --neutral: 220 9% 45%;

/* Green Growth */ 
--primary: 142 76% 36%;  --neutral: 140 6% 45%;

/* Purple Creative */
--primary: 262 84% 58%;  --neutral: 260 6% 45%;

/* Red Bold */
--primary: 0 84% 60%;    --neutral: 0 0% 45%;

/* Orange Default */
--primary: 24 85% 53%;   --neutral: 20 6% 45%;
```

### Design Token Customization

```css
/* Adjust overall feel */
--radius: 0.25rem;           /* Sharp corners */
--radius: 0.8rem;            /* Moderate (default) */
--radius: 1.2rem;            /* Very rounded */

/* Animation speed */
--duration-fast: 0.15s;      /* Snappy */
--duration-medium: 0.5s;     /* Balanced (default) */
--duration-slow: 0.8s;       /* Smooth */

/* Font family */
--font-family-base: "Inter", Arial, sans-serif;     /* Modern */
--font-family-base: "Poppins", Arial, sans-serif;   /* Friendly */
--font-family-base: "Source Sans Pro", Arial, sans-serif; /* Professional */
```

## 🏗️ Design System Overview

Our design system is built on these principles:

### 1. **2-Variable Color System**
- Only 2 colors to customize: `--primary` (brand) and `--neutral` (gray)
- All other colors are auto-generated from these 2 base variables
- Change 2 variables, rebrand entire application instantly

### 2. **No Hard-Coded Colors**
- Zero hard-coded color values in components
- Everything derives from the 2 base CSS variables
- Consistent theming across all UI elements

### 3. **Enhanced shadcn/ui**
- Standard shadcn/ui components with custom variants
- Maintains full compatibility with shadcn/ui ecosystem
- Adds advanced styling options perfect for SaaS applications

## 🔧 Custom CSS Variables

### Core Branding Variables

```css
/* PRIMARY BRAND COLOR - Change this to rebrand your entire app */
--primary: 24 85% 53.1%;                    /* HSL format for primary color */
--primary-foreground: 0 0% 100%;            /* Text color on primary backgrounds */

/* DESIGN TOKENS */
--radius: 0.8rem;                           /* Global border radius */
--font-family-base: "Manrope", Arial, Helvetica, sans-serif;

/* ANIMATION TIMING */
--duration-fast: 0.2s;                      /* Quick interactions */
--duration-medium: 0.5s;                    /* Standard interactions */
--duration-slow: 0.8s;                      /* Slow interactions */
--transition-timing: ease;                  /* Animation curve */
```

### Foundational Colors

```css
/* CORE COLORS - Generic, reusable across any component */
--background: 0 0% 100%;                    /* Main background */
--foreground: 222.2 84% 4.9%;              /* Main text color */
--muted: 210 40% 96.1%;                     /* Subtle backgrounds */
--muted-foreground: 215.4 16.3% 46.9%;     /* Subtle text */
--border: 214.3 31.8% 91.4%;               /* All borders */
--input: 214.3 31.8% 91.4%;                /* Input borders */
--ring: 222.2 84% 4.9%;                     /* Focus rings */

/* STATE COLORS */
--destructive: 0 84.2% 60.2%;               /* Error/danger states */
--destructive-foreground: 210 40% 98%;      /* Text on error backgrounds */
--success: 142 76% 36%;                     /* Success states */
--success-foreground: 0 0% 98%;             /* Text on success backgrounds */
```

## 🎯 Enhanced shadcn/ui Components

We've extended standard shadcn/ui components with custom variants while maintaining full compatibility.

### Button Component

**Standard variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

**Custom variants added:**

```jsx
// Gradient button with enhanced styling
<Button variant="gradient">Get Started</Button>

// Glassmorphism effect for modern UIs
<Button variant="glassmorphism">Modern Style</Button>
```

**CSS Implementation:**
```css
/* Custom button variants */
.gradient {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.9));
  box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Card Component

**Standard variants:** `default`

**Custom variants added:**

```jsx
// Elevated card with hover animation
<Card variant="elevated">Content</Card>

// Interactive card with scale effect
<Card variant="interactive">Clickable Content</Card>

// Gradient background card
<Card variant="gradient">Featured Content</Card>

// Glassmorphism card
<Card variant="glassmorphism">Modern Card</Card>

// Glowing card with primary color accent
<Card variant="glow">Important Content</Card>
```

**CSS Implementation:**
```css
/* Custom card variants */
.elevated {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(0);
  transition: all var(--duration-medium) var(--transition-timing);
}

.elevated:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
}

.interactive {
  cursor: pointer;
  transition: all var(--duration-medium) var(--transition-timing);
}

.interactive:hover {
  transform: translateY(-8px) scale(1.02);
}
```

### Input Component

Enhanced with better focus states and custom styling:

```css
/* Custom input enhancements */
.input {
  transition: all var(--duration-fast) var(--transition-timing);
  border: 1px solid hsl(var(--border));
}

.input:focus-visible {
  ring: 2px solid hsl(var(--ring));
  border-color: hsl(var(--primary));
}
```

## 🎬 Animation System

### Keyframe Animations

```css
/* Core animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Animation Utility Classes

```jsx
// Apply animations to any element
<div className="animate-fade-in">Fades in smoothly</div>
<div className="animate-slide-up">Slides up from bottom</div>
<div className="animate-float">Gentle floating motion</div>
<div className="animate-gradient">Animated gradient background</div>
```

### Hover Effects

```jsx
// Hover utilities
<div className="hover-scale">Scales slightly on hover</div>
<div className="hover-lift">Lifts with shadow on hover</div>
```

**CSS Implementation:**
```css
.hover-scale {
  transition: transform var(--duration-fast) var(--transition-timing);
}
.hover-scale:hover {
  transform: scale(1.02);
}

.hover-lift {
  transition: transform var(--duration-medium) var(--transition-timing), 
              box-shadow var(--duration-medium) var(--transition-timing);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
```

## 🎨 Utility Classes

### Brand Utilities

```jsx
// Gradient backgrounds
<div className="gradient-bg">Primary gradient background</div>
<div className="gradient-bg-subtle">Subtle gradient background</div>

// Gradient text
<h1 className="gradient-text">Gradient text effect</h1>
```

### Badge System

```jsx
// Status badges
<span className="badge badge-primary">Primary Status</span>
<span className="badge badge-success">Success Status</span>
```

**CSS Implementation:**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-primary {
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  border: 1px solid hsl(var(--primary) / 0.2);
}
```

## 🌈 Color System

### HSL Color Format

All colors use HSL format for better manipulation:

```css
/* HSL format: Hue Saturation Lightness */
--primary: 24 85% 53.1%;  /* Orange: 24° hue, 85% saturation, 53.1% lightness */

/* Usage with transparency */
background: hsl(var(--primary) / 0.1);  /* 10% opacity */
background: hsl(var(--primary) / 0.9);  /* 90% opacity */
```

### Dark Mode Support

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  /* ... other dark mode overrides */
}
```

## 📝 Typography

### Font System

```css
/* Base typography */
body {
  font-family: var(--font-family-base);
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Custom typography classes can be added here */
.heading-xl { /* Add your custom heading styles */ }
.body-large { /* Add your custom body styles */ }
```

## ✅ Best Practices

### 1. **Use CSS Variables for All Colors**

```css
/* ✅ Good: Uses design system */
background: hsl(var(--primary));

/* ❌ Bad: Hard-coded color */
background: #ff6b35;
```

### 2. **Maintain shadcn/ui Compatibility**

```jsx
// ✅ Good: Extends existing variants
<Button variant="gradient">Custom Style</Button>

// ✅ Good: Uses standard variants
<Button variant="default">Standard Style</Button>

// ❌ Bad: Creates completely custom component
<CustomButton>Non-standard</CustomButton>
```

### 3. **Use Animation Variables**

```css
/* ✅ Good: Uses design system timing */
transition: all var(--duration-medium) var(--transition-timing);

/* ❌ Bad: Hard-coded timing */
transition: all 0.3s ease-in-out;
```

### 4. **Consistent Component Enhancement**

When adding custom variants:
- Maintain the same API as shadcn/ui
- Use `cva` (class-variance-authority) for variants
- Follow the same naming conventions
- Document new variants

### 5. **Performance Considerations**

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, or `background-color` directly
- Use `will-change` sparingly and remove after animations

### 6. **Accessibility**

- Maintain proper color contrast ratios
- Respect `prefers-reduced-motion` for animations
- Ensure focus states are visible
- Use semantic HTML with proper ARIA attributes

## 🔄 Adding New Components

When adding new shadcn/ui components:

```bash
# Add standard shadcn/ui component
npx shadcn@latest add dialog

# Then enhance with custom variants if needed
```

Example of enhancing a new component:

```tsx
// components/ui/dialog.tsx
const dialogVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
  {
    variants: {
      variant: {
        default: "border",
        glassmorphism: "bg-background/10 backdrop-blur-md border-background/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

## 📚 Additional Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Class Variance Authority](https://cva.style/)

---

This styling system gives you the flexibility of a custom design system while maintaining the reliability and ecosystem of shadcn/ui. Happy styling! 🎨 