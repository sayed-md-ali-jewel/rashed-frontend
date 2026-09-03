import { ImageResponse } from "next/og";
import { getLandingPageData } from "@/lib/cms-data";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default async function Image() {
  const { doctor, websiteSetting: setting } = await getLandingPageData();

  const doctorName = doctor?.name || "Doctor Specialist";
  const designation = doctor?.designation || "Consultant Physician";
  const specialization = doctor?.specialization || "Clinical Medicine";
  const siteName = setting.siteName || "Dr. Rashed";

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
                {siteName}
              </span>
              <span style={{ fontSize: "14px", color: "#5b5b5b", fontWeight: 500 }}>
                Official Doctor Portfolio & Online Serial Booking
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
            Verified Medical Specialist
          </div>
        </div>

        {/* Doctor Card */}
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
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#2196f3", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            {specialization}
          </span>
          <h1
            style={{
              fontSize: "44px",
              fontWeight: 900,
              color: "#141414",
              marginTop: "8px",
              marginBottom: "8px",
              lineHeight: 1.1,
              letterSpacing: "-1px"
            }}
          >
            {doctorName}
          </h1>
          <p style={{ fontSize: "20px", color: "#5b5b5b", margin: 0, fontWeight: 600 }}>
            {designation}
          </p>

          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#f3f5f8",
                border: "1px solid #ece7df",
                borderRadius: "12px",
                padding: "10px 18px",
                fontSize: "15px",
                fontWeight: 700,
                color: "#141414"
              }}
            >
              Online Serial Booking
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#f3f5f8",
                border: "1px solid #ece7df",
                borderRadius: "12px",
                padding: "10px 18px",
                fontSize: "15px",
                fontWeight: 700,
                color: "#141414"
              }}
            >
              Chamber Timings & Hospitals
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#f3f5f8",
                border: "1px solid #ece7df",
                borderRadius: "12px",
                padding: "10px 18px",
                fontSize: "15px",
                fontWeight: 700,
                color: "#141414"
              }}
            >
              Verified Patient Reviews
            </div>
          </div>
        </div>

        {/* Bottom CTA bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "15px", color: "#5b5b5b", fontWeight: 600 }}>
            Book appointments and consult with specialist doctor
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
            <span>Book Consultation Now</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
