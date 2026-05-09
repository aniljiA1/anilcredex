# DEVLOG — SpendLens

---

## Day 1 — 2025-07-07

**Hours worked:** 3.5

**What I did:**
Read the brief carefully twice before touching code. Sketched the data model on paper: what does an `AuditResult` look like, what fields does the form need, what does the share page need to show. Set up Next.js 14 with App Router, TypeScript, and the base folder structure. Created `types/index.ts` with all core interfaces. Initialized git, wrote first commit.

**What I learned:**
The brief says "the audit math must be defensible — a finance person should agree with it." That's a high bar. I need to make sure each recommendation has a clear numerical justification, not just vibes. Spent 30 min reading vendor pricing pages before writing any engine code.

**Blockers / what I'm stuck on:**
Not blocked. Need to decide early whether to use a DB or in-memory store — leaning in-memory for speed, with a clear abstraction layer so it's swappable.

**Plan for tomorrow:**
Build the full audit engine (`auditEngine.ts`) with per-tool logic. Write the 5+ tests against it. Lock in pricing data from official pages.

---

## Day 2 — 2025-07-08

**Hours worked:** 5

**What I did:**
Built `auditEngine.ts` — the core of the product. Wrote per-tool audit functions for all 8 tools. The hardest was getting the Claude Team logic right: Team has a 5-seat minimum, so a 3-person team paying for Team is actually paying for 5 seats. Pulled current pricing from all 8 vendor pages and populated `PRICING_DATA.md` with verified URLs. Wrote 7 Jest tests covering the audit engine.

**What I learned:**
GitHub Copilot's pricing is genuinely confusing — Individual is $10/seat billed monthly or $100/year. I made a decision to use the monthly price in the engine and document it. Also learned that Windsurf recently changed pricing — their Pro is now $15/seat, not $10. Good catch; would have been embarrassing to ship wrong numbers.

**Blockers / what I'm stuck on:**
Jest setup with ts-jest required a `jest.config.js` — spent 20 min debugging `Cannot find module` errors before realizing I needed `moduleNameMapper` for the `@/*` path alias.

**Plan for tomorrow:**
Build the landing page, the form component, and the API route. Get end-to-end working so I can do a full audit from UI to result.

---

## Day 3 — 2025-07-09

**Hours worked:** 6

**What I did:**
Built the full UI: landing page with hero, the tool input form with `localStorage` persistence, the `AuditResults` component, and the `RecCard` per-tool breakdown. Wired up the `/api/audit` route. Did my first end-to-end audit — it worked first try on the happy path. Fixed a bug where the savings hero showed negative numbers when projected spend was higher than current (shouldn't happen, but clamped it to 0). Set up the design system in `globals.css` — went with a high-contrast ink/acid-green aesthetic, Syne display font + IBM Plex Mono.

**What I learned:**
`localStorage` in Next.js App Router requires a `useEffect` guard — reading it directly during SSR throws. Learned to always wrap `localStorage` access in `try/catch` because iOS Safari in private mode throws on quota exceeded.

**Blockers / what I'm stuck on:**
The AI summary sometimes returns mid-sentence — need to check if `max_tokens: 200` is cutting it off. Will bump to 250 and add a sentence-end check tomorrow.

**Plan for tomorrow:**
Lead capture form + `/api/leads` route. Share URL page with OG metadata. Start on the markdown docs.

---

## Day 4 — 2025-07-10

**Hours worked:** 5.5

**What I did:**
Built `LeadCaptureForm` with honeypot spam protection and IP rate limiting in `/api/leads`. Built the share page (`/share/[id]`) with dynamic OG metadata via Next.js `generateMetadata`. Wired up Resend email (graceful fallback when `RESEND_API_KEY` not set). Wrote `ARCHITECTURE.md` with the Mermaid diagram. Bumped AI summary `max_tokens` to 250; the truncation issue is gone.

**What I learned:**
Next.js `generateMetadata` in App Router must be an `async` export from a Server Component — it can't be in a Client Component. Had to split the share page into a server wrapper (`page.tsx`) and a client component (`SharePageClient.tsx`). Spent 45 min on this.

**Blockers / what I'm stuck on:**
The in-memory store doesn't survive server restarts in development — every `npm run dev` reload clears audits. Fine for production (Vercel cold starts are rare), but annoying for dev. Added a note in ARCHITECTURE.md. Acceptable tradeoff for MVP.

**Plan for tomorrow:**
Conduct user interviews. Write GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md. Deploy to Vercel.

---

## Day 5 — 2025-07-11

**Hours worked:** 4

**What I did:**
Conducted 3 user interviews (see `USER_INTERVIEWS.md`). The conversations changed my thinking about the target persona significantly — I'd been thinking "CTO" but the real pain is felt by the first engineering manager who gets handed a $2k/month Slack notification from the finance team. Wrote `GTM.md`, `ECONOMICS.md`, `LANDING_COPY.md`, and `METRICS.md`. Deployed to Vercel — first deploy failed because I forgot to set `NEXT_PUBLIC_BASE_URL`. Fixed, redeployed, working.

**What I learned:**
From the interviews: the most common reaction to AI overspend isn't "I should audit this" — it's "I'll deal with it next quarter." The tool needs to make the pain visible immediately. The savings hero number being big and red/green is the right instinct.

**Blockers / what I'm stuck on:**
Lighthouse accessibility score is 87 on mobile — just below the 90 threshold. The culprit is color contrast on the `.text-muted` class against the paper background. Will fix tomorrow.

**Plan for tomorrow:**
Fix accessibility score. Write `PROMPTS.md`, `TESTS.md`. Polish UI — especially the results page. Final review of all docs.

---

## Day 6 — 2025-07-12

**Hours worked:** 5

**What I did:**
Fixed accessibility contrast: changed `--muted` from `#6b6b72` to `#595960` (passes WCAG AA at 4.6:1 on paper background). Added `aria-label` to the remove tool button and `role="status"` to the loading state. Lighthouse accessibility now 92. Wrote `PROMPTS.md` and `TESTS.md`. Added CI workflow (`.github/workflows/ci.yml`). Ran all 7 tests — green. Did a full end-to-end walkthrough on mobile: fixed a layout bug in the tool row grid on narrow screens. Added `PRICING_DATA.md` with all source URLs.

**What I learned:**
GitHub Actions `ubuntu-latest` comes with Node 20 by default — no need to set up the node version manually. Also learned that `next lint` needs `eslint-config-next` in devDependencies or it throws — caught this in CI.

**Blockers / what I'm stuck on:**
Not blocked. Need to write REFLECTION.md tomorrow and do a final read-through of all files.

**Plan for tomorrow:**
Write `REFLECTION.md`. Final git hygiene pass — check commit messages, count distinct days, verify CI is green. Submit.

---

## Day 7 — 2025-07-13

**Hours worked:** 3

**What I did:**
Wrote `REFLECTION.md` — answered all 5 questions honestly. Did a final review of every required file. Ran `git log --pretty=format:"%ad" --date=short | sort -u | wc -l` — 7 distinct days, confirmed. Ran `npm test` — all tests pass. Checked the live Vercel URL on mobile and desktop. Fixed a typo in `GTM.md`. Final commit: `docs: finalize reflection and submission checklist`. Submitted the Google Form.

**What I learned:**
Writing the REFLECTION.md forced me to articulate decisions I'd made instinctively. The exercise of explaining "what AI got wrong and I caught it" was useful — it happened twice with the Anthropic API and once with pricing data. Worth doing on every project.

**Blockers / what I'm stuck on:**
Nothing. Shipped.

**Plan for tomorrow:**
N/A — submission complete. If shortlisted, prep for the Round 2 brief.
