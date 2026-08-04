import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Courier_Prime } from "next/font/google";
import { HermesAgent } from "./hermes-agent";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hermes-display",
  display: "swap",
});

const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-hermes-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hermes Agent | Nous Research",
  description:
    "Hermes Agent — the open-source agent that grows with you. Native apps for macOS, Windows, and Linux.",
  openGraph: {
    title: "Hermes Agent | Nous Research",
    description: "The open-source agent that grows with you.",
    type: "website",
    images: [
      {
        url: "https://hermes-agent.nousresearch.com/opengraph-image.png",
        width: 1200,
        height: 692,
        alt: "Hermes Agent by Nous Research",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hermes Agent | Nous Research",
    description: "The open-source agent that grows with you.",
    images: ["https://hermes-agent.nousresearch.com/opengraph-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0000f2",
};

export default function HermesAgentPage() {
  return (
    <div className={`${display.variable} ${mono.variable}`}>
      <HermesAgent />
    </div>
  );
}
