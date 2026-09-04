"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./superlogical.module.css";

const MIN_THUMB = 32;

export function PageScrollbar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const activityTimerRef = useRef<number | null>(null);
  const dragRef = useRef<{ pointerId: number; offset: number } | null>(null);
  const metricsRef = useRef({ maxScroll: 0, track: 0, thumb: MIN_THUMB });
  const [progress, setProgress] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [active, setActive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [coarseActive, setCoarseActive] = useState(false);

  const showActivity = useCallback(() => {
    setActive(true);
    if (activityTimerRef.current !== null) {
      window.clearTimeout(activityTimerRef.current);
    }
    activityTimerRef.current = window.setTimeout(() => {
      setActive(false);
      activityTimerRef.current = null;
    }, 700);
  }, []);

  const sync = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const track = root.getBoundingClientRect().height;
    const viewport = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = Math.max(0, documentHeight - viewport);
    const thumb = Math.max(
      MIN_THUMB,
      Math.min(track, track * (viewport / Math.max(documentHeight, viewport))),
    );
    const nextProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    metricsRef.current = { maxScroll, track, thumb };
    setScrollable(maxScroll > 1);
    setProgress(Math.min(1, Math.max(0, nextProgress)));
  }, []);

  useEffect(() => {
    let frame = 0;
    const requestSync = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };
    const onScroll = () => {
      requestSync();
      showActivity();
    };
    const observer = new ResizeObserver(requestSync);
    observer.observe(document.documentElement);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", requestSync);
    sync();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", requestSync);
      if (frame) cancelAnimationFrame(frame);
      if (activityTimerRef.current !== null) {
        window.clearTimeout(activityTimerRef.current);
      }
    };
  }, [showActivity, sync]);

  const scrollToProgress = useCallback((nextProgress: number) => {
    const bounded = Math.min(1, Math.max(0, nextProgress));
    window.scrollTo(0, metricsRef.current.maxScroll * bounded);
  }, []);

  const pointerToProgress = (clientY: number, offset: number) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const available = Math.max(1, metricsRef.current.track - metricsRef.current.thumb);
    scrollToProgress((clientY - rect.top - offset) / available);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrollable || event.button !== 0) return;
    const root = rootRef.current;
    if (!root) return;
    event.preventDefault();
    const rect = root.getBoundingClientRect();
    const available = Math.max(1, metricsRef.current.track - metricsRef.current.thumb);
    const thumbTop = progress * available;
    const localY = event.clientY - rect.top;
    const clickedThumb =
      localY >= thumbTop && localY <= thumbTop + metricsRef.current.thumb;
    const offset = clickedThumb
      ? localY - thumbTop
      : metricsRef.current.thumb / 2;
    dragRef.current = { pointerId: event.pointerId, offset };
    root.setPointerCapture(event.pointerId);
    setDragging(true);
    showActivity();
    pointerToProgress(event.clientY, offset);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    pointerToProgress(event.clientY, drag.offset);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (rootRef.current?.hasPointerCapture(event.pointerId)) {
      rootRef.current.releasePointerCapture(event.pointerId);
    }
    showActivity();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    const max = metricsRef.current.maxScroll;
    if (event.key === "ArrowDown") next = window.scrollY + 40;
    if (event.key === "ArrowUp") next = window.scrollY - 40;
    if (event.key === "PageDown") next = window.scrollY + window.innerHeight * 0.9;
    if (event.key === "PageUp") next = window.scrollY - window.innerHeight * 0.9;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = max;
    if (next === null) return;
    event.preventDefault();
    window.scrollTo(0, Math.min(max, Math.max(0, next)));
    showActivity();
  };

  const style = {
    "--thumb-height": `${metricsRef.current.thumb}px`,
    "--thumb-y": `${progress * Math.max(0, metricsRef.current.track - metricsRef.current.thumb)}px`,
  } as CSSProperties;

  return (
    <>
      <div
        ref={rootRef}
        className={`${styles["sl-scrollbar"]} ${coarseActive ? styles["is-coarse-active"] : ""}`}
        style={style}
        role="scrollbar"
        aria-label="Page scroll"
        aria-controls="article-content"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        tabIndex={scrollable ? 0 : -1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        onMouseEnter={showActivity}
        onFocus={showActivity}
      >
        <span
          className={`${styles["sl-scrollbar-thumb"]} ${active || dragging ? styles["is-active"] : ""} ${dragging ? styles["is-dragging"] : ""}`}
          aria-hidden="true"
        />
      </div>
      <input
        className={styles["sl-scroll-range"]}
        type="range"
        min="0"
        max="100"
        step="0.01"
        value={progress * 100}
        aria-label="Page scroll"
        onPointerDown={() => {
          setCoarseActive(true);
          showActivity();
        }}
        onPointerUp={() => setCoarseActive(false)}
        onPointerCancel={() => setCoarseActive(false)}
        onChange={(event) => scrollToProgress(Number(event.target.value) / 100)}
      />
    </>
  );
}
