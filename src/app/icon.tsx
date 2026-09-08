import { ImageResponse } from "next/og";
import { getWebsiteSetting } from "@/lib/cms-data";

export const runtime = "nodejs";
export const size = {
  width: 32,
  height: 32
};
export const contentType = "image/png";

export default async function Icon() {
  const setting = await getWebsiteSetting();
  const initial = (setting.siteName ? setting.siteName.trim().charAt(0) : "R").toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: "#2563eb",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "8px",
          fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        {initial}
      </div>
    ),
    {
      ...size
    }
  );
}
