import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How to Build an Agent — Amp",
  description:
    "A practical field note on building a small, capable coding agent.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
