"use client";

import { useEffect, useRef } from "react";
import styles from "./bwmi.module.css";

const CELL = 14;
const MAX_DASH = 13;
const MIN_DASH = 2;
const LINE_WIDTH = 1.4;
const RING_PERIOD = 46;
const STROKE_COLOR = "#dfd1df";
const REST_BASE = 0.06;
const REST_AMPLITUDE = 0.78;
const ORIGIN_X = 0.16;
const ORIGIN_Y = 0.78;
const DECAY_SCALE = 1.8;
const CUTOFF = 0.04;

const WAVE_PERIOD = 34;
const WAVE_SPEED_MS = 240;
const RIPPLE_RADIUS = 600;
const RIPPLE_STRENGTH = 0.55;
const POINTER_IDLE_MS = 1200;
const EASE_MS = 130;
const STOP_EPSILON = 0.004;
const MAX_DPR = 2;
const EMPTY_RETRIES = 90;
const MAX_FRAME_DELTA = 64;

type Grid = {
  cols: number;
  rows: number;
  xs: Float32Array;
  ys: Float32Array;
  resting: Float32Array;
};

const EMPTY_GRID: Grid = {
  cols: 0,
  rows: 0,
  xs: new Float32Array(0),
  ys: new Float32Array(0),
  resting: new Float32Array(0),
};

function buildGrid(width: number, height: number): Grid {
  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const xs = new Float32Array(cols);
  const ys = new Float32Array(rows);
  const resting = new Float32Array(cols * rows);

  const offsetX = (width - (cols - 1) * CELL) / 2;
  const offsetY = (height - (rows - 1) * CELL) / 2;
  for (let c = 0; c < cols; c += 1) xs[c] = offsetX + c * CELL;
  for (let r = 0; r < rows; r += 1) ys[r] = offsetY + r * CELL;

  const originX = width * ORIGIN_X;
  const originY = height * ORIGIN_Y;
  const decay = Math.max(width, height) * DECAY_SCALE;

  for (let c = 0; c < cols; c += 1) {
    const dx = xs[c] - originX;
    const rowBase = c * rows;
    for (let r = 0; r < rows; r += 1) {
      const dy = ys[r] - originY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      resting[rowBase + r] =
        REST_BASE +
        REST_AMPLITUDE *
          (0.5 + 0.5 * Math.sin(dist / RING_PERIOD)) *
          Math.exp(-dist / decay);
    }
  }

  return { cols, rows, xs, ys, resting };
}

function dashLength(value: number) {
  if (value <= CUTOFF) return 0;
  const length = Math.min(value, 1) * MAX_DASH;
  return length < MIN_DASH ? 0 : length;
}

export function DitherField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) return;
    const context = ctx;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let disposed = false;
    let width = 0;
    let height = 0;
    let grid = EMPTY_GRID;
    let pointerX = 0;
    let pointerY = 0;
    let strength = 0;
    let pointerActive = false;
    let frameId = 0;
    let startTime = 0;
    let lastFrameTime = 0;
    let lastPointerTime = 0;
    let emptyRetries = 0;
    let wentLive = false;

    const render = (elapsed: number) => {
      if (!width || !height || !grid.cols) return;

      context.clearRect(0, 0, width, height);
      context.strokeStyle = STROKE_COLOR;
      context.lineWidth = LINE_WIDTH;
      context.lineCap = "butt";
      context.beginPath();

      const phase = reducedMotion.matches ? 0 : elapsed / WAVE_SPEED_MS;
      const amplitude = strength > 0.002 ? RIPPLE_STRENGTH * strength : 0;

      for (let c = 0; c < grid.cols; c += 1) {
        const x = grid.xs[c];
        const dx = x - pointerX;
        const nearColumn =
          amplitude > 0 && dx > -RIPPLE_RADIUS && dx < RIPPLE_RADIUS;
        const rowBase = c * grid.rows;

        for (let r = 0; r < grid.rows; r += 1) {
          const y = grid.ys[r];
          let value = grid.resting[rowBase + r];

          if (nearColumn) {
            const dy = y - pointerY;
            if (dy > -RIPPLE_RADIUS && dy < RIPPLE_RADIUS) {
              const distSq = dx * dx + dy * dy;
              if (distSq < RIPPLE_RADIUS * RIPPLE_RADIUS) {
                const dist = Math.sqrt(distSq);
                const falloff = 1 - dist / RIPPLE_RADIUS;
                value +=
                  amplitude *
                  falloff *
                  falloff *
                  Math.sin(dist / WAVE_PERIOD - phase);
              }
            }
          }

          const length = dashLength(value);
          if (!length) continue;

          const half = length / 2;
          const crispY = Math.round(y) + 0.5;
          context.moveTo(x - half, crispY);
          context.lineTo(x + half, crispY);
        }
      }

      context.stroke();

      if (!wentLive) {
        wentLive = true;
        canvas.parentElement?.classList.add(styles.patternLive);
      }
    };

    const tick = (now: number) => {
      if (disposed) return;
      startTime ||= now;
      lastFrameTime ||= now;

      const delta = Math.min(MAX_FRAME_DELTA, now - lastFrameTime);
      lastFrameTime = now;

      if (pointerActive && now - lastPointerTime > POINTER_IDLE_MS) {
        pointerActive = false;
      }

      const target = pointerActive ? 1 : 0;
      strength = reducedMotion.matches
        ? target
        : strength + (target - strength) * (1 - Math.exp(-delta / EASE_MS));

      render(now - startTime);

      if (pointerActive || strength > STOP_EPSILON) {
        frameId = requestAnimationFrame(tick);
      } else {
        frameId = 0;
        lastFrameTime = 0;
        strength = 0;
        render(now - startTime);
      }
    };

    const startLoop = () => {
      frameId ||= requestAnimationFrame(tick);
    };

    const wake = (target: number) => {
      if (!reducedMotion.matches) {
        startLoop();
        return;
      }
      strength = target;
      render(0);
    };

    const resize = () => {
      if (disposed) return;
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);

      if (!nextWidth || !nextHeight) {
        if (emptyRetries < EMPTY_RETRIES) {
          emptyRetries += 1;
          requestAnimationFrame(resize);
        }
        return;
      }

      emptyRetries = 0;
      if (nextWidth === width && nextHeight === height && grid.cols) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      grid = buildGrid(width, height);
      render(0);
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      pointerActive = true;
      lastPointerTime = performance.now();
      wake(1);
    };

    const handlePointerEnd = () => {
      pointerActive = false;
      wake(0);
    };

    resize();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver === "function") {
      observer = new ResizeObserver(resize);
      observer.observe(canvas);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerdown", handlePointer);
    canvas.addEventListener("pointerup", handlePointerEnd);
    canvas.addEventListener("pointerleave", handlePointerEnd);
    canvas.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerdown", handlePointer);
      canvas.removeEventListener("pointerup", handlePointerEnd);
      canvas.removeEventListener("pointerleave", handlePointerEnd);
      canvas.removeEventListener("pointercancel", handlePointerEnd);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.ditherCanvas} aria-hidden="true" />;
}
