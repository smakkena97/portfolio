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

export async function parseResumeText(resumeText: string): Promise<PortfolioData> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a resume parser. Extract the following information from the resume text below and return it as a valid JSON object with exactly this structure:

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
- For bio, write in third person or first person consistently, make it engaging
- For linkedin/github, include the full URL if available, otherwise empty string

Resume text:
${resumeText}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const parsed = JSON.parse(content.text) as PortfolioData;
  return parsed;
}
