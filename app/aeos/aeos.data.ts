// Self-hosted copies (downloaded 2026-08-14) so the hero works even if the
// CDNs are unreachable. Original remote URLs kept for reference:
// export const splineSceneUrl =
//   "https://prod.spline.design/QXrPpNV6z8SngYZ2/scene.splinecode";
export const splineSceneUrl = "/assets/aeos/scene.splinecode";

// The viewer's lazy-loaded companion chunks (navmesh.js, physics.js, etc.)
// live alongside this file in /assets/aeos/.
// export const splineViewerScriptUrl =
//   "https://unpkg.com/@splinetool/viewer@1.0.94/build/spline-viewer.js";
export const splineViewerScriptUrl = "/assets/aeos/spline-viewer.js";

export const media = {
  hero: "/assets/aeos/hero.jpg",
  logo: "/assets/aeos/logo.png",
  serviceArt: "/assets/aeos/service-art.png",
  statement: "/assets/aeos/statement.mp4",
  processDiscovery: "/assets/aeos/process-discovery.png",
  processAnalysis: "/assets/aeos/process-analysis.png",
  processExecution: "/assets/aeos/process-execution.png",
  contact: "/assets/aeos/contact.png",
  footer: "/assets/aeos/footer.png",
} as const;

export const navItems = [
  { label: "Home", href: "#top" },
  { label: "What we do", href: "#what-we-do" },
  { label: "How we do it", href: "#process" },
  { label: "Why choose us", href: "#we-ship" },
  { label: "Talk to us", href: "#contact" },
] as const;

export const clients = [
  "PhonePe",
  "Charged by Coca-Cola",
  "Lotto",
  "Urban Company",
  "EMotorad",
  "Mirzapur S3",
] as const;

export type Service = {
  id: string;
  label: string;
  title: string;
  body: string;
  accent: string;
};

export const services: Service[] = [
  {
    id: "content",
    label: "GenAI Marketing & Content",
    title: "Magical customer experiences",
    body: "Personalized content, campaigns and video systems that adapt to every audience while staying unmistakably on-brand.",
    accent: "01",
  },
  {
    id: "llm",
    label: "Custom LLM Deployments",
    title: "Intelligence built around your business",
    body: "Private, purpose-built language systems connected to the knowledge, tools and safeguards your teams already rely on.",
    accent: "02",
  },
  {
    id: "automation",
    label: "Workflow Automation",
    title: "Less busywork. More momentum.",
    body: "We map the handoffs that slow teams down, then build dependable automations that fit the way your organization actually operates.",
    accent: "03",
  },
  {
    id: "vision",
    label: "Vision Applications",
    title: "Give software a sharper set of eyes",
    body: "Computer vision and video intelligence for monitoring, discovery, quality control and new customer-facing experiences.",
    accent: "04",
  },
];

export type ShipProject = {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  visual: "voice" | "video" | "language" | "report";
};

export const shipProjects: ShipProject[] = [
  {
    id: "voice-agent",
    index: "01 / 04",
    title: "112 AI Voice Agent",
    category: "Conversational AI",
    description:
      "A calm, context-aware voice layer designed to respond clearly when every second matters.",
    visual: "voice",
  },
  {
    id: "shortform",
    index: "02 / 04",
    title: "Longform → Shortform",
    category: "Generative video",
    description:
      "An editorial engine that finds the strongest moments and reshapes them for every channel.",
    visual: "video",
  },
  {
    id: "dubbing",
    index: "03 / 04",
    title: "AI Multilingual Dubbing",
    category: "Voice & localization",
    description:
      "Natural, expressive localization that keeps the original performance present across languages.",
    visual: "language",
  },
  {
    id: "reportgen",
    index: "04 / 04",
    title: "ReportGen AI",
    category: "Workflow intelligence",
    description:
      "Scattered operating data becomes a useful, structured brief before the next meeting begins.",
    visual: "report",
  },
];

export type ProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  summary: string;
  bullets: string[];
  image: string;
};

export const processSteps: ProcessStep[] = [
  {
    id: "discovery",
    number: "Step 1",
    title: "Discovery",
    description:
      "Together, we dive into your world. A brainstorming session where your challenges meet our creative thinking.",
    summary: "We learn from you",
    bullets: ["Identify painpoints", "Uncover opportunities", "Flag ineffeciences"],
    image: media.processDiscovery,
  },
  {
    id: "analysis",
    number: "Step 2",
    title: "Analysis",
    description:
      "We craft a tailored action plan that aligns with your budget and requirements – no guesswork, just solutions.",
    summary: "We build for you",
    bullets: [
      "Compatible with your stack",
      "Designed for the end user",
      "Future ready & modular",
    ],
    image: media.processAnalysis,
  },
  {
    id: "execution",
    number: "Step 3",
    title: "Execution",
    description:
      "It’s go time. Our team gets to work, setting plans into motion, turning ideas into real-world impact.",
    summary: "We keep you looped",
    bullets: [
      "Regular status calls",
      "Open line of communication",
      "Documentation & support",
    ],
    image: media.processExecution,
  },
];

export const socialLinks = [
  { label: "X", href: "https://x.com/aeos_labs?s=11" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/aeos.labs?igsh=Ynh3bHZ2eHc1eW9o&utm_source=qr",
  },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/aeos-labs/" },
] as const;
