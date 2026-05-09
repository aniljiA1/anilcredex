import { NextRequest, NextResponse } from "next/server";
import { getAudit, publicAudit } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const audit = getAudit(params.id);
  if (!audit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(publicAudit(audit));
}
