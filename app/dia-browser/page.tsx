import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { DiaBrowser } from "./dia-browser";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dia-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dia-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dia-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dia Browser — A browser for the work in your head",
  description:
    "An independent design study of Dia, a context-aware browser that helps turn tabs into briefs, plans, and comparisons.",
  openGraph: {
    title: "Dia Browser — A browser for the work in your head",
    description:
      "A close, independently authored design study for a browser that works with your context.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Dia Browser — A browser for the work in your head",
    description: "A browser that works with your context.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020204",
};

export default function DiaBrowserPage() {
  return (
    <div className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <DiaBrowser />
    </div>
  );
}
