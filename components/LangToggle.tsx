"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE } from "@/lib/i18n";
import { useT } from "./Locale";

export default function LangToggle({ className = "" }: { className?: string }) {
  const { locale, t } = useT();
  const router = useRouter();
  const next = locale === "en" ? "ur" : "en";
  return (
    <button
      onClick={() => {
        try {
          document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
        } catch {}
        router.refresh();
      }}
      aria-label={t("a.lang")}
      className={`flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-semibold transition hover:border-gold hover:text-gold ${className}`}
    >
      <Languages className="h-[18px] w-[18px]" />
      <span lang={next}>{t("lang.other")}</span>
    </button>
  );
}
