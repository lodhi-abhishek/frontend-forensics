"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SELECTED_PHRASE, WHEEL_PHRASES, PHRASES } from "./content";
import styles from "./superlogical.module.css";

const AUTOPLAY_INTERVAL = 1500;
const ROTATION_DURATION = 620;
const SPRING_MIN_DISPLACEMENT = 0.002;
const SPRING_MIN_VELOCITY = 0.05;
const DRAG_FLING_BOOST_MIN = 1.35;
const DRAG_FLING_BOOST_MAX = 3.0;

function signedAngle(degrees: number) {
  return ((((degrees + 180) % 360) + 360) % 360) - 180;
}

// Request animation frame with timeout fallback for throttled/headless tabs
function safeRaf(cb: (time: number) => void): number {
  let called = false;
  const rafId = requestAnimationFrame((time) => {
    if (!called) {
      called = true;
      clearTimeout(timerId);
      cb(time);
    }
  });
  const timerId = window.setTimeout(() => {
    if (!called) {
      called = true;
      cancelAnimationFrame(rafId);
      cb(performance.now());
    }
  }, 25);
  return rafId;
}

export function PhraseWheel({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const slotRef = useRef<HTMLSpanElement | null>(null);
  const drumRef = useRef<HTMLSpanElement | null>(null);
  const hitAreaRef = useRef<HTMLSpanElement | null>(null);
  const selectedRef = useRef<HTMLSpanElement | null>(null);
  const rulerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const rowColorRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const [isMobile, setIsMobile] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Active word sets:
  // Desktop: 12 phrases duplicated to 24 items, selected ("all work.") displayed at center
  // Mobile: 13 phrases (selected + 12 phrases) duplicated to 26 items, rotating through center
  const words = isMobile ? PHRASES : WHEEL_PHRASES;
  const rows = [...words, ...words];
  const rowCount = rows.length;
  const stepDegrees = 360 / Math.max(rowCount, 1);

  // Cylinder geometry values
  const radiusEm = 1.3 / ((stepDegrees * Math.PI) / 180);
  const halfEm = radiusEm * 1.04;
  const gapEm = 0.58;
  const lipEm = Math.min(2.08, gapEm + (halfEm - gapEm) * 0.6);
  const reachEm = Math.min(
    Math.max(halfEm * 0.4, lipEm + 0.6),
    lipEm + (halfEm - lipEm) * 0.75,
  );

  // Animation & interaction mutable state
  const thetaRef = useRef(0);
  const velocityRef = useRef(0);
  const flingBoostRef = useRef(1);
  const isSettlingRef = useRef(false);
  const animFrameRef = useRef(0);
  const settleTimerRef = useRef<number | null>(null);
  const autoplayTimerRef = useRef<number | null>(null);

  // Wheel interaction state
  const isWheelScrollingRef = useRef(false);
  const inertialCaptureRef = useRef(false);
  const inertialTimerRef = useRef<number | null>(null);
  const lastWheelTimeRef = useRef(0);
  const lastWheelDeltaSignRef = useRef(0);
  const lastWheelDeltaAbsRef = useRef(0);

  // Pointer interaction state
  const isDraggingRef = useRef(false);
  const activePointerIdRef = useRef(-1);
  const dragStartYRef = useRef(0);
  const lastPointerYRef = useRef(0);
  const dragMaxDistanceRef = useRef(0);
  const pointerSamplesRef = useRef<Array<{ time: number; y: number }>>([]);

  // Visibility & hover state
  const isHoveredRef = useRef(false);
  const isIntersectingRef = useRef(true);
  const isTabVisibleRef = useRef(true);

  // Metrics cache
  const baseFontSizeRef = useRef(0);
  const baseLineHeightRef = useRef(0);
  const baseLetterSpacingRef = useRef(0);

  const cancelAnim = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
  }, []);

  const getLineHeight = useCallback(() => {
    const slot = slotRef.current;
    if (!slot) return 32;
    const computed = getComputedStyle(slot);
    const fontSize = Number.parseFloat(computed.fontSize) || 16;
    return Number.parseFloat(computed.lineHeight) || fontSize * 1.2;
  }, []);

  // Update drum and row transforms
  const render = useCallback(
    (currentTheta: number) => {
      thetaRef.current = currentTheta;
      const drum = drumRef.current;
      if (drum) {
        drum.style.transform = `translateZ(calc(-1 * var(--r))) rotateX(${currentTheta}deg)`;
      }

      // Mobile row highlight
      if (isMobile) {
        for (let i = 0; i < rowColorRefs.current.length; i++) {
          const rowColor = rowColorRefs.current[i];
          if (!rowColor) continue;
          const diff = signedAngle(currentTheta - i * stepDegrees);
          const normalized = Math.max(0, 1 - Math.abs(diff) / stepDegrees);
          const he = 0.08;
          const r = Math.min(1, Math.max(0, (normalized - he) / (0.4 - he)));
          const opacity = r * r * (3 - 2 * r);
          rowColor.style.opacity = `${opacity}`;
        }
      }
    },
    [isMobile, stepDegrees],
  );

  // Damped harmonic spring settle
  const springSettle = useCallback(() => {
    if (settleTimerRef.current !== null) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    cancelAnim();
    isSettlingRef.current = true;

    const currentTheta = thetaRef.current;
    const currentVel = velocityRef.current;
    const boost = flingBoostRef.current;
    const omega = Math.sqrt(120) / boost;
    const hasVel = Math.abs(currentVel) >= stepDegrees * 0.75;
    const projected = hasVel ? currentTheta + currentVel / omega : currentTheta;
    const targetTheta = Math.round(projected / stepDegrees) * stepDegrees;
    const sign = Math.sign(currentVel);
    const displacement = targetTheta - currentTheta;

    const damping =
      hasVel &&
      Math.abs(displacement) > SPRING_MIN_DISPLACEMENT &&
      Math.sign(displacement) === sign
        ? Math.abs(currentVel / displacement)
        : omega * 2;

    const x0 = currentTheta - targetTheta;
    const v0 = currentVel + damping * x0;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = (now - startTime) / 1000;
      const exp = Math.exp(-damping * t);
      const x = (x0 + v0 * t) * exp;
      const nextTheta = targetTheta + x;
      velocityRef.current = (v0 - damping * (x0 + v0 * t)) * exp;
      render(nextTheta);

      const isCloseEnough =
        Math.abs(targetTheta - nextTheta) <= SPRING_MIN_DISPLACEMENT &&
        Math.abs(velocityRef.current) <= SPRING_MIN_VELOCITY;
      const isTimedOut = t > 1.2;

      if (isCloseEnough || isTimedOut) {
        animFrameRef.current = 0;
        velocityRef.current = 0;
        isSettlingRef.current = false;
        flingBoostRef.current = 1;
        render(targetTheta);
        return;
      }
      animFrameRef.current = safeRaf(step);
    };
    animFrameRef.current = safeRaf(step);
  }, [cancelAnim, render, stepDegrees]);

  // Cubic ease-out tween for autoplay transitions
  const animateTo = useCallback(
    (targetTheta: number, duration: number, onComplete?: () => void) => {
      cancelAnim();
      if (reducedMotion || duration <= 0 || Math.abs(targetTheta - thetaRef.current) < 1e-4) {
        render(targetTheta);
        onComplete?.();
        return;
      }

      const startTheta = thetaRef.current;
      const delta = targetTheta - startTheta;
      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        render(startTheta + delta * eased);

        if (progress < 1) {
          animFrameRef.current = safeRaf(step);
        } else {
          animFrameRef.current = 0;
          render(targetTheta);
          onComplete?.();
        }
      };
      animFrameRef.current = safeRaf(step);
    },
    [cancelAnim, reducedMotion, render],
  );

  // Update rolling velocity
  const updateVelocity = useCallback(
    (deltaDegrees: number, elapsedMs: number, maxSteps: number) => {
      const dt = Math.min(Math.max(elapsedMs, 8), 80) / 1000;
      const maxVel = stepDegrees * maxSteps;
      const instantVel = Math.max(-maxVel, Math.min(maxVel, deltaDegrees / dt));
      velocityRef.current =
        velocityRef.current === 0 || Math.sign(instantVel) !== Math.sign(velocityRef.current)
          ? instantVel
          : velocityRef.current * 0.55 + instantVel * 0.45;
    },
    [stepDegrees],
  );

  // Calculate pointer drag release velocity
  const calcPointerVelocity = useCallback(() => {
    const samples = pointerSamplesRef.current;
    if (samples.length < 2) return 0;
    const latest = samples[samples.length - 1];
    const cutoff = latest.time - 100;
    let startTime = samples[0].time;
    let startY = samples[0].y;

    for (let i = 1; i < samples.length; i++) {
      const s = samples[i];
      if (s.time < cutoff) continue;
      const prev = samples[i - 1];
      if (prev.time < cutoff && s.time > prev.time) {
        const fraction = (cutoff - prev.time) / (s.time - prev.time);
        startTime = cutoff;
        startY = prev.y + (s.y - prev.y) * fraction;
      } else {
        startTime = s.time;
        startY = s.y;
      }
      break;
    }

    const dt = Math.max((latest.time - startTime) / 1000, 0.016);
    const pxPerSec = (latest.y - startY) / dt;
    const lh = getLineHeight();
    const maxVelocity = stepDegrees * 48;
    const vel = (-pxPerSec / lh) * stepDegrees;
    return Math.max(-maxVelocity, Math.min(maxVelocity, vel));
  }, [getLineHeight, stepDegrees]);

  // Finish wheel scroll gesture
  const finishWheel = useCallback(() => {
    if (isWheelScrollingRef.current) {
      isWheelScrollingRef.current = false;
      if (performance.now() - lastWheelTimeRef.current < 140) {
        inertialCaptureRef.current = true;
        if (inertialTimerRef.current !== null) clearTimeout(inertialTimerRef.current);
        inertialTimerRef.current = window.setTimeout(() => {
          inertialCaptureRef.current = false;
        }, 140);
      }
      if (!isDraggingRef.current && isSettlingRef.current && animFrameRef.current === 0) {
        springSettle();
      }
    }
  }, [springSettle]);

  // Measurement & geometry sync
  const measureAndApplyMetrics = useCallback(
    (force = false) => {
      const slot = slotRef.current;
      if (!slot) return;

      const computed = getComputedStyle(slot);
      const fontSize = Number.parseFloat(computed.fontSize) || 16;
      const isDesktop = !window.matchMedia("(max-width: 47.999rem)").matches;

      if (!baseFontSizeRef.current || force || isDesktop) {
        baseFontSizeRef.current = fontSize;
        baseLineHeightRef.current = Number.parseFloat(computed.lineHeight) || fontSize * 1.2;
        baseLetterSpacingRef.current = Number.parseFloat(computed.letterSpacing) || 0;
      }

      const scale = isDesktop ? fontSize / (baseFontSizeRef.current || fontSize) : 1;
      const invScale = 1 / (scale || 1);

      let maxWidth = 0;
      for (const r of rulerRefs.current) {
        if (r) maxWidth = Math.max(maxWidth, r.getBoundingClientRect().width);
      }
      const selectedWidth = rulerRefs.current[0]?.getBoundingClientRect().width ?? maxWidth;

      slot.style.width = `${selectedWidth}px`;

      const fieldPanel = document.querySelector("[data-field-panel]");
      const fieldLeft = fieldPanel?.getBoundingClientRect().left ?? window.innerWidth;
      const headingRight = slot.closest("h1")?.getBoundingClientRect().right ?? fieldLeft;
      const slotLeft = slot.getBoundingClientRect().left;

      const visibleWidth = Math.max(0, Math.min(maxWidth, fieldLeft - slotLeft));
      const fadeStart = Math.max(0, Math.min(visibleWidth, headingRight - slotLeft));

      slot.style.setProperty("--wheel-font-size", `${baseFontSizeRef.current}px`);
      slot.style.setProperty("--wheel-line-height", `${baseLineHeightRef.current}px`);
      slot.style.setProperty("--wheel-letter-spacing", `${baseLetterSpacingRef.current}px`);
      slot.style.setProperty("--wheel-scale", `${scale}`);
      slot.style.setProperty("--wheel-width", `${maxWidth * invScale}px`);
      slot.style.setProperty("--visible-wheel-width", `${visibleWidth * invScale}px`);
      slot.style.setProperty("--wheel-fade-start", `${fadeStart * invScale}px`);
      slot.style.setProperty("--wheel-hit-width", `${maxWidth}px`);
      slot.style.setProperty("--visible-wheel-hit-width", `${visibleWidth}px`);

      slot.style.setProperty("--step", `${stepDegrees}deg`);
      slot.style.setProperty("--r", `${radiusEm}em`);
      slot.style.setProperty("--half", `${halfEm}em`);
      slot.style.setProperty("--reach", `${reachEm}em`);
      slot.style.setProperty("--gap", `${gapEm}em`);
      slot.style.setProperty("--lip", `${lipEm}em`);

      setIsMeasured(true);
    },
    [gapEm, halfEm, lipEm, radiusEm, reachEm, stepDegrees],
  );

  // Monitor media query
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 47.999rem)");
    const update = () => {
      setIsMobile(mq.matches);
      measureAndApplyMetrics(true);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [measureAndApplyMetrics]);

  // Monitor visibility and resize
  useEffect(() => {
    const onVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onResize = () => {
      measureAndApplyMetrics(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onResize, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(() => measureAndApplyMetrics(false));
      ro.observe(document.documentElement);
    }

    document.fonts?.ready?.then(() => {
      measureAndApplyMetrics(true);
    });

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [measureAndApplyMetrics]);

  // Monitor viewport visibility for autoplay
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const checkIntersection = () => {
      const rect = slot.getBoundingClientRect();
      isIntersectingRef.current = rect.bottom > 0 && rect.top < window.innerHeight;
    };
    checkIntersection();
    window.addEventListener("scroll", checkIntersection, { passive: true });
    return () => window.removeEventListener("scroll", checkIntersection);
  }, []);

  // Entrance delay
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsEntered(true);
      render(thetaRef.current);
    }, isMobile ? 300 : 200);
    return () => clearTimeout(timer);
  }, [isMobile, render]);

  // Wheel and pointer event listeners
  useEffect(() => {
    const slot = slotRef.current;
    const hitArea = hitAreaRef.current;
    if (!slot || !hitArea || !isMeasured) return;

    // Wheel event handler: captures wheel scrolling over the cylinder and prevents body scroll
    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY || e.deltaX;
      if (!delta) return;

      const path = e.composedPath ? e.composedPath() : [];
      let isOverWheel = path.includes(slot) || (e.target instanceof Node && slot.contains(e.target));
      if (!isOverWheel && e.clientX !== undefined && e.clientY !== undefined) {
        const hitRect = hitArea.getBoundingClientRect();
        if (
          e.clientX >= hitRect.left &&
          e.clientX <= hitRect.right &&
          e.clientY >= hitRect.top &&
          e.clientY <= hitRect.bottom
        ) {
          isOverWheel = true;
        }
      }

      const now = performance.now();

      if (isOverWheel && !isDraggingRef.current) {
        inertialCaptureRef.current = false;
        if (inertialTimerRef.current !== null) clearTimeout(inertialTimerRef.current);
        isWheelScrollingRef.current = true;
      } else if (isWheelScrollingRef.current) {
        finishWheel();
      }

      if (!isWheelScrollingRef.current) {
        if (!inertialCaptureRef.current) return;
        if (
          now - lastWheelTimeRef.current > 55 ||
          Math.sign(delta) !== lastWheelDeltaSignRef.current ||
          Math.abs(delta) > Math.max(1, lastWheelDeltaAbsRef.current * 1.35)
        ) {
          inertialCaptureRef.current = false;
          if (inertialTimerRef.current !== null) clearTimeout(inertialTimerRef.current);
          return;
        }
        e.preventDefault();
        lastWheelTimeRef.current = now;
        lastWheelDeltaSignRef.current = Math.sign(delta);
        lastWheelDeltaAbsRef.current = Math.abs(delta);
        if (inertialTimerRef.current !== null) clearTimeout(inertialTimerRef.current);
        inertialTimerRef.current = window.setTimeout(() => {
          inertialCaptureRef.current = false;
        }, 140);
        return;
      }

      // Intercept scroll: PREVENT WEBPAGE FROM SCROLLING
      e.preventDefault();
      isHoveredRef.current = slot.matches(":hover");
      flingBoostRef.current = 1;

      if (settleTimerRef.current !== null) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
      cancelAnim();
      isSettlingRef.current = true;

      const lh = getLineHeight();
      const deltaPx =
        e.deltaMode === 1
          ? delta * lh
          : e.deltaMode === 2
            ? delta * window.innerHeight
            : delta;
      const stepDelta = (deltaPx / lh) * stepDegrees;
      const elapsed = lastWheelTimeRef.current ? now - lastWheelTimeRef.current : 40;
      if (elapsed > 120) {
        velocityRef.current = 0;
      }
      updateVelocity(stepDelta, elapsed, 8);
      lastWheelTimeRef.current = now;
      lastWheelDeltaSignRef.current = Math.sign(delta);
      lastWheelDeltaAbsRef.current = Math.abs(delta);

      render(thetaRef.current + stepDelta);

      // Snap to nearest row after wheel scrolling ceases
      settleTimerRef.current = window.setTimeout(springSettle, 55);
    };

    // Pointer events on hit area
    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return;
      e.preventDefault();

      if (settleTimerRef.current !== null) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
      cancelAnim();

      try {
        hitArea.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      isDraggingRef.current = true;
      setIsDragging(true);
      isHoveredRef.current = true;
      isSettlingRef.current = true;
      velocityRef.current = 0;
      flingBoostRef.current = DRAG_FLING_BOOST_MIN;
      activePointerIdRef.current = e.pointerId;
      dragStartYRef.current = e.clientY;
      lastPointerYRef.current = e.clientY;
      dragMaxDistanceRef.current = 0;
      pointerSamplesRef.current = [{ time: e.timeStamp || performance.now(), y: e.clientY }];
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || e.pointerId !== activePointerIdRef.current) return;
      e.preventDefault();

      const dy = lastPointerYRef.current - e.clientY;
      if (!dy) return;

      const lh = getLineHeight();
      const stepDelta = (dy / lh) * stepDegrees;
      dragMaxDistanceRef.current = Math.max(
        dragMaxDistanceRef.current,
        Math.abs(e.clientY - dragStartYRef.current),
      );
      lastPointerYRef.current = e.clientY;

      const now = e.timeStamp || performance.now();
      const samples = pointerSamplesRef.current;
      const last = samples[samples.length - 1];
      if (!last || now > last.time || (now === last.time && e.clientY !== last.y)) {
        samples.push({ time: now, y: e.clientY });
      }
      const cutoff = (samples[samples.length - 1]?.time ?? now) - 100;
      const sliceIdx = samples.findIndex((s) => s.time >= cutoff);
      if (sliceIdx > 1) {
        pointerSamplesRef.current = samples.slice(sliceIdx - 1);
      }

      velocityRef.current = calcPointerVelocity();
      render(thetaRef.current + stepDelta);
    };

    const onPointerUp = (e: PointerEvent, cancelled = false) => {
      if (!isDraggingRef.current || e.pointerId !== activePointerIdRef.current) return;

      const now = e.timeStamp || performance.now();
      const samples = pointerSamplesRef.current;
      const last = samples[samples.length - 1];
      const timeSinceLast = last ? Math.max(0, now - last.time) : Infinity;

      velocityRef.current = cancelled || timeSinceLast > 80 ? 0 : calcPointerVelocity();

      const lh = getLineHeight();
      if (Math.abs(velocityRef.current) <= SPRING_MIN_VELOCITY) {
        velocityRef.current = 0;
        flingBoostRef.current = 1;
      } else {
        const distRatio = dragMaxDistanceRef.current / lh;
        const pe = 0.75;
        const t = Math.min(1, Math.max(0, (distRatio - pe) / (6 - pe)));
        const smoothT = t * t * (3 - 2 * t);
        flingBoostRef.current =
          DRAG_FLING_BOOST_MIN + smoothT * (DRAG_FLING_BOOST_MAX - DRAG_FLING_BOOST_MIN);
      }

      isDraggingRef.current = false;
      setIsDragging(false);
      activePointerIdRef.current = -1;

      try {
        if (hitArea.hasPointerCapture(e.pointerId)) {
          hitArea.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }

      isHoveredRef.current = e.pointerType === "mouse" && slot.matches(":hover");
      springSettle();
    };

    const onPointerCancel = (e: PointerEvent) => {
      onPointerUp(e, true);
    };

    const onPointerEnter = () => {
      isHoveredRef.current = true;
    };

    const onPointerLeave = () => {
      isHoveredRef.current = false;
      finishWheel();
    };

    const onBlur = () => {
      isWheelScrollingRef.current = false;
      inertialCaptureRef.current = false;
      if (inertialTimerRef.current !== null) clearTimeout(inertialTimerRef.current);
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        activePointerIdRef.current = -1;
        springSettle();
      }
    };

    slot.addEventListener("pointerenter", onPointerEnter);
    slot.addEventListener("pointerleave", onPointerLeave);
    hitArea.addEventListener("pointerdown", onPointerDown);
    hitArea.addEventListener("pointerup", onPointerUp);
    hitArea.addEventListener("pointercancel", onPointerCancel);
    hitArea.addEventListener("lostpointercapture", onPointerCancel);
    hitArea.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    window.addEventListener("blur", onBlur);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });

    return () => {
      slot.removeEventListener("pointerenter", onPointerEnter);
      slot.removeEventListener("pointerleave", onPointerLeave);
      hitArea.removeEventListener("pointerdown", onPointerDown);
      hitArea.removeEventListener("pointerup", onPointerUp);
      hitArea.removeEventListener("pointercancel", onPointerCancel);
      hitArea.removeEventListener("lostpointercapture", onPointerCancel);
      hitArea.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("wheel", onWheel, { capture: true });

      if (settleTimerRef.current !== null) clearTimeout(settleTimerRef.current);
      if (inertialTimerRef.current !== null) clearTimeout(inertialTimerRef.current);
      cancelAnim();
    };
  }, [
    calcPointerVelocity,
    cancelAnim,
    finishWheel,
    getLineHeight,
    isMeasured,
    render,
    springSettle,
    stepDegrees,
    updateVelocity,
  ]);

  // Autoplay loop when idle
  useEffect(() => {
    if (reducedMotion || !isMeasured || !isEntered) return;

    const interval = window.setInterval(() => {
      if (
        isDraggingRef.current ||
        isWheelScrollingRef.current ||
        isSettlingRef.current ||
        isHoveredRef.current ||
        !isIntersectingRef.current ||
        !isTabVisibleRef.current ||
        animFrameRef.current !== 0
      ) {
        return;
      }
      animateTo(thetaRef.current + stepDegrees, ROTATION_DURATION);
    }, AUTOPLAY_INTERVAL);

    autoplayTimerRef.current = interval;
    return () => {
      clearInterval(interval);
      autoplayTimerRef.current = null;
    };
  }, [animateTo, isEntered, isMeasured, reducedMotion, stepDegrees]);

  return (
    <span
      ref={slotRef}
      className={`${styles["sl-slot"]} ${isMeasured ? styles["is-interactive"] : ""} ${isDragging ? styles["is-dragging"] : ""} ${isEntered ? styles["is-entered"] : ""}`}
    >
      {/* Sizer for layout flow matching selected phrase */}
      <span className={styles.sizer} aria-hidden="true">
        {SELECTED_PHRASE}
      </span>

      {/* Invisible rulers to measure all phrase widths */}
      <span className={styles.rulers} aria-hidden="true">
        {PHRASES.map((phrase, index) => (
          <span
            key={phrase}
            ref={(node) => {
              rulerRefs.current[index] = node;
            }}
          >
            {phrase}
          </span>
        ))}
      </span>

      {/* 3D Wheel Cylinder */}
      <span className={styles.wheel} aria-hidden="true">
        <span className={styles["edge-fade"]}>
          <span className={styles.stage}>
            <span ref={drumRef} className={styles.drum}>
              {rows.map((phrase, index) => (
                <span
                  key={`${phrase}-${index}`}
                  className={styles.row}
                  style={{ "--i": index } as CSSProperties}
                >
                  {phrase}
                  {isMobile ? (
                    <span
                      ref={(node) => {
                        rowColorRefs.current[index] = node;
                      }}
                      className={`${styles["row-color"]} ${styles["gradient-text"]}`}
                    >
                      {phrase}
                    </span>
                  ) : null}
                </span>
              ))}
            </span>
          </span>
        </span>
      </span>

      {/* Interactive hit area capturing pointer drag and wheel events */}
      <span
        ref={hitAreaRef}
        className={`${styles["wheel-hit-area"]} ${isDragging ? styles["is-dragging"] : ""}`}
        aria-hidden="true"
      />

      {/* Selected phrase at center (desktop static gradient text) */}
      <span
        ref={selectedRef}
        className={`${styles.selected} ${styles["gradient-text"]}`}
        aria-hidden="true"
      >
        {SELECTED_PHRASE}
      </span>
    </span>
  );
}
