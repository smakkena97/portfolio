"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { PortfolioData } from "@/lib/claude";

interface Profile {
  id: string;
  username: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  contact_email: string;
  contact_linkedin: string;
  contact_github: string;
  github_username: string;
  avatar_url: string;
}

export default function DashboardClient({
  profile,
  userEmail,
}: {
  profile: Profile;
  userEmail: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<PortfolioData | null>(null);
  const [copied, setCopied] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [savingAvatar, setSavingAvatar] = useState(false);
  const router = useRouter();

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.querySelector<HTMLInputElement>('input[type="file"]');
    const file = input?.files?.[0];
    if (!file) { setStatus("error"); setMessage("Please select a file."); return; }

    setStatus("loading");
    setMessage("Parsing with Claude AI...");
    setPreview(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("userId", profile.id);

    try {
      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) { setStatus("error"); setMessage(json.error || "Something went wrong."); return; }

      setStatus("success");
      setMessage("Resume parsed and saved!");
      setPreview(json.data);
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  async function saveAvatar() {
    setSavingAvatar(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", profile.id);
    setSavingAvatar(false);
    router.refresh();
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const portfolioUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${profile.username}`;

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Your portfolio:{" "}
            <a href={`/${profile.username}`} target="_blank" style={{ color: "var(--accent)" }}>
              {portfolioUrl}
            </a>
          </p>
        </div>
        <button onClick={signOut} className="text-sm px-3 py-1.5 rounded border" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
          Sign out
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile picture */}
        <section className="p-6 rounded-xl border space-y-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="font-semibold text-lg">Profile Picture</h2>
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" style={{ border: "2px solid var(--border)" }} />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--border)" }}>
                <span className="text-2xl">{(profile.name || userEmail)[0]?.toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1 space-y-2">
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Paste an image URL, or use your GitHub avatar: https://github.com/{profile.github_username || "username"}.png
              </p>
            </div>
          </div>
          <button
            onClick={saveAvatar}
            disabled={savingAvatar}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--accent)", color: "#0a0a0a", opacity: savingAvatar ? 0.6 : 1 }}
          >
            {savingAvatar ? "Saving..." : "Save photo"}
          </button>
        </section>

        {/* Resume upload */}
        <section className="p-6 rounded-xl border space-y-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="font-semibold text-lg">Upload Resume</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Upload your resume to auto-populate your name, bio, skills, and contact info.
          </p>
          <form onSubmit={handleUpload} className="space-y-3">
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="w-full text-sm"
              style={{ color: "var(--muted)" }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm"
              style={{ background: "var(--accent)", color: "#0a0a0a", opacity: status === "loading" ? 0.6 : 1 }}
            >
              {status === "loading" ? "Parsing..." : "Parse Resume"}
            </button>
          </form>

          {status === "error" && <p className="text-sm" style={{ color: "#ef4444" }}>{message}</p>}
          {status === "success" && (
            <p className="text-sm" style={{ color: "#22c55e" }}>{message}</p>
          )}

          {status === "success" && preview && (
            <div className="space-y-2 pt-2">
              <PreviewRow label="Name" value={preview.name} />
              <PreviewRow label="Title" value={preview.title} />
              <PreviewRow label="Bio" value={preview.bio} />
              <div>
                <span className="text-xs" style={{ color: "var(--muted)" }}>Skills: </span>
                <span className="text-sm">{preview.skills.join(", ")}</span>
              </div>
            </div>
          )}
        </section>

        {/* Current info */}
        <section className="p-6 rounded-xl border space-y-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="font-semibold text-lg">Current Portfolio Data</h2>
          <PreviewRow label="Name" value={profile.name} />
          <PreviewRow label="Title" value={profile.title} />
          <PreviewRow label="Bio" value={profile.bio} />
          <PreviewRow label="Skills" value={profile.skills?.join(", ")} />
          <PreviewRow label="GitHub repos" value={profile.github_username ? `@${profile.github_username}` : ""} />
          <div className="pt-2">
            <a
              href={`/${profile.username}`}
              target="_blank"
              className="text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              View my portfolio →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function PreviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="text-sm">
      <span style={{ color: "var(--muted)" }}>{label}: </span>
      <span>{value || <span style={{ color: "var(--border)" }}>—</span>}</span>
    </div>
  );
}
