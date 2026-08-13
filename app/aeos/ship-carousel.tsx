"use client";

import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import {
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { shipProjects } from "./aeos.data";
import styles from "./aeos.module.css";

export function ShipCarousel({ reducedMotion }: { reducedMotion: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manualAnnouncement, setManualAnnouncement] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.22),
      { threshold: [0, 0.22, 0.55] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const changeSlide = useCallback((nextIndex: number, announce = true) => {
    const normalized = (nextIndex + shipProjects.length) % shipProjects.length;
    setIndex(normalized);
    if (announce) {
      const project = shipProjects[normalized];
      setManualAnnouncement(`Slide ${normalized + 1}: ${project.title}`);
    }
  }, []);

  useEffect(() => {
    if (reducedMotion || paused || hovered || focused || !visible) return;
    const tick = () => {
      if (document.visibilityState === "visible") {
        setIndex((current) => (current + 1) % shipProjects.length);
      }
    };
    const timer = window.setInterval(tick, 5500);
    return () => window.clearInterval(timer);
  }, [focused, hovered, paused, reducedMotion, visible]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStart.current = event.clientX;
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 52) return;
    changeSlide(index + (distance < 0 ? 1 : -1));
  };

  return (
    <div
      ref={rootRef}
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label="Selected Aeos projects"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div
        className={styles.carouselTrack}
        style={{ "--ship-index": index } as React.CSSProperties}
      >
        {shipProjects.map((project, projectIndex) => (
          <article
            key={project.id}
            className={styles.shipSlide}
            data-active={projectIndex === index ? "true" : "false"}
            aria-roledescription="slide"
            aria-label={`${projectIndex + 1} of ${shipProjects.length}`}
            aria-hidden={projectIndex === index ? undefined : true}
          >
            <div className={styles.shipSlideTopline}>
              <span>{project.index}</span>
              <span>{project.category}</span>
            </div>
            <div className={styles.shipVisual} data-visual={project.visual}>
              <div className={styles.visualGrid} aria-hidden="true" />
              <div className={styles.voiceOrb} aria-hidden="true">
                {Array.from({ length: 17 }, (_, bar) => (
                  <i key={bar} style={{ "--bar": bar } as React.CSSProperties} />
                ))}
              </div>
              <div className={styles.videoFrames} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className={styles.languageStack} aria-hidden="true">
                <span>हैलो</span>
                <span>Hello</span>
                <span>Hola</span>
              </div>
              <div className={styles.reportSheet} aria-hidden="true">
                <b />
                <i />
                <i />
                <i />
              </div>
              <span className={styles.visualTag}>AEOS / LABS</span>
            </div>
            <div className={styles.shipSlideCopy}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.carouselControls}>
        <div className={styles.carouselArrows}>
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => changeSlide(index - 1)}
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => changeSlide(index + 1)}
          >
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className={styles.carouselDots} aria-label="Choose a project">
          {shipProjects.map((project, dotIndex) => (
            <button
              key={project.id}
              type="button"
              aria-label={`Show ${project.title}`}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => changeSlide(dotIndex)}
            >
              <span />
            </button>
          ))}
        </div>
        <button
          className={styles.carouselPause}
          type="button"
          aria-label={paused ? "Play project carousel" : "Pause project carousel"}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          <span>{paused ? "Play" : "Pause"}</span>
        </button>
      </div>
      <p className={styles.srOnly} aria-live="polite">
        {manualAnnouncement}
      </p>
    </div>
  );
}
