"use client";

import { useEffect, useRef } from "react";
import styles from "./aeos.module.css";

export function VisibilityVideo({
  src,
  reducedMotion,
}: {
  src: string;
  reducedMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let visible = false;
    const update = () => {
      if (visible && !reducedMotion && document.visibilityState === "visible") {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio > 0.28;
        update();
      },
      { threshold: [0, 0.28, 0.65] },
    );

    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [reducedMotion]);

  return (
    <video
      ref={videoRef}
      className={styles.statementVideo}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
