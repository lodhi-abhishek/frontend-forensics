"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight, Menu, Plus, X } from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ContactForm } from "./contact-form";
import {
  clients,
  media,
  navItems,
  processSteps,
  services,
  socialLinks,
} from "./aeos.data";
import { ShipCarousel } from "./ship-carousel";
import { SplineHero } from "./spline-hero";
import styles from "./aeos.module.css";
import { VisibilityVideo } from "./visibility-video";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function Header({
  onOpen,
  triggerRef,
}: {
  onOpen: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#top" aria-label="Aeos Labs home">
        <Image src={media.logo} alt="Aeos Labs" width={142} height={64} priority />
      </a>
      <button
        ref={triggerRef}
        className={styles.menuButton}
        type="button"
        onClick={onOpen}
        aria-label="Open navigation"
        aria-haspopup="dialog"
      >
        <span>Menu</span>
        <Menu aria-hidden="true" />
      </button>
    </header>
  );
}

function FullscreenMenu({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const oldOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => firstLinkRef.current?.focus());
      return () => {
        document.body.style.overflow = oldOverflow;
      };
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = useCallback(() => {
    onClose();
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [onClose, triggerRef]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.menuDialog}
      aria-label="Aeos Labs navigation"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className={styles.menuPanel}>
        <div className={styles.menuTopline}>
          <span>AEOS / LABS</span>
          <button type="button" onClick={close} aria-label="Close navigation">
            <span>Close</span>
            <X aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Main navigation">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              ref={index === 0 ? firstLinkRef : undefined}
              href={item.href}
              onClick={close}
              style={{ "--menu-index": index } as React.CSSProperties}
            >
              <span>{item.label}</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div className={styles.menuFooter}>
          <span>Bangalore, India</span>
          <span>AI · VIDEO · ENGINEERING</span>
        </div>
      </div>
    </dialog>
  );
}

function CustomCursor({ reducedMotion }: { reducedMotion: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrame = 0;

    const draw = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      animationFrame = requestAnimationFrame(draw);
    };
    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.dataset.visible = "true";
      const target = event.target as HTMLElement;
      cursor.dataset.active = target.closest("a, button, summary, [role='tab']")
        ? "true"
        : "false";
    };
    const onLeave = () => {
      cursor.dataset.visible = "false";
    };

    document.documentElement.dataset.aeosCursor = "true";
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    animationFrame = requestAnimationFrame(draw);
    return () => {
      delete document.documentElement.dataset.aeosCursor;
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, [reducedMotion]);

  return <div ref={cursorRef} className={styles.customCursor} aria-hidden="true" />;
}

function Hero({ reducedMotion }: { reducedMotion: boolean }) {
  const letters = ["m", "a", "g", "i", "c"];
  return (
    <section className={styles.hero} id="top" aria-labelledby="aeos-title">
      <div className={styles.heroAtmosphere} aria-hidden="true" />
      <h1 id="aeos-title" className={styles.srOnly}>
        Magic as a service
      </h1>
      <div className={styles.heroComposition} aria-hidden="true">
        <div className={styles.magicWord}>
          {letters.map((letter, index) => (
            <span key={letter} style={{ "--letter-index": index } as React.CSSProperties}>
              {letter}
            </span>
          ))}
        </div>
        <p className={styles.asAService}>as a service</p>
      </div>
      <SplineHero reducedMotion={reducedMotion} />
      <div className={styles.heroCopy} data-reveal>
        <p>
          We are Aeos Labs, an engineering team that specializes in AI &amp; Video
          Technology
        </p>
        <span>Based in Bangalore, India. Tinkering since 2022.</span>
      </div>
      <a className={styles.heroScroll} href="#clients" aria-label="Scroll to clients">
        <ArrowDown aria-hidden="true" />
      </a>
    </section>
  );
}

function ClientMarquee() {
  const sequence = clients.map((client) => (
    <span key={client} className={styles.clientName}>
      {client}
      <i aria-hidden="true">✦</i>
    </span>
  ));

  return (
    <section className={styles.clients} id="clients" aria-label="Clients we have worked with">
      <p>Clients we’ve worked with</p>
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeGroup}>{sequence}</div>
          <div className={styles.marqueeGroup} aria-hidden="true">
            {sequence}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatWeDo() {
  const [active, setActive] = useState(services[0].id);
  const selected = services.find((service) => service.id === active) ?? services[0];
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = services.findIndex((service) => service.id === active);
    let next = current;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = current + 1;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = services.length - 1;
    else return;
    event.preventDefault();
    const normalized = (next + services.length) % services.length;
    setActive(services[normalized].id);
    tabRefs.current[normalized]?.focus();
  };

  return (
    <section className={styles.servicesSection} id="what-we-do">
      <div className={styles.servicesPanel} data-reveal>
        <div className={styles.servicesIntro}>
          <p className={styles.eyebrow}>What we do</p>
          <h2>
            We bring AI, engineering &amp; <em>content expertise</em>
          </h2>
          <p>
            Each problem is looked at from a fresh lens to provide you with a
            solution that solves your specific requirements and integrates with your
            existing infrastructure.
          </p>
        </div>
        <div className={styles.servicesBody}>
          <div
            className={styles.serviceTabs}
            role="tablist"
            aria-label="Aeos services"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
          >
            {services.map((service, index) => (
              <button
                key={service.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`tab-${service.id}`}
                role="tab"
                type="button"
                tabIndex={service.id === active ? 0 : -1}
                aria-selected={service.id === active}
                aria-controls={`panel-${service.id}`}
                onClick={() => setActive(service.id)}
              >
                <span>{service.label}</span>
                <ArrowUpRight aria-hidden="true" />
              </button>
            ))}
          </div>
          <div
            key={selected.id}
            className={styles.serviceDetail}
            role="tabpanel"
            id={`panel-${selected.id}`}
            aria-labelledby={`tab-${selected.id}`}
            tabIndex={0}
          >
            <div className={styles.serviceArtwork}>
              <Image src={media.serviceArt} alt="" fill sizes="(max-width: 800px) 90vw, 45vw" />
              <span>{selected.accent}</span>
            </div>
            <div>
              <h3>{selected.title}</h3>
              <p>{selected.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatementSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section className={styles.statement} id="statement">
      <VisibilityVideo src={media.statement} reducedMotion={reducedMotion} />
      <div className={styles.statementScrim} aria-hidden="true" />
      <h2 data-reveal>
        The AI landscape is changing fast — <em>we’ll stay on top of it for you</em>
      </h2>
    </section>
  );
}

function WeShip({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section className={styles.weShip} id="we-ship">
      <header className={styles.shipHeader} data-reveal>
        <p className={styles.eyebrow}>You’re in good hands</p>
        <h2>
          We Ship. <em>All the time.</em>
        </h2>
        <p>
          We work with teams across industries, we speak to experts, we do our
          research and we are always experimenting all day, everyday. We’ve been
          building technology for a long time and it shows.
        </p>
      </header>
      <ShipCarousel reducedMotion={reducedMotion} />
    </section>
  );
}

function ProcessSection() {
  return (
    <section className={styles.process} id="process" aria-label="How Aeos works">
      {processSteps.map((step, index) => (
        <article
          className={styles.processStep}
          key={step.id}
          aria-labelledby={`process-title-${step.id}`}
          style={{ "--step-index": index } as React.CSSProperties}
        >
          <div className={styles.processStepInner}>
            <header className={styles.processHeading}>
              <p className={styles.processNumber}>({step.number})</p>
              <h2 id={`process-title-${step.id}`}>{step.title}</h2>
            </header>
            <p className={styles.processDescription}>{step.description}</p>
            <div className={styles.processIcon} aria-hidden="true">
              <Image
                src={step.image}
                alt=""
                fill
                sizes="(max-width: 1199px) 68px, 198px"
              />
            </div>
            <details className={styles.processDetails}>
              <summary>
                <span>{step.summary}</span>
                <Plus aria-hidden="true" />
              </summary>
              <ul>
                {step.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </details>
          </div>
        </article>
      ))}
    </section>
  );
}

function ContactSection() {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.contactIntro} data-reveal>
        <p className={styles.eyebrow}>Work with us today</p>
        <h2>
          Ready to <em>Upgrade?</em>
        </h2>
        <p>
          Dive into the future with Aeos Labs. Get in touch and build out a smarter,
          more automated org.
        </p>
        <div className={styles.contactImage}>
          <Image src={media.contact} alt="" fill sizes="(max-width: 800px) 92vw, 40vw" />
        </div>
      </div>
      <div className={styles.contactFormPanel} data-reveal>
        <ContactForm />
      </div>
    </section>
  );
}

function TalkToUsCta({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <a className={styles.talkCta} href="#contact" aria-label="Talk to Aeos Labs">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path
            id="talk-path"
            d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
          />
        </defs>
        <text className={reducedMotion ? styles.noSpin : undefined}>
          <textPath href="#talk-path">TALK TO US · TALK TO US · </textPath>
        </text>
      </svg>
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <Image src={media.footer} alt="Aeos Labs" width={512} height={232} />
        <p>Magic, engineered in Bangalore.</p>
      </div>
      <div className={styles.footerLinks}>
        <div>
          <span>Follow</span>
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </div>
        <div>
          <span>Navigate</span>
          {navItems.slice(1).map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>® Everto Technologies LLP</p>
        <div aria-label="Legal information">
          <span>Terms &amp; Conditions</span>
          <span aria-hidden="true">•</span>
          <span>Privacy Policy</span>
        </div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

export function Aeos() {
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const page = document.querySelector<HTMLElement>(`.${styles.page}`);
    if (!page) return;
    page.dataset.motionReady = reducedMotion ? "false" : "true";
    const elements = Array.from(page.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reducedMotion) {
      elements.forEach((element) => (element.dataset.visible = "true"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.13, rootMargin: "0px 0px -5% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#what-we-do">
        Skip to content
      </a>
      <Header
        onOpen={() => setMenuOpen(true)}
        triggerRef={dialogTriggerRef}
      />
      <FullscreenMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={dialogTriggerRef}
      />
      <Hero reducedMotion={reducedMotion} />
      <ClientMarquee />
      <WhatWeDo />
      <StatementSection reducedMotion={reducedMotion} />
      <WeShip reducedMotion={reducedMotion} />
      <ProcessSection />
      <ContactSection />
      <Footer />
      <TalkToUsCta reducedMotion={reducedMotion} />
      <CustomCursor reducedMotion={reducedMotion} />
    </main>
  );
}
