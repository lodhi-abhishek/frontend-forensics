"use client";

import Image from "next/image";
import {
  type AnimationEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { media } from "./aeos.data";
import styles from "./aeos.module.css";

const LOADER_FALLBACK_MS = 2700;
const REDUCED_LOADER_FALLBACK_MS = 450;

let hasPlayedAeosLoader = false;

export function LoadingOverlay({ reducedMotion }: { reducedMotion: boolean }) {
  const [mounted, setMounted] = useState(() => !hasPlayedAeosLoader);
  const overlayRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    hasPlayedAeosLoader = true;
    const overlay = overlayRef.current;
    const body = document.body;
    const root = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const bodyPaddingRight = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    const siblings = overlay?.parentElement
      ? Array.from(overlay.parentElement.children).filter(
          (element): element is HTMLElement =>
            element instanceof HTMLElement && element !== overlay,
        )
      : [];
    const previousInert = siblings.map((element) => [element, element.inert] as const);

    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
    }
    siblings.forEach((element) => {
      element.inert = true;
    });

    const ownAnimation = overlay
      ?.getAnimations()
      .find((animation) => animation.effect instanceof KeyframeEffect);
    if (ownAnimation?.playState === "finished") {
      finish();
    }

    const timeout = window.setTimeout(
      finish,
      reducedMotion ? REDUCED_LOADER_FALLBACK_MS : LOADER_FALLBACK_MS,
    );

    return () => {
      window.clearTimeout(timeout);
      body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      previousInert.forEach(([element, inert]) => {
        element.inert = inert;
      });
    };
  }, [finish, mounted, reducedMotion]);

  if (!mounted) return null;

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) finish();
  };

  return (
    <div
      ref={overlayRef}
      className={styles.loadingOverlay}
      role="status"
      aria-live="polite"
      onAnimationEnd={handleAnimationEnd}
    >
      <span className={styles.srOnly}>Loading Aeos Labs</span>
      <div className={styles.loadingAtmosphere} aria-hidden="true" />
      <div className={styles.loadingMark} aria-hidden="true">
        <Image
          className={styles.loadingLogo}
          src={media.logo}
          alt=""
          width={512}
          height={232}
          priority
        />
        <span className={styles.loadingTrace}>
          <span />
        </span>
      </div>
    </div>
  );
}
