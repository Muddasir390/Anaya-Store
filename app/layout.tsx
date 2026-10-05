import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Amiri } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { SITE_URL } from "@/lib/config";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic"], weight: ["400", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Anaya — Modern Abayas, Crafted with Grace",
    template: "%s · Anaya Abayas",
  },
  description:
    "Discover Anaya's collection of premium abayas — everyday, occasion and embroidered designs. Order online, confirm on WhatsApp, delivered to your door.",
  openGraph: { type: "website", siteName: "Anaya Abayas" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f0e6" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

// Runs before first paint so there is no light/dark flash.
const themeScript = `(function(){try{var t=localStorage.getItem('anaya.theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${manrope.variable} ${cormorant.variable} ${amiri.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
