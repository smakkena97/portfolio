"use client";

import { useState } from "react";
import { THEMES, ThemeId, Theme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";

export default function ThemePicker({
  profileId,
  currentTheme,
}: {
  profileId: string;
  currentTheme: string;
}) {
  const [selected, setSelected] = useState<ThemeId>((currentTheme as ThemeId) || "dark");
  const [previewing, setPreviewing] = useState<ThemeId>((currentTheme as ThemeId) || "dark");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const previewTheme = THEMES.find((t) => t.id === previewing) ?? THEMES[0];

  async function saveTheme(id: ThemeId) {
    setSelected(id);
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase.from("profiles").update({ theme: id }).eq("id", profileId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex gap-4">
      {/* Theme options */}
      <div className="space-y-2 shrink-0 w-44">
        {THEMES.map((theme) => {
          const isSelected = selected === theme.id;
          const isPreviewing = previewing === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => saveTheme(theme.id)}
              onMouseEnter={() => setPreviewing(theme.id)}
              onMouseLeave={() => setPreviewing(selected)}
              className="w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all"
              style={{
                borderColor: isSelected ? "var(--accent)" : isPreviewing ? theme.vars.accent : "var(--border)",
                background: isPreviewing ? `${theme.vars.accent}15` : "var(--card)",
                opacity: saving ? 0.7 : 1,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: theme.vars.accent }} />
                <span className="text-xs font-medium">{theme.name}</span>
                {isSelected && (
                  <span className="ml-auto text-xs" style={{ color: "var(--accent)" }}>✓</span>
                )}
              </div>
            </button>
          );
        })}
        {saved && (
          <p className="text-xs pt-1" style={{ color: "#22c55e" }}>✓ Theme saved!</p>
        )}
      </div>

      {/* Live preview */}
      <div className="flex-1 rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
        <ThemePreview theme={previewTheme} />
      </div>
    </div>
  );
}

function ThemePreview({ theme }: { theme: Theme }) {
  const v = theme.vars;
  return (
    <div style={{ background: v.background, minHeight: 220, padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: v.accent, flexShrink: 0 }} />
        <div>
          <div style={{ color: v.accent, fontSize: 9, marginBottom: 2, fontFamily: "monospace" }}>Hi, my name is</div>
          <div style={{ color: v.foreground, fontSize: 13, fontWeight: 700 }}>Alex Chen</div>
          <div style={{ color: v.muted, fontSize: 10 }}>Full Stack Engineer</div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ color: v.muted, fontSize: 9, lineHeight: 1.5, marginBottom: 10, maxWidth: 220 }}>
        I build scalable web apps and love open source.
      </div>

      {/* Skills */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        {["TypeScript", "React", "Node.js"].map((s) => (
          <span
            key={s}
            style={{
              fontSize: 8,
              padding: "2px 6px",
              borderRadius: 999,
              border: `1px solid ${v.accent}`,
              color: v.accent,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Project cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {["open-saas", "fastapi-kit"].map((name) => (
          <div
            key={name}
            style={{
              background: v.card,
              border: `1px solid ${v.border}`,
              borderRadius: 6,
              padding: 6,
            }}
          >
            <div style={{ color: v.accent, fontSize: 8, fontWeight: 600, marginBottom: 2 }}>{name}</div>
            <div style={{ color: v.muted, fontSize: 7 }}>Open source project</div>
          </div>
        ))}
      </div>

      {/* Theme label */}
      <div style={{ marginTop: 10, textAlign: "center", color: v.muted, fontSize: 8 }}>
        {theme.name} — {theme.description}
      </div>
    </div>
  );
}
