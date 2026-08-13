import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, Manrope } from "next/font/google";
import { Aeos } from "./aeos";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-aeos-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-aeos-serif",
  display: "swap",
});

const utility = Manrope({
  subsets: ["latin"],
  variable: "--font-aeos-utility",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aeos Labs — Magic as a service",
  description:
    "Aeos Labs is an engineering team building AI, video technology and intelligent automation for ambitious teams.",
  openGraph: {
    title: "Aeos Labs — Magic as a service",
    description: "AI engineering, video technology and intelligent automation.",
    type: "website",
    images: [
      {
        url: "/assets/aeos/hero.jpg",
        width: 1600,
        height: 817,
        alt: "Aeos Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aeos Labs — Magic as a service",
    description: "AI engineering, video technology and intelligent automation.",
    images: ["/assets/aeos/hero.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
};

export default function AeosPage() {
  return (
    <div className={`${sans.variable} ${serif.variable} ${utility.variable}`}>
      <Aeos />
    </div>
  );
}
