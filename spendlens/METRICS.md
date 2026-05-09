# METRICS.md — SpendLens

## North Star metric

**Audits completed per week**

This is the right North Star because: (1) completing an audit is the first moment of value delivery — before this, the user has given us nothing and gotten nothing; (2) it's a leading indicator for every downstream metric (email captures, consultation requests, credit purchases); (3) it's directly actionable — if it drops, we look at landing page conversion; if it stays flat but email capture drops, we look at the results page.

"Unique visitors" is not the North Star because traffic without completion is vanity. "Email captures" is not the North Star because the email gate comes after value — optimizing email capture rate in isolation could mean adding friction that kills completions. "Revenue" is not the North Star at this stage because the lag between audit and credit purchase is weeks, which makes it a lagging indicator too slow to steer by.

---

## 3 input metrics that drive the North Star

**1. Landing page → audit start rate**
*(Users who add at least one tool / total landing page visitors)*

This measures whether the hero communicates enough value to motivate a user to start the form. Target: >50%. Below 35% triggers a copy/design experiment.

**2. Audit start → audit completion rate**
*(Audits submitted / users who added at least one tool)*

This measures form friction. Each additional tool row added is a micro-commitment that raises completion probability. Target: >75%. Below 60% triggers a form length / UX experiment.

**3. Audit completion → share URL created rate**
*(Share URLs generated / audits completed)*

Every audit auto-generates a share URL. This metric tracks how many users actively copy or use that URL — a proxy for organic distribution and product satisfaction. Target: >20% of completers share their link within 48 hours. Below 10% triggers a share bar redesign or incentive experiment.

---

## What I'd instrument first

1. **Completion funnel events** (client-side, Posthog or Mixpanel):
   - `page_viewed` (landing)
   - `tool_added` (first tool row filled)
   - `audit_submitted`
   - `results_viewed`
   - `email_form_opened`
   - `email_submitted`
   - `share_url_copied`

2. **Server-side audit logs** (structured JSON to console → Logtail):
   - audit_id, tool_count, total_monthly_spend, total_savings, use_case, team_size, created_at
   - Lets us answer "what does a high-savings audit look like?" without touching user PII

3. **Error rate on Anthropic API calls**: how often the fallback summary fires vs. the AI summary. If >10%, investigate quota or key issues.

---

## What number triggers a pivot decision

**Audit completion → Credex consultation rate falls below 3% for audits showing >$500/month savings.**

This is the core monetization signal. If users with $500+/month savings are not booking consultations, the problem is either: (a) the Credex CTA is not believable/visible, (b) the savings number is wrong and users don't trust it, or (c) the audience is wrong (e.g., we're getting individual contributors who don't control budgets, not EMs and CTOs).

At <3%, we stop marketing and run 5 user interviews with people who completed high-savings audits but didn't book. Their reason tells us which problem to fix.

A secondary pivot trigger: **if median audit savings is below $50/month after 200 audits**, the tool is reaching the wrong audience (individual solopreneurs rather than team EMs). Response: adjust GTM targeting toward team-size signals.
