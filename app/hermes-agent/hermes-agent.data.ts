export type Platform = "mac" | "windows" | "linux" | "unknown";
export type InstallerTab = "unix" | "windows";

const assets = "https://hermes-assets.nousresearch.com";
const localAssets = "/assets/hermes-agent";

export const HERMES_VERSION = "v0.19.1";

export const media = {
  hero: `${localAssets}/hero-art.webp`,
  showcasePoster: `${localAssets}/showcase.webp`,
  showcaseVideo: `${localAssets}/hermes-desktop.mp4`,
  badge: `${localAssets}/badge.webp`,
  portalFigurePoster: `${localAssets}/portal-figure.webp`,
  portalFigureWebm: `${localAssets}/portal-figure-orb.webm`,
  portalFigureStackedMp4: `${localAssets}/portal-figure-orb.mp4`,
  nousMark: `${localAssets}/nous.webp`,
} as const;

export const installCommands: Record<InstallerTab, string> = {
  unix: "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
  windows: "irm https://hermes-agent.nousresearch.com/install.ps1 | iex",
};

export const downloads = [
  {
    id: "mac",
    eyebrow: "macOS 12+",
    title: "Mac OS",
    action: "Download",
    href: `${assets}/Hermes-Setup.dmg?build=cc4cab2f592e`,
    art: `${localAssets}/platform-art-mac.webp`,
  },
  {
    id: "windows",
    eyebrow: "Windows 10/11",
    title: "Windows",
    action: "Download",
    href: `${assets}/Hermes-Setup.exe?build=cc4cab2f592e`,
    art: `${localAssets}/platform-art-windows.webp`,
  },
  {
    id: "linux",
    eyebrow: "Any distro",
    title: "Linux",
    action: "Install via terminal",
    href: "#install",
    art: `${localAssets}/platform-art-linux.webp`,
  },
] as const;

export const features = [
  {
    number: "#1",
    verb: "Connect",
    title: "Lives Everywhere",
    description:
      "Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI — and a growing list of platforms. One agent, one memory, every surface.",
    art: `${localAssets}/feature-connect.webp`,
  },
  {
    number: "#2",
    verb: "Remember",
    title: "Persistent Memory",
    description:
      "It learns your projects, auto-generates skills, and never forgets how it solved a problem.",
    art: `${localAssets}/feature-memory.webp`,
  },
  {
    number: "#3",
    verb: "Schedule",
    title: "Focused Automation",
    description:
      "Natural-language scheduling for reports, backups, and briefings — running unattended through the gateway, focused every time.",
    art: `${localAssets}/feature-automation.webp`,
  },
  {
    number: "#4",
    verb: "Delegate",
    title: "Tasks Multiplied",
    description:
      "Isolated subagents with their own conversations, terminals, and Python RPC scripts for zero-context-cost pipelines.",
    art: `${localAssets}/feature-tasks.webp`,
  },
  {
    number: "#5",
    verb: "Search",
    title: "Browse the Web",
    description:
      "Web search, browser automation, vision, image generation, text-to-speech, and multi-model reasoning.",
    art: `${localAssets}/feature-browse.webp`,
  },
  {
    number: "#6",
    verb: "Experiment",
    title: "Isolated Sandboxing",
    description:
      "Five backends — local, Docker, SSH, Singularity, Modal — with container hardening and namespace isolation.",
    art: `${localAssets}/feature-sandbox.webp`,
  },
] as const;

export const productLinks = [
  { label: "Hermes Agent", href: "/hermes-agent", external: false },
  {
    label: "Hermes Cloud",
    href: "https://portal.nousresearch.com/cloud",
    external: true,
  },
  {
    label: "Nous Portal",
    href: "https://portal.nousresearch.com/",
    external: true,
  },
] as const;

export function getPlatformDownload(platform: Platform) {
  if (platform === "mac") return downloads[0];
  if (platform === "windows") return downloads[1];
  if (platform === "linux") return downloads[2];
  return null;
}
