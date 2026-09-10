import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Nikita Kulpinov — Python Backend developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#191919",
          color: "rgba(253,253,252,0.9)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "rgba(253,253,252,0.4)", marginBottom: 24 }}>gangstand.tech</div>
        <div style={{ fontSize: 64, fontWeight: 600, marginBottom: 24 }}>Nikita Kulpinov</div>
        <div style={{ fontSize: 32, color: "rgba(253,253,252,0.7)", maxWidth: 900 }}>
          Python Backend developer focused on DevOps and AI
        </div>
      </div>
    ),
    { ...size },
  );
}
