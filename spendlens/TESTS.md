# TESTS.md — SpendLens

## How to run

```bash
npm test
# or
npx jest
```

CI runs on every push to `main` via `.github/workflows/ci.yml`.

---

## Test files

### `src/__tests__/auditEngine.test.ts`

Covers the core audit engine logic. All tests are deterministic — no API calls, no network.

| # | Test name | What it covers |
|---|---|---|
| 1 | `Cursor Business with ≤3 seats recommends downgrade to Pro` | `auditCursor` correctly identifies overspend when Business plan is used for a small team and recommends Pro, calculating exact savings. |
| 2 | `Cursor Pro with 1 seat for coding suggests Copilot Individual` | `auditCursor` surfaces a cheaper alternative tool when the use case is pure coding and team size is small. |
| 3 | `Cursor Pro with 10 seats is marked optimal` | No false positives — large teams on Business are correctly left alone. |
| 4 | `GitHub Copilot Business with ≤3 seats recommends Individual` | `auditGithubCopilot` correctly flags the Business→Individual downgrade opportunity for small teams. |
| 5 | `GitHub Copilot Enterprise under 50 seats recommends Business` | Enterprise-tier flag fires correctly below the 50-seat threshold. |
| 6 | `Claude Max single seat non-research recommends Pro downgrade` | `auditClaude` correctly identifies the 5× premium of Max vs Pro for non-research workflows. |
| 7 | `Claude Team with 3 seats recommends individual Pro accounts` | Correctly catches the 5-seat minimum forcing a 3-person team to pay for 5. |
| 8 | `Anthropic API above $200/dev flags for optimization` | `auditApiDirect` fires the high-spend warning and calculates 40% projected savings. |
| 9 | `runAudit totals are calculated correctly` | Integration test: `totalMonthlySavings = totalMonthlySpend - totalProjectedSpend` is accurate across a multi-tool input. |
| 10 | `runAudit with all-optimal tools returns isOptimal=true` | Confirms the `isOptimal` flag is correctly set when savings < $10. |
| 11 | `normalizedMonthlyCost uses perSeat pricing when available` | Unit test on the pricing normalization helper — confirms per-seat tools ignore user-entered `monthlySpend`. |
| 12 | `normalizedMonthlyCost uses user-entered spend for API tools` | Confirms API/variable tools trust the user's actual invoice amount. |

---

## How to add tests

All test files live in `src/__tests__/`. Jest is configured in `jest.config.js` to look for `**/__tests__/**/*.test.ts`.

To test a new audit rule, import `runAudit` or the specific audit function from `@/lib/auditEngine` and assert on the returned `ToolRecommendation` fields.
