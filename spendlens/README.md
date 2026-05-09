# SpendLens — Free AI Tool Spend Audit

SpendLens is a free web app that audits startup AI tool spending across Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, and more — surfacing overspend, recommending right-sized plans, and generating a shareable report with a unique public URL. It is a lead-generation asset for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

**Who it's for:** Engineering managers and CTOs at early-stage startups (5–50 people) who pay monthly SaaS bills for AI tools without ever benchmarking them.

---

## Screenshots

> Add 3 screenshots or a Loom/YouTube link here after deployment.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & run locally

```bash
git clone https://github.com/YOUR_USERNAME/spendlens
cd spendlens
npm install
cp .env.example .env.local
# Fill in .env.local with your keys
npm run dev
# Open http://localhost:3000
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | For AI-generated audit summaries |
| `RESEND_API_KEY` | No | Transactional email on lead capture |
| `NEXT_PUBLIC_BASE_URL` | Yes | Your deployed URL (e.g. https://spendlens.vercel.app) |

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Set environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

---

## Decisions

1. **Next.js App Router over Vite + React SPA** — needed server-side API routes for Anthropic API calls (can't expose key client-side), OG metadata generation per share URL, and easy Vercel deployment. App Router gave all three with minimal config.

2. **In-memory store instead of a database for v1** — Supabase and Postgres both require provisioning time and add deployment complexity. For a 7-day MVP, an in-memory Map is correct: it works, it's zero-config, and the abstraction (`store.ts`) is a single-file swap when we're ready to persist. Documented in ARCHITECTURE.md.

3. **Hardcoded audit rules over LLM-generated recommendations** — the assignment explicitly calls this out. Hardcoded rules are deterministic, auditable, and don't hallucinate savings numbers. The AI is used only for the narrative summary where nuance is a feature, not a risk.

4. **Honeypot abuse protection over hCaptcha** — hCaptcha adds a UX step before the user has seen value. Honeypot + IP-based rate limiting catches bot submissions silently, with zero friction for real users. Rate limit is 1 submission/IP/minute — loose enough for humans, tight enough to stop naive scrapers.

5. **Form state persisted to localStorage** — a user who fills in 6 tools and accidentally closes the tab loses nothing. This is a small detail that has outsized impact on completion rate, especially on mobile.

---

## Deployed URL

> https://spendlens.vercel.app *(update after deployment)*
