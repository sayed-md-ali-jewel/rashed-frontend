import { ImageResponse } from "next/og";
import { getScheduleBySlug, getWebsiteSetting } from "@/lib/cms-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const schedule = await getScheduleBySlug(slug);
  const setting = await getWebsiteSetting();

  const displayTitle = schedule?.title || schedule?.hospital?.name || "Consultation Schedule";
  const hospitalName = schedule?.hospital?.name || setting.siteName;
  const hospitalAddress = schedule?.hospital?.address || setting.contactAddress || "Chamber Address";
  const sessionDate = schedule?.startsAt ? formatDateTime(schedule.startsAt) : "Upcoming Session";
  const fee = schedule?.fee ? formatCurrency(schedule.fee) : "BDT 1,000";
  const duration = `${schedule?.slotDurationMinutes || 10} Mins / Slot`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fffaf6",
          padding: "50px 60px",
          fontFamily: "sans-serif"
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#2196f3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: 900
              }}
            >
              +
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "22px", fontWeight: 800, color: "#141414", letterSpacing: "-0.5px" }}>
                {setting.siteName || "Dr. Rashed"}
              </span>
              <span style={{ fontSize: "14px", color: "#5b5b5b", fontWeight: 500 }}>
                Specialist Consultation & Serial Booking
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #ece7df",
              borderRadius: "9999px",
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#141414"
            }}
          >
            Verified Chamber Slot
          </div>
        </div>

        {/* Main Schedule Card Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1.5px solid #ece7df",
            padding: "36px 40px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#2196f3", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            {hospitalName}
          </span>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: 900,
              color: "#141414",
              marginTop: "8px",
              marginBottom: "12px",
              lineHeight: 1.15,
              letterSpacing: "-1px"
            }}
          >
            {displayTitle}
          </h1>
          <p style={{ fontSize: "18px", color: "#5b5b5b", margin: 0 }}>
            {hospitalAddress}
          </p>

          {/* Details Row */}
          <div style={{ display: "flex", gap: "16px", marginTop: "28px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f3f5f8",
                border: "1px solid #ece7df",
                borderRadius: "16px",
                padding: "14px 20px",
                flex: 1
              }}
            >
              <span style={{ fontSize: "12px", color: "#5b5b5b", fontWeight: 600, textTransform: "uppercase" }}>Session Starts</span>
              <span style={{ fontSize: "18px", color: "#141414", fontWeight: 800, marginTop: "4px" }}>{sessionDate}</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f3f5f8",
                border: "1px solid #ece7df",
                borderRadius: "16px",
                padding: "14px 20px",
                flex: 1
              }}
            >
              <span style={{ fontSize: "12px", color: "#5b5b5b", fontWeight: 600, textTransform: "uppercase" }}>Slot Duration</span>
              <span style={{ fontSize: "18px", color: "#141414", fontWeight: 800, marginTop: "4px" }}>{duration}</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f3f5f8",
                border: "1px solid #ece7df",
                borderRadius: "16px",
                padding: "14px 20px",
                flex: 1
              }}
            >
              <span style={{ fontSize: "12px", color: "#5b5b5b", fontWeight: 600, textTransform: "uppercase" }}>Consultation Fee</span>
              <span style={{ fontSize: "18px", color: "#141414", fontWeight: 800, marginTop: "4px" }}>{fee}</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "15px", color: "#5b5b5b", fontWeight: 600 }}>
            Instant online serial booking & real-time queue management
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#ffc200",
              color: "#141414",
              borderRadius: "9999px",
              padding: "12px 28px",
              fontSize: "16px",
              fontWeight: 800
            }}
          >
            <span>Book Appointment Online</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
