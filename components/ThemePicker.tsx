"use client";

import { useState } from "react";
import { THEMES, ThemeId } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";

export default function ThemePicker({
  profileId,
  currentTheme,
}: {
  profileId: string;
  currentTheme: string;
}) {
  const [selected, setSelected] = useState<ThemeId>(currentTheme as ThemeId || "dark");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((theme) => {
          const isSelected = selected === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => saveTheme(theme.id)}
              className="text-left rounded-xl border-2 overflow-hidden transition-all"
              style={{
                borderColor: isSelected ? "var(--accent)" : "var(--border)",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {/* Mini preview */}
              <div
                className="p-3 space-y-1.5"
                style={{ background: theme.vars.background }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full" style={{ background: theme.vars.accent }} />
                  <div className="h-2 rounded w-16" style={{ background: theme.vars.foreground, opacity: 0.8 }} />
                </div>
                <div className="h-1.5 rounded w-24" style={{ background: theme.vars.muted, opacity: 0.5 }} />
                <div className="h-1.5 rounded w-20" style={{ background: theme.vars.muted, opacity: 0.4 }} />
                <div className="flex gap-1.5 pt-1">
                  <div className="h-5 rounded w-12" style={{ background: theme.vars.card, border: `1px solid ${theme.vars.border}` }} />
                  <div className="h-5 rounded w-12" style={{ background: theme.vars.card, border: `1px solid ${theme.vars.border}` }} />
                </div>
              </div>
              {/* Label */}
              <div className="px-3 py-2" style={{ background: "var(--card)" }}>
                <p className="text-xs font-semibold">{theme.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{theme.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      {saved && (
        <p className="text-sm" style={{ color: "#22c55e" }}>Theme saved!</p>
      )}
    </div>
  );
}
