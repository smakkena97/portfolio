export type ThemeId = "dark" | "minimal" | "colorful" | "professional";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  vars: {
    background: string;
    foreground: string;
    card: string;
    accent: string;
    muted: string;
    border: string;
  };
  font: string;
}

export const THEMES: Theme[] = [
  {
    id: "dark",
    name: "Dark & Bold",
    description: "Dark background, vibrant cyan accent. Popular for developers.",
    font: "font-mono",
    vars: {
      background: "#0a0a0a",
      foreground: "#e0e0e0",
      card: "#111827",
      accent: "#00bcd4",
      muted: "#6b7280",
      border: "#1f2937",
    },
  },
  {
    id: "minimal",
    name: "Minimal & Clean",
    description: "Lots of whitespace, simple typography. Lets your work speak.",
    font: "font-sans",
    vars: {
      background: "#ffffff",
      foreground: "#111111",
      card: "#f9fafb",
      accent: "#2563eb",
      muted: "#6b7280",
      border: "#e5e7eb",
    },
  },
  {
    id: "colorful",
    name: "Colorful & Creative",
    description: "Gradients, bold colors, expressive layout. Great for designers.",
    font: "font-sans",
    vars: {
      background: "#0f0a1e",
      foreground: "#f0e6ff",
      card: "#1a1035",
      accent: "#a855f7",
      muted: "#9d8ec4",
      border: "#2d1f4e",
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Clean, structured, resume-like. Best for traditional industries.",
    font: "font-serif",
    vars: {
      background: "#f8f7f4",
      foreground: "#1a1a1a",
      card: "#ffffff",
      accent: "#1e3a5f",
      muted: "#555555",
      border: "#d1cfc9",
    },
  },
];

export function getTheme(id?: string | null): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
