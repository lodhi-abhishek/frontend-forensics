"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { COPY } from "./content";
import styles from "./superlogical.module.css";

type FormState = "idle" | "submitting" | "success" | "error";

export function SignupForm({ reducedMotion }: { reducedMotion: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const valid = email.length > 0 && inputRef.current?.validity.valid === true;

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = inputRef.current;
    if (!input || !form.checkValidity()) {
      input?.reportValidity();
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setState("submitting");
    setMessage("");
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => {
        timerRef.current = null;
        if (!navigator.onLine) {
          setState("error");
          setMessage(COPY.signupError);
          requestAnimationFrame(() => input.focus());
          return;
        }
        setState("success");
        setMessage(COPY.signupSuccess);
      },
      reducedMotion ? 80 : 650,
    );
  };

  const formClasses = [
    styles["sl-signup-form"],
    valid ? styles["is-valid"] : "",
    state === "success" ? styles["is-done"] : "",
    state === "submitting" ? styles["is-submitting"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={styles["sl-signup"]} aria-labelledby="signup-heading">
      <h2 id="signup-heading" className={styles["sl-signup-heading"]}>
        {COPY.signupHeading}
      </h2>
      <form className={formClasses} onSubmit={submit} noValidate>
        <label className={styles["sr-only"]} htmlFor="superlogical-email">
          Email address
        </label>
        <input
          ref={inputRef}
          id="superlogical-email"
          className={styles["sl-signup-input"]}
          type="email"
          name="email"
          value={email}
          placeholder="Email address"
          autoComplete="email"
          required
          disabled={state === "submitting" || state === "success"}
          aria-describedby="superlogical-signup-hint superlogical-signup-status"
          aria-invalid={state === "error" ? true : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state === "error") {
              setState("idle");
              setMessage("");
            }
          }}
        />
        <input
          className={styles["sl-honeypot"]}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button
          className={styles["sl-signup-submit"]}
          type="submit"
          disabled={state === "submitting" || state === "success"}
          aria-label={state === "success" ? "Signed up" : "Sign up"}
        >
          <svg
            className={styles["icon-arrow"]}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
          <svg
            className={styles["icon-tick"]}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
        </button>
        {message ? (
          <span
            id="superlogical-signup-status"
            className={`${styles["sl-message"]} ${styles["is-field"]}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </span>
        ) : (
          <span id="superlogical-signup-status" className={styles["sr-only"]} />
        )}
      </form>
      <p id="superlogical-signup-hint" className={styles["sr-only"]}>
        {COPY.signupHint}
      </p>
      <p className={styles["sl-signup-note"]}>{COPY.signupNote}</p>
    </section>
  );
}
