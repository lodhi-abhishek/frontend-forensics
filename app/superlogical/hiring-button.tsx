"use client";

import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { COPY } from "./content";
import styles from "./superlogical.module.css";

type HiringState = "idle" | "typing" | "ready";

export function HiringButton({ reducedMotion }: { reducedMotion: boolean }) {
  const [state, setState] = useState<HiringState>("idle");
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("");
  const [widths, setWidths] = useState({ idle: 0, command: 0 });
  const idleSizerRef = useRef<HTMLSpanElement>(null);
  const commandSizerRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useLayoutEffect(() => {
    const measure = () => {
      setWidths({
        idle: Math.ceil(idleSizerRef.current?.getBoundingClientRect().width ?? 0),
        command: Math.ceil(
          commandSizerRef.current?.getBoundingClientRect().width ?? 0,
        ),
      });
    };
    measure();
    document.fonts.ready.then(measure).catch(() => undefined);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => clearTimers, []);

  const beginTyping = () => {
    clearTimers();
    setState(reducedMotion ? "ready" : "typing");
    if (reducedMotion) {
      setTyped(COPY.hiringDisplay);
      return;
    }

    setTyped("");
    let elapsed = 0;
    Array.from(COPY.hiringDisplay).forEach((character, index) => {
      const jitter = ((index * 17) % 41) - 12;
      elapsed += 45 + jitter + (character === " " ? 55 : 0);
      timersRef.current.push(
        window.setTimeout(() => {
          setTyped(COPY.hiringDisplay.slice(0, index + 1));
          if (index === COPY.hiringDisplay.length - 1) {
            timersRef.current.push(
              window.setTimeout(() => setState("ready"), 120),
            );
          }
        }, 560 + elapsed),
      );
    });
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(COPY.hiringCommand);
      setStatus("Copied");
    } catch {
      setStatus("Copy unavailable");
    }
    timersRef.current.push(
      window.setTimeout(() => setStatus(""), reducedMotion ? 500 : 1600),
    );
  };

  const expanded = state !== "idle";
  const style = {
    "--hiring-width": `${expanded ? widths.command : widths.idle}px`,
  } as CSSProperties;

  return (
    <span className={styles["sl-hiring-wrap"]}>
      <span ref={idleSizerRef} className={styles["sl-hiring-sizer"]}>
        We&apos;re hiring
      </span>
      <span
        ref={commandSizerRef}
        className={`${styles["sl-hiring-sizer"]} ${styles["is-mono"]}`}
      >
        {COPY.hiringDisplay}
      </span>
      <button
        className={`${styles["sl-hiring"]} ${expanded ? styles["is-ssh"] : ""}`}
        type="button"
        style={style}
        title={COPY.hiringTooltip}
        aria-label={expanded ? `${COPY.hiringDisplay}. Copy command` : "We're hiring"}
        onClick={() => {
          if (state === "idle") beginTyping();
          else if (state === "ready") void copyCommand();
        }}
      >
        <span className={styles["hiring-label"]}>We&apos;re hiring</span>
        <span className={styles["hiring-ssh"]} aria-hidden="true">
          {typed}
          <span className={styles.caret} />
        </span>
      </button>
      {status ? (
        <span
          className={`${styles["sl-message"]} ${styles["sl-message-above"]}`}
          role="status"
          aria-live="polite"
        >
          {status}
        </span>
      ) : null}
    </span>
  );
}
