"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./dia-browser.module.css";

const RAINBOW_BANDS = [
  { x: -16, height: 323 },
  { x: 125, height: 404 },
  { x: 266, height: 478 },
  { x: 407, height: 530 },
  { x: 548, height: 584 },
  { x: 689, height: 530 },
  { x: 830, height: 478 },
  { x: 971, height: 404 },
  { x: 1112, height: 323 },
];

function easeOutQuart(value: number) {
  return 1 - Math.pow(1 - value, 4);
}

export function RainbowReveal() {
  const [motionAllowed, setMotionAllowed] = useState<boolean | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!motionQuery.matches);
    update();
    motionQuery.addEventListener("change", update);
    return () => motionQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!motionAllowed) return;

    const sentinel = sentinelRef.current;
    const spacer = spacerRef.current;
    const visual = visualRef.current;
    if (!sentinel || !spacer || !visual) return;

    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    );
    let progress = 0;
    let scrollFrame = 0;
    let recoilFrame = 0;
    let recoilTimer = 0;
    let recoiling = false;
    let previousScrollBehavior = "";

    const anchorScroll = () =>
      Math.max(0, sentinel.getBoundingClientRect().top + window.scrollY - window.innerHeight);

    const updateProgress = () => {
      scrollFrame = 0;
      const range = Math.max(1, spacer.offsetHeight);
      progress = Math.min(1, Math.max(0, (window.scrollY - anchorScroll()) / range));
      visual.style.setProperty("--rainbow-progress", progress.toFixed(4));
      visual.toggleAttribute("data-visible", progress > 0.002);
    };

    const scheduleProgress = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateProgress);
    };

    const cancelRecoil = () => {
      if (recoilTimer) window.clearTimeout(recoilTimer);
      recoilTimer = 0;
      if (recoilFrame) window.cancelAnimationFrame(recoilFrame);
      recoilFrame = 0;
      if (recoiling) {
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        recoiling = false;
      }
    };

    const recoil = () => {
      if (!finePointer.matches || progress <= 0.05 || recoiling) return;
      const startY = window.scrollY;
      const targetY = anchorScroll();
      if (startY <= targetY + 1) return;

      recoiling = true;
      previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      const startTime = performance.now();
      const duration = 280;

      const step = (time: number) => {
        const elapsed = Math.min(1, (time - startTime) / duration);
        window.scrollTo(0, startY + (targetY - startY) * easeOutQuart(elapsed));
        if (elapsed < 1) {
          recoilFrame = window.requestAnimationFrame(step);
        } else {
          recoilFrame = 0;
          recoiling = false;
          document.documentElement.style.scrollBehavior = previousScrollBehavior;
        }
      };

      recoilFrame = window.requestAnimationFrame(step);
    };

    const onWheel = () => {
      cancelRecoil();
      scheduleProgress();
      if (!finePointer.matches) return;
      recoilTimer = window.setTimeout(() => {
        recoilTimer = 0;
        recoil();
      }, 220);
    };

    const onInterrupt = () => cancelRecoil();

    updateProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onInterrupt, { passive: true });
    window.addEventListener("touchstart", onInterrupt, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onInterrupt);
      window.removeEventListener("touchstart", onInterrupt);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      cancelRecoil();
    };
  }, [motionAllowed]);

  if (motionAllowed !== true) return null;

  return (
    <div className={styles.rainbowRegion} aria-hidden="true">
      <div ref={sentinelRef} className={styles.rainbowSentinel} />
      <div ref={spacerRef} className={styles.rainbowSpacer} />
      <div ref={visualRef} className={styles.rainbowVisual}>
        <svg
          className={styles.rainbowSvg}
          viewBox="0 0 1271 599"
          preserveAspectRatio="none"
          focusable="false"
        >
          <defs>
            <linearGradient id="dia-rainbow-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffc0fd" stopOpacity="0" />
              <stop offset="19.71%" stopColor="#fd02f5" />
              <stop offset="31.73%" stopColor="#fa3d1d" />
              <stop offset="41.34%" stopColor="#ffd400" />
              <stop offset="58.65%" stopColor="#e1ecfe" />
              <stop offset="71.63%" stopColor="#5092c7" />
              <stop offset="81.73%" stopColor="#0358f7" />
              <stop offset="100%" stopColor="#340b05" />
            </linearGradient>
            <filter
              id="dia-rainbow-blur"
              x="-20%"
              y="-10%"
              width="140%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="15" />
            </filter>
          </defs>
          {RAINBOW_BANDS.map((band) => (
            <rect
              key={`${band.x}-${band.height}`}
              x={band.x}
              y={599 - band.height}
              width="174"
              height={band.height}
              fill="url(#dia-rainbow-gradient)"
              filter="url(#dia-rainbow-blur)"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
