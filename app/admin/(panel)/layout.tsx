import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { user } = await requireAdmin();
  return (
    <div className="min-h-dvh">
      <AdminNav email={user.email ?? ""} />
      <main className="p-4 md:p-8 lg:ml-64">{children}</main>
    </div>
  );
}
