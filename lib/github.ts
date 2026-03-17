export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  fork: boolean;
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  if (!username) return [];

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=public`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "portfolio-site",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    console.error(`GitHub API error: ${res.status}`);
    return [];
  }

  const repos: GitHubRepo[] = await res.json();
  return repos.filter((r) => !r.fork);
}
