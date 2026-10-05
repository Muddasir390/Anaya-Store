import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <AnnouncementBar text={settings.announcement} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <CartDrawer settings={settings} />
      <WhatsAppFab number={settings.whatsapp_number} />
    </>
  );
}
