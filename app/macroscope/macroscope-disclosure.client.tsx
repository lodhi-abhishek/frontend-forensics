"use client";

import { useId, useState } from "react";
import styles from "./macroscope.module.css";

type Item = readonly [question: string, answer: string];

export function DisclosureList({
  items,
  dark = false,
  initialOpen = null,
}: {
  items: readonly Item[];
  dark?: boolean;
  initialOpen?: number | null;
}) {
  const groupId = useId();
  const [open, setOpen] = useState<number | null>(initialOpen);

  return (
    <div className={`${styles.disclosureList} ${dark ? styles.disclosureDark : ""}`}>
      {items.map(([question, answer], index) => {
        const isOpen = open === index;
        const panelId = `${groupId}-panel-${index}`;
        return (
          <div className={styles.disclosureItem} key={question}>
            <button
              type="button"
              className={styles.disclosureButton}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span>{question}</span>
              <span className={styles.disclosureMark} aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            <div id={panelId} className={styles.disclosurePanel} hidden={!isOpen}>
              <p>{answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
