import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { join } from "path";
import { parseResumePDF } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfBase64 = Buffer.from(arrayBuffer).toString("base64");

    const portfolioData = await parseResumePDF(pdfBase64);

    const filePath = join(process.cwd(), "data", "portfolio.json");
    writeFileSync(filePath, JSON.stringify(portfolioData, null, 2));

    return NextResponse.json({ success: true, data: portfolioData });
  } catch (err) {
    console.error("parse-resume error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
