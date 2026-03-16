import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import SkillBadges from "@/components/SkillBadges";
import { fetchGitHubRepos } from "@/lib/github";
import portfolioData from "@/data/portfolio.json";

export const revalidate = 3600;

export default async function Page() {
  const projects = await fetchGitHubRepos();

  return (
    <main>
      <div className="max-w-4xl mx-auto px-6 pt-6 pb-2 flex justify-end">
        <a
          href="/admin"
          className="text-xs px-3 py-1 rounded border transition-colors"
          style={{ color: "var(--muted)", borderColor: "var(--border)" }}
        >
          Admin
        </a>
      </div>
      <Hero data={portfolioData} />
      <SkillBadges skills={portfolioData.skills} />
      <ProjectGrid projects={projects} />
      <footer
        className="max-w-4xl mx-auto px-6 py-8 text-center text-sm"
        style={{ color: "var(--muted)" }}
      >
        Built with Next.js &amp; Claude AI
      </footer>
    </main>
  );
}
