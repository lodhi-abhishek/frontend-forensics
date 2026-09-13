"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { videoCards } from "./macroscope.data";
import styles from "./macroscope.module.css";

export function VideoGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);
  const [active, setActive] = useState<number | null>(null);

  const open = (index: number) => {
    setActive(index);
    dialogRef.current?.showModal();
  };
  const close = () => {
    const index = active;
    dialogRef.current?.close();
    setActive(null);
    if (index !== null) triggers.current[index]?.focus();
  };

  return (
    <>
      <div className={styles.videoGrid}>
        {videoCards.map((video, index) => (
          <button ref={(node) => { triggers.current[index] = node; }} type="button" className={styles.videoCard} onClick={() => open(index)} key={video.title} aria-label={video.ariaLabel}>
            <span className={styles.videoPoster}>
              <Image src={video.poster} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
              <span className={styles.playButton} aria-hidden="true">▶</span>
            </span>
          </button>
        ))}
      </div>
      <dialog ref={dialogRef} className={styles.videoDialog} onCancel={(event) => { event.preventDefault(); close(); }}>
        {active !== null && (
          <div>
            <div className={styles.videoDialogTop}><h3>{videoCards[active].title}</h3><button type="button" onClick={close} aria-label="Close video">×</button></div>
            <div className={styles.videoFrame}>
              <iframe src={`https://www.youtube-nocookie.com/embed/${videoCards[active].youtubeId}?autoplay=1&playsinline=1&rel=0`} title={videoCards[active].title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
