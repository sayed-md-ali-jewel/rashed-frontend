import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingBookButton } from "@/components/layout/floating-book-button";
import { ChunkErrorHandler } from "@/components/layout/chunk-error-handler";
import { LanguageProvider } from "@/context/language-context";
import { getWebsiteSetting } from "@/lib/cms-data";
import type { Language } from "@/lib/i18n/translations";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getWebsiteSetting();
  const rawSiteUrl =
    setting.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? "https://drrashed.bd" : "http://localhost:3000");
  const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
    ? rawSiteUrl.replace(/\/+$/, "")
    : `https://${rawSiteUrl.replace(/\/+$/, "")}`;

  const isIndexingAllowed = setting.allowIndexing !== false && !setting.defaultSeo?.noIndex;

  const verificationOther: Record<string, string> = {};
  if (setting.bingVerification) {
    verificationOther["msvalidate.01"] = setting.bingVerification;
  }
  if (setting.facebookDomainVerification) {
    verificationOther["facebook-domain-verification"] = setting.facebookDomainVerification;
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: setting.defaultSeo?.seoTitle ?? setting.siteName,
      template: `%s | ${setting.siteName}`
    },
    description: setting.defaultSeo?.metaDescription ?? setting.footerDescription,
    keywords: setting.defaultSeo?.focusKeyword ? [setting.defaultSeo.focusKeyword] : undefined,
    alternates: {
      canonical: setting.defaultSeo?.canonicalUrl || siteUrl
    },
    verification: {
      google: setting.googleSearchConsoleVerification || undefined,
      yandex: setting.yandexVerification || undefined,
      other: Object.keys(verificationOther).length > 0 ? verificationOther : undefined
    },
    robots: {
      index: isIndexingAllowed,
      follow: isIndexingAllowed,
      googleBot: {
        index: isIndexingAllowed,
        follow: isIndexingAllowed
      }
    },
    openGraph: {
      siteName: setting.siteName,
      locale: "en_US",
      type: "website",
      title: setting.defaultSeo?.ogTitle || setting.defaultSeo?.seoTitle || setting.siteName,
      description: setting.defaultSeo?.ogDescription || setting.defaultSeo?.metaDescription || setting.footerDescription,
      images: setting.defaultSeo?.ogImage ? [{ url: setting.defaultSeo.ogImage }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: setting.defaultSeo?.twitterTitle || setting.defaultSeo?.ogTitle || setting.defaultSeo?.seoTitle || setting.siteName,
      description: setting.defaultSeo?.twitterDescription || setting.defaultSeo?.ogDescription || setting.defaultSeo?.metaDescription || setting.footerDescription,
      images: setting.defaultSeo?.twitterImage || setting.defaultSeo?.ogImage
        ? [setting.defaultSeo?.twitterImage || setting.defaultSeo?.ogImage || ""]
        : undefined
    },
    icons: {
      icon: setting.favicon || "/favicon.ico",
      apple: setting.appleTouchIcon || setting.favicon || "/apple-touch-icon.png"
    }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const setting = await getWebsiteSetting();
  const cookieStore = await cookies();
  const savedLang = cookieStore.get("site_lang")?.value;
  const initialLang: Language = savedLang === "en" ? "en" : "bn";

  return (
    <html
      lang={initialLang}
      data-lang={initialLang}
      className={`${poppins.variable} ${initialLang === "bn" ? "lang-bn" : "lang-en"}`}
    >
      <head>
        {/* Preload Kalpurush Bengali Font */}
        <link
          rel="preload"
          href="/fonts/kalpurush.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

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

        {/* Google Tag Manager Snippet if configured */}
        {setting.googleTagManagerId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${setting.googleTagManagerId}');
              `
            }}
          />
        )}

        {/* Custom Header Script Snippet if configured */}
        {setting.customHeadScript && (
          <script
            dangerouslySetInnerHTML={{
              __html: setting.customHeadScript
            }}
          />
        )}
      </head>
      <body className="font-sans antialiased bg-white text-[#141414] selection:bg-[#ffc200] selection:text-[#141414]">
        <LanguageProvider initialLanguage={initialLang}>
          {/* Google Tag Manager (noscript) */}
          {setting.googleTagManagerId && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${setting.googleTagManagerId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          )}

          {/* Google Analytics 4 (gtag.js) */}
          {setting.googleAnalyticsId && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${setting.googleAnalyticsId}`}
              />
              <Script
                id="google-analytics-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${setting.googleAnalyticsId}', {
                      page_path: window.location.pathname,
                    });
                  `
                }}
              />
            </>
          )}

          <ChunkErrorHandler />
          <SiteHeader setting={setting} />
          <div className="min-h-screen">{children}</div>
          <FloatingBookButton />
          <SiteFooter setting={setting} />
        </LanguageProvider>
      </body>
    </html>
  );
}
