import { GitHubRepo } from "@/lib/github";

interface ProjectGridProps {
  projects: GitHubRepo[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Ruby: "#701516",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
};

export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
          GitHub Projects
        </h2>
        <p style={{ color: "var(--muted)" }}>
          No projects found. Make sure GITHUB_USERNAME is set.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        GitHub Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 rounded-xl border transition-all"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className="font-semibold text-base truncate"
                style={{ color: "var(--accent)" }}
              >
                {repo.name}
              </h3>
              {repo.stargazers_count > 0 && (
                <span
                  className="flex items-center gap-1 text-sm shrink-0"
                  style={{ color: "var(--muted)" }}
                >
                  <StarIcon />
                  {repo.stargazers_count}
                </span>
              )}
            </div>

            {repo.description && (
              <p
                className="text-sm mb-3 line-clamp-2"
                style={{ color: "var(--muted)" }}
              >
                {repo.description}
              </p>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              {repo.language && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{
                      background: LANGUAGE_COLORS[repo.language] ?? "#8b949e",
                    }}
                  />
                  {repo.language}
                </span>
              )}
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0, 188, 212, 0.1)",
                    color: "var(--accent)",
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
