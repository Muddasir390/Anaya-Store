import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { hasSupabase } from "./config";

/** Returns the Supabase client + admin user, or redirects to /admin/login. */
export async function requireAdmin() {
  if (!hasSupabase) redirect("/admin/login");
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const { data: row } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!row) redirect("/admin/login?error=not-admin");
  return { supabase, user: data.user };
}
