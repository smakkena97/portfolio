import { NextResponse } from "next/server";
import { fetchGitHubRepos } from "@/lib/github";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") ?? "";
    const repos = await fetchGitHubRepos(username);
    return NextResponse.json(repos);
  } catch (err) {
    console.error("GitHub API error:", err);
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
  }
}
