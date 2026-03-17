import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { fetchGitHubRepos } from "@/lib/github";
import Hero from "@/components/Hero";
import SkillBadges from "@/components/SkillBadges";
import ProjectGrid from "@/components/ProjectGrid";

export const revalidate = 3600;

export default async function UserPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const projects = await fetchGitHubRepos(profile.github_username || "");

  const portfolioData = {
    name: profile.name || "",
    title: profile.title || "",
    bio: profile.bio || "",
    skills: profile.skills || [],
    contact: {
      email: profile.contact_email || "",
      linkedin: profile.contact_linkedin || "",
      github: profile.contact_github || "",
    },
    avatar_url: profile.avatar_url || "",
  };

  return (
    <main>
      <Hero data={portfolioData} />
      <SkillBadges skills={portfolioData.skills} />
      <ProjectGrid projects={projects} />
      <footer className="max-w-4xl mx-auto px-6 py-8 text-center text-sm" style={{ color: "var(--muted)" }}>
        Built with <a href="/" style={{ color: "var(--accent)" }}>Portfol.io</a>
      </footer>
    </main>
  );
}
