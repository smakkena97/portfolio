"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const [username, setUsername] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const clean = username.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (clean.length < 3) {
      setError("Username must be at least 3 characters (letters, numbers, hyphens).");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/signin"); return; }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      username: clean,
      github_username: githubUsername.replace(/^https?:\/\/github\.com\//, "").trim(),
      contact_email: user.email ?? "",
    });

    if (upsertError) {
      setError(
        upsertError.message.includes("unique")
          ? "That username is already taken. Try another."
          : upsertError.message
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Set up your portfolio
          </h1>
          <p style={{ color: "var(--muted)" }}>Choose a username for your public URL.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--muted)" }}>
              Username
            </label>
            <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <span className="px-3 py-3 text-sm border-r" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
                yoursite.com/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                required
                className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
                style={{ color: "var(--foreground)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--muted)" }}>
              GitHub username <span style={{ color: "var(--muted)", fontWeight: 400 }}>(to show your repos)</span>
            </label>
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="github-username"
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold"
            style={{ background: "var(--accent)", color: "#0a0a0a", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Saving..." : "Create my portfolio"}
          </button>
        </form>
      </div>
    </main>
  );
}
