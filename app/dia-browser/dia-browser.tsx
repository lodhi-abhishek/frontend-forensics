"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { BrowserScene, FeatureFragment } from "./browser-scenes";
import {
  features,
  footerGroups,
  navItems,
  officialDiaUrl,
  privacyTracks,
  useCases,
} from "./dia-browser.data";
import { RainbowReveal } from "./rainbow-reveal";
import styles from "./dia-browser.module.css";

const PROFILE_FRAMES = [
  {
    face: "M376 83C320 98 280 137 266 193C254 242 268 278 247 314C233 339 204 346 200 369C196 392 216 404 248 408L246 456C245 490 264 519 296 532C334 548 389 542 421 515C454 487 462 445 452 403C443 365 450 333 469 302C492 264 501 213 482 167C464 120 425 72 376 83Z",
    brow: "M282 233C318 211 356 210 389 226",
    mouth: "M255 358C282 371 313 369 337 356",
    eye: "M297 250C319 243 337 245 352 255",
  },
  {
    face: "M368 78C311 94 271 136 259 194C250 241 266 279 242 316C227 339 202 350 199 373C196 394 215 407 247 411L245 460C244 492 263 520 296 535C335 552 389 543 422 514C454 485 462 444 450 401C440 364 448 330 469 297C492 259 500 207 478 160C456 115 416 68 368 78Z",
    brow: "M278 230C314 207 354 206 391 224",
    mouth: "M253 360C281 373 315 370 340 354",
    eye: "M292 247C317 239 338 243 355 253",
  },
  {
    face: "M361 82C305 98 267 140 255 197C246 243 262 278 239 315C223 340 201 353 200 376C199 397 217 410 250 413L248 460C247 493 266 521 299 535C339 551 394 541 425 511C456 482 462 441 448 399C437 364 445 327 468 293C492 256 499 205 475 159C452 116 409 70 361 82Z",
    brow: "M275 231C310 207 353 206 392 226",
    mouth: "M252 362C282 375 318 369 343 352",
    eye: "M289 248C316 239 340 243 357 254",
  },
  {
    face: "M356 88C301 103 263 145 252 201C243 246 260 280 237 317C222 342 200 357 201 379C202 400 220 413 252 415L250 462C249 495 268 523 302 536C342 551 398 539 428 508C458 478 463 437 447 397C434 363 443 324 468 291C493 255 499 205 474 160C449 119 404 76 356 88Z",
    brow: "M273 234C308 210 352 209 393 229",
    mouth: "M252 365C283 376 320 369 346 350",
    eye: "M287 251C315 242 341 246 359 257",
  },
  {
    face: "M361 84C305 98 267 140 255 197C246 243 262 278 239 315C223 340 201 353 200 376C199 397 217 410 250 413L248 460C247 493 266 521 299 535C339 551 394 541 425 511C456 482 462 441 448 399C437 364 445 327 468 293C492 256 499 205 475 159C452 116 409 70 361 84Z",
    brow: "M275 231C310 207 353 206 392 226",
    mouth: "M252 362C282 375 318 369 343 352",
    eye: "M289 248C316 239 340 243 357 254",
  },
  {
    face: "M368 79C311 94 271 136 259 194C250 241 266 279 242 316C227 339 202 350 199 373C196 394 215 407 247 411L245 460C244 492 263 520 296 535C335 552 389 543 422 514C454 485 462 444 450 401C440 364 448 330 469 297C492 259 500 207 478 160C456 115 416 68 368 79Z",
    brow: "M278 230C314 207 354 206 391 224",
    mouth: "M253 360C281 373 315 370 340 354",
    eye: "M292 247C317 239 338 243 355 253",
  },
] as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function ProfileFlipbook({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const reducedMotion = useReducedMotion();
  const [frame, setFrame] = useState(3);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [heroRef]);

  useEffect(() => {
    if (reducedMotion || !visible) return;
    let animationFrame = 0;
    let lastFrame = 0;

    const tick = (time: number) => {
      if (document.visibilityState === "visible" && time - lastFrame >= 125) {
        setFrame((value) => (value + 1) % PROFILE_FRAMES.length);
        lastFrame = time;
      }
      animationFrame = window.requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      lastFrame = performance.now();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    animationFrame = window.requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [reducedMotion, visible]);

  const portrait = PROFILE_FRAMES[reducedMotion ? 3 : frame];

  return (
    <div className={styles.profileStage} aria-hidden="true">
      <svg className={styles.profileSvg} viewBox="0 0 720 660" role="presentation">
        <defs>
          <filter id="dia-roughen">
            <feTurbulence baseFrequency="0.012 0.08" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          </filter>
          <linearGradient id="dia-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.96" />
            <stop offset="0.76" stopColor="#d8d8d8" stopOpacity="0.92" />
            <stop offset="1" stopColor="#777" stopOpacity="0" />
          </linearGradient>
          <clipPath id="dia-portrait-clip">
            <rect x="105" y="42" width="510" height="582" rx="250" />
          </clipPath>
        </defs>
        <g clipPath="url(#dia-portrait-clip)">
          <rect x="105" y="42" width="510" height="582" fill="#080808" />
          <path className={styles.profileEchoFar} d={portrait.face} />
          <path className={styles.profileEcho} d={portrait.face} />
          <path className={styles.profileFill} d={portrait.face} fill="url(#dia-fade)" filter="url(#dia-roughen)" />
          <path className={styles.profileShadow} d="M382 86C352 158 364 221 397 279C428 333 431 410 397 488C437 472 470 435 480 390C490 343 472 314 482 270C496 208 466 121 382 86Z" />
          <path className={styles.profileLine} d={portrait.brow} />
          <path className={styles.profileLine} d={portrait.eye} />
          <path className={styles.profileLine} d={portrait.mouth} />
          <path className={styles.profileDetail} d="M273 275C258 310 248 333 229 352" />
          <path className={styles.profileDetail} d="M300 536C338 559 397 550 429 516" />
          <g className={styles.scanLines}>
            {Array.from({ length: 14 }, (_, index) => (
              <line key={index} x1="130" y1={120 + index * 30} x2="585" y2={120 + index * 30} />
            ))}
          </g>
        </g>
        <rect className={styles.profileFrameLine} x="105" y="42" width="510" height="582" rx="250" />
        <path className={styles.profileMeasure} d="M88 180H128M108 160V200M592 490H632M612 470V510" />
        <text x="78" y="546">FRAME {String(reducedMotion ? 4 : frame + 1).padStart(2, "0")}</text>
        <text x="555" y="92">08 FPS</text>
      </svg>
      <div className={styles.profileCaption}>
        <span>Context in motion</span>
        <span>Original study / 2026</span>
      </div>
    </div>
  );
}

function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const previousOverflowRef = useRef<string | null>(null);
  const [open, setOpen] = useState(false);

  const restoreScroll = useCallback(() => {
    if (previousOverflowRef.current === null) return;
    document.body.style.overflow = previousOverflowRef.current;
    previousOverflowRef.current = null;
  }, []);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setOpen(true);
    dialog.showModal();
    requestAnimationFrame(() => firstLinkRef.current?.focus());
  };

  const closeMenu = useCallback(() => {
    restoreScroll();
    dialogRef.current?.close();
  }, [restoreScroll]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      restoreScroll();
      setOpen(false);
      window.setTimeout(() => triggerRef.current?.focus(), 0);
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", restoreScroll);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", restoreScroll);
      restoreScroll();
    };
  }, [restoreScroll]);

  return (
    <>
      <button
        ref={triggerRef}
        className={styles.menuTrigger}
        type="button"
        aria-label="Open navigation menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="dia-mobile-menu"
        onClick={openMenu}
      >
        <Menu aria-hidden="true" size={20} />
      </button>
      <dialog
        ref={dialogRef}
        id="dia-mobile-menu"
        className={styles.mobileDialog}
        aria-label="Navigation menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className={styles.dialogPanel}>
          <div className={styles.dialogHeader}>
            <a href="#top" onClick={closeMenu} aria-label="Dia home" className={styles.dialogBrand}>dia</a>
            <button type="button" onClick={closeMenu} aria-label="Close navigation menu">
              <X aria-hidden="true" size={20} />
            </button>
          </div>
          <nav className={styles.dialogNav} aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                ref={index === 0 ? firstLinkRef : undefined}
                href={item.href}
                onClick={closeMenu}
              >
                <span>{item.label}</span>
                <ChevronRight aria-hidden="true" size={20} />
              </a>
            ))}
          </nav>
          <a
            className={styles.dialogCta}
            href={officialDiaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            Visit Dia <ArrowUpRight aria-hidden="true" size={17} />
          </a>
          <p>This page is an independent design study and is not affiliated with Dia.</p>
        </div>
      </dialog>
    </>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.navBrand} href="#top" aria-label="Dia home">dia</a>
      <nav className={styles.desktopNav} aria-label="Primary navigation">
        {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>
      <a className={styles.navCta} href={officialDiaUrl} target="_blank" rel="noopener noreferrer">
        Try Dia <ArrowUpRight aria-hidden="true" size={14} />
      </a>
      <MobileMenu />
    </header>
  );
}

function PrivacyMarquee({ items, reverse = false }: { items: readonly string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className={styles.marqueeViewport} aria-hidden="true">
      <div className={`${styles.marqueeTrack} ${reverse ? styles.marqueeReverse : ""}`}>
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`}>
            <Sparkles size={12} /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DiaBrowser() {
  const heroRef = useRef<HTMLElement>(null);
  const useCaseRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeCase, setActiveCase] = useState(useCases[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry?.target.id) setActiveCase(visibleEntry.target.id);
      },
      { rootMargin: "-28% 0px -48%", threshold: [0, 0.25, 0.5, 0.75] },
    );
    useCaseRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.contentLayer}>
        <section ref={heroRef} id="top" className={styles.hero}>
          <Header />
          <div className={styles.heroWordmark} aria-hidden="true">dia</div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>The browser that works with you</p>
            <h1>A new kind of browser.<br /><em>For the work in your head.</em></h1>
            <p className={styles.heroDescription}>
              Dia brings your tabs, questions, and half-finished thoughts into one conversation—so the web feels less like a pile and more like a place to think.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href={officialDiaUrl} target="_blank" rel="noopener noreferrer">
                Visit Dia <ArrowUpRight aria-hidden="true" size={17} />
              </a>
              <a className={styles.textButton} href="#use-cases">
                See how it works <ArrowDown aria-hidden="true" size={16} />
              </a>
            </div>
          </div>
          <ProfileFlipbook heroRef={heroRef} />
          <div className={styles.heroFootnote}>
            <span>Made for macOS</span>
            <span>Scroll to enter</span>
          </div>
        </section>

        <section id="use-cases" className={styles.showcaseSection} aria-labelledby="showcase-heading">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>One browser, three useful shifts</p>
            <h2 id="showcase-heading">The web becomes more useful<br />when it knows what you mean.</h2>
          </div>
          <div className={styles.showcaseLayout}>
            <aside className={styles.caseRail} aria-label="Use cases">
              <p>What Dia does</p>
              <nav>
                {useCases.map((useCase, index) => (
                  <a
                    key={useCase.id}
                    href={`#${useCase.id}`}
                    aria-current={activeCase === useCase.id ? "true" : undefined}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {useCase.label}
                  </a>
                ))}
              </nav>
              <div className={styles.railProgress}>
                <i style={{ "--active-index": useCases.findIndex((item) => item.id === activeCase) } as CSSProperties} />
              </div>
            </aside>
            <div className={styles.caseStack}>
              {useCases.map((useCase, index) => (
                <article
                  key={useCase.id}
                  id={useCase.id}
                  ref={(node) => { useCaseRefs.current[index] = node; }}
                  className={styles.caseArticle}
                >
                  <div className={styles.caseCopy}>
                    <span className={styles.caseNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <p>{useCase.label}</p>
                    <h3>{useCase.title}</h3>
                    <div className={styles.promptQuote}>
                      <Sparkles aria-hidden="true" size={15} />
                      <span>{useCase.prompt}</span>
                    </div>
                    <p className={styles.caseDescription}>{useCase.description}</p>
                  </div>
                  <BrowserScene scene={useCase.scene} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className={styles.featuresSection} aria-labelledby="features-heading">
          <div className={styles.featuresHeading}>
            <p className={styles.eyebrow}>Built around your attention</p>
            <h2 id="features-heading">Less browser management.<br /><em>More movement.</em></h2>
            <p>Dia keeps context close without letting the interface become the work.</p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article
                key={feature.title}
                className={`${styles.featureCard} ${styles[`tone${feature.tone[0].toUpperCase()}${feature.tone.slice(1)}`]} ${feature.size === "wide" ? styles.featureWide : ""}`}
              >
                <div className={styles.featureCopy}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <FeatureFragment fragment={feature.fragment} />
              </article>
            ))}
          </div>
        </section>

        <section id="privacy" className={styles.privacySection} aria-labelledby="privacy-heading">
          <div className={styles.privacyFrame}>
            <div className={styles.privacyCopy}>
              <p className={styles.eyebrow}>Your browser sees a lot</p>
              <h2 id="privacy-heading">So you should always see<br /><em>what it remembers.</em></h2>
              <p>
                Dia is most useful when context is explicit. Choose the pages it can use, pause memory, keep a chat temporary, and clear what no longer belongs.
              </p>
              <a href={officialDiaUrl} target="_blank" rel="noopener noreferrer">
                Read Dia’s privacy information <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            </div>
            <div className={styles.privacyTracks}>
              <PrivacyMarquee items={privacyTracks[0]} />
              <PrivacyMarquee items={privacyTracks[1]} reverse />
            </div>
          </div>
        </section>

        <section className={styles.closingCta} aria-labelledby="closing-heading">
          <div className={styles.ctaGlyph} aria-hidden="true"><Sparkles size={28} fill="currentColor" /></div>
          <p className={styles.eyebrow}>Your next tab can be the beginning</p>
          <h2 id="closing-heading">Browse like your ideas<br /><em>belong together.</em></h2>
          <a className={styles.primaryButton} href={officialDiaUrl} target="_blank" rel="noopener noreferrer">
            Go to Dia <ArrowRight aria-hidden="true" size={17} />
          </a>
          <small>Availability and system requirements are set by Dia.</small>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerTop}>
            <a className={styles.footerBrand} href="#top" aria-label="Back to top">dia</a>
            <p>A browser for the work in your head.</p>
            <a className={styles.backToTop} href="#top">Back to top <ArrowUpRight aria-hidden="true" size={14} /></a>
          </div>
          <div className={styles.footerGrid}>
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                    {"external" in link && link.external && <ArrowUpRight aria-hidden="true" size={12} />}
                  </a>
                ))}
              </div>
            ))}
            <div className={styles.footerNote}>
              <h3>About this page</h3>
              <p>
                An independently authored front-end design study. Not affiliated with, endorsed by, or produced by Dia or The Browser Company. Product names belong to their respective owners.
              </p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>Independent study · 2026</span>
            <span>Original interface scenes and artwork</span>
          </div>
        </footer>
      </div>
      <RainbowReveal />
    </main>
  );
}
