import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MacroscopePage } from "./macroscope";

const geist = Geist({
  subsets: ["latin"],
  variable: "--macroscope-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--macroscope-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Macroscope - AI Code Review & Status Updates",
  description: "Command your own software factory with AI code review, engineering status, and cloud agent orchestration.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F8FB",
  colorScheme: "light",
};

export default function Page() {
  return <div className={`${geist.variable} ${geistMono.variable}`}><MacroscopePage /></div>;
}
