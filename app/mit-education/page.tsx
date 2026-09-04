import type { Metadata, Viewport } from "next";
import { MitEducation } from "./mit-education";

export const metadata: Metadata = {
  title: "Education | MIT - Massachusetts Institute of Technology",
  description:
    "At MIT, we revel in a culture of learning by doing, across more than 30 departments and five schools.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function MitEducationPage() {
  return <MitEducation />;
}
