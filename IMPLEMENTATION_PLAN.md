# AltCast Implementation Plan
## Next.js 15 Migration — "The Code Janitor for the AI Age"

> **Source of Truth:** `altcastv5.1.html`  
> **Target:** Nervous founders who saw your "Verified Kill" posts and fear their app is next.

---

## 🎯 WHY NEXT.JS (Not Static HTML)

| Capability | Static HTML | Next.js 15 |
|------------|-------------|------------|
| Real-time audit | ❌ Manual email | ✅ Server Action in 15 sec |
| Loading states | ❌ Page freezes | ✅ Theatrical progress |
| SEO per audit | ❌ One page | ✅ `/audit/[slug]` dynamic routes |
| Lead capture | ❌ Basic form | ✅ Gated behind live results |
| Email automation | ❌ Manual | ✅ Resend/SendGrid integration |

---

## 📋 TECHNICAL STACK (Latest 2025)

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router, React 19, Turbopack) |
| **Language** | TypeScript 5.x (strict mode) |
| **Styling** | Tailwind CSS 4.x (CSS-first `@theme` config) |
| **Animation** | Motion (formerly Framer Motion) |
| **Icons** | Phosphor Icons React |
| **Font** | JetBrains Mono + Space Grotesk via `next/font/google` |
| **Browser Automation** | Playwright (headless Chromium) |
| **Database** | Supabase (Phase 2) |
| **Email** | Resend (Phase 2) |
| **Hosting** | Vercel / Railway (for Playwright support) |

---

## 🚀 PROJECT INITIALIZATION

```bash
# Create Next.js 15 project (non-interactive)
npx -y create-next-app@latest ./ \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --turbopack \
  --import-alias "@/*"

# Install dependencies
npm install motion phosphor-react clsx zod

# Install Playwright for server-side audits
npm install playwright
npx playwright install chromium
```

---

## 🎨 DESIGN SYSTEM (Tailwind 4 CSS-First)

In `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* === CORE PALETTE === */
  --color-void: #050505;
  --color-surface: #0a0a0a;
  --color-pure-black: #000000;
  --color-danger: #FF003C;
  --color-purple: #9D00FF;
  --color-acid: #CCFF00;
  --color-electric: #2E5CFF;
  --color-text-primary: #e5e5e5;
  --color-text-muted: #6b7280;

  /* === SHADOWS === */
  --shadow-neo: 4px 4px 0px 0px #333;
  --shadow-neo-lg: 8px 8px 0px 0px #333;
  --shadow-glow-acid: 0 0 15px rgba(204, 255, 0, 0.3);
  --shadow-glow-danger: 0 0 20px rgba(255, 0, 60, 0.5);

  /* === FONTS === */
  --font-sans: var(--font-space-grotesk), ui-sans-serif, system-ui;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

/* === GLITCH EFFECT === */
.glitch-hover:hover {
  animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
  text-shadow: 2px 0 var(--color-danger), -2px 0 var(--color-acid);
}

@keyframes glitch-skew {
  0%, 100% { transform: skew(0deg); }
  20% { transform: skew(-2deg); }
  40% { transform: skew(2deg); }
  60% { transform: skew(-1deg); }
  80% { transform: skew(1deg); }
}

/* === GRID BACKGROUND === */
.bg-grid {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
}

/* === TERMINAL SCROLLBAR === */
.terminal-scroll::-webkit-scrollbar { width: 8px; }
.terminal-scroll::-webkit-scrollbar-track { background: var(--color-void); }
.terminal-scroll::-webkit-scrollbar-thumb { background: #333; border: 1px solid var(--color-void); }

/* === NOISE OVERLAY === */
.bg-noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
}
```

---

## 📁 PROJECT STRUCTURE

```
src/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata, cursor
│   ├── page.tsx                # Homepage (Server Component)
│   ├── globals.css             # Tailwind 4 @theme config
│   ├── audit/
│   │   └── [slug]/
│   │       └── page.tsx        # 🔥 SEO WEAPONIZATION: Public audit reports
│   └── api/
│       └── audit/
│           └── route.ts        # API route for audit (alternative to Server Action)
│
├── components/
│   ├── boot-screen.tsx         # Client - Loading animation on mount
│   ├── navbar.tsx              # Client - Sticky nav with magnetic buttons
│   ├── hero-terminal.tsx       # Client - Terminal input + audit form + loading theatre
│   ├── kill-feed.tsx           # Client - Infinite marquee ticker
│   ├── glass-cannon.tsx        # Server - Educational vuln cards
│   ├── protocol.tsx            # Server - Feature cards
│   ├── pricing-ransom.tsx      # Server - Pricing comparison
│   ├── footer.tsx              # Server - Static footer
│   ├── custom-cursor.tsx       # Client - Animated cursor effect
│   └── audit-theatre.tsx       # Client - 🔥 THE LOADING THEATRE
│
├── actions/
│   ├── light-audit.ts          # Server Action - Playwright scan
│   └── capture-lead.ts         # Server Action - Email capture
│
├── hooks/
│   └── use-audit-form.ts       # Custom hook for form state machine
│
├── lib/
│   ├── sounds.ts               # Web Audio API synthesized sounds
│   └── audit-checks.ts         # Individual vulnerability check functions
│
└── types/
    └── index.ts                # Shared TypeScript interfaces
```

---

## 🔥 FEATURE 1: THE "INSTANT FEAR" LEAD CAPTURE FUNNEL

### The Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ALTCAST LEAD CAPTURE FUNNEL                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [1] VISITOR LANDS              [2] ENTERS URL                             │
│   ───────────────────────────    ───────────────────────────                │
│   "I saw AltCast broke                                                      │
│    someone's app on X..."        ┌─────────────────────────┐                │
│                                  │ root@altcast:~$ target  │                │
│                           ──────▶│ https://theirapp.com    │                │
│                                  │ [ BREAK MY APP ]        │                │
│                                  └─────────────────────────┘                │
│                                              │                              │
│                                              ▼                              │
│                          ┌───────────────────────────────────┐              │
│   [3] LIGHT AUDIT        │   🔴 SERVER ACTION (10-30 sec)    │              │
│   (Headless Browser)     │   ─────────────────────────────   │              │
│                          │   • Playwright spins up           │              │
│                          │   • Hits their homepage           │              │
│                          │   • Checks for common vulns       │              │
│                          │   • Screenshots evidence          │              │
│                          └───────────────────────────────────┘              │
│                                              │                              │
│                                              ▼                              │
│   [4] THE HOOK           ┌───────────────────────────────────┐              │
│   (Instant Fear)         │  ⚠️ CRITICAL VULNERABILITY FOUND  │              │
│                          │  ─────────────────────────────────│              │
│                          │  IDEMPOTENCY_CHECK: ❌ MISSING    │              │
│                          │  RATE_LIMITING:     ❌ MISSING    │              │
│                          │  CSRF_TOKEN:        ⚠️ WEAK       │              │
│                          └───────────────────────────────────┘              │
│                                              │                              │
│                                              ▼                              │
│   [5] THE GATE           ┌───────────────────────────────────┐              │
│   (Email Capture)        │  🔒 UNLOCK FULL REPORT            │              │
│                          │  ─────────────────────────────────│              │
│                          │  We recorded video evidence.      │              │
│                          │                                   │              │
│                          │  📧 [Enter email to unlock]       │              │
│                          │  [ SEND ME THE KILL FOOTAGE ]     │              │
│                          └───────────────────────────────────┘              │
│                                              │                              │
│                                              ▼                              │
│   [6] LEAD CAPTURED      Database: email, url, vulns, timestamp             │
│                          Email: Auto-send report + CTA                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Form State Machine

```typescript
type AuditState = 
  | "idle"           // Waiting for URL input
  | "scanning"       // Server Action running (show loading theatre)
  | "results"        // Vulns found, show partial/blurred results
  | "email_gate"     // Prompt for email to unlock full report
  | "captured";      // Success, redirect to report page
```

### Server Action: `actions/light-audit.ts`

```typescript
"use server";

import { chromium } from "playwright";

export interface LightAuditResult {
  status: "clean" | "vulnerable" | "error";
  slug: string; // For SEO URL generation
  vulnerabilities: {
    code: string;
    severity: "critical" | "warning" | "info";
    description: string;
  }[];
  scanDuration: number;
  screenshot?: string;
}

export async function runLightAudit(url: string): Promise<LightAuditResult> {
  const startTime = Date.now();
  const slug = generateSlug(url); // e.g., "crypto-startup-x"
  
  // Validate URL
  try {
    new URL(url);
  } catch {
    return { status: "error", slug, vulnerabilities: [], scanDuration: 0 };
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const vulns: LightAuditResult["vulnerabilities"] = [];

  try {
    const response = await page.goto(url, { timeout: 15000 });
    
    // CHECK 1: Security headers
    const headers = response?.headers() || {};
    if (!headers["x-frame-options"]) {
      vulns.push({ code: "CLICKJACKING", severity: "warning", description: "Missing X-Frame-Options" });
    }
    if (!headers["content-security-policy"]) {
      vulns.push({ code: "CSP_MISSING", severity: "critical", description: "No Content-Security-Policy" });
    }
    if (!headers["strict-transport-security"]) {
      vulns.push({ code: "HSTS_MISSING", severity: "warning", description: "No HSTS header" });
    }

    // CHECK 2: CSRF tokens on forms
    const forms = await page.$$("form");
    for (const form of forms) {
      const csrfInput = await form.$('input[name*="csrf"], input[name*="token"]');
      if (!csrfInput) {
        vulns.push({ code: "CSRF_MISSING", severity: "critical", description: "Form without CSRF protection" });
        break;
      }
    }

    // CHECK 3: Console errors
    let hasConsoleErrors = false;
    page.on("console", (msg) => {
      if (msg.type() === "error") hasConsoleErrors = true;
    });
    await page.waitForTimeout(2000);
    if (hasConsoleErrors) {
      vulns.push({ code: "JS_ERRORS", severity: "warning", description: "JavaScript errors detected" });
    }

    // CHECK 4: Idempotency (submit buttons)
    const submitButtons = await page.$$('button[type="submit"], input[type="submit"]');
    if (submitButtons.length > 0) {
      vulns.push({ code: "IDEMPOTENCY_UNKNOWN", severity: "info", description: "Payment/submit forms need idempotency check" });
    }

    // Take screenshot
    const screenshot = await page.screenshot({ encoding: "base64", fullPage: false });

    await browser.close();

    return {
      status: vulns.some(v => v.severity === "critical") ? "vulnerable" : "clean",
      slug,
      vulnerabilities: vulns,
      scanDuration: Date.now() - startTime,
      screenshot
    };

  } catch (error) {
    await browser.close();
    return { 
      status: "error", 
      slug,
      vulnerabilities: [{ code: "UNREACHABLE", severity: "info", description: "Target unreachable" }], 
      scanDuration: Date.now() - startTime 
    };
  }
}

function generateSlug(url: string): string {
  const hostname = new URL(url).hostname.replace("www.", "");
  const slug = hostname.replace(/\./g, "-");
  const timestamp = Date.now().toString(36);
  return `${slug}-${timestamp}`;
}
```

---

## 🔥 FEATURE 2: ASYNCHRONOUS WARFARE (The Loading Theatre)

A real Playwright scan takes **10-30 seconds**. Static HTML would freeze. Next.js lets us build **theatrical engagement**.

### The Theatre Script

```typescript
// src/components/audit-theatre.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const THEATRE_SCRIPT = [
  { time: 0,     text: "> ESTABLISHING HANDSHAKE...",           color: "text-acid" },
  { time: 2000,  text: "> TARGET ACQUIRED",                     color: "text-white" },
  { time: 4000,  text: "> DEPLOYING RECONNAISSANCE BOTS...",    color: "text-acid" },
  { time: 6000,  text: "> SCANNING ATTACK SURFACE...",          color: "text-white" },
  { time: 8000,  text: "> INJECTING PAYLOAD: emoji_bomb.js",    color: "text-purple" },
  { time: 10000, text: "> TRIGGERING RACE CONDITION...",        color: "text-danger" },
  { time: 12000, text: "> CHECKING IDEMPOTENCY GUARDS...",      color: "text-white" },
  { time: 15000, text: "> ANALYZING RESPONSE PATTERNS...",      color: "text-acid" },
  { time: 18000, text: "> COMPILING EVIDENCE...",               color: "text-white" },
  { time: 22000, text: "> GENERATING KILL REPORT...",           color: "text-danger" },
];

interface AuditTheatreProps {
  isRunning: boolean;
  onComplete?: () => void;
}

export function AuditTheatre({ isRunning, onComplete }: AuditTheatreProps) {
  const [lines, setLines] = useState<typeof THEATRE_SCRIPT>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      setLines([]);
      setProgress(0);
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Schedule each line
    THEATRE_SCRIPT.forEach((line, index) => {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, line]);
        setProgress(((index + 1) / THEATRE_SCRIPT.length) * 100);
      }, line.time);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [isRunning]);

  if (!isRunning) return null;

  return (
    <div className="font-mono text-sm space-y-2">
      {/* Progress Bar */}
      <div className="h-1 bg-surface border border-gray-800 overflow-hidden">
        <motion.div 
          className="h-full bg-acid shadow-glow-acid"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Terminal Lines */}
      <div className="h-48 overflow-y-auto terminal-scroll p-4 bg-pure-black border border-gray-800">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${line.color} mb-1`}
            >
              {line.text}
              {i === lines.length - 1 && (
                <span className="animate-blink ml-1">█</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Status */}
      <div className="flex justify-between text-xs text-muted">
        <span>SCAN IN PROGRESS</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
```

### Why This Works

| Problem | Solution |
|---------|----------|
| User gets bored waiting | **Theatre keeps them engaged** |
| Page looks frozen | **Animated progress shows life** |
| User might leave | **Each line builds anticipation** |
| No feedback on slow server | **Fake progress masks real wait** |

---

## 🔥 FEATURE 3: SEO WEAPONIZATION (The "Public Shame" Strategy)

### The Mechanism

Every completed audit generates a **permanent, indexable URL**:

```
https://altcast.com/audit/crypto-startup-x-m4k2j9
https://altcast.com/audit/fintech-app-y-n8p3l2
https://altcast.com/audit/health-saas-z-k7r1m5
```

### Dynamic Route: `app/audit/[slug]/page.tsx`

```typescript
// src/app/audit/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuditBySlug } from "@/lib/database";

interface Props {
  params: { slug: string };
}

// 🔥 SEO MAGIC: Dynamic metadata for each audit
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const audit = await getAuditBySlug(params.slug);
  
  if (!audit) return { title: "Audit Not Found" };
  
  const vulnCount = audit.vulnerabilities.length;
  const severity = audit.vulnerabilities.some(v => v.severity === "critical") 
    ? "CRITICAL" 
    : "WARNING";

  return {
    title: `${audit.targetDomain} Security Audit | ${vulnCount} Vulnerabilities Found`,
    description: `AltCast hostile audit of ${audit.targetDomain}. ${severity}: ${vulnCount} security vulnerabilities detected including ${audit.vulnerabilities[0]?.code}.`,
    openGraph: {
      title: `🔴 ${audit.targetDomain} - ${vulnCount} Security Flaws Exposed`,
      description: `Public security audit report. ${severity} vulnerabilities found.`,
      images: [{ url: `/api/og/audit/${params.slug}` }], // Dynamic OG image
    },
    robots: {
      index: true,  // 🔥 INDEXABLE BY GOOGLE
      follow: true,
    },
  };
}

export default async function AuditReportPage({ params }: Props) {
  const audit = await getAuditBySlug(params.slug);
  
  if (!audit) notFound();

  return (
    <main className="min-h-screen bg-void text-text-primary">
      {/* Header */}
      <div className="border-b border-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 text-danger font-mono text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            HOSTILE AUDIT REPORT
          </div>
          <h1 className="text-4xl font-black uppercase text-white">
            {audit.targetDomain}
          </h1>
          <p className="text-muted font-mono mt-2">
            Scan completed: {audit.completedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Vulnerability List */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black uppercase text-acid mb-8">
          {audit.vulnerabilities.length} VULNERABILITIES DETECTED
        </h2>
        
        <div className="space-y-4">
          {audit.vulnerabilities.map((vuln, i) => (
            <div 
              key={i}
              className={`border p-6 ${
                vuln.severity === "critical" 
                  ? "border-danger bg-danger/10" 
                  : "border-gray-800 bg-surface"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono font-bold text-lg text-white">
                    {vuln.code}
                  </div>
                  <p className="text-muted mt-1">{vuln.description}</p>
                </div>
                <span className={`px-2 py-1 font-mono text-xs uppercase ${
                  vuln.severity === "critical" 
                    ? "bg-danger text-white" 
                    : "bg-gray-800 text-gray-400"
                }`}>
                  {vuln.severity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 border border-acid bg-acid/5 text-center">
          <h3 className="text-2xl font-black uppercase text-white mb-4">
            Is This Your App?
          </h3>
          <p className="text-muted mb-6">
            We can remove this report and help you fix these vulnerabilities.
          </p>
          <a 
            href="/contact"
            className="inline-block bg-acid text-black px-8 py-4 font-black uppercase hover:bg-white transition-colors"
          >
            REQUEST REMEDIATION
          </a>
        </div>
      </div>

      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": `${audit.targetDomain} Security Audit Report`,
            "description": `${audit.vulnerabilities.length} vulnerabilities found`,
            "author": {
              "@type": "Organization",
              "name": "AltCast"
            },
            "datePublished": audit.completedAt.toISOString(),
          }),
        }}
      />
    </main>
  );
}
```

### The Pressure Mechanism

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE PUBLIC SHAME LOOP                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [1] Founder's app gets audited (free scan)                    │
│                        │                                        │
│                        ▼                                        │
│   [2] Public report generated at:                               │
│       altcast.com/audit/their-startup-x                         │
│                        │                                        │
│                        ▼                                        │
│   [3] Google indexes the page with their domain name            │
│       "their-startup.com security vulnerabilities"              │
│                        │                                        │
│                        ▼                                        │
│   [4] Investors/customers Google the startup                    │
│       → Find AltCast report on page 1                           │
│                        │                                        │
│                        ▼                                        │
│   [5] Founder panics → Contacts AltCast                         │
│       "Please remove the report"                                │
│                        │                                        │
│                        ▼                                        │
│   [6] AltCast: "We'll remove it + fix the vulns for $X"         │
│                        │                                        │
│                        ▼                                        │
│   [7] 💰 CONVERSION                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 COMPONENT BREAKDOWN

### Client Components (`"use client"`)

| Component | Purpose |
|-----------|---------|
| `boot-screen.tsx` | Initial loading animation, unmounts after complete |
| `navbar.tsx` | Sticky nav with magnetic hover effect |
| `hero-terminal.tsx` | URL input + state machine + audit theatre |
| `kill-feed.tsx` | Infinite scrolling marquee (Motion) |
| `custom-cursor.tsx` | Animated dot + outline cursor |
| `audit-theatre.tsx` | Theatrical loading messages during scan |

### Server Components (default)

| Component | Purpose |
|-----------|---------|
| `glass-cannon.tsx` | Educational vulnerability cards |
| `protocol.tsx` | Feature cards ("The Protocol" section) |
| `pricing-ransom.tsx` | $299 vs $2,500 pricing comparison |
| `footer.tsx` | Static footer with links |

---

## 📊 DATABASE SCHEMA (Phase 2 - Supabase)

```sql
-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audits table
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  target_domain TEXT NOT NULL,
  status TEXT NOT NULL, -- 'clean' | 'vulnerable' | 'error'
  vulnerabilities JSONB NOT NULL DEFAULT '[]',
  screenshot TEXT, -- Base64 or S3 URL
  scan_duration INTEGER,
  lead_id UUID REFERENCES leads(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for SEO lookups
CREATE INDEX audits_slug_idx ON audits(slug);
CREATE INDEX audits_domain_idx ON audits(target_domain);
```

---

## 🚀 DEPLOYMENT CONSIDERATIONS

### For Playwright Support

Vercel's serverless functions have limitations with Playwright. Options:

| Platform | Playwright Support | Notes |
|----------|-------------------|-------|
| **Railway** | ✅ Full | Docker-based, recommended |
| **Render** | ✅ Full | Docker-based |
| **Fly.io** | ✅ Full | Docker-based |
| **Vercel** | ⚠️ Limited | Use Browserless.io instead |
| **AWS Lambda** | ⚠️ Requires layer | Complex setup |

### Recommended: Railway + Browserless.io

```typescript
// For production, use Browserless.io
import { chromium } from "playwright";

const browser = await chromium.connect({
  wsEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
});
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Core UI (Week 1)
- [ ] Initialize Next.js 15 project
- [ ] Configure Tailwind 4 with design tokens
- [ ] Port all sections from `altcastv5.1.html`
- [ ] Implement boot screen animation
- [ ] Implement custom cursor
- [ ] Implement kill feed marquee
- [ ] Build hero terminal with mock state machine

### Phase 2: Live Audit (Week 2)
- [ ] Set up Playwright server action
- [ ] Implement audit theatre component
- [ ] Build email gate UI
- [ ] Connect to Supabase for lead storage
- [ ] Set up Resend for email automation

### Phase 3: SEO Weaponization (Week 3)
- [ ] Build dynamic `/audit/[slug]` route
- [ ] Generate OG images dynamically
- [ ] Add structured data (Schema.org)
- [ ] Set up sitemap generation
- [ ] Test Google indexing

### Phase 4: Polish (Week 4)
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Error handling
- [ ] Rate limiting
- [ ] Analytics integration

---

## 📚 REFERENCE FILES

- **Source of Truth:** `altcastv5.1.html`
- **This Plan:** `IMPLEMENTATION_PLAN.md`

---

*Generated: 2025-12-07*  
*AltCast Systems — The Code Janitor for the AI Age*
