import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.username) redirect("/dashboard/setup");

  const identitiesResult = await supabase.auth.getUserIdentities();
  const identities = identitiesResult.data?.identities;
  const hasGitHub = identities?.some((i) => i.provider === "github") ?? false;

  return <DashboardClient profile={profile} userEmail={user.email ?? ""} hasGitHub={hasGitHub} />;
}
