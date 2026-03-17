import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { join } from "path";
import { parseResumePDF, parseResumeText } from "@/lib/claude";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File must be a PDF or Word document (.docx)" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let portfolioData;

    if (file.type === "application/pdf") {
      const pdfBase64 = buffer.toString("base64");
      portfolioData = await parseResumePDF(pdfBase64);
    } else {
      // Word document — extract text with mammoth
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value;

      if (!text || text.trim().length < 50) {
        return NextResponse.json(
          { error: "Could not extract text from the Word document." },
          { status: 400 }
        );
      }

      portfolioData = await parseResumeText(text);
    }

    // Try to write to disk (works locally, skipped on Vercel read-only fs)
    let savedLocally = false;
    try {
      const filePath = join(process.cwd(), "data", "portfolio.json");
      writeFileSync(filePath, JSON.stringify(portfolioData, null, 2));
      savedLocally = true;
    } catch {
      // Read-only filesystem (e.g. Vercel) — return data for manual save
    }

    return NextResponse.json({ success: true, savedLocally, data: portfolioData });
  } catch (err) {
    console.error("parse-resume error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
