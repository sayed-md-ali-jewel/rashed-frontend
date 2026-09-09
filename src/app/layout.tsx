import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingBookButton } from "@/components/layout/floating-book-button";
import { ChunkErrorHandler } from "@/components/layout/chunk-error-handler";
import { getWebsiteSetting } from "@/lib/cms-data";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getWebsiteSetting();
  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? "https://drrashed.bd" : "http://localhost:3000");
  const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
    ? rawSiteUrl
    : `https://${rawSiteUrl}`;

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
      <head>
        {/* Service Worker and Cache Buster for legacy PWA / Strapi caches */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Clear obsolete service workers and caches
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var i = 0; i < registrations.length; i++) {
                      registrations[i].unregister();
                    }
                  });
                  if ('caches' in window) {
                    caches.keys().then(function(names) {
                      for (var i = 0; i < names.length; i++) {
                        caches.delete(names[i]);
                      }
                    });
                  }
                }

                // Global Early ChunkLoadError Interceptor
                function isChunkErr(err) {
                  if (!err) return false;
                  var msg = (typeof err === 'string' ? err : '') || err.message || err.name || '';
                  return msg.indexOf('ChunkLoadError') !== -1 ||
                         msg.indexOf('Loading chunk') !== -1 ||
                         msg.indexOf('Failed to fetch dynamically imported module') !== -1 ||
                         msg.indexOf('CSS chunk load failed') !== -1;
                }

                function reloadOnChunkError() {
                  try {
                    var lastReload = parseInt(sessionStorage.getItem('chunk_early_reload') || '0', 10);
                    var now = Date.now();
                    if (now - lastReload > 12000) {
                      sessionStorage.setItem('chunk_early_reload', now.toString());
                      window.location.reload();
                    }
                  } catch(e) {
                    window.location.reload();
                  }
                }

                window.addEventListener('error', function(e) {
                  if (isChunkErr(e.error) || isChunkErr(e.message)) {
                    reloadOnChunkError();
                  }
                });

                window.addEventListener('unhandledrejection', function(e) {
                  if (isChunkErr(e.reason)) {
                    reloadOnChunkError();
                  }
                });
              })();
            `
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-[#141414] selection:bg-[#ffc200] selection:text-[#141414]">
        <ChunkErrorHandler />
        <SiteHeader setting={setting} />
        <div className="min-h-screen">{children}</div>
        <FloatingBookButton />
        <SiteFooter setting={setting} />
      </body>
    </html>
  );
}
