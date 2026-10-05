import Link from "next/link";
import { getT } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div className="container-x grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-arabic text-7xl text-gold">٤٠٤</p>
        <h1 className="mt-4 font-display text-5xl">{t("nf.title")}</h1>
        <p className="mt-3 text-muted">{t("nf.text")}</p>
        <Link href="/shop" className="btn btn-ink mt-8">{t("nf.back")}</Link>
      </div>
    </div>
  );
}
