"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./macroscope.module.css";

const unicornScript = "/assets/macroscope/runtime/unicornStudio.umd.js";

type UnicornScene = { destroy: () => void };

type UnicornStudioApi = {
  addScene: (options: { projectId: string; element: HTMLElement; fps: number }) => Promise<UnicornScene>;
};

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioApi;
  }
}

export function SignupTelemetry() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let scene: UnicornScene | undefined;
    let initializing = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let script = document.querySelector<HTMLScriptElement>(`script[src="${unicornScript}"]`);

    const initialize = async () => {
      if (!window.UnicornStudio || !sceneRef.current || cancelled || initializing || motion.matches) return;
      initializing = true;
      try {
        const loaded = await window.UnicornStudio.addScene({
          projectId: "30rpduQRyX8xJHHe3O3J",
          element: sceneRef.current,
          fps: 60,
        });
        if (cancelled || motion.matches) loaded.destroy();
        else {
          scene = loaded;
          setReady(true);
        }
      } catch {
        // Keep the readable fallback and signup link when WebGL or the scene is unavailable.
      } finally {
        initializing = false;
      }
    };

    const updateMotion = () => {
      if (motion.matches) {
        scene?.destroy();
        scene = undefined;
        setReady(false);
      } else void initialize();
    };
    motion.addEventListener("change", updateMotion);

    if (script) {
      if (window.UnicornStudio) void initialize();
      else script.addEventListener("load", initialize, { once: true });
    } else {
      script = document.createElement("script");
      script.src = unicornScript;
      script.async = true;
      script.addEventListener("load", initialize, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", initialize);
      motion.removeEventListener("change", updateMotion);
      scene?.destroy();
    };
  }, []);

  return (
    <div className={`${styles.signupTelemetry} ${ready ? styles.signupTelemetryReady : ""}`}>
      <div className={styles.signupFallback} aria-hidden="true">Sign up</div>
      <div
        ref={sceneRef}
        className={styles.signupUnicornScene}
        aria-hidden="true"
      />
      <a className={styles.signupGithubButton} href="https://app.macroscope.com" aria-label="Sign up with GitHub">
        <Image src="/assets/macroscope/brand/github-black.svg" alt="" width={80} height={80} />
        <span className={styles.signupGithubLabel}>Sign up</span>
      </a>
    </div>
  );
}
