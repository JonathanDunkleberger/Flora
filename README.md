<p align="center">
  <img src="public/app-icon-1024.svg" width="80" height="80" alt="Tend" />
</p>

<h1 align="center">tend.</h1>

<p align="center">
  <strong>Quit bad habits. Grow new ones.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="#philosophy">Philosophy</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-4ade80?style=flat-square&labelColor=0a0e18" />
  <img src="https://img.shields.io/badge/next.js-15-white?style=flat-square&labelColor=0a0e18" />
  <img src="https://img.shields.io/badge/react-19-61dafb?style=flat-square&labelColor=0a0e18" />
  <img src="https://img.shields.io/badge/license-proprietary-8b85a0?style=flat-square&labelColor=0a0e18" />
  <img src="https://img.shields.io/badge/data-local%20only-22c55e?style=flat-square&labelColor=0a0e18" />
</p>

<br />

<p align="center">
  <em>[ screenshot placeholder — add UI screenshot here ]</em>
</p>

<br />

---

## The Problem

Most habit trackers assume you already have momentum. They hand you a checkbox and a streak counter. But if you're on hour 6 of quitting nicotine, white-knuckling through cravings at 2 AM — you need more than a checkbox.

**Tend is a habit tracker built for people fighting real battles.** It combines recovery support (guided breathing, urge journaling, physical redirects) with a gamified world that grows with your progress. Every quit habit plants an egg that cracks, wobbles, and hatches over 72 hours. Every urge you survive earns coins and brings your creature closer to life.

It's [Forest](https://www.forestapp.cc/) meets [Tamagotchi](https://en.wikipedia.org/wiki/Tamagotchi) meets the hardest thing you've ever done.

---

## Features

### Dual-Mode Habit Tracking
- **Quit habits** — sobriety-style counters that tick automatically. You're clean unless you say otherwise. No daily checkboxes for things you're *not* doing.
- **Build habits** — traditional daily check-offs for exercise, meditation, hydration, journaling, and anything you want to grow.

### Urge Intervention System
When cravings hit, tap **Urge** and choose your weapon:
- **Breathe** — 5-cycle guided breathing (4s inhale → 4s hold → 6s exhale) with animated visual ring
- **Write it out** — quick journal with trigger tags (Stress, Boredom, Social, Night) to identify patterns over time
- **Redirect** — randomized 2-minute physical activities (cold water, pushups, grounding exercises) to break the craving cycle

Every urge survived earns coins and accelerates egg hatching.

### Living Planet
Your habits grow creatures on a tiny planet inspired by *The Little Prince*. The planet starts with natural foliage — grass, flowers, a small tree — and fills with life as you progress. Creatures evolve through 5 stages (Egg → Hatchling → Young → Growing → Evolved) based on consistency.

### Egg Progression
New quit habits begin as eggs that visually transform over 72 hours:
- **0–12h**: Clean egg, gentle pulse
- **12–24h**: Hairline crack, wobble begins
- **24–48h**: Multiple cracks, pronounced wobble
- **48–72h**: Heavy cracks, intense shaking, sparkle particles
- **72h+**: Hatch animation with flash, burst, and creature reveal

### AA-Style Milestone Coins
Recovery medallions awarded at 2h, 6h, 12h, 24h, 48h, 72h, 1 week, 2 weeks, 1 month, 2 months, 3 months, 6 months, and 1 year. Color progression from stone gray → bronze → green → blue → purple → red → gold. Each coin is earned, never given.

### Healing Timelines
Science-backed body recovery timelines for quit habits. See what's happening inside your body at each milestone — from heart rate normalizing at 2 hours to lung function improving at 90 days.

### Insights & Analytics
- **Multi-habit heatmap** — vertical color columns showing all habits at a glance
- **Trigger patterns** — aggregated urge journal data revealing when and why cravings hit
- **Habit synergies** — constellation visualization showing which habits reinforce each other
- **Money saved** — real-time calculator based on daily cost of the habit you quit

### Engagement Without Manipulation
- **Morning check-in** — daily pledge ("I'm still clean") with a science fact about your body healing
- **Creature reactions** — creatures respond to your habits (thriving, neglected, sleeping) via CSS state changes
- **Night wind-down** — calm end-of-day screen when all habits are complete
- **Compassionate relapse** — no shame, no red screens. "You went 3 days. That strength is still inside you."
- **Weekly recap** — Sunday summary with habit completion rates, urges beaten, and coins earned

### Monetization
- **Free tier**: 3 habits, all recovery features, basic shop, simplified insights
- **Tend+** ($4.99/mo or $29.99/yr): Unlimited habits, +5 daily coins, full insights, premium decorations, custom colors

Recovery features are **never** gated. Breathing, urge support, healing timelines, and relapse compassion are free forever.

---

## Architecture

> Full interactive diagram: [`docs/architecture.html`](docs/architecture.html)

The system is organized in five layers. Each layer communicates downward through React state and localStorage.

### Experience Layer

| Module | Mode | Details |
|--------|------|---------|
| **Habit Tracking** | Dual mode | **Build** → daily checkbox · **Quit** → auto sobriety timer · Pause/resume · Custom colors |
| **Urge System** | 3 tools | **Breathe** → 4-4-6 guided cycle · **Write** → journal + trigger tags · **Redirect** → physical activity · +3 coins per urge survived |
| **Planet & Creatures** | 5 stages | Egg → Hatchling → Young → Growing → Evolved · 72h egg progression w/ CSS anim · Creature mood reactions · Shop decorations |
| **Subscription** | Freemium | **Free** → 3 habits, all recovery · **Tend+** → $4.99/mo, $29.99/yr · Recovery features never gated · 5 soft + 1 hard paywall CTAs |

### Frontend Layer

| Component | Technology | Details |
|-----------|-----------|---------|
| **Next.js 15** | App Router + Tailwind | React 19 server components · Fraunces + DM Sans typography · CSS-only animations · Mobile-first (375px base) |
| **React Components** | 7 screens | Planet → SVG + sprite rendering · HabitRow → status + medallion · UrgeModal → 3-option flow · MilestoneCoin → SVG component |
| **Asset System** | Sprout Lands pack | 25 creature sprites × 5 stages · 35+ decoration sprites · CSS `hue-rotate` for colors · `image-rendering: pixelated` |
| **Icon System** | Lucide React | Zero emoji policy · Custom SVG milestone coins · Shield icon for quit habits · Consistent 16–24px sizing |

### Game Systems

| System | Details |
|--------|---------|
| **Milestone Engine** | 13 AA-style tiers: 2h, 6h, 12h, 24h, 48h, 72h → 7d to 365d · Color: stone → bronze → green → blue → purple → red → gold · Re-earnable on quit reset |
| **Coin System** | 250 starting coins · +3 per urge survived · +coins per milestone tier · Spend in World Shop |
| **Egg Progression** | 72-hour hatch cycle · Phases: fresh → stirring → cracking → hatching · Crack overlays via `::after` · Wobble + shake + sparkle · Urge survival reduces hatch time |
| **Creature Moods** | **Healthy** → bob + blink · **Neglected** → droopy + desaturated · **Thriving** → sparkles + scale 1.05 · **Sleeping** → ZZZ + still |

### Data Layer

All data is stored locally. No accounts required. No telemetry.

| Store | Details |
|-------|---------|
| **Storage** | Web → localStorage · Native → AsyncStorage · Save on every state change · No cloud sync (v1) |
| **Habit Records** | id, name, type, color, dates · Completions map (id:date) · Creature stage + evolution · Pause state + reason text |
| **Urge Log** | habitId + timestamp · Tags: Stress, Boredom, Social, Night · Free-text note · Method used + survived flag |
| **Progress State** | Coin balance + transaction log · Milestone earned flags · Owned shop items · Tend+ subscription state |

### Deployment Layer

| Platform | Technology | Details |
|----------|-----------|---------|
| **Web** | Vercel | Automatic deploy on push · Preview branches · Edge functions |
| **iOS** | React Native + Expo | Expo managed workflow · StoreKit for subscriptions · TestFlight → production |
| **Billing** | Multi-platform | Web → Stripe Checkout · iOS → StoreKit / RevenueCat · Monthly ($4.99) + Annual ($29.99) |

### Stack

```
Next.js 15 · React 19 · Tailwind CSS · Fraunces · DM Sans
Lucide · Sprout Lands · localStorage · Stripe · Vercel · Expo · StoreKit
```

### Data Model

```
AppState
├── habits[]
│   ├── id, name, type: 'build' | 'quit', color
│   ├── createdAt, quitDate (quit only), dailyCost (quit only)
│   ├── reason, paused
│   └── creature: { stage: 0-4, color }
├── completions: Record<habitId:date, boolean>
├── urgeLog[]
│   ├── habitId, timestamp, tags[], note, method
│   └── survived: boolean
├── milestones: Record<habitId:key, earned>
├── coins: number
├── ownedItems: string[]
├── isPro: boolean
├── proExpiry: ISO string | null
└── onboardingComplete: boolean
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Development

```bash
# Clone the repository
git clone https://github.com/JonathanDunkleberger/Tend.git
cd tend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — best viewed at 375px width (mobile).

### Build

```bash
npm run build
npm start
```

### Deploy

```bash
# Vercel (recommended)
vercel --prod
```

---

## Roadmap

### v1.0 — Launch *(current)*
- [x] Dual-mode habit tracking (build + quit)
- [x] Urge intervention system (Breathe / Write / Redirect)
- [x] Living planet with pixel art creatures
- [x] Egg progression with 72-hour hatch cycle
- [x] AA-style milestone coins
- [x] Healing timelines
- [x] Coin economy + World Shop
- [x] Tend+ subscription
- [x] Morning check-in + creature reactions
- [x] Privacy policy + Terms of Service
- [ ] React Native build for App Store
- [ ] TestFlight beta

### v1.1 — Polish
- [ ] Push notifications (native, opt-in, max 2/day)
- [ ] Sound design (optional, ASMR-quality)
- [ ] Weekly recap (Sunday summary)
- [ ] Night wind-down screen

### v1.2 — Social
- [ ] Shared planets (anonymous accountability partner)
- [ ] Shareable milestone cards (privacy-safe, no habit names by default)

### v2.0 — Growth
- [ ] Seasonal events (cosmetic, Tend+ only)
- [ ] Expanded creature catalog
- [ ] Custom creature naming
- [ ] Cloud sync (optional, encrypted)

---

## Philosophy

### Recovery features are free. Forever.

Breathing timer, urge journal, healing timelines, relapse support, and milestone coins will never be moved behind a paywall. If someone is having a craving at 2 AM, the last thing they should see is a purchase screen.

### No shame mechanics.

There are no red screens, broken streaks, or dying creatures. Relapsing shows: "You went 3 days. That strength is still inside you." Users earn +5 coins for honesty when they reset. The app should be the last thing someone deletes, not the first.

### Data stays on-device.

Tend collects nothing. No analytics, no tracking, no accounts. Your recovery journey is stored on your phone and nowhere else. We can't see it. We can't sell it. We can't lose it.

### Engagement without addiction.

We're building an app for people breaking addictions. The engagement model must be fundamentally different from apps that exploit attention. No loot boxes, no daily login obligations, no guilt notifications, no "your creature is dying" manipulation. Every feature should make users feel cared for, not surveilled.

---

## Credits

- **Creature & decoration art**: [Sprout Lands](https://cupnooble.itch.io/sprout-lands-asset-pack) by Cup Nooble
- **Icons**: [Lucide](https://lucide.dev/)
- **Typography**: [Fraunces](https://fonts.google.com/specimen/Fraunces) by Undercase Type · [DM Sans](https://fonts.google.com/specimen/DM+Sans) by Colophon Foundry

---

<p align="center">
  <strong>tend.</strong> — Quit bad habits. Grow new ones.
</p>
