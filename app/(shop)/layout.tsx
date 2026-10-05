import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollExtras from "@/components/ScrollExtras";
import { LocaleProvider } from "@/components/Locale";
import { getSettings } from "@/lib/data";
import { getT } from "@/lib/i18n/server";
import { loc } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: LayoutProps<"/">) {
  const [settings, { locale, dir }] = await Promise.all([getSettings(), getT()]);
  return (
    <LocaleProvider locale={locale}>
      <div lang={locale} dir={dir} className={`flex min-h-dvh flex-1 flex-col ${locale === "ur" ? "ur" : ""}`}>
        <AnnouncementBar text={loc(settings, "announcement", locale)} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <CartDrawer settings={settings} />
        <WhatsAppFab number={settings.whatsapp_number} />
        <ScrollExtras />
      </div>
    </LocaleProvider>
  );
}
