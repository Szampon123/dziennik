import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { UserMenu } from "@/components/UserMenu";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { getLocale } from "@/lib/i18n/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Dziennik",
  description: "Osobisty dziennik dnia — intencje, notatki, refleksje.",
};

// Applies the saved (or system) theme before first paint to avoid a flash.
// Mirrors applyTheme() in src/lib/theme.ts — keep the two in sync.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var r=document.documentElement;r.classList.remove("dark");r.removeAttribute("data-theme");if(t==="dark"){r.classList.add("dark");}else if(t==="colorful"){r.setAttribute("data-theme","colorful");}else if(t==="custom"){r.setAttribute("data-theme","custom");try{var c=JSON.parse(localStorage.getItem("customTheme")||"{}");for(var k in c){if(c[k])r.style.setProperty(k,c[k]);}}catch(e){}}else if(t!=="light"){if(window.matchMedia("(prefers-color-scheme: dark)").matches)r.classList.add("dark");}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale}>
          <Nav userMenu={<UserMenu />} />
          <main className="mx-auto w-full max-w-[760px] flex-1 px-6 py-12">{children}</main>
        </I18nProvider>
      </body>
    </html>
  );
}
