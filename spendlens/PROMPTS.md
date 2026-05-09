# PROMPTS.md — SpendLens

## The AI summary prompt

Used in `/src/app/api/audit/route.ts` in `generateAISummary()`.

### Full prompt

```
You are an AI spend analyst. Write a personalized 80–110 word audit summary paragraph for a startup.

Context:
- Tools: {toolList}
- Team size: {teamSize}
- Primary use case: {useCase}
- Potential monthly savings: ${monthlySavings}
- Potential annual savings: ${annualSavings}

Write in second person ("your team"), be specific about their actual tools. Lead with the single most impactful finding. End with one actionable next step. Do NOT use bullet points. Tone: direct, analytical, not salesy.
```

### Why I wrote it this way

**Second person ("your team"):** Creates immediate ownership. "Your team is overspending" lands differently than "This team is overspending." Tested both; second person scored higher in user interviews for perceived relevance.

**"Lead with the single most impactful finding":** Without this constraint, the model writes generic preamble ("Based on your audit...") for 30 words before getting to the point. This instruction cuts that.

**"Do NOT use bullet points":** Default model behavior is to bullet-point everything. For a 100-word summary paragraph, bullets break the reading flow and look like a template. Explicit prohibition is the only reliable way to prevent it.

**"Tone: direct, analytical, not salesy":** The model defaults to marketing language ("unlock savings", "optimize your investment") without this. The product is a trust tool — salesy language destroys trust.

**Word count range (80–110):** Tight enough that the model can't pad. Loose enough that it doesn't truncate. Tested 50–70 (too terse, lost nuance), 100–150 (too long, people don't read it).

### What I tried that didn't work

1. **Asking for a "financial analyst tone":** The model over-rotated into jargon ("opex reduction opportunities", "unit economics optimization"). Users in interviews described it as "corporate speak."

2. **Including the per-tool savings breakdown in the prompt:** The model just re-narrated the table in prose. The summary should synthesize, not repeat. Removed the per-tool detail; the model was forced to focus on the top-line insight.

3. **Asking it to end with a "call to action about Credex":** Too heavy-handed. One user said "it felt like an ad at the end." Removed. The Credex CTA is surfaced separately in the UI for high-savings cases.

4. **Longer max_tokens (initially 200, bumped to 250):** At 200 tokens, the model occasionally truncated mid-sentence when the input was long. 250 gives enough headroom for all observed inputs.

### Failure handling

If the Anthropic API call fails (network error, 429 rate limit, missing key, any exception), `generateAISummary()` catches the error and returns `fallbackSummary()` — a deterministic template that uses the same data fields. The audit result is never blocked by AI availability. This is explicitly logged with `console.error` so operators can monitor API health without user impact.
