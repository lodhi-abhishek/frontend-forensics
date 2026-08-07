"use client";

import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  Github,
  MessageCircle,
  SquareTerminal,
} from "lucide-react";
import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  downloads,
  features,
  getPlatformDownload,
  HERMES_VERSION,
  installCommands,
  media,
  productLinks,
  type InstallerTab,
  type Platform,
} from "./hermes-agent.data";
import styles from "./hermes-agent.module.css";
import { PortalFigureMedia } from "./portal-figure-media";

const SCRAMBLE_GLYPHS = "/\\-_=+|<>~:*";

type ParallaxMetric = {
  image: HTMLElement;
  boxTop: number;
  boxHeight: number;
};

type MotionMetrics = {
  viewportHeight: number;
  maximumScroll: number;
  featureTop: number;
  stopOffset: number;
  badgeStickyBottom: number;
  badgeVisible: boolean;
  panel: HTMLElement;
  badge: HTMLElement | null;
  stop: HTMLElement;
  images: ParallaxMetric[];
};

function detectPlatform(): Platform {
  const source = `${navigator.platform ?? ""} ${navigator.userAgent}`;
  if (/Mac|iPhone|iPad/i.test(source)) return "mac";
  if (/Win/i.test(source)) return "windows";
  if (/Linux|X11/i.test(source)) return "linux";
  return "unknown";
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function externalProps(external: boolean) {
  return external
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}

function ProductsMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const menuId = useId();

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        close();
      }
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  const focusItem = (index: number) => {
    const itemCount = productLinks.length;
    itemRefs.current[(index + itemCount) % itemCount]?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() =>
        focusItem(event.key === "ArrowDown" ? 0 : productLinks.length - 1),
      );
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const activeIndex = itemRefs.current.findIndex(
      (item) => item === document.activeElement,
    );
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(productLinks.length - 1);
    }
  };

  return (
    <div className={styles.products}>
      <button
        ref={triggerRef}
        className={styles.productsTrigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleTriggerKeyDown}
      >
        Products
        <ChevronDown aria-hidden="true" size={14} strokeWidth={1.8} />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        className={styles.productsMenu}
        role="menu"
        hidden={!open}
        onKeyDown={handleMenuKeyDown}
      >
        {productLinks.map((item, index) => (
          <a
            key={item.label}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            href={item.href}
            role="menuitem"
            tabIndex={open ? 0 : -1}
            onClick={() => close()}
            {...externalProps(item.external)}
          >
            <span>{item.label}</span>
            {item.external && <ArrowUpRight aria-hidden="true" size={14} />}
          </a>
        ))}
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <header className={styles.nav}>
      <nav className={styles.navLeft} aria-label="Company navigation">
        <a href="https://nousresearch.com" target="_blank" rel="noopener noreferrer">
          Nous
        </a>
        <a
          href="https://hermes-agent.nousresearch.com/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
      </nav>

      <div className={styles.navCenter}>
        <a className={styles.brand} href="#top" aria-label="Hermes Agent home">
          <span>Hermes</span>
          <span>Agent</span>
        </a>
        <div className={styles.socials}>
          <a
            href="https://discord.gg/nousresearch"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hermes Agent Discord"
          >
            <MessageCircle aria-hidden="true" size={17} strokeWidth={1.7} />
          </a>
          <a
            href="https://github.com/NousResearch/hermes-agent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hermes Agent GitHub"
          >
            <Github aria-hidden="true" size={17} strokeWidth={1.7} />
          </a>
        </div>
      </div>

      <nav className={styles.navRight} aria-label="Product navigation">
        <ProductsMenu />
        <a className={styles.installNav} href="#downloads">
          Install
        </a>
      </nav>
    </header>
  );
}

function PlatformCta({ platform, reducedMotion }: { platform: Platform; reducedMotion: boolean }) {
  const download = getPlatformDownload(platform);
  const finalLabel = download
    ? download.id === "linux"
      ? "Install via terminal"
      : `Download for ${download.title}`
    : "Download desktop app";
  const finalHref = download?.href ?? "#downloads";
  const [label, setLabel] = useState("Download desktop app");

  useEffect(() => {
    if (reducedMotion || platform === "unknown") {
      setLabel(finalLabel);
      return;
    }

    let frame = 0;
    const totalFrames = 9;
    const timer = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / totalFrames) * finalLabel.length);
      setLabel(
        finalLabel
          .split("")
          .map((character, index) => {
            if (character === " " || index < settled) return character;
            return SCRAMBLE_GLYPHS[(frame + index * 3) % SCRAMBLE_GLYPHS.length];
          })
          .join(""),
      );
      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setLabel(finalLabel);
      }
    }, 90);

    return () => window.clearInterval(timer);
  }, [finalLabel, platform, reducedMotion]);

  return (
    <a
      className={styles.primaryCta}
      href={finalHref}
      {...externalProps(Boolean(download && download.id !== "linux"))}
    >
      <Download aria-hidden="true" size={17} strokeWidth={1.75} />
      <span>{label}</span>
    </a>
  );
}

function Installer({ initialTab }: { initialTab: InstallerTab }) {
  const [activeTab, setActiveTab] = useState<InstallerTab>(initialTab);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const resetTimer = useRef<number | null>(null);
  const tabs: InstallerTab[] = ["unix", "windows"];

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const selectTab = (tab: InstallerTab) => {
    setActiveTab(tab);
    setCopyStatus("idle");
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const current = tabs.indexOf(activeTab);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const next = event.key === "ArrowRight" ? current + 1 : current - 1;
      selectTab(tabs[(next + tabs.length) % tabs.length]);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectTab(tabs[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      selectTab(tabs[tabs.length - 1]);
    }
  };

  const copyCommand = async () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(installCommands[activeTab]);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    resetTimer.current = window.setTimeout(() => setCopyStatus("idle"), 2000);
  };

  return (
    <div className={styles.installer} id="install">
      <div className={styles.installerHeading}>
        <SquareTerminal aria-hidden="true" size={17} strokeWidth={1.6} />
        <span>Install via terminal</span>
      </div>
      <div className={styles.terminalCard}>
        <div className={styles.tabs} role="tablist" aria-label="Operating system">
          <button
            type="button"
            id="installer-tab-unix"
            role="tab"
            aria-selected={activeTab === "unix"}
            aria-controls="installer-command"
            tabIndex={activeTab === "unix" ? 0 : -1}
            onClick={() => selectTab("unix")}
            onKeyDown={handleTabKeyDown}
          >
            macOS / Linux
          </button>
          <button
            type="button"
            id="installer-tab-windows"
            role="tab"
            aria-selected={activeTab === "windows"}
            aria-controls="installer-command"
            tabIndex={activeTab === "windows" ? 0 : -1}
            onClick={() => selectTab("windows")}
            onKeyDown={handleTabKeyDown}
          >
            Windows
          </button>
        </div>
        <div
          className={styles.commandRow}
          id="installer-command"
          role="tabpanel"
          aria-labelledby={`installer-tab-${activeTab}`}
        >
          <code>{installCommands[activeTab]}</code>
          <button
            type="button"
            className={styles.copyButton}
            onClick={copyCommand}
            aria-label={
              copyStatus === "copied"
                ? "Copied"
                : copyStatus === "failed"
                  ? "Copy failed. Select and copy the command"
                  : "Copy install command"
            }
          >
            {copyStatus === "copied" ? (
              <Check aria-hidden="true" size={18} />
            ) : (
              <Copy aria-hidden="true" size={18} />
            )}
          </button>
        </div>
      </div>
      <span className={styles.srOnly} aria-live="polite">
        {copyStatus === "copied"
          ? "Install command copied."
          : copyStatus === "failed"
            ? "Clipboard access failed. Select and copy the command."
            : ""}
      </span>
    </div>
  );
}

function Hero({ platform, reducedMotion }: { platform: Platform; reducedMotion: boolean }) {
  return (
    <section className={styles.hero} id="top">
      <Navigation />
      <div className={styles.heroArt} aria-hidden="true">
        <img src={media.hero} alt="" width={1129} height={1418} />
      </div>
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>Open Source <span>•</span> MIT License</p>
        <h1>
          <span>The Agent</span>
          <span>That Grows</span>
          <span>With You</span>
        </h1>
        <div className={styles.heroActions}>
          <div>
            <p className={styles.actionLabel}>Install desktop app</p>
            <PlatformCta platform={platform} reducedMotion={reducedMotion} />
          </div>
          <Installer initialTab={platform === "windows" ? "windows" : "unix"} />
        </div>
      </div>
    </section>
  );
}

function Showcase({ reducedMotion }: { reducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) {
      video?.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <figure className={styles.showcase}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster={media.showcasePoster}
        aria-label="Hermes Agent desktop application demonstration"
      >
        <source src={media.showcaseVideo} type="video/mp4" />
      </video>
    </figure>
  );
}

function DownloadCards() {
  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <section className={styles.downloads} id="downloads" aria-label="Downloads">
      {downloads.map((item) => (
        <article className={styles.downloadCard} key={item.id}>
          <img src={item.art} alt="" width={627} height={547} aria-hidden="true" />
          <div className={styles.downloadNoise} aria-hidden="true" />
          <div className={styles.downloadContent}>
            <p>{item.eyebrow}</p>
            <h2>{item.title}</h2>
            <a
              href={item.href}
              onClick={(event) => handleAnchor(event, item.href)}
              {...externalProps(!item.href.startsWith("#"))}
            >
              <Download aria-hidden="true" size={16} />
              {item.action}
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}

function Features({
  wrapperRef,
}: {
  wrapperRef: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={wrapperRef} className={styles.featureParallax}>
      <img
        className={styles.featureBadge}
        src={media.badge}
        alt=""
        width={600}
        height={1200}
        aria-hidden="true"
        data-feature-badge
      />
      <section
        className={styles.features}
        aria-labelledby="features-title"
        data-feature-panel
      >
        <div className={styles.featureMarker}>
          <span>Feature</span>
          <span>Preview</span>
        </div>
        <h2 className={styles.srOnly} id="features-title">
          Hermes Agent features
        </h2>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article className={styles.feature} key={feature.number}>
              <p className={styles.featureEyebrow}>
                <span>{feature.number}</span> {feature.verb}
              </p>
              <h3>{feature.title}</h3>
              <div className={styles.featureImage}>
                <img
                  src={feature.art}
                  alt=""
                  width={1334}
                  height={1148}
                  aria-hidden="true"
                  data-parallax
                />
              </div>
              <p className={styles.featureDescription}>{feature.description}</p>
            </article>
          ))}
        </div>
        <div
          className={styles.hermesWordmark}
          aria-hidden="true"
          data-feature-stop
        >
          Hermes
        </div>
      </section>
    </div>
  );
}

function PortalFooter({
  active,
  interactive,
  reducedMotion,
}: {
  active: boolean;
  interactive: boolean;
  reducedMotion: boolean;
}) {
  const footerRef = useRef<HTMLElement>(null);
  const orbTargetRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const orbTarget = orbTargetRef.current;
    if (!footer || !orbTarget) return;

    const alignFigure = () => {
      if (window.innerWidth <= 767) return;
      const footerRect = footer.getBoundingClientRect();
      const targetRect = orbTarget.getBoundingClientRect();
      const portalFontSize = Number.parseFloat(
        window.getComputedStyle(orbTarget.parentElement ?? orbTarget).fontSize,
      );
      const targetDiameter = portalFontSize * 0.522;
      const figureWidth = targetDiameter / 0.2204;
      const figureHeight = figureWidth / 0.8076;
      const targetCenterX = targetRect.left - footerRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top - footerRect.top + targetRect.height / 2;

      footer.style.setProperty(
        "--portal-figure-left",
        `${targetCenterX - figureWidth * 0.1868 + 6}px`,
      );
      footer.style.setProperty(
        "--portal-figure-top",
        `${targetCenterY - figureHeight * 0.5582 - 7}px`,
      );
      footer.style.setProperty("--portal-figure-width", `${figureWidth}px`);
    };

    alignFigure();
    void document.fonts?.ready.then(alignFigure);
    const observer = new ResizeObserver(alignFigure);
    observer.observe(footer);
    observer.observe(orbTarget);
    window.addEventListener("orientationchange", alignFigure);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", alignFigure);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className={styles.portalFooter}
      aria-hidden={!interactive}
      data-interactive={interactive ? "true" : "false"}
    >
      <div className={styles.portalGhost} aria-hidden="true">
        <span>Nous</span>
        <span className={styles.portalWord}>
          P<span ref={orbTargetRef}>o</span>rtal
        </span>
      </div>
      <PortalFigureMedia
        active={active}
        reducedMotion={reducedMotion}
        poster={media.portalFigurePoster}
        webm={media.portalFigureWebm}
        stackedMp4={media.portalFigureStackedMp4}
      />
      <div className={styles.portalContent}>
        <p className={styles.portalTiers}>Free <span>•</span> Plus <span>•</span> Super <span>•</span> Ultra</p>
        <h2>Nous Portal</h2>
        <p>
          All paid tiers include monthly credits for use in Hermes Agent,
          access to 300+ cutting-edge models and built-in tool use.
        </p>
        <a
          href="https://portal.nousresearch.com/manage-subscription"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={interactive ? 0 : -1}
        >
          View All Our Plans
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      </div>
      <div className={styles.footerLegal}>
        <div>
          <span>Hermes Agent {HERMES_VERSION}</span>
          <span>Nous Research</span>
        </div>
        <span>MIT License · 2026</span>
      </div>
      <img
        className={styles.nousMark}
        src={media.nousMark}
        alt=""
        width={121}
        height={173}
        aria-hidden="true"
      />
    </footer>
  );
}

export function HermesAgent() {
  const reducedMotion = useReducedMotion();
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [footerInteractive, setFooterInteractive] = useState(false);
  const [footerMediaActive, setFooterMediaActive] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const featureRef = useRef<HTMLDivElement | null>(null);
  const motionMetricsRef = useRef<MotionMetrics | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => setPlatform(detectPlatform()), []);

  const measureMotion = useCallback(() => {
    const wrapper = featureRef.current;
    if (!wrapper) return;

    const panel = wrapper.querySelector<HTMLElement>("[data-feature-panel]");
    const badge = wrapper.querySelector<HTMLElement>("[data-feature-badge]");
    const stop = wrapper.querySelector<HTMLElement>("[data-feature-stop]");
    if (!panel || !stop) return;

    const viewportHeight = window.innerHeight;
    const currentFeatureY =
      Number.parseFloat(
        window.getComputedStyle(panel).getPropertyValue("--feature-y"),
      ) || 0;
    const panelRect = panel.getBoundingClientRect();
    const stopOffset = stop.getBoundingClientRect().top - panelRect.top;
    const badgeStyle = badge ? window.getComputedStyle(badge) : null;
    const badgeVisible = Boolean(badge && badgeStyle?.display !== "none");
    const badgeStickyBottom = badgeVisible
      ? (Number.parseFloat(badgeStyle?.top ?? "0") || 0) +
        (badge?.offsetHeight ?? 0)
      : 0;

    const images = Array.from(
      wrapper.querySelectorAll<HTMLElement>("[data-parallax]"),
    ).map((image) => {
      const box = image.parentElement as HTMLElement;
      const rect = box.getBoundingClientRect();
      return {
        image,
        boxTop: rect.top + window.scrollY - currentFeatureY,
        boxHeight: rect.height,
      };
    });

    motionMetricsRef.current = {
      viewportHeight,
      maximumScroll: Math.max(
        0,
        document.documentElement.scrollHeight -
          viewportHeight -
          currentFeatureY,
      ),
      featureTop: wrapper.getBoundingClientRect().top + window.scrollY,
      stopOffset,
      badgeStickyBottom,
      badgeVisible,
      panel,
      badge,
      stop,
      images,
    };
  }, []);

  const updateMotion = useCallback(() => {
    rafRef.current = null;
    const page = pageRef.current;
    const metrics = motionMetricsRef.current;
    if (!page || !metrics || reducedMotion) {
      setFooterInteractive(reducedMotion);
      setFooterMediaActive(false);
      return;
    }

    const clamp = (value: number, minimum: number, maximum: number) =>
      Math.max(minimum, Math.min(maximum, value));
    const scroll = clamp(window.scrollY, 0, metrics.maximumScroll);
    const distanceBelowTop = Math.max(metrics.featureTop - scroll, 0);
    const lift = clamp(
      (metrics.viewportHeight - distanceBelowTop) * 0.14,
      0,
      metrics.viewportHeight * 0.18,
    );
    const featureY = lift === 0 ? "0px" : `${(-lift).toFixed(1)}px`;

    if (metrics.panel.style.getPropertyValue("--feature-y") !== featureY) {
      metrics.panel.style.setProperty("--feature-y", featureY);
    }

    if (metrics.badge) {
      let badgeTransform = "";
      if (metrics.badgeVisible) {
        const stopTop =
          metrics.featureTop + metrics.stopOffset - scroll - lift;
        const availableBottom = stopTop - 16;
        if (metrics.badgeStickyBottom > availableBottom) {
          badgeTransform = `translateY(${(
            availableBottom - metrics.badgeStickyBottom
          ).toFixed(1)}px)`;
        }
      }
      if (metrics.badge.style.transform !== badgeTransform) {
        metrics.badge.style.transform = badgeTransform;
      }
    }

    metrics.images.forEach(({ image, boxTop, boxHeight }) => {
      const boxCenter = boxTop - scroll - lift + boxHeight / 2;
      const normalized = clamp(
        (boxCenter - metrics.viewportHeight / 2) /
          (metrics.viewportHeight / 2 + boxHeight / 2),
        -1,
        1,
      );
      const imageY = `${(-normalized * boxHeight * 0.1).toFixed(1)}px`;
      if (image.style.getPropertyValue("--py-img") !== imageY) {
        image.style.setProperty("--py-img", imageY);
      }
    });

    const remaining = Math.max(0, metrics.maximumScroll - scroll);
    const reveal = clamp(
      (metrics.viewportHeight * 0.72 - remaining) /
        (metrics.viewportHeight * 0.38),
      0,
      1,
    );
    page.style.setProperty("--footer-opacity", String(reveal));

    setFooterMediaActive((current) => {
      const next = remaining < metrics.viewportHeight * 0.82;
      return current === next ? current : next;
    });
    setFooterInteractive((current) => {
      const next = reveal > 0.98;
      return current === next ? current : next;
    });
  }, [reducedMotion]);

  useEffect(() => {
    const wrapper = featureRef.current;
    const panel = wrapper?.querySelector<HTMLElement>("[data-feature-panel]");
    const badge = wrapper?.querySelector<HTMLElement>("[data-feature-badge]");
    const images = wrapper?.querySelectorAll<HTMLElement>("[data-parallax]");

    if (reducedMotion) {
      pageRef.current?.style.setProperty("--footer-opacity", "1");
      panel?.style.setProperty("--feature-y", "0px");
      if (badge) badge.style.transform = "";
      images?.forEach((image) => image.style.setProperty("--py-img", "0px"));
      motionMetricsRef.current = null;
      setFooterInteractive(true);
      setFooterMediaActive(false);
      return;
    }

    const schedule = () => {
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(updateMotion);
      }
    };
    const measureAndSchedule = () => {
      measureMotion();
      schedule();
    };

    let cancelled = false;
    measureAndSchedule();
    void document.fonts?.ready.then(() => {
      if (!cancelled) measureAndSchedule();
    });

    const onLoad = () => measureAndSchedule();
    if (document.readyState !== "complete") {
      window.addEventListener("load", onLoad, { once: true });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measureAndSchedule);
    window.addEventListener("orientationchange", measureAndSchedule);
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measureAndSchedule);
      window.removeEventListener("orientationchange", measureAndSchedule);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [measureMotion, reducedMotion, updateMotion]);

  const rootClassName = useMemo(
    () => `${styles.page} ${reducedMotion ? styles.reducedMotion : ""}`,
    [reducedMotion],
  );

  return (
    <main ref={pageRef} className={rootClassName}>
      <div className={styles.scrollLayer}>
        <Hero platform={platform} reducedMotion={reducedMotion} />
        <Showcase reducedMotion={reducedMotion} />
        <DownloadCards />
        <Features
          wrapperRef={(node) => {
            featureRef.current = node;
          }}
        />
      </div>
      <PortalFooter
        active={footerMediaActive}
        interactive={footerInteractive}
        reducedMotion={reducedMotion}
      />
      <div className={styles.viewportFrame} aria-hidden="true" />
    </main>
  );
}
