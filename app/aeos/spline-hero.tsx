"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { media, splineSceneUrl, splineViewerScriptUrl } from "./aeos.data";
import styles from "./aeos.module.css";

type SplineViewerElement = HTMLElement & {
  play?: () => void;
  pause?: () => void;
  dispose?: () => void;
};

let viewerScriptPromise: Promise<void> | null = null;

function loadViewerScript() {
  if (customElements.get("spline-viewer")) return Promise.resolve();
  if (viewerScriptPromise) return viewerScriptPromise;

  viewerScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${splineViewerScriptUrl}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Spline viewer failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = splineViewerScriptUrl;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Spline viewer failed")), {
      once: true,
    });
    document.head.appendChild(script);
  });

  viewerScriptPromise.catch(() => {
    viewerScriptPromise = null;
  });
  return viewerScriptPromise;
}

export function SplineHero({ reducedMotion }: { reducedMotion: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setReady(false);
      return;
    }
    const mount = mountRef.current;
    if (!mount) return;

    let viewer: SplineViewerElement | null = null;
    let visible = true;
    let destroyed = false;

    const updatePlayback = () => {
      if (!viewer) return;
      if (visible && document.visibilityState === "visible") viewer.play?.();
      else viewer.pause?.();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio > 0.08;
        updatePlayback();
      },
      { threshold: [0, 0.08, 0.35] },
    );

    const onVisibilityChange = () => updatePlayback();

    void loadViewerScript()
      .then(() => customElements.whenDefined("spline-viewer"))
      .then(() => {
        if (destroyed || !mountRef.current) return;
        viewer = document.createElement("spline-viewer") as SplineViewerElement;
        viewer.setAttribute("url", splineSceneUrl);
        viewer.setAttribute("loading-anim-type", "none");
        viewer.setAttribute("aria-hidden", "true");
        viewer.tabIndex = -1;
        viewer.className = styles.splineViewer;
        viewer.addEventListener("load", () => setReady(true), { once: true });
        mountRef.current.appendChild(viewer);
        observer.observe(mountRef.current);
        document.addEventListener("visibilitychange", onVisibilityChange);
        updatePlayback();
      })
      .catch(() => setReady(false));

    return () => {
      destroyed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      viewer?.pause?.();
      viewer?.dispose?.();
      viewer?.remove();
    };
  }, [reducedMotion]);

  return (
    <div className={styles.splineStage} data-ready={ready ? "true" : "false"}>
      <Image
        className={styles.splineFallback}
        src={media.hero}
        alt=""
        fill
        sizes="100vw"
      />
      <div ref={mountRef} className={styles.splineMount} aria-hidden="true" />
      <div className={styles.splineShade} aria-hidden="true" />
    </div>
  );
}
