import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Auto-save GitHub username if they just connected GitHub
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const identitiesResult = await supabase.auth.getUserIdentities();
        const identities = identitiesResult.data?.identities;
        const githubIdentity = identities?.find((i) => i.provider === "github");
        if (githubIdentity) {
          const githubUsername = githubIdentity.identity_data?.user_name as string | undefined;
          if (githubUsername) {
            await supabase.from("profiles").update({
              github_username: githubUsername,
              avatar_url: githubIdentity.identity_data?.avatar_url ?? undefined,
            }).eq("id", user.id).is("github_username", null);
            // Only auto-fill if not already set (don't overwrite manual entry)
          }
        }
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/signin?error=auth`);
}
