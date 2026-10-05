"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/types";

export default function SettingsForm({ s }: { s: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSettings, null);
  return (
    <form action={action} className="card mt-8 space-y-5 p-6 md:p-8">
      <div><label className="label" htmlFor="store_name">Store name</label><input id="store_name" name="store_name" defaultValue={s.store_name} className="input" /></div>
      <div>
        <label className="label" htmlFor="whatsapp_number">WhatsApp number (country code, digits only)</label>
        <input id="whatsapp_number" name="whatsapp_number" defaultValue={s.whatsapp_number} placeholder="923001234567" className="input" />
        <p className="mt-1 text-xs text-muted">Customers are sent here to confirm orders and chat with you.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="label" htmlFor="shipping_fee">Shipping fee</label><input id="shipping_fee" name="shipping_fee" type="number" min="0" step="0.01" defaultValue={s.shipping_fee} className="input" /></div>
        <div><label className="label" htmlFor="free_shipping_over">Free shipping over</label><input id="free_shipping_over" name="free_shipping_over" type="number" min="0" step="0.01" defaultValue={s.free_shipping_over} className="input" /></div>
      </div>
      <div><label className="label" htmlFor="announcement">Announcement bar text (blank to hide)</label><input id="announcement" name="announcement" defaultValue={s.announcement} className="input" /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="label" htmlFor="contact_email">Contact email</label><input id="contact_email" name="contact_email" type="email" defaultValue={s.contact_email} className="input" /></div>
        <div><label className="label" htmlFor="instagram">Instagram handle</label><input id="instagram" name="instagram" defaultValue={s.instagram} className="input" /></div>
      </div>
      {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      {state?.ok && <p className="text-sm text-ok" aria-live="polite">Saved ✓</p>}
      <button disabled={pending} className="btn btn-gold">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save settings"}</button>
    </form>
  );
}
