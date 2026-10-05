"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Settings, ShoppingBag, Tags, ExternalLink } from "lucide-react";
import Logo from "../Logo";
import ThemeToggle from "../ThemeToggle";
import { signOut } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminNav({ email }: { email: string }) {
  const path = usePathname();
  return (
    <aside className="border-b border-line bg-surface lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between p-4 lg:flex-col lg:items-start lg:gap-8 lg:p-6">
        <div className="flex w-full items-center justify-between">
          <Logo href="/admin" />
          <div className="lg:hidden"><ThemeToggle /></div>
        </div>
        <nav className="flex gap-1 overflow-x-auto max-lg:hidden lg:w-full lg:flex-col" aria-label="Admin">
          {LINKS.map((l) => <NavLink key={l.href} l={l} path={path} />)}
        </nav>
      </div>
      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:hidden" aria-label="Admin">
        {LINKS.map((l) => <NavLink key={l.href} l={l} path={path} />)}
      </nav>
      <div className="hidden space-y-3 p-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
        <div className="flex items-center justify-between"><span className="truncate text-xs text-muted">{email}</span><ThemeToggle /></div>
        <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-muted hover:text-fg"><ExternalLink className="h-4 w-4" /> View store</Link>
        <form action={signOut}><button className="flex items-center gap-2 text-sm text-muted hover:text-danger"><LogOut className="h-4 w-4" /> Sign out</button></form>
      </div>
    </aside>
  );
}

function NavLink({ l, path }: { l: (typeof LINKS)[number]; path: string }) {
  const active = l.exact ? path === l.href : path.startsWith(l.href);
  return (
    <Link href={l.href} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${active ? "bg-gold text-on-gold" : "text-muted hover:bg-surface-2 hover:text-fg"}`}>
      <l.icon className="h-4 w-4" /> {l.label}
    </Link>
  );
}
