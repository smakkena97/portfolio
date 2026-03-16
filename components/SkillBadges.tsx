interface SkillBadgesProps {
  skills: string[];
}

export default function SkillBadges({ skills }: SkillBadgesProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        Skills & Technologies
      </h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-full text-sm font-medium border"
            style={{
              borderColor: "var(--accent)",
              color: "var(--accent)",
              background: "rgba(0, 188, 212, 0.08)",
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
