import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { hasSupabase } from "@/lib/config";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function AdminLogin({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  return (
    <div className="relative grid min-h-dvh place-items-center p-6">
      <div className="absolute right-5 top-5"><ThemeToggle /></div>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card p-8">
          <h1 className="font-display text-3xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Manage orders and products.</p>
          {!hasSupabase && <p className="mt-4 rounded-xl border border-gold/50 bg-gold-soft/40 p-3 text-xs">Supabase isn&apos;t connected yet. Add your keys to <code>.env.local</code> (see SETUP.md), then restart.</p>}
          {sp.error === "not-admin" && <p className="mt-4 rounded-xl bg-danger/10 p-3 text-xs text-danger">That account isn&apos;t an admin.</p>}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
