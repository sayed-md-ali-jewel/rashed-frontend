import type { MetadataRoute } from "next";
import { getWebsiteSetting } from "@/lib/cms-data";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const setting = await getWebsiteSetting();

  return {
    name: setting.siteName,
    short_name: setting.siteName,
    description: setting.defaultSeo?.metaDescription ?? setting.footerDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffc200",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
