export type Platform = "mac" | "windows" | "linux" | "unknown";
export type InstallerTab = "unix" | "windows";

const site = "https://hermes-agent.nousresearch.com";
const assets = "https://hermes-assets.nousresearch.com";

export const HERMES_VERSION = "v0.19.1";

export const media = {
  hero: `${site}/img/desktop/hero-art.webp`,
  showcasePoster: `${site}/img/desktop/showcase.webp`,
  showcaseVideo: `${assets}/hermes-desktop.mp4`,
  badge: `${site}/img/desktop/badge.webp`,
  portalFigurePoster: `${site}/img/desktop/portal-figure.webp`,
  portalFigureWebm: `${site}/img/desktop/portal-figure-orb.webm`,
  portalFigureStackedMp4: `${site}/img/desktop/portal-figure-orb.mp4`,
  nousMark: `${site}/img/desktop/nous.webp`,
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
    art: `${site}/img/desktop/platform-art-mac.webp`,
  },
  {
    id: "windows",
    eyebrow: "Windows 10/11",
    title: "Windows",
    action: "Download",
    href: `${assets}/Hermes-Setup.exe?build=cc4cab2f592e`,
    art: `${site}/img/desktop/platform-art-windows.webp`,
  },
  {
    id: "linux",
    eyebrow: "Any distro",
    title: "Linux",
    action: "Install via terminal",
    href: "#install",
    art: `${site}/img/desktop/platform-art-linux.webp`,
  },
] as const;

export const features = [
  {
    number: "#1",
    verb: "Connect",
    title: "Lives Everywhere",
    description:
      "Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI — and a growing list of platforms. One agent, one memory, every surface.",
    art: `${site}/img/desktop/feature-connect.webp`,
  },
  {
    number: "#2",
    verb: "Remember",
    title: "Persistent Memory",
    description:
      "It learns your projects, auto-generates skills, and never forgets how it solved a problem.",
    art: `${site}/img/desktop/feature-memory.webp`,
  },
  {
    number: "#3",
    verb: "Schedule",
    title: "Focused Automation",
    description:
      "Natural-language scheduling for reports, backups, and briefings — running unattended through the gateway, focused every time.",
    art: `${site}/img/desktop/feature-automation.webp`,
  },
  {
    number: "#4",
    verb: "Delegate",
    title: "Tasks Multiplied",
    description:
      "Isolated subagents with their own conversations, terminals, and Python RPC scripts for zero-context-cost pipelines.",
    art: `${site}/img/desktop/feature-tasks.webp`,
  },
  {
    number: "#5",
    verb: "Search",
    title: "Browse the Web",
    description:
      "Web search, browser automation, vision, image generation, text-to-speech, and multi-model reasoning.",
    art: `${site}/img/desktop/feature-browse.webp`,
  },
  {
    number: "#6",
    verb: "Experiment",
    title: "Isolated Sandboxing",
    description:
      "Five backends — local, Docker, SSH, Singularity, Modal — with container hardening and namespace isolation.",
    art: `${site}/img/desktop/feature-sandbox.webp`,
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
