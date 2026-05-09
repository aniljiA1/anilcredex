# REFLECTION.md — SpendLens

---

## 1. The hardest bug I hit this week

The nastiest bug was the share page OG metadata not rendering correctly when the link was shared on Twitter. The `<meta property="og:image">` tag was present in the HTML source, but Twitter's card validator kept returning "Unable to render card preview."

My first hypothesis was that the image path was wrong — I checked, it was correct and accessible at `/og-image.png`. My second hypothesis was a caching issue with Twitter's crawler — I cleared the card cache via the validator tool, no change. Third hypothesis: the metadata was being generated client-side after hydration, which means the crawler (which doesn't execute JavaScript) never saw it.

That turned out to be exactly the problem. I had put the share page as a pure Client Component (`"use client"`) and used `useEffect` to set document title. Next.js App Router's `generateMetadata` function only works in Server Components. The fix was to split the page into a thin Server Component wrapper (`page.tsx`) that exports `generateMetadata` and renders a Client Component (`SharePageClient.tsx`) for the interactive parts. After the split, the OG tags appeared in the raw HTML and Twitter rendered the card correctly.

The debugging took about 45 minutes. The lesson: anything that crawlers need to see must be in the server-rendered HTML. Next.js makes this easy — but only if you understand the Server/Client Component boundary.

---

## 2. A decision I reversed mid-week

I initially planned to generate the per-tool audit recommendations using the Anthropic API — send the tool list + usage context and ask Claude to reason about savings opportunities. I wrote a prompt draft on Day 1 and planned to use it.

By Day 2, I reversed this. Three reasons: (1) the brief explicitly says "for the audit math itself, hardcoded rules are correct — knowing when not to use AI is part of the test." I'd glossed over this on first read. (2) LLM-generated savings numbers are non-deterministic — two users with identical inputs could get different savings figures, which would be confusing and untrustworthy. (3) Hardcoded rules are testable. I can write `expect(auditCursor({plan: "Business", seats: 2})).toHaveProperty("monthlySavings", 40)` and it will always pass or fail cleanly.

The reversal made the engine better and the tests meaningful. The AI is now used only for the narrative summary — where nuance and personalization are a feature, not a liability.

---

## 3. What I would build in week 2

The most obvious gap in the MVP is the absence of a benchmark layer. Right now I tell you what you *could* save. I don't tell you what *companies like yours* spend. "Your AI spend per developer is $85/month — the median for Series A SaaS companies is $62" is a much more compelling hook than raw savings numbers.

Week 2 would be: (1) build a lightweight anonymized benchmark dataset seeded from the user interviews + public data (State of AI survey, Ramp spending reports); (2) add a "your stack vs. peers" section to the results page; (3) add PDF export so the audit is a deliverable users can share with their finance team — the finance team is the actual buyer of Credex credits, not the CTO; (4) add a referral code system so users who share the tool get a perk (e.g., first month of Credex credits at an additional 5% discount), which closes the viral loop.

I'd also move the store from in-memory to Supabase — critical once real email addresses are being stored.

---

## 4. How I used AI tools

I used Claude (Sonnet) and GitHub Copilot throughout the week.

**What I used them for:**
- Copilot autocompleted boilerplate (Next.js route handler signatures, TypeScript interface declarations, CSS property values I couldn't remember). I accepted probably 60% of suggestions.
- Claude helped me draft the initial structure of `ECONOMICS.md` — I gave it the brief requirements and asked for a skeleton, then filled in all the numbers myself from first principles.
- I used Claude to sanity-check my Anthropic API prompt (see PROMPTS.md) — asked it to critique the prompt from the perspective of a bad actor trying to get it to hallucinate savings numbers.

**What I didn't trust AI with:**
- The audit engine logic. Every rule is my reasoning, not the model's. I wrote it by hand, with vendor pricing pages open in separate tabs.
- Pricing data. Models confidently hallucinate prices. Every number in PRICING_DATA.md was verified by me against a live vendor page.
- The user interview questions. I didn't want AI-shaped interview questions producing AI-shaped answers.

**One time the AI was wrong and I caught it:**
I asked Claude to help me estimate the Windsurf Team plan price. It said $25/seat. The actual current price is $35/seat. I caught it because I had the Windsurf pricing page open and cross-checked before using the number. This is exactly why PRICING_DATA.md exists and why every number has a source URL.

---

## 5. Self-ratings

| Dimension | Rating | Reason |
|---|---|---|
| **Discipline** | 8/10 | Committed across 7 days with meaningful entries each day. Could have gone deeper on the bonus features. |
| **Code quality** | 7/10 | The engine is clean and testable. The UI components are functional but could use more decomposition — `AuditResults.tsx` is doing too much. |
| **Design sense** | 8/10 | The ink/acid-green aesthetic is deliberate and consistent. The results page hierarchy (big savings number → AI summary → per-tool breakdown → CTA) is intentional. Lighthouse accessibility 92. |
| **Problem-solving** | 8/10 | The OG metadata bug and the Claude Team pricing edge case both required actual debugging, not guessing. Reversed a bad architectural decision early (AI audit engine). |
| **Entrepreneurial thinking** | 7/10 | User interviews happened and changed the design. GTM and ECONOMICS have real numbers. I under-invested in the benchmark feature and the referral loop — those are the two things that would actually drive word-of-mouth. |
