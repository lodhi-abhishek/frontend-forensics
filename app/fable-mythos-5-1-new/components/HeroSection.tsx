"use client";

import React, { useEffect, useRef } from "react";
import { createFableHero } from "../fableHeroEngine";

const INDEX_ROWS = [
  { target: "#introduction", label: "Introduction" },
  { target: "#frontier", label: "A new performance frontier" },
  { target: "#scientific-research", label: "Scientific research" },
  { target: "#safety-security-and-alignment", label: "Safety, security, and alignment" },
  { target: "#mythos", label: "Claude Mythos 5.1" },
];

const LEADER_DOTS = ".".repeat(160);

export function HeroSection() {
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const indexRef = useRef<HTMLElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);

  // 1. Entrance blur/fade animation triggered via data-fx-ready
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const setReady = () => {
      header.setAttribute("data-fx-ready", "");
    };

    let timer: NodeJS.Timeout | null = null;
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setReady);
      // Fallback timer to guarantee entrance animation starts smoothly
      timer = setTimeout(setReady, 100);
    } else {
      setReady();
    }

    const onAnimEnd = (e: AnimationEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        target.style.animation = "none";
        target.style.filter = "none";
        target.style.opacity = "1";
      }
    };

    header.addEventListener("animationend", onAnimEnd as any, true);
    return () => {
      if (timer) clearTimeout(timer);
      header.removeEventListener("animationend", onAnimEnd as any, true);
    };
  }, []);

  // 2. Initialize 3D WebGL hero scene, tree foliage, perched bird, and lighting controls
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let disposed = false;
    let heroInstance: any = null;
    let resizeObserver: ResizeObserver | null = null;

    const getShelters = () => {
      const w = header.clientWidth;
      const h = header.clientHeight;
      if (!w || !h) return null;

      const calcBox = (
        el: HTMLElement | null,
        padX: number,
        padY: number
      ): [number, number, number, number] => {
        if (!el || !(el instanceof HTMLElement)) return [0, 0, 0, 0];
        let x = 0;
        let y = 0;
        let curr: HTMLElement | null = el;
        while (curr && curr !== header) {
          x += curr.offsetLeft;
          y += curr.offsetTop;
          curr = curr.offsetParent as HTMLElement | null;
        }
        return [
          (x - padX) / w,
          (y - padY) / h,
          (x + el.offsetWidth + padX) / w,
          (y + el.offsetHeight + padY) / h,
        ];
      };

      return [
        calcBox(titleRef.current, 32, 18),
        calcBox(indexRef.current, 40, 22),
        calcBox(dateRef.current, 56, 30),
      ];
    };

    try {
      const shelters = getShelters();
      heroInstance = createFableHero(header, {
        assets: "/fable-mythos/hero/",
        classes: {
          host: "hero-scene",
          canvas: "hero-canvas",
          drawn: "hero-drawn",
          overBird: "hero-over-bird",
          looks: "hero-looks",
          look: "hero-look",
          on: "hero-on",
          night: "hero-night",
          dusk: "hero-dusk",
          morning: "hero-morning",
          unsupported: "hero-unsupported",
        },
        shelters: shelters as any,
        onLook: (lookName: string) => {
          header.classList.remove("hero-night", "hero-morning", "hero-dusk");
          if (lookName === "night") header.classList.add("hero-night");
          if (lookName === "morning") header.classList.add("hero-morning");
          if (lookName === "dusk") header.classList.add("hero-dusk");
        },
      });

      const updateShelters = () => {
        if (disposed || !heroInstance || typeof heroInstance.setShelters !== "function") return;
        const s = getShelters();
        if (s) {
          heroInstance.setShelters(...s);
        }
      };

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(updateShelters);
        resizeObserver.observe(header);
      }
      if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateShelters);
      }
    } catch (err) {
      console.error("Fable hero WebGL init error:", err);
    }

    return () => {
      disposed = true;
      if (resizeObserver) resizeObserver.disconnect();
      if (heroInstance && typeof heroInstance.dispose === "function") {
        heroInstance.dispose();
      }
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="hero-scene"
      aria-label="Claude Fable and Mythos 5.1"
    >
      <div className="hero-words">
        <p
          ref={dateRef}
          className="hero-date"
        >
          September 2026
        </p>
        <h1
          ref={titleRef}
          className="hero-title"
          aria-label="Claude Fable 5.1 and Mythos 5.1"
        >
          <span
            className="hero-title-line"
            aria-hidden="true"
          >
            <span className="hero-title-claude">
              :Claude:
            </span>{" "}
            Fable 5.1
          </span>
          <span
            className="hero-title-line hero-title-line-second"
            aria-hidden="true"
          >
            and Mythos 5.1
          </span>
        </h1>
        <nav
          ref={indexRef}
          className="hero-index"
          aria-label="Contents"
        >
          {INDEX_ROWS.map((row, idx) => (
            <a
              key={row.target}
              href={row.target}
              className="hero-index-row"
              style={{ ["--fx-row" as any]: idx }}
            >
              <span className="hero-index-row-inner">
                <span className="hero-index-number">
                  [{idx + 1}]
                </span>
                <span
                  className="hero-index-leader"
                  aria-hidden="true"
                >
                  {LEADER_DOTS}
                </span>
                <span>{row.label}</span>
              </span>
            </a>
          ))}
        </nav>
      </div>

      <span className="hero-credit">Made with Fable 5.1</span>
    </header>
  );
}
