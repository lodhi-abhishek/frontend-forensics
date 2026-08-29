import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { Bwmi } from "./bwmi";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Build What Moves India",
  description:
    "A hackathon to rethink public service websites. Register for Build What Moves India.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2edf3",
};

export default function BuildWhatMovesIndiaPage() {
  return (
    <div className={`${sans.variable} ${mono.variable}`}>
      <Bwmi />
    </div>
  );
}
