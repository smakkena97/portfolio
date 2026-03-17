import Anthropic from "@anthropic-ai/sdk";

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
}

const client = new Anthropic();

const PARSE_PROMPT = `You are a resume parser. Extract the following information and return it as a valid JSON object with exactly this structure:

{
  "name": "Full name",
  "title": "Professional title or current role",
  "bio": "A 2-3 sentence professional summary suitable for a portfolio website",
  "skills": ["skill1", "skill2", "skill3"],
  "contact": {
    "email": "email@example.com",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username"
  }
}

Rules:
- Return ONLY the JSON object, no markdown, no explanation
- If a field is not found, use an empty string "" or empty array []
- For skills, include programming languages, frameworks, tools, and technologies
- For bio, write in first person, make it engaging
- For linkedin/github, include the full URL if available, otherwise empty string`;

export async function parseResumePDF(pdfBase64: string): Promise<PortfolioData> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: pdfBase64,
            },
          },
          { type: "text", text: PARSE_PROMPT },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response from Claude");
  return JSON.parse(content.text) as PortfolioData;
}

export async function parseResumeText(resumeText: string): Promise<PortfolioData> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `${PARSE_PROMPT}\n\nResume text:\n${resumeText}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response from Claude");
  return JSON.parse(content.text) as PortfolioData;
}
