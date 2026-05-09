"use client";
import { useState } from "react";

interface Props {
  auditId: string;
  isOptimal: boolean;
  monthlySavings: number;
}

export default function LeadCaptureForm({ auditId, isOptimal, monthlySavings }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [botField, setBotField] = useState(""); // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email) { setError("Email is required."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId, email, companyName: company, role, bot_field: botField }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="lead-form" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <h3>Report sent!</h3>
        <p style={{ marginTop: 8 }}>
          Check your inbox for a copy of this audit.{" "}
          {monthlySavings > 500 && "Our team will reach out within 24 hours to discuss Credex credits."}
        </p>
      </div>
    );
  }

  return (
    <div className={`lead-form ${monthlySavings > 500 ? "lead-form--highlight" : ""}`}>
      {isOptimal ? (
        <>
          <h3>Stay in the loop</h3>
          <p>
            You&apos;re spending well right now. Drop your email and we&apos;ll notify you when new
            optimizations apply to your stack.
          </p>
        </>
      ) : (
        <>
          <h3>Get a copy of your report</h3>
          <p>
            We&apos;ll email you the full audit breakdown.
            {monthlySavings > 500 && " Our team will also reach out about Credex credits — same AI tools, lower price."}
          </p>
        </>
      )}

      {/* Honeypot - hidden from real users */}
      <div style={{ position: "absolute", left: "-9999px", visibility: "hidden" }}>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={botField}
          onChange={(e) => setBotField(e.target.value)}
          placeholder="Leave this blank"
        />
      </div>

      <div className="form-grid" style={{ marginBottom: 16 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="label">Work email *</label>
          <input
            type="email"
            className="input"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Company name</label>
          <input
            type="text"
            className="input"
            placeholder="Acme Inc."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Your role</label>
          <input
            type="text"
            className="input"
            placeholder="CTO, Eng Manager, etc."
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p style={{ color: "var(--red)", fontSize: 13, marginBottom: 12 }}>{error}</p>
      )}

      <button
        className="btn btn--primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <><span className="spinner" /> Sending…</> : isOptimal ? "Notify me →" : "Email me the report →"}
      </button>

      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
        No spam. Unsubscribe any time. We don&apos;t sell data.
      </p>
    </div>
  );
}
