import { NextRequest, NextResponse } from "next/server";
import { parseResumePDF, parseResumeText } from "@/lib/claude";
import { createClient } from "@/lib/supabase/server";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    if (!ACCEPTED_TYPES.includes(file.type))
      return NextResponse.json({ error: "File must be a PDF or Word document (.docx)" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let portfolioData;
    if (file.type === "application/pdf") {
      portfolioData = await parseResumePDF(buffer.toString("base64"));
    } else {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      if (!result.value || result.value.trim().length < 50)
        return NextResponse.json({ error: "Could not extract text from the Word document." }, { status: 400 });
      portfolioData = await parseResumeText(result.value);
    }

    // Save to database if userId provided
    if (userId) {
      const supabase = await createClient();
      await supabase.from("profiles").update({
        name: portfolioData.name,
        title: portfolioData.title,
        bio: portfolioData.bio,
        skills: portfolioData.skills,
        contact_email: portfolioData.contact.email,
        contact_linkedin: portfolioData.contact.linkedin,
        contact_github: portfolioData.contact.github,
        updated_at: new Date().toISOString(),
      }).eq("id", userId);
    }

    return NextResponse.json({ success: true, data: portfolioData });
  } catch (err) {
    console.error("parse-resume error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
