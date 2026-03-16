import { NextResponse } from "next/server";
import { fetchGitHubRepos } from "@/lib/github";

export async function GET() {
  try {
    const repos = await fetchGitHubRepos();
    return NextResponse.json(repos);
  } catch (err) {
    console.error("GitHub API error:", err);
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
  }
}
