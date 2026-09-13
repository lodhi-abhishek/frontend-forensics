import type { Metadata } from "next";
import LensScene from "./lens-scene";
import styles from "./macroscope-app.module.css";

export const metadata: Metadata = {
  title: "Macroscope — Lens study",
  description: "An interactive glass lens over a rainbow-lit scene.",
};

export default function MacroscopeAppPage() {
  return (
    <main className={styles.page} aria-label="Interactive glass lens over a rainbow-lit background">
      <LensScene />
    </main>
  );
}
