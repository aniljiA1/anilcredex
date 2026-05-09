# ECONOMICS.md — SpendLens Unit Economics

## What a converted lead is worth to Credex

Credex sells discounted AI infrastructure credits. Based on the assignment brief ("substantial" discounts from companies that overforecast), I'll model a 20% gross margin on credits sold (conservative — sourcing arbitrage typically runs 15–30%).

**Assumptions:**
- Average credit purchase: $3,000/year per customer (a 20-person eng team spending $150/dev/year on AI tools at retail)
- Gross margin on credits: 20%
- Gross profit per customer per year: **$600**
- Average customer lifetime: 2 years (SaaS tooling is sticky once procurement is set up)
- **LTV per customer: $1,200**

## CAC at each GTM channel

| Channel | Estimated reach | Conversion to audit | Conversion to consult | Conversion to purchase | Est. CAC |
|---|---|---|---|---|---|
| X/Twitter organic thread | 2,000 impressions | 3% → 60 audits | 5% → 3 consults | 33% → 1 purchase | ~$0 (time only) |
| Hacker News Show HN | 5,000 impressions | 1.5% → 75 audits | 4% → 3 consults | 33% → 1 purchase | ~$0 (time only) |
| Newsletter mention | 8,000 readers | 0.5% → 40 audits | 5% → 2 consults | 33% → 0.7 purchase | ~$0 (relationship cost) |
| Vendor CS referral | 50 warm intros | 60% → 30 audits | 20% → 6 consults | 50% → 3 purchases | ~$0 (relationship cost) |

At zero paid budget, blended CAC across these channels is effectively founder/operator time. If we value that time at $100/hour and spend 20 hours on GTM in month 1: CAC = $2,000 / 5 purchases = **$400**.

LTV/CAC = $1,200 / $400 = **3.0×** — acceptable for a B2B lead gen tool, with room to improve as word-of-mouth compounds.

## Conversion funnel: audit → consultation → purchase

| Stage | Rate | Notes |
|---|---|---|
| Visitor → audit completed | 40% | Form is short; no login required; value is clear upfront |
| Audit completed → email captured | 30% | Email is asked after value is shown, not before |
| Email captured → consult booked (>$500/mo savings) | 25% | High-savings users are explicitly prompted; low-savings users are not |
| Consult booked → credit purchase | 40% | Credex has a real product; the consult is pre-qualified |
| **Overall: visitor → purchase** | **1.2%** | Reasonable for cold traffic to a B2B purchase |

## What would have to be true for $1M ARR in 18 months

**Target:** $1M ARR = $1M gross revenue. At 20% margin, that's $200k gross profit — or 1,667 customers at $600 GP/year each, or 833 customers at $1,200 LTV each if we think in cohort terms.

More practically: $1M ARR / $3,000 average annual credit purchase = **333 paying customers** at end of month 18.

**Monthly new customer target:** 333 customers over 18 months ≈ **19 new customers/month** by month 18 (assuming linear ramp from 0).

**Required funnel at that scale:**
- 19 purchases/month
- At 40% consult→purchase: 48 consults/month
- At 25% email→consult: 190 email captures/month
- At 30% audit→email: 633 audits/month
- At 40% visit→audit: **1,583 visitors/month**

1,583 monthly visitors is achievable with a combination of: (1) SEO on "AI tool cost" and "Cursor vs Copilot" queries (3–6 month lag), (2) compounding word-of-mouth from share URLs, (3) 2–3 newsletter placements per month.

**What has to be true:**
1. The vendor CS referral channel activates — this is the single highest-leverage channel and only Credex can unlock it
2. The share URL goes mildly viral at least once (one tweet with 500+ engagements compounds for weeks)
3. Credex closes ≥40% of consultations — requires a sharp sales motion and a real discount offer, not vague "we can save you money"
4. Average credit purchase is ≥$3,000/year — requires targeting teams with ≥10 engineers, not solopreneurs

## Summary table

| Metric | Value |
|---|---|
| LTV per customer | $1,200 |
| Blended CAC (organic) | $400 |
| LTV/CAC | 3.0× |
| Visitors needed for $1M ARR | ~1,600/month by month 18 |
| New customers needed/month | ~19 by month 18 |
| Overall visitor→purchase conversion | ~1.2% |
