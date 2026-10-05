"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" className="input" /></div>
      <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input" /></div>
      {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      <button disabled={pending} className="btn btn-gold w-full">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}</button>
    </form>
  );
}
