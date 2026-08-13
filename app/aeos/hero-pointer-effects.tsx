"use client";

import { type RefObject, useEffect, useRef } from "react";
import styles from "./aeos.module.css";

type CursorVariant = "default" | "magic" | "subtitle" | "interactive" | "text";

type Spring = {
  value: number;
  velocity: number;
};

type HeroPointerEffectsProps = {
  reducedMotion: boolean;
  wordRef: RefObject<HTMLDivElement | null>;
  subtitleRef: RefObject<HTMLSpanElement | null>;
  letterRefs: RefObject<Array<HTMLSpanElement | null>>;
};

const POINTER_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 1200px)";
const LETTER_RADIUS = 70;
const MAX_SCALE_X = 1.2;
const MIN_SCALE_Y = 0.95;
const MAX_STROKE_EM = 0.07;
const MAX_PADDING_EM = 0.05;

const CURSOR_TARGETS: Record<CursorVariant, { size: number; opacity: number }> = {
  default: { size: 15, opacity: 1 },
  magic: { size: 70, opacity: 0 },
  subtitle: { size: 72, opacity: 1 },
  interactive: { size: 36, opacity: 1 },
  text: { size: 15, opacity: 0 },
};

function containsPoint(rect: DOMRect, x: number, y: number) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function stepSpring(
  spring: Spring,
  target: number,
  delta: number,
  stiffness: number,
  damping: number,
) {
  const acceleration = (target - spring.value) * stiffness;
  spring.velocity += acceleration * delta;
  spring.velocity *= Math.exp(-damping * delta);
  spring.value += spring.velocity * delta;

  if (Math.abs(target - spring.value) < 0.0005 && Math.abs(spring.velocity) < 0.0005) {
    spring.value = target;
    spring.velocity = 0;
  }

  return spring.value;
}

export function HeroPointerEffects({
  reducedMotion,
  wordRef,
  subtitleRef,
  letterRefs,
}: HeroPointerEffectsProps) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || reducedMotion) return;

    const pointerQuery = window.matchMedia(POINTER_QUERY);
    let active = false;
    let animationFrame = 0;
    let lastTime = 0;
    let pointerVisible = false;
    let positionInitialized = false;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let currentVariant: CursorVariant = "default";
    const sizeSpring: Spring = { value: CURSOR_TARGETS.default.size, velocity: 0 };
    const opacitySpring: Spring = { value: 0, velocity: 0 };
    const letterSprings = Array.from({ length: 5 }, (): Spring => ({
      value: 0,
      velocity: 0,
    }));

    const resetLetters = (removeProperties = false) => {
      letterRefs.current.forEach((letter) => {
        if (!letter) return;
        if (removeProperties) {
          letter.style.removeProperty("--letter-influence");
          letter.style.removeProperty("--letter-scale-x");
          letter.style.removeProperty("--letter-scale-y");
          letter.style.removeProperty("--letter-stroke");
          letter.style.removeProperty("--letter-padding");
          return;
        }
        letter.style.setProperty("--letter-influence", "0");
        letter.style.setProperty("--letter-scale-x", "1");
        letter.style.setProperty("--letter-scale-y", "1");
        letter.style.setProperty("--letter-stroke", "0em");
        letter.style.setProperty("--letter-padding", "0em");
      });
    };

    const resetSprings = () => {
      letterSprings.forEach((spring) => {
        spring.value = 0;
        spring.velocity = 0;
      });
      sizeSpring.value = CURSOR_TARGETS.default.size;
      sizeSpring.velocity = 0;
      opacitySpring.value = 0;
      opacitySpring.velocity = 0;
    };

    const hideImmediately = () => {
      pointerVisible = false;
      positionInitialized = false;
      lastTime = 0;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      delete document.documentElement.dataset.aeosCursor;
      cursor.style.opacity = "0";
      cursor.style.setProperty(
        "--cursor-scale",
        String(CURSOR_TARGETS.default.size / CURSOR_TARGETS.subtitle.size),
      );
      cursor.dataset.variant = "default";
      currentVariant = "default";
      resetSprings();
      resetLetters();
    };

    const resolveVariant = (
      x: number,
      y: number,
      wordRect: DOMRect | null,
      subtitleRect: DOMRect | null,
    ): CursorVariant => {
      if (wordRect && containsPoint(wordRect, x, y)) return "magic";
      if (subtitleRect && containsPoint(subtitleRect, x, y)) return "subtitle";

      const target = document.elementFromPoint(x, y);
      if (!(target instanceof Element)) return "default";
      if (target.closest("input, textarea, [contenteditable='true']")) return "text";
      if (target.closest("a, button, summary, [role='tab']")) return "interactive";
      return "default";
    };

    const ensureFrame = () => {
      if (!active || animationFrame || document.visibilityState !== "visible") return;
      animationFrame = requestAnimationFrame(draw);
    };

    const draw = (time: number) => {
      animationFrame = 0;
      if (!active) return;

      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.034) : 1 / 60;
      lastTime = time;

      const word = wordRef.current;
      const subtitle = subtitleRef.current;
      const letters = letterRefs.current;
      const wordRect = word?.getBoundingClientRect() ?? null;
      const subtitleRect = subtitle?.getBoundingClientRect() ?? null;
      const letterRects = letters.map((letter) =>
        letter?.getBoundingClientRect() ?? null,
      );
      const insideWordBand = Boolean(
        pointerVisible &&
          wordRect &&
          targetY >= wordRect.top &&
          targetY <= wordRect.bottom,
      );
      const variant = pointerVisible
        ? resolveVariant(targetX, targetY, wordRect, subtitleRect)
        : "default";
      const cursorTarget = CURSOR_TARGETS[variant];

      if (variant !== currentVariant) {
        currentVariant = variant;
        cursor.dataset.variant = variant;
      }

      const positionEase = 1 - Math.exp(-18 * delta);
      currentX += (targetX - currentX) * positionEase;
      currentY += (targetY - currentY) * positionEase;
      const cursorSize = stepSpring(sizeSpring, cursorTarget.size, delta, 500, 48);
      const cursorOpacity = stepSpring(
        opacitySpring,
        pointerVisible ? cursorTarget.opacity : 0,
        delta,
        500,
        48,
      );

      const influences = letterRects.map((rect, index) => {
        const target =
          insideWordBand && rect
            ? Math.max(0, 1 - Math.abs(targetX - (rect.left + rect.right) / 2) / LETTER_RADIUS)
            : 0;
        return stepSpring(letterSprings[index], target, delta, 350, 40);
      });

      influences.forEach((influence, index) => {
        const letter = letters[index];
        if (!letter) return;
        letter.style.setProperty("--letter-influence", influence.toFixed(4));
        letter.style.setProperty(
          "--letter-scale-x",
          (1 + (MAX_SCALE_X - 1) * influence).toFixed(4),
        );
        letter.style.setProperty(
          "--letter-scale-y",
          (1 - (1 - MIN_SCALE_Y) * influence).toFixed(4),
        );
        letter.style.setProperty(
          "--letter-stroke",
          `${(MAX_STROKE_EM * influence).toFixed(4)}em`,
        );
        letter.style.setProperty(
          "--letter-padding",
          `${(MAX_PADDING_EM * influence).toFixed(4)}em`,
        );
      });

      cursor.style.setProperty(
        "--cursor-scale",
        (cursorSize / CURSOR_TARGETS.subtitle.size).toFixed(4),
      );
      cursor.style.opacity = Math.max(0, Math.min(1, cursorOpacity)).toFixed(3);
      cursor.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) translate(-50%, -50%) scale(var(--cursor-scale))`;

      const cursorSettled =
        Math.abs(targetX - currentX) < 0.05 &&
        Math.abs(targetY - currentY) < 0.05 &&
        Math.abs(cursorTarget.size - sizeSpring.value) < 0.01 &&
        Math.abs((pointerVisible ? cursorTarget.opacity : 0) - opacitySpring.value) < 0.001;
      const lettersSettled = letterSprings.every(
        (spring) => Math.abs(spring.velocity) < 0.001,
      );

      if (!cursorSettled || !lettersSettled) ensureFrame();
      else lastTime = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      pointerVisible = true;
      document.documentElement.dataset.aeosCursor = "true";
      if (!positionInitialized) {
        currentX = targetX;
        currentY = targetY;
        positionInitialized = true;
      }
      ensureFrame();
    };

    const onPointerLeave = () => {
      pointerVisible = false;
      delete document.documentElement.dataset.aeosCursor;
      ensureFrame();
    };

    const onViewportChange = () => {
      if (!pointerVisible) return;
      const wordRect = wordRef.current?.getBoundingClientRect();
      if (wordRect && (wordRect.bottom < 0 || wordRect.top > window.innerHeight)) {
        letterSprings.forEach((spring) => {
          spring.value = 0;
          spring.velocity = 0;
        });
        resetLetters();
      }
      ensureFrame();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") hideImmediately();
    };

    const start = () => {
      if (active || !pointerQuery.matches) return;
      active = true;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onViewportChange, { passive: true });
      window.addEventListener("resize", onViewportChange, { passive: true });
      window.addEventListener("blur", onPointerLeave);
      document.documentElement.addEventListener("mouseleave", onPointerLeave);
      document.addEventListener("visibilitychange", onVisibilityChange);
    };

    const stop = () => {
      if (!active) return;
      active = false;
      delete document.documentElement.dataset.aeosCursor;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("blur", onPointerLeave);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      hideImmediately();
      resetLetters(true);
    };

    const onPointerQueryChange = () => {
      if (pointerQuery.matches) start();
      else stop();
    };

    pointerQuery.addEventListener("change", onPointerQueryChange);
    start();

    return () => {
      pointerQuery.removeEventListener("change", onPointerQueryChange);
      stop();
      resetLetters(true);
    };
  }, [letterRefs, reducedMotion, subtitleRef, wordRef]);

  return (
    <div
      ref={cursorRef}
      className={styles.customCursor}
      data-variant="default"
      aria-hidden="true"
    />
  );
}
