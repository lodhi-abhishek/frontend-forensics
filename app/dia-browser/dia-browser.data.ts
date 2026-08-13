export type BrowserSceneName = "brief" | "plan" | "compare";
export type FeatureFragmentName =
  | "memory"
  | "writing"
  | "tabs"
  | "skills"
  | "history"
  | "control";

export type NavItem = {
  label: string;
  href: string;
};

export type UseCase = {
  id: string;
  label: string;
  title: string;
  description: string;
  prompt: string;
  scene: BrowserSceneName;
};

export type Feature = {
  title: string;
  description: string;
  fragment: FeatureFragmentName;
  tone: "paper" | "ink" | "blue" | "red" | "lavender" | "sand";
  size: "wide" | "standard";
};

export const officialDiaUrl = "https://www.diabrowser.com/";

export const navItems: NavItem[] = [
  { label: "What Dia does", href: "#use-cases" },
  { label: "Features", href: "#features" },
  { label: "Privacy", href: "#privacy" },
];

export const useCases: UseCase[] = [
  {
    id: "morning-brief",
    label: "Start informed",
    title: "Your morning, already made sense of.",
    description:
      "Dia reads the pages you choose and turns yesterday’s loose ends into a focused starting point for today.",
    prompt: "Catch me up before my first meeting.",
    scene: "brief",
  },
  {
    id: "project-plan",
    label: "Move ideas forward",
    title: "From scattered research to a plan you can use.",
    description:
      "Ask in the same window where the work lives. Dia can connect notes, docs, and open tabs without making you restate the whole project.",
    prompt: "Turn these notes into a launch plan.",
    scene: "plan",
  },
  {
    id: "source-compare",
    label: "See the difference",
    title: "Compare the web without losing the thread.",
    description:
      "Bring several sources into one clear view, keep the citations close, and follow the detail that actually changes your decision.",
    prompt: "Compare these options for our small team.",
    scene: "compare",
  },
];

export const features: Feature[] = [
  {
    title: "A browser that remembers with you",
    description:
      "Choose what Dia can recall, then return to an idea without rebuilding the trail of tabs that led there.",
    fragment: "memory",
    tone: "ink",
    size: "wide",
  },
  {
    title: "Write where you read",
    description:
      "Draft, revise, and sharpen language beside the source instead of moving the work into another tool.",
    fragment: "writing",
    tone: "paper",
    size: "standard",
  },
  {
    title: "Tabs become working context",
    description:
      "Mention the pages that matter and leave the rest out. Context stays visible and under your control.",
    fragment: "tabs",
    tone: "blue",
    size: "standard",
  },
  {
    title: "Make repeat work feel personal",
    description:
      "Save the way you prepare briefs, review writing, or organize research as a reusable skill.",
    fragment: "skills",
    tone: "lavender",
    size: "wide",
  },
  {
    title: "Find the thought, not the tab",
    description:
      "Search by what you remember—a phrase, a person, a half-formed idea—and get back to the useful moment.",
    fragment: "history",
    tone: "sand",
    size: "wide",
  },
  {
    title: "You decide what follows you",
    description:
      "Pause memory, exclude sites, clear saved context, or keep a conversation temporary whenever you need.",
    fragment: "control",
    tone: "red",
    size: "standard",
  },
];

export const privacyTracks = [
  ["Private by default", "Incognito conversations", "Site exclusions", "Clear memory"],
  ["Visible sources", "You choose the context", "Pause anytime", "No hidden tabs"],
] as const;

export const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "What Dia does", href: "#use-cases" },
      { label: "Features", href: "#features" },
      { label: "Privacy", href: "#privacy" },
    ],
  },
  {
    title: "Dia",
    links: [
      { label: "Official website", href: officialDiaUrl, external: true },
      { label: "Download from Dia", href: officialDiaUrl, external: true },
      { label: "About The Browser Company", href: "https://thebrowser.company/", external: true },
    ],
  },
] as const;
