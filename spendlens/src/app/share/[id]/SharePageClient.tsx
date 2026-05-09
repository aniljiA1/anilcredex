"use client";
import { useEffect, useState } from "react";
import { AuditResult, TOOL_LABELS } from "@/types";

export default function SharePageClient({ id }: { id: string }) {
  const [result, setResult] = useState<Partial<AuditResult> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/share/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => { if (d) setResult(d); })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <nav className="nav">
        <div className="container">
          <div className="nav__inner">
            <a href="/" className="nav__logo">Spend<span>Lens</span></a>
            <a href="/" className="btn btn--acid btn--sm">Run your own audit →</a>
          </div>
        </div>
      </nav>
      <main style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div className="container">
          {loading && <p className="text-muted">Loading audit…</p>}
          {notFound && (
            <div style={{ textAlign: "center", paddingTop: 80 }}>
              <h2 style={{ fontFamily: "var(--display)" }}>Audit not found</h2>
              <p className="text-muted" style={{ marginTop: 8 }}>This link may have expired.</p>
              <a href="/" className="btn btn--primary" style={{ marginTop: 24 }}>Run a new audit</a>
            </div>
          )}
          {result && (
            <>
              <p className="section-label" style={{ marginBottom: 16 }}>Shared audit report</p>
              <div className="savings-hero fade-up" style={{ marginBottom: 32 }}>
                <p className="savings-hero__label">Potential monthly savings identified</p>
                <div className="savings-hero__amount">${(result.totalMonthlySavings ?? 0).toFixed(0)}</div>
                <p className="savings-hero__sub">
                  Current spend: ${(result.totalMonthlySpend ?? 0).toFixed(0)}/mo → Optimized: ${(result.totalProjectedSpend ?? 0).toFixed(0)}/mo
                </p>
                {(result.totalAnnualSavings ?? 0) > 0 && (
                  <p className="savings-hero__annual">${(result.totalAnnualSavings ?? 0).toFixed(0)} potential annual savings</p>
                )}
              </div>

              {result.aiSummary && (
                <div className="ai-summary fade-up" style={{ marginBottom: 32 }}>
                  <p className="ai-summary__label"><span>✦</span> AI-generated analysis</p>
                  <p>{result.aiSummary}</p>
                </div>
              )}

              <h2 style={{ fontFamily: "var(--display)", fontSize: 20, marginBottom: 16 }}>Recommendations</h2>
              {result.recommendations?.map((rec, i) => (
                <div key={i} className="rec-card fade-up">
                  <div className="rec-card__header">
                    <span className="rec-card__tool">{TOOL_LABELS[rec.tool]}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                      {rec.monthlySavings > 0 ? `−$${rec.monthlySavings.toFixed(0)}/mo` : "✓ Optimal"}
                    </span>
                  </div>
                  <div className="rec-card__body">
                    <p className="rec-card__action">{rec.recommendedAction}</p>
                    <p className="rec-card__reason">{rec.reason}</p>
                  </div>
                </div>
              ))}

              <div style={{ textAlign: "center", marginTop: 48 }}>
                <p style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
                  Want to audit your own AI stack?
                </p>
                <a href="/" className="btn btn--acid btn--lg">Run my free audit →</a>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
