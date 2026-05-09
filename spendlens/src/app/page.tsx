"use client";
import { useState, useEffect } from "react";
import { AuditFormData, AuditResult, ToolEntry, ToolName, TOOL_PLANS, TOOL_LABELS, UseCase } from "@/types";
import AuditResults from "@/components/results/AuditResults";

const ALL_TOOLS = Object.keys(TOOL_LABELS) as ToolName[];

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Software development / coding" },
  { value: "writing", label: "Writing & content" },
  { value: "data", label: "Data analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / general" },
];

function ToolRow({
  entry,
  index,
  onChange,
  onRemove,
}: {
  entry: ToolEntry;
  index: number;
  onChange: (i: number, e: ToolEntry) => void;
  onRemove: (i: number) => void;
}) {
  const plans = TOOL_PLANS[entry.tool] ?? [];

  return (
    <div className="tool-row">
      <div>
        <label className="label">Tool</label>
        <div className="select-wrapper">
          <select
            className="select"
            value={entry.tool}
            onChange={(e) =>
              onChange(index, {
                ...entry,
                tool: e.target.value as ToolName,
                plan: TOOL_PLANS[e.target.value as ToolName][0],
              })
            }
          >
            {ALL_TOOLS.map((t) => (
              <option key={t} value={t}>{TOOL_LABELS[t]}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Plan</label>
        <div className="select-wrapper">
          <select
            className="select"
            value={entry.plan}
            onChange={(e) => onChange(index, { ...entry, plan: e.target.value })}
          >
            {plans.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Seats</label>
        <input
          type="number"
          className="input"
          min={1}
          value={entry.seats}
          style={{ width: 72 }}
          onChange={(e) => onChange(index, { ...entry, seats: parseInt(e.target.value) || 1 })}
        />
      </div>
      <div>
        <label className="label">$/mo</label>
        <input
          type="number"
          className="input"
          min={0}
          value={entry.monthlySpend}
          style={{ width: 90 }}
          onChange={(e) => onChange(index, { ...entry, monthlySpend: parseFloat(e.target.value) || 0 })}
        />
      </div>
      <button className="tool-row__remove" onClick={() => onRemove(index)} aria-label="Remove tool">×</button>
    </div>
  );
}

const DEFAULT_TOOL: ToolEntry = { tool: "cursor", plan: "Pro", seats: 1, monthlySpend: 20 };
const STORAGE_KEY = "spendlens_form";

export default function HomePage() {
  const [tools, setTools] = useState<ToolEntry[]>([{ ...DEFAULT_TOOL }]);
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState<UseCase>("coding");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  // Persist form across reloads
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tools) setTools(parsed.tools);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tools, teamSize, useCase }));
    } catch {}
  }, [tools, teamSize, useCase]);

  function addTool() {
    const used = new Set(tools.map((t) => t.tool));
    const next = ALL_TOOLS.find((t) => !used.has(t)) ?? "cursor";
    setTools([...tools, { tool: next, plan: TOOL_PLANS[next][0], seats: 1, monthlySpend: 0 }]);
  }

  function updateTool(i: number, e: ToolEntry) {
    setTools(tools.map((t, idx) => (idx === i ? e : t)));
  }

  function removeTool(i: number) {
    setTools(tools.filter((_, idx) => idx !== i));
  }

  async function runAudit() {
    if (tools.length === 0) { setError("Add at least one tool."); return; }
    setLoading(true); setError("");
    try {
      const body: AuditFormData = { tools, teamSize, useCase };
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      const data: AuditResult = await res.json();
      setResult(data);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav className="nav">
        <div className="container">
          <div className="nav__inner">
            <a href="/" className="nav__logo">Spend<span>Lens</span></a>
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
              Free AI spend audit by <strong style={{ color: "var(--ink)" }}>Credex</strong>
            </span>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="container">
            <p className="hero__eyebrow">Free · No login required · Results in 30 seconds</p>
            <h1 className="hero__title">
              Are you<br />
              <span className="highlight">overpaying</span><br />
              for AI tools?
            </h1>
            <p className="hero__sub">
              Most startups spend 20–40% more than they need to on AI subscriptions.
              Enter your stack and get an instant, honest audit.
            </p>
            <div className="hero__proof">
              <div className="hero__proof-item">
                <strong>$312</strong>avg monthly savings found
              </div>
              <div className="hero__proof-item">
                <strong>8</strong>tools audited
              </div>
              <div className="hero__proof-item">
                <strong>2 min</strong>to complete
              </div>
            </div>
          </div>
        </section>

        {/* ── FORM ── */}
        <section style={{ paddingBottom: 80 }}>
          <div className="container">
            <div style={{ marginBottom: 32 }}>
              <p className="section-label">Step 1 — Your AI stack</p>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>
                Add each tool your team pays for. Enter the actual amount from your last invoice.
              </p>
            </div>

            {tools.map((entry, i) => (
              <ToolRow key={i} entry={entry} index={i} onChange={updateTool} onRemove={removeTool} />
            ))}

            <button className="btn btn--outline btn--sm" onClick={addTool} style={{ marginBottom: 40 }}>
              + Add another tool
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
              <div>
                <p className="section-label">Step 2 — Team context</p>
                <div style={{ marginBottom: 16 }}>
                  <label className="label">Total team size (headcount)</label>
                  <input
                    type="number"
                    className="input"
                    min={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="label">Primary use case</label>
                  <div className="select-wrapper">
                    <select className="select" value={useCase} onChange={(e) => setUseCase(e.target.value as UseCase)}>
                      {USE_CASES.map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <div style={{ background: "var(--paper-2)", borderRadius: 8, padding: 20, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--ink)", fontFamily: "var(--mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>How it works</strong>
                  <br /><br />
                  Our audit engine compares your current plans against every vendor&apos;s published pricing, checks whether your plan tier matches your team size, and surfaces cheaper alternatives with equivalent capability.
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fff0ee", border: "1.5px solid var(--red)", borderRadius: 8, padding: "12px 16px", color: "var(--red)", marginBottom: 16, fontSize: 14 }}>
                {error}
              </div>
            )}

            <button
              className="btn btn--acid btn--lg"
              onClick={runAudit}
              disabled={loading}
              style={{ width: "100%", maxWidth: 360 }}
            >
              {loading ? <><span className="spinner" style={{ borderTopColor: "var(--ink)" }} /> Running audit…</> : "Run my free audit →"}
            </button>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
              No email required to see results. We ask after, if you want a copy.
            </p>

          </div>
        </section>

        {/* ── RESULTS ── */}
        {result && (
          <div id="results">
            <AuditResults result={result} />
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <span>© 2025 SpendLens by <a href="https://credex.rocks" target="_blank" rel="noopener">Credex</a></span>
            <span>Pricing verified weekly from official vendor pages.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
