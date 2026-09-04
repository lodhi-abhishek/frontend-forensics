"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { PHRASES } from "./content";
import styles from "./superlogical.module.css";

const AUTOPLAY_INTERVAL = 1500;
const ROTATION_DURATION = 620;
const ROW_COUNT = 26;
const STEP_DEGREES = 360 / ROW_COUNT;
const DRAG_PROJECTION_MS = 220;
const MAX_PROJECTED_STEPS = 5;

const rows = [...PHRASES, ...PHRASES];
const widestPhrase = PHRASES.reduce((widest, phrase) =>
  phrase.length > widest.length ? phrase : widest,
);

const easeInOutCubic = (progress: number) =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

const signedAngle = (angle: number) =>
  ((((angle + 180) % 360) + 360) % 360) - 180;

export function PhraseWheel({ reducedMotion }: { reducedMotion: boolean }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const drumRef = useRef<HTMLSpanElement>(null);
  const selectedRef = useRef<HTMLSpanElement>(null);
  const hitAreaRef = useRef<HTMLSpanElement>(null);
  const rowColorRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const drum = drumRef.current;
    const selected = selectedRef.current;
    const hitArea = hitAreaRef.current;

    if (reducedMotion || !root || !stage || !drum || !selected || !hitArea) {
      setDragging(false);
      return;
    }

    type Animation = {
      from: number;
      to: number;
      duration: number;
      elapsed: number;
      lastTime: number | null;
      fadeSelected: boolean;
    };

    type Drag = {
      pointerId: number;
      startY: number;
      startTheta: number;
      lastTheta: number;
      lastTime: number;
      velocity: number;
    };

    let theta = 0;
    let selectedOpacity = 1;
    let animation: Animation | null = null;
    let drag: Drag | null = null;
    let animationFrame = 0;
    let autoplayTimer: number | null = null;
    let heroVisible = false;
    let documentVisible = document.visibilityState === "visible";
    let destroyed = false;

    const canAnimate = () => heroVisible && documentVisible && drag === null;

    const render = (nextTheta: number, nextSelectedOpacity = selectedOpacity) => {
      theta = nextTheta;
      selectedOpacity = nextSelectedOpacity;
      drum.style.setProperty("--theta", `${theta}deg`);
      selected.style.opacity = `${selectedOpacity}`;
      stage.style.opacity = `${1 - selectedOpacity}`;

      rowColorRefs.current.forEach((rowColor, index) => {
        if (!rowColor) return;
        const distance = Math.abs(
          signedAngle(theta - index * STEP_DEGREES),
        );
        const proximity = Math.max(
          0,
          1 - distance / (STEP_DEGREES * 1.15),
        );
        rowColor.style.opacity = `${proximity * proximity * (1 - selectedOpacity)}`;
      });
    };

    const clearAutoplay = () => {
      if (autoplayTimer === null) return;
      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
    };

    const stopAnimationFrame = () => {
      if (!animationFrame) return;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      if (animation) animation.lastTime = null;
    };

    const animate = (time: number) => {
      animationFrame = 0;
      if (!animation || destroyed || !canAnimate()) return;

      if (animation.lastTime !== null) {
        animation.elapsed += Math.min(time - animation.lastTime, 34);
      }
      animation.lastTime = time;

      const progress = Math.min(1, animation.elapsed / animation.duration);
      const eased = easeInOutCubic(progress);
      render(
        animation.from + (animation.to - animation.from) * eased,
        animation.fadeSelected ? 1 - eased : selectedOpacity,
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      render(animation.to, animation.fadeSelected ? 0 : selectedOpacity);
      animation = null;
    };

    const resumeAnimation = () => {
      if (!animation || animationFrame || !canAnimate()) return;
      animation.lastTime = null;
      animationFrame = requestAnimationFrame(animate);
    };

    const startAnimation = (
      targetTheta: number,
      duration: number,
      fadeSelected = false,
    ) => {
      stopAnimationFrame();
      animation = {
        from: theta,
        to: targetTheta,
        duration,
        elapsed: 0,
        lastTime: null,
        fadeSelected,
      };
      resumeAnimation();
    };

    const scheduleAutoplay = () => {
      clearAutoplay();
      if (!canAnimate()) return;
      autoplayTimer = window.setTimeout(() => {
        autoplayTimer = null;
        const nextStep = Math.round(theta / STEP_DEGREES) + 1;
        startAnimation(
          nextStep * STEP_DEGREES,
          ROTATION_DURATION,
          selectedOpacity > 0,
        );
        scheduleAutoplay();
      }, AUTOPLAY_INTERVAL);
    };

    const syncActivity = () => {
      if (!canAnimate()) {
        clearAutoplay();
        stopAnimationFrame();
        return;
      }
      resumeAnimation();
      scheduleAutoplay();
    };

    const moveDrag = (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const pixelsPerStep = Math.max(root.getBoundingClientRect().height, 18);
      const nextTheta =
        drag.startTheta -
        ((event.clientY - drag.startY) / pixelsPerStep) * STEP_DEGREES;
      const now = performance.now();
      const elapsed = Math.max(1, now - drag.lastTime);
      const instantVelocity = (nextTheta - drag.lastTheta) / elapsed;
      drag.velocity = drag.velocity * 0.65 + instantVelocity * 0.35;
      drag.lastTheta = nextTheta;
      drag.lastTime = now;
      render(nextTheta, 0);
    };

    const finishDrag = (pointerId: number, cancelled: boolean) => {
      if (!drag || drag.pointerId !== pointerId) return;

      const velocity = cancelled ? 0 : drag.velocity;
      const projectedDistance = Math.max(
        -STEP_DEGREES * MAX_PROJECTED_STEPS,
        Math.min(
          STEP_DEGREES * MAX_PROJECTED_STEPS,
          velocity * DRAG_PROJECTION_MS,
        ),
      );
      const target =
        Math.round((theta + projectedDistance) / STEP_DEGREES) *
        STEP_DEGREES;
      const distanceInSteps = Math.abs(target - theta) / STEP_DEGREES;
      const duration = Math.min(
        ROTATION_DURATION,
        Math.max(260, 260 + distanceInSteps * 90),
      );

      drag = null;
      setDragging(false);
      startAnimation(target, duration);
      syncActivity();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (
        !event.isPrimary ||
        (event.pointerType === "mouse" && event.button !== 0)
      ) {
        return;
      }

      event.preventDefault();
      clearAutoplay();
      stopAnimationFrame();
      animation = null;

      if (selectedOpacity > 0) {
        render(0, 0);
      }

      drag = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startTheta: theta,
        lastTheta: theta,
        lastTime: performance.now(),
        velocity: 0,
      };
      hitArea.setPointerCapture(event.pointerId);
      setDragging(true);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      event.preventDefault();
      moveDrag(event);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      moveDrag(event);
      const pointerId = event.pointerId;
      finishDrag(pointerId, false);
      if (hitArea.hasPointerCapture(pointerId)) {
        hitArea.releasePointerCapture(pointerId);
      }
    };

    const onPointerCancel = (event: PointerEvent) => {
      const pointerId = event.pointerId;
      finishDrag(pointerId, true);
      if (hitArea.hasPointerCapture(pointerId)) {
        hitArea.releasePointerCapture(pointerId);
      }
    };

    const onLostPointerCapture = (event: PointerEvent) => {
      finishDrag(event.pointerId, true);
    };

    const observedHero = root.closest("section") ?? root;
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting && entry.intersectionRatio > 0;
        syncActivity();
      },
      { threshold: [0, 0.01] },
    );

    const onVisibilityChange = () => {
      documentVisible = document.visibilityState === "visible";
      syncActivity();
    };

    render(theta, selectedOpacity);
    observer.observe(observedHero);
    document.addEventListener("visibilitychange", onVisibilityChange);
    hitArea.addEventListener("pointerdown", onPointerDown);
    hitArea.addEventListener("pointermove", onPointerMove);
    hitArea.addEventListener("pointerup", onPointerUp);
    hitArea.addEventListener("pointercancel", onPointerCancel);
    hitArea.addEventListener("lostpointercapture", onLostPointerCapture);

    return () => {
      destroyed = true;
      clearAutoplay();
      stopAnimationFrame();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      hitArea.removeEventListener("pointerdown", onPointerDown);
      hitArea.removeEventListener("pointermove", onPointerMove);
      hitArea.removeEventListener("pointerup", onPointerUp);
      hitArea.removeEventListener("pointercancel", onPointerCancel);
      hitArea.removeEventListener("lostpointercapture", onLostPointerCapture);
      if (drag && hitArea.hasPointerCapture(drag.pointerId)) {
        hitArea.releasePointerCapture(drag.pointerId);
      }
    };
  }, [reducedMotion]);

  return (
    <span ref={rootRef} className={styles["sl-slot"]}>
      <span className={styles.sizer} aria-hidden="true">
        {widestPhrase}
      </span>
      {reducedMotion ? null : (
        <span ref={stageRef} className={styles["edge-fade"]} aria-hidden="true">
          <span className={styles.stage}>
            <span ref={drumRef} className={styles.drum}>
              {rows.map((phrase, index) => (
                <span
                  key={`${phrase}-${index}`}
                  className={styles.row}
                  style={{ "--i": index } as CSSProperties}
                >
                  {phrase}
                  <span
                    ref={(node) => {
                      rowColorRefs.current[index] = node;
                    }}
                    className={`${styles["row-color"]} ${styles["gradient-text"]}`}
                  >
                    {phrase}
                  </span>
                </span>
              ))}
            </span>
          </span>
        </span>
      )}
      <span
        ref={selectedRef}
        className={`${styles.selected} ${styles["gradient-text"]}`}
        aria-hidden="true"
      >
        {PHRASES[0]}
      </span>
      {reducedMotion ? null : (
        <span
          ref={hitAreaRef}
          className={`${styles["wheel-hit-area"]} ${dragging ? styles["is-dragging"] : ""}`}
          aria-hidden="true"
        />
      )}
      <span className={styles["sr-only"]}>{PHRASES[0]}</span>
    </span>
  );
}
