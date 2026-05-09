"use client";
import { useState } from "react";
import { AuditResult, ToolRecommendation, TOOL_LABELS } from "@/types";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

function SeverityBadge({ severity }: { severity: ToolRecommendation["severity"] }) {
  if (severity === "overspending") return <span className="badge badge--red">⚠ Overspending</span>;
  if (severity === "consider-switching") return <span className="badge badge--amber">↔ Consider switching</span>;
  return <span className="badge badge--green">✓ Optimal</span>;
}

function RecCard({ rec }: { rec: ToolRecommendation }) {
  return (
    <div className="rec-card fade-up">
      <div className="rec-card__header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="rec-card__tool">{TOOL_LABELS[rec.tool]}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
            {rec.currentPlan} · ${rec.currentSpend.toFixed(0)}/mo
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {rec.monthlySavings > 0 && (
            <span className="rec-card__savings">−${rec.monthlySavings.toFixed(0)}/mo</span>
          )}
          <SeverityBadge severity={rec.severity} />
        </div>
      </div>
      <div className="rec-card__body">
        <p className="rec-card__action">{rec.recommendedAction}</p>
        <p className="rec-card__reason">{rec.reason}</p>
        {rec.recommendedPlan && (
          <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            → {rec.recommendedPlan} · projected ${rec.projectedSpend.toFixed(0)}/mo
          </p>
        )}
      </div>
    </div>
  );
}

export default function AuditResults({ result }: { result: AuditResult }) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${result.id}`
      : `/share/${result.id}`;

  function copyShare() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const highSavings = result.totalMonthlySavings > 500;
  const lowSavings = result.totalMonthlySavings < 100;

  return (
    <section style={{ paddingBottom: 80, borderTop: "1.5px solid var(--border)", paddingTop: 60 }}>
      <div className="container">
        <p className="section-label" style={{ marginBottom: 24 }}>Your audit results</p>

        {/* ── Savings hero ── */}
        <div className="savings-hero fade-up">
          <p className="savings-hero__label">Potential monthly savings</p>
          <div className="savings-hero__amount">
            ${result.totalMonthlySavings > 0 ? result.totalMonthlySavings.toFixed(0) : "0"}
          </div>
          <p className="savings-hero__sub">
            Current spend: ${result.totalMonthlySpend.toFixed(0)}/mo → Optimized: ${result.totalProjectedSpend.toFixed(0)}/mo
          </p>
          {result.totalAnnualSavings > 0 && (
            <p className="savings-hero__annual">
              That&apos;s ${result.totalAnnualSavings.toFixed(0)} saved per year
            </p>
          )}
        </div>

        {/* ── AI Summary ── */}
        {result.aiSummary && (
          <div className="ai-summary fade-up fade-up-1">
            <p className="ai-summary__label">
              <span>✦</span> AI-generated analysis
            </p>
            <p>{result.aiSummary}</p>
          </div>
        )}

        {/* ── Per-tool breakdown ── */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--display)", fontSize: 20, marginBottom: 16 }}>
            Per-tool breakdown
          </h2>
          {result.recommendations.map((rec, i) => (
            <RecCard key={i} rec={rec} />
          ))}
        </div>

        {/* ── Credex CTA for high savings ── */}
        {highSavings && (
          <div className="credex-cta fade-up fade-up-2">
            <div>
              <h3>You qualify for a Credex consultation</h3>
              <p>
                At ${result.totalMonthlySavings.toFixed(0)}/mo in potential savings, Credex can source
                discounted AI credits — Cursor, Claude, ChatGPT Enterprise — from companies that
                overforecast. Real discounts, same product.
              </p>
            </div>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener"
              className="btn btn--acid"
              style={{ flexShrink: 0 }}
            >
              Book free consultation →
            </a>
          </div>
        )}

        {/* ── Share bar ── */}
        <div className="share-bar fade-up fade-up-3">
          <span className="share-bar__url">{shareUrl}</span>
          <button className="btn btn--outline btn--sm" onClick={copyShare}>
            {copied ? "✓ Copied" : "Copy link"}
          </button>
        </div>

        {/* ── Lead capture ── */}
        <LeadCaptureForm auditId={result.id} isOptimal={lowSavings} monthlySavings={result.totalMonthlySavings} />
      </div>
    </section>
  );
}
