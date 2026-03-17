"use client";

import { useState, useRef } from "react";
import { PortfolioData } from "@/lib/claude";

export default function AdminPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<PortfolioData | null>(null);
  const [savedLocally, setSavedLocally] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setStatus("error");
      setMessage("Please select a file.");
      return;
    }

    setStatus("loading");
    setMessage("Parsing resume with Claude AI...");
    setPreview(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setSavedLocally(json.savedLocally);
      setMessage(
        json.savedLocally
          ? "Resume parsed and saved to portfolio.json!"
          : "Resume parsed! Follow the steps below to save your data."
      );
      setPreview(json.data as PortfolioData);
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  function copyJSON() {
    if (!preview) return;
    navigator.clipboard.writeText(JSON.stringify(preview, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main
      className="min-h-screen p-8 max-w-2xl mx-auto"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <h1 className="text-3xl font-bold mb-2">Resume Parser</h1>
      <p className="mb-8" style={{ color: "var(--muted)" }}>
        Upload your resume to auto-populate your portfolio data.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer"
          style={{ borderColor: "var(--border)" }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const name = e.target.files?.[0]?.name;
              if (name) setMessage(`Selected: ${name}`);
            }}
          />
          <p className="text-lg mb-2">Click to select a file</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            PDF or Word document (.docx) — parsed by Claude AI
          </p>
        </div>

        {message && status === "idle" && (
          <p style={{ color: "var(--muted)" }}>{message}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 px-6 rounded-lg font-semibold"
          style={{
            background: "var(--accent)",
            color: "#0a0a0a",
            opacity: status === "loading" ? 0.6 : 1,
            cursor: status === "loading" ? "not-allowed" : "pointer",
          }}
        >
          {status === "loading" ? "Parsing..." : "Parse Resume"}
        </button>
      </form>

      {status === "error" && (
        <div
          className="mt-6 p-4 rounded-lg border"
          style={{ borderColor: "#ef4444", color: "#ef4444", background: "rgba(239,68,68,0.1)" }}
        >
          {message}
        </div>
      )}

      {status === "success" && preview && (
        <div className="mt-8 space-y-4">
          <div
            className="p-4 rounded-lg border"
            style={{ borderColor: "#22c55e", background: "rgba(34,197,94,0.1)", color: "#22c55e" }}
          >
            {message}
          </div>

          {/* Preview */}
          <div
            className="p-6 rounded-xl border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <h2 className="text-xl font-semibold mb-4">Extracted Data</h2>
            <dl className="space-y-3">
              <Field label="Name" value={preview.name} />
              <Field label="Title" value={preview.title} />
              <Field label="Bio" value={preview.bio} />
              <Field label="Email" value={preview.contact?.email} />
              <Field label="GitHub" value={preview.contact?.github} />
              <Field label="LinkedIn" value={preview.contact?.linkedin} />
              <div>
                <dt className="text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>Skills</dt>
                <dd className="flex flex-wrap gap-2">
                  {preview.skills?.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full text-sm border"
                      style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* If on Vercel (read-only fs), show manual save instructions */}
          {!savedLocally && (
            <div
              className="p-6 rounded-xl border space-y-3"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <h2 className="text-lg font-semibold">Save to your portfolio</h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Copy the JSON below, paste it into{" "}
                <code className="font-mono" style={{ color: "var(--accent)" }}>data/portfolio.json</code>{" "}
                on your computer, then run:
              </p>
              <pre
                className="text-xs p-3 rounded-lg overflow-auto"
                style={{ background: "#0a0a0a", color: "var(--muted)" }}
              >
                {`git add data/portfolio.json\ngit commit -m "Update portfolio data"\ngit push`}
              </pre>
              <button
                onClick={copyJSON}
                className="w-full py-2 px-4 rounded-lg font-semibold text-sm"
                style={{ background: "var(--accent)", color: "#0a0a0a" }}
              >
                {copied ? "Copied!" : "Copy JSON"}
              </button>
              <pre
                className="text-xs p-3 rounded-lg overflow-auto max-h-48"
                style={{ background: "#0a0a0a", color: "var(--muted)" }}
              >
                {JSON.stringify(preview, null, 2)}
              </pre>
            </div>
          )}

          {savedLocally && (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Visit{" "}
              <a href="/" style={{ color: "var(--accent)" }}>the homepage</a>{" "}
              to see your portfolio.
            </p>
          )}
        </div>
      )}
    </main>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-sm font-medium" style={{ color: "var(--muted)" }}>{label}</dt>
      <dd>{value || <span style={{ color: "var(--muted)" }}>—</span>}</dd>
    </div>
  );
}
