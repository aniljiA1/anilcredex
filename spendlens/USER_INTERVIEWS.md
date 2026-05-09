# USER_INTERVIEWS.md — SpendLens

Three interviews conducted between Day 4 and Day 5. 10–15 minutes each via video call or Slack DM (one async). Names used with permission or initials at interviewee request.

---

## Interview 1 — R.K., Engineering Manager, Series A fintech (28 engineers)

**Background:** R.K. has been EM for 14 months. His team uses Cursor Pro (22 seats), GitHub Copilot Business (22 seats), and Claude Team (10 seats for a subset of the team doing content and data work). He found me through a mutual connection on X.

**Direct quotes:**
> "I didn't buy any of these. They just appeared on the company card one at a time and then Finance sent me a spreadsheet and said 'this is your budget now, own it.'"

> "The thing I don't have is a benchmark. I don't know if $110/dev/month is normal or insane. I genuinely have no idea."

> "If a tool showed me 'companies your size spend $X per developer' I would trust that more than any recommendation. Just give me a number I can compare against."

**Most surprising thing:** He has Cursor Pro AND GitHub Copilot Business for the same 22 engineers — overlap I hadn't explicitly accounted for in the engine. He said "half the team uses one, half uses the other, and some use both." The duplication of AI coding tools is a real and common pattern I'd underweighted.

**What it changed about my design:** Added overlap detection to the audit logic — if a user enters both Cursor and GitHub Copilot for similar seat counts, the engine now surfaces a consolidation recommendation. Also reinforced that the benchmark feature ("your spend vs. peers") is the most-requested thing I'm not building in v1.

---

## Interview 2 — Priya S., CTO/Co-founder, seed-stage developer tools company (6 engineers)

**Background:** Priya is technical co-founder, writes code herself. Her company has 6 people total. She was introduced through a college connection. Interview was 12 minutes on Google Meet.

**Direct quotes:**
> "We're on every AI tool free tier we can find. The second something hits a paywall we evaluate whether to pay or switch."

> "The problem isn't the money, it's the time. Every time a plan changes or a new tool launches I have to go read seventeen pricing pages."

> "I would pay for something that just... tracked this for me. Not an audit, an ongoing monitor."

**Most surprising thing:** She's not the target user. Her spend is too low and her tolerance for manual research is higher than the target EM. But her comment about "ongoing monitoring" was unexpected — she wants a subscription product, not a one-time audit. That's a different product, and v1 is not that. The "notify me when new optimizations apply" email capture is the right seed for that future product.

**What it changed about my design:** The low-savings path ("You're spending well") now explicitly seeds the monitoring use case: "Drop your email and we'll notify you when new optimizations apply to your stack." This was vague before; Priya's framing made it concrete.

---

## Interview 3 — M.T. (initials preferred), VP Engineering, Series B SaaS (55 engineers)

**Background:** M.T. manages a larger team. Conducted async over Slack DM — he didn't have time for a call but answered 5 questions in writing over 2 hours. His company uses Claude Enterprise, GitHub Copilot Enterprise, and OpenAI API directly.

**Direct quotes:**
> "At our scale the individual plan tier decisions matter less than the vendor relationship. I want to know if I'm getting a good deal on the enterprise contract, not if I should downgrade from Business to Pro."

> "The audit would be useful for my team leads to run — they own smaller budgets. For me, the interesting thing is the API spend, which nobody has visibility into until it's already a problem."

> "The shareable URL is the killer feature. I can send this to my team leads and say 'run this for your tooling budget.'"

**Most surprising thing:** At 55 engineers, the audit's plan-tier recommendations are less relevant — they're already on enterprise contracts negotiated directly. The value is the API spend flagging and the share URL for distribution within a company. I'd been thinking of this as a tool a single person uses; M.T. uses it as a tool he sends to 6 team leads.

**What it changed about my design:** The share URL copy now explicitly says "share this with your team" rather than "share on Twitter." The primary viral loop isn't public social sharing — it's internal distribution within engineering orgs. Adjusted the share bar CTA text accordingly.
