"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";
import styles from "./dot-field.module.css";

/** The reference's eight-pixel halftone field, animated only while on screen. */
export function DotField({ dark = false }: { dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let frame = 0;
    const percent = (value: number) => `${2 * Math.round(value / 2)}%`;
    const unit = (value: number) => (Math.sin(value) + 1) / 2;
    const update = () => {
      const t = (frame++ % 96) / 8;
      const a = .68 * t, b = -.43 * t + 1.7;
      const values = {
        "wave-a-x": percent(50 + 43 * Math.cos(a)), "wave-a-y": percent(48 + 26 * Math.sin(a)),
        "wave-b-x": percent(50 + 39 * Math.cos(b)), "wave-b-y": percent(54 + 31 * Math.sin(b)),
        "ring-a-x": percent(50 + 18 * Math.cos(.19 * t + .5)), "ring-a-y": percent(50 + 14 * Math.sin(.19 * t + .5)),
        "ring-b-x": percent(50 + 28 * Math.cos(-.23 * t + 2.1)), "ring-b-y": percent(51 + 20 * Math.sin(-.23 * t + 2.1)),
        "ring-a-size": percent(20 + 18 * unit(.86 * t)), "ring-b-size": percent(18 + 22 * unit(.44 * t + 2.2)),
        "wave-opacity": (.44 + .06 * unit(.28 * t)).toFixed(2),
      };
      Object.entries(values).forEach(([key, value]) => node.style.setProperty(`--dot-${key}`, value));
    };
    const observer = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting) { update(); timer = setInterval(update, 125); }
    });
    observer.observe(node);
    return () => { observer.disconnect(); clearInterval(timer); };
  }, [reduced]);
  return <div ref={ref} aria-hidden="true" className={`${styles.field} ${dark ? styles.dark : ""}`} />;
}
