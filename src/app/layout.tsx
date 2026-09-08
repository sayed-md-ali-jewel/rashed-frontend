import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingBookButton } from "@/components/layout/floating-book-button";
import { getWebsiteSetting } from "@/lib/cms-data";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getWebsiteSetting();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: setting.defaultSeo?.seoTitle ?? setting.siteName,
      template: `%s | ${setting.siteName}`
    },
    description: setting.defaultSeo?.metaDescription ?? setting.footerDescription,
    openGraph: {
      siteName: setting.siteName,
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image"
    },
    icons: {
      icon: setting.favicon || "/favicon.ico",
      apple: setting.appleTouchIcon || setting.favicon || "/apple-touch-icon.png"
    }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const setting = await getWebsiteSetting();

  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased bg-white text-[#141414] selection:bg-[#ffc200] selection:text-[#141414]">
        <SiteHeader setting={setting} />
        <div className="min-h-screen">{children}</div>
        <FloatingBookButton />
        <SiteFooter setting={setting} />
      </body>
    </html>
  );
}
