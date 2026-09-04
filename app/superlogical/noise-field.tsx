"use client";

import { useEffect, useRef } from "react";
import styles from "./superlogical.module.css";

const FIELD_SCALE = 0.25;
const MAX_DPR = 2;
const MAX_FPS = 30;
const FRAME_INTERVAL = 1000 / MAX_FPS;
const EMPTY_RETRIES = 90;

const NOISE_FREQUENCY = 1.5;
const WARP = 0.34;
const WAVE = 0.06;
const TRAVEL = 1;
const JITTER = 0.008;
const GRAIN_SIZE = 200;

const SHERBET_RAMP = [
  [209, 182, 254],
  [209, 182, 253],
  [210, 181, 249],
  [212, 179, 244],
  [214, 178, 236],
  [217, 175, 227],
  [221, 172, 215],
  [225, 169, 202],
  [230, 165, 187],
  [235, 161, 171],
  [240, 157, 153],
  [246, 152, 133],
  [253, 147, 113],
  [254, 147, 105],
  [253, 151, 106],
  [251, 155, 107],
  [250, 159, 108],
  [248, 163, 109],
  [246, 167, 110],
  [244, 171, 110],
  [243, 176, 111],
  [241, 180, 112],
  [239, 185, 113],
  [237, 189, 114],
  [236, 194, 115],
] as const;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function fade(value: number) {
  return value * value * (3 - 2 * value);
}

function hash2(x: number, y: number) {
  let value = Math.imul(x, 0x1f123bb5) ^ Math.imul(y, 0x5f356495);
  value = Math.imul(value ^ (value >>> 15), 0x6c8e9cf5);
  return ((value ^ (value >>> 13)) >>> 0) / 0xffffffff;
}

function valueNoise(x: number, y: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = fade(x - x0);
  const ty = fade(y - y0);

  const a = hash2(x0, y0);
  const b = hash2(x0 + 1, y0);
  const c = hash2(x0, y0 + 1);
  const d = hash2(x0 + 1, y0 + 1);
  const top = a + (b - a) * tx;
  const bottom = c + (d - c) * tx;

  return (top + (bottom - top) * ty) * 2 - 1;
}

function twoOctaveNoise(x: number, y: number) {
  return valueNoise(x, y) * (2 / 3) + valueNoise(x * 2, y * 2) * (1 / 3);
}

function writeRampColor(
  data: Uint8ClampedArray,
  offset: number,
  value: number,
  reversed: boolean,
) {
  const scaled = clamp01(value) * (SHERBET_RAMP.length - 1);
  const low = Math.floor(scaled);
  const high = Math.min(low + 1, SHERBET_RAMP.length - 1);
  const mix = scaled - low;
  const lowIndex = reversed ? SHERBET_RAMP.length - 1 - low : low;
  const highIndex = reversed ? SHERBET_RAMP.length - 1 - high : high;
  const from = SHERBET_RAMP[lowIndex];
  const to = SHERBET_RAMP[highIndex];

  data[offset] = from[0] + (to[0] - from[0]) * mix;
  data[offset + 1] = from[1] + (to[1] - from[1]) * mix;
  data[offset + 2] = from[2] + (to[2] - from[2]) * mix;
  data[offset + 3] = 255;
}

function createGrainDataUrl() {
  const canvas = document.createElement("canvas");
  canvas.width = GRAIN_SIZE;
  canvas.height = GRAIN_SIZE;
  const context = canvas.getContext("2d");
  if (!context) return "";

  const image = context.createImageData(GRAIN_SIZE, GRAIN_SIZE);
  let state = 0x51f15e5d;

  for (let index = 0; index < image.data.length; index += 4) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const shade = (state >>> 24) & 0xff;
    image.data[index] = shade;
    image.data[index + 1] = shade;
    image.data[index + 2] = shade;
    image.data[index + 3] = 82;
  }

  context.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

export function NoiseField() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const grainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    const grain = grainRef.current;
    if (!panel || !canvas) return;

    let context: CanvasRenderingContext2D | null = null;
    try {
      context = canvas.getContext("2d", { alpha: false });
    } catch {
      context = null;
    }
    if (!context) return;
    const visibleContext = context;

    const bufferCanvas = document.createElement("canvas");
    const bufferContext = bufferCanvas.getContext("2d", { alpha: false });
    if (!bufferContext) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");

    let disposed = false;
    let visible = document.visibilityState !== "hidden";
    let width = 0;
    let height = 0;
    let dpr = 0;
    let fieldWidth = 0;
    let fieldHeight = 0;
    let fieldImage: ImageData | null = null;
    let scrollProgress = 0;
    let dirty = true;
    let frameId = 0;
    let resizeFrameId = 0;
    let timerId = 0;
    let lastRenderTime = -Infinity;
    let emptyRetries = 0;

    if (grain) {
      try {
        const grainUrl = createGrainDataUrl();
        if (grainUrl) grain.style.backgroundImage = `url(${grainUrl})`;
      } catch {
        grain.style.backgroundImage = "none";
      }
    }

    const readScrollProgress = () => {
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight ?? 0,
      );
      const scrollRange = Math.max(1, documentHeight - window.innerHeight);
      return clamp01(window.scrollY / scrollRange);
    };

    const render = (now: number) => {
      if (
        disposed ||
        !visible ||
        !width ||
        !height ||
        !fieldImage ||
        !fieldWidth ||
        !fieldHeight
      ) {
        return;
      }

      const pixels = fieldImage.data;
      const aspect = width / height;
      const travel = reducedMotion.matches ? 0 : scrollProgress * TRAVEL;
      const reversed = darkMode.matches;
      let offset = 0;

      for (let y = 0; y < fieldHeight; y += 1) {
        const v = (y + 0.5) / fieldHeight;
        const domainY = (v + travel) * NOISE_FREQUENCY;

        for (let x = 0; x < fieldWidth; x += 1) {
          const u = (x + 0.5) / fieldWidth;
          const domainX = (u - 0.5) * aspect * NOISE_FREQUENCY;
          const warpX = twoOctaveNoise(domainX + 17.31, domainY - 9.17);
          const warpY = twoOctaveNoise(domainX - 6.43, domainY + 21.79);
          const wave =
            Math.sin((domainX + warpX * WARP + travel) * Math.PI * 2) *
            WAVE;
          const jitter = (hash2(x + 4099, y + 8191) - 0.5) * JITTER;
          const colorPosition = v + warpY * WARP + wave + jitter;

          writeRampColor(pixels, offset, colorPosition, reversed);
          offset += 4;
        }
      }

      bufferContext.putImageData(fieldImage, 0, 0);
      visibleContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      visibleContext.imageSmoothingEnabled = true;
      visibleContext.clearRect(0, 0, width, height);
      visibleContext.drawImage(bufferCanvas, 0, 0, width, height);
      lastRenderTime = now;
    };

    const queueFrame = () => {
      if (disposed || !visible || frameId) return;

      frameId = requestAnimationFrame((now) => {
        frameId = 0;
        if (disposed || !visible || !dirty) return;

        const remaining = FRAME_INTERVAL - (now - lastRenderTime);
        if (remaining > 0) {
          timerId = window.setTimeout(() => {
            timerId = 0;
            queueFrame();
          }, remaining);
          return;
        }

        dirty = false;
        render(now);
      });
    };

    const requestRender = () => {
      dirty = true;
      if (disposed || !visible || frameId || timerId) return;

      const remaining = FRAME_INTERVAL - (performance.now() - lastRenderTime);
      if (remaining > 0) {
        timerId = window.setTimeout(() => {
          timerId = 0;
          queueFrame();
        }, remaining);
      } else {
        queueFrame();
      }
    };

    const resize = () => {
      resizeFrameId = 0;
      if (disposed) return;

      const rect = panel.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);

      if (!nextWidth || !nextHeight) {
        if (emptyRetries < EMPTY_RETRIES) {
          emptyRetries += 1;
          resizeFrameId = requestAnimationFrame(resize);
        }
        return;
      }

      emptyRetries = 0;
      const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const nextFieldWidth = Math.max(1, Math.ceil(nextWidth * FIELD_SCALE));
      const nextFieldHeight = Math.max(1, Math.ceil(nextHeight * FIELD_SCALE));

      if (
        nextWidth !== width ||
        nextHeight !== height ||
        nextDpr !== dpr ||
        nextFieldWidth !== fieldWidth ||
        nextFieldHeight !== fieldHeight
      ) {
        width = nextWidth;
        height = nextHeight;
        dpr = nextDpr;
        fieldWidth = nextFieldWidth;
        fieldHeight = nextFieldHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        bufferCanvas.width = fieldWidth;
        bufferCanvas.height = fieldHeight;
        fieldImage = bufferContext.createImageData(fieldWidth, fieldHeight);
      }

      scrollProgress = readScrollProgress();
      requestRender();
    };

    const handleScroll = () => {
      if (reducedMotion.matches) return;
      const nextProgress = readScrollProgress();
      if (nextProgress === scrollProgress) return;
      scrollProgress = nextProgress;
      requestRender();
    };

    const handleMotionChange = () => {
      scrollProgress = reducedMotion.matches ? 0 : readScrollProgress();
      requestRender();
    };

    const handleColorChange = () => {
      requestRender();
    };

    const handleVisibilityChange = () => {
      visible = document.visibilityState !== "hidden";
      if (!visible) {
        if (frameId) cancelAnimationFrame(frameId);
        if (timerId) window.clearTimeout(timerId);
        frameId = 0;
        timerId = 0;
        dirty = true;
        return;
      }
      scrollProgress = reducedMotion.matches ? 0 : readScrollProgress();
      resize();
    };

    resize();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver === "function") {
      observer = new ResizeObserver(resize);
      observer.observe(panel);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionChange);
    darkMode.addEventListener("change", handleColorChange);

    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionChange);
      darkMode.removeEventListener("change", handleColorChange);
      if (frameId) cancelAnimationFrame(frameId);
      if (resizeFrameId) cancelAnimationFrame(resizeFrameId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, []);

  return (
    <div ref={panelRef} className={styles["sl-field-panel"]} aria-hidden="true">
      <div className={styles["sl-field-panel-canvas"]}>
        <canvas ref={canvasRef} />
        <div ref={grainRef} className={styles.grain} />
      </div>
      <div className={styles["sl-field-inset-shadow"]} />
    </div>
  );
}
