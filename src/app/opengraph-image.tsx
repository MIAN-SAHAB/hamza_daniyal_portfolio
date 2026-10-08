import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Mian Muhammad Hamza Daniyal — Senior Full-Stack Developer & Creative Technologist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "public/assets/fonts");

export default async function OpengraphImage() {
  const [nevera, haas] = await Promise.all([
    readFile(join(fontDir, "Nevera-Regular.otf")),
    readFile(join(fontDir, "neuehaasgrot.otf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "#F4F4F0",
          color: "#111114",
          fontFamily: "Haas",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 4, color: "#5B5B66" }}>
          <span>SENIOR FULL-STACK DEVELOPER & CREATIVE TECHNOLOGIST</span>
          <span>PKT / UTC+5</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Nevera", fontSize: 168, lineHeight: 0.86 }}>
          <span>HAMZA</span>
          <span style={{ display: "flex", paddingLeft: 220 }}>
            DANIYAL<span style={{ color: "#FF4D2D" }}>.</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#111114" }}>
          <span style={{ width: 12, height: 12, borderRadius: 12, background: "#FF4D2D" }} />
          Next.js · Three.js / R3F · GSAP · Laravel · Headless Shopify
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Nevera", data: nevera, style: "normal", weight: 400 },
        { name: "Haas", data: haas, style: "normal", weight: 400 },
      ],
    },
  );
}
