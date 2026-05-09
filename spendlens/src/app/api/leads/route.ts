import { NextRequest, NextResponse } from "next/server";
import { saveLead, getAudit } from "@/lib/store";
import { LeadData } from "@/types";

// Honeypot + simple rate limit
const recentSubmissions = new Map<string, number>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();

  // Rate limit: 5 submissions per IP per hour
  const lastSubmit = recentSubmissions.get(ip) ?? 0;
  if (now - lastSubmit < 60 * 1000) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }
  recentSubmissions.set(ip, now);

  try {
    const body = await req.json();

    // Honeypot: if bot_field is filled, silently ignore
    if (body.bot_field) {
      return NextResponse.json({ ok: true });
    }

    const { auditId, email, companyName, role, teamSize } = body;

    if (!auditId || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const audit = getAudit(auditId);
    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    const lead: LeadData = { auditId, email, companyName, role, teamSize };
    saveLead(lead);

    // Send confirmation email via Resend (graceful fallback if not configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "SpendLens <audit@spendlens.app>",
          to: email,
          subject: "Your AI Spend Audit Report",
          html: `
            <h2>Your AI Spend Audit is Ready</h2>
            <p>Here's a summary of what we found:</p>
            <ul>
              <li>Total monthly spend: <strong>$${audit.totalMonthlySpend.toFixed(0)}</strong></li>
              <li>Potential monthly savings: <strong>$${audit.totalMonthlySavings.toFixed(0)}</strong></li>
              <li>Potential annual savings: <strong>$${audit.totalAnnualSavings.toFixed(0)}</strong></li>
            </ul>
            ${audit.totalMonthlySavings > 500 ? `<p><strong>You qualify for a free Credex consultation.</strong> Reply to this email and we'll reach out within 24 hours.</p>` : ""}
            <p>View your full report: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/share/${auditId}">${process.env.NEXT_PUBLIC_BASE_URL}/share/${auditId}</a></p>
          `,
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ ok: true, shareUrl: `/share/${auditId}` });
  } catch (err) {
    console.error("Lead capture error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
