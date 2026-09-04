import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Superlogical } from "./superlogical";

const suisse = localFont({
  src: "./fonts/SuisseIntl-Regular-latin.woff2",
  display: "swap",
  variable: "--font-superlogical",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Superlogical",
  description: "Building the multiplexer for all work.",
  openGraph: {
    title: "An announcement from Superlogical",
    description: "Building the multiplexer for all work.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "An announcement from Superlogical",
    description: "Building the multiplexer for all work.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f4" },
    { media: "(prefers-color-scheme: dark)", color: "#10120f" },
  ],
};

export default function SuperlogicalPage() {
  return (
    <div className={suisse.variable}>
      <Superlogical />
    </div>
  );
}
