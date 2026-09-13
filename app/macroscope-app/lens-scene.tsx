"use client";

import { useEffect, useId } from "react";
import styles from "./macroscope-app.module.css";

type Scene = { destroy: () => void };
type Runtime = {
  addScene: (options: {
    elementId: string;
    filePath: string;
    projectId: null;
    scale: number;
    dpi: number;
    fps: number;
    lazyLoad: boolean;
  }) => Promise<Scene>;
};

let runtimePromise: Promise<Runtime> | undefined;
function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = new Promise<Runtime>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/assets/macroscope-app/unicornStudio-2.2.12.umd.js";
      script.async = true;
      script.onload = () => {
        const runtime = (window as Window & { UnicornStudio?: Runtime }).UnicornStudio;
        if (runtime) resolve(runtime);
        else reject(new Error("Lens renderer unavailable"));
      };
      script.onerror = () => {
        script.remove();
        reject(new Error("Lens renderer failed to load"));
      };
      document.head.appendChild(script);
    }).catch((error: unknown) => {
      runtimePromise = undefined;
      throw error;
    });
  }
  return runtimePromise;
}

export default function LensScene() {
  const id = useId();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;

    function start() {
      dispose?.();
      if (motion.matches) return;
      let cancelled = false;
      let scene: Scene | undefined;
      let canvas: HTMLCanvasElement | null = null;
      const destroy = () => {
        canvas?.removeEventListener("webglcontextlost", destroy);
        scene?.destroy();
        scene = undefined;
      };
      dispose = () => {
        cancelled = true;
        destroy();
      };
      void loadRuntime()
        .then((runtime) => {
          if (cancelled) return;
          return runtime.addScene({
            elementId: id,
            filePath: "/assets/macroscope-app/login-lens-scene.json",
            projectId: null,
            scale: 1,
            dpi: Math.min(window.devicePixelRatio, 1.5),
            fps: 60,
            lazyLoad: false,
          });
        })
        .then((loaded) => {
          if (!loaded) return;
          if (cancelled) return loaded.destroy();
          scene = loaded;
          canvas = document.getElementById(id)?.querySelector("canvas") ?? null;
          canvas?.addEventListener("webglcontextlost", destroy);
        })
        .catch(() => {
          // The local background remains visible if WebGL is unavailable.
        });
    }
    start();
    motion.addEventListener("change", start);
    return () => {
      motion.removeEventListener("change", start);
      dispose?.();
    };
  }, [id]);

  return <div id={id} className={styles.scene} aria-hidden="true" />;
}
