"use client";

import { useEffect } from "react";
import { DitherField } from "./dither-field";
import styles from "./bwmi.module.css";

const FLUID_ROOT_FONT_SIZE = "clamp(1rem, 1rem + 0.333333vw - 4.8px, 1.5rem)";

export function Bwmi() {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.fontSize;
    root.style.fontSize = FLUID_ROOT_FONT_SIZE;
    return () => {
      root.style.fontSize = previous;
    };
  }, []);

  return (
    <main className={styles.landingShell}>
      <div className={styles.landingBody}>
        <section className={styles.introPanel} aria-labelledby="event-title">
          <div className={styles.heroCopy}>
            <p className={styles.presenter}>
              <strong>Varun Mayya</strong> presents
            </p>
            <h1 id="event-title" className={styles.title}>
              Build what
              <br />
              moves India.
            </h1>
            <p className={styles.eventDescription}>
              A hackathon to rethink public service websites.
              <br />
              Submission deadline:{" "}
              <strong>August 28, 2026 at 8:00 PM IST</strong>.
            </p>
            <div className={styles.heroActions}>
              <a
                className={styles.applyCta}
                href="https://forms.gle/szFiESzejRUmfbow5"
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now
              </a>
              <a
                className={styles.briefCta}
                href="https://buildwhatmovesindia.com/brief"
                target="_blank"
                rel="noopener noreferrer"
              >
                Builder Brief
              </a>
              <a
                className={styles.textCta}
                href="https://buildwhatmovesindia.com/faq"
                target="_blank"
                rel="noopener noreferrer"
              >
                FAQ
              </a>
            </div>
          </div>
          <div className={styles.eventLockup}>
            <div className={styles.sponsorList}>
              <span
                className={styles.openaiMark}
                role="img"
                aria-label="OpenAI"
              />
            </div>
          </div>
        </section>
        <aside className={styles.patternPanel}>
          <DitherField />
        </aside>
      </div>
    </main>
  );
}
