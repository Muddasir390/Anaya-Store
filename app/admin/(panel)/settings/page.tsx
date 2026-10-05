import { requireAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/data";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-4xl font-semibold">Store settings</h1>
      <SettingsForm s={s} />
    </div>
  );
}
