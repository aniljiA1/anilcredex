# PRICING_DATA.md — SpendLens

All prices are in USD/month unless stated. Verified from official vendor pricing pages.

---

## Cursor

- Hobby: $0/user/month — https://cursor.com/pricing — verified 2025-07-07
- Pro: $20/user/month — https://cursor.com/pricing — verified 2025-07-07
- Business: $40/user/month — https://cursor.com/pricing — verified 2025-07-07
- Enterprise: Contact sales (estimated $100+/user/month based on comparable tools) — https://cursor.com/pricing — verified 2025-07-07

---

## GitHub Copilot

- Individual: $10/user/month (or $100/year) — https://github.com/features/copilot#pricing — verified 2025-07-07
- Business: $19/user/month — https://github.com/features/copilot#pricing — verified 2025-07-07
- Enterprise: $39/user/month — https://github.com/features/copilot#pricing — verified 2025-07-07

---

## Claude (Anthropic)

- Free: $0 — https://claude.ai/upgrade — verified 2025-07-07
- Pro: $20/user/month — https://claude.ai/upgrade — verified 2025-07-07
- Max: $100/user/month — https://claude.ai/upgrade — verified 2025-07-07
- Team: $30/user/month (minimum 5 seats) — https://claude.ai/upgrade — verified 2025-07-07
- Enterprise: Contact sales (estimated $60/user/month floor) — https://www.anthropic.com/claude-for-business — verified 2025-07-07
- API direct: Variable (pay-as-you-go per token) — https://www.anthropic.com/pricing — verified 2025-07-07

---

## ChatGPT (OpenAI)

- Plus: $20/user/month — https://openai.com/chatgpt/pricing/ — verified 2025-07-07
- Team: $30/user/month (minimum 2 seats) — https://openai.com/chatgpt/pricing/ — verified 2025-07-07
- Enterprise: Contact sales (estimated $60/user/month, min 150 seats) — https://openai.com/chatgpt/pricing/ — verified 2025-07-07
- API direct: Variable (pay-as-you-go per token) — https://openai.com/api/pricing/ — verified 2025-07-07

---

## Anthropic API (direct)

- Pay-as-you-go (no seat fee): Claude Haiku 3.5: $0.80/MTok input, $4/MTok output; Claude Sonnet 4: $3/MTok input, $15/MTok output; Claude Opus 4: $15/MTok input, $75/MTok output — https://www.anthropic.com/pricing — verified 2025-07-07

---

## OpenAI API (direct)

- Pay-as-you-go: GPT-4o: $2.50/MTok input, $10/MTok output; GPT-4o mini: $0.15/MTok input, $0.60/MTok output; o3: $10/MTok input, $40/MTok output — https://openai.com/api/pricing/ — verified 2025-07-07

---

## Gemini (Google)

- Free: $0 (Gemini 1.5 Flash with rate limits) — https://ai.google.dev/pricing — verified 2025-07-07
- Advanced (Gemini Advanced): $19.99/user/month (part of Google One AI Premium) — https://one.google.com/about/plans — verified 2025-07-07
- API: Variable pay-as-you-go — https://ai.google.dev/pricing — verified 2025-07-07

*Note: "Gemini Advanced" is $19.99/month rounded to $20 in the engine for consistency.*

---

## Windsurf (Codeium)

- Free: $0 — https://windsurf.com/pricing — verified 2025-07-08
- Pro: $15/user/month — https://windsurf.com/pricing — verified 2025-07-08
- Team: $35/user/month — https://windsurf.com/pricing — verified 2025-07-08

*Note: Windsurf pricing changed in early 2025. Pro was previously $10/seat. Current price as of verification date is $15/seat.*

---

## Audit engine pricing assumptions

1. For plans with per-seat pricing, total cost = `perSeat × seats`.
2. For API/variable plans, the engine trusts the user-entered `monthlySpend` value — the user knows their actual invoice.
3. Claude Team has a 5-seat minimum. If a user enters 3 seats on Team, the engine notes they are paying for 5 seats minimum and compares against 3× Pro.
4. Enterprise plans with "contact sales" pricing use conservative floor estimates and are clearly labeled as estimates in the audit output.
