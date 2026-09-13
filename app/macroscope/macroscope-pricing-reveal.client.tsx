"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./macroscope.module.css";

export function PricingReveal({ children }: { children: ReactNode }) {
  const [revealRequest, setRevealRequest] = useState(0);
  const scrollTimer = useRef<number | null>(null);
  const visible = revealRequest > 0;

  const reveal = useCallback(() => {
    setRevealRequest((request) => request + 1);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#pricing") reveal();
    };

    window.addEventListener("macroscope:show-pricing", reveal);
    window.addEventListener("hashchange", handleHash);
    handleHash();

    return () => {
      window.removeEventListener("macroscope:show-pricing", reveal);
      window.removeEventListener("hashchange", handleHash);
    };
  }, [reveal]);

  useEffect(() => {
    if (!visible) return;

    if (scrollTimer.current !== null) {
      window.clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = window.setTimeout(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      document.getElementById("pricing")?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      scrollTimer.current = null;
    }, 350);

    return () => {
      if (scrollTimer.current !== null) {
        window.clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }
    };
  }, [revealRequest, visible]);

  if (!visible) {
    return <div className={styles.pricingAnchor} aria-hidden="true" />;
  }

  return <div className={styles.pricingReveal}>{children}</div>;
}
