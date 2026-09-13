"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { mobileMenuLinks, navGroups } from "./macroscope.data";
import styles from "./macroscope.module.css";

export function MacroscopeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sentinel = document.getElementById("macroscope-hero-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      rootMargin: "-56px 0px 0px",
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-nav-disclosure]")) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const openMobile = () => {
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };

  const closeMobile = () => {
    dialogRef.current?.close();
    document.documentElement.style.overflow = "";
    menuButtonRef.current?.focus();
  };

  const showPricing = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    event.preventDefault();
    if (dialogRef.current?.open) closeMobile();
    window.history.replaceState(null, "", "#pricing");
    window.dispatchEvent(new Event("macroscope:show-pricing"));
  };

  useEffect(() => () => { document.documentElement.style.overflow = ""; }, []);

  const renderDisclosure = (group: (typeof navGroups)[number]) => (
    <div className={styles.navDisclosure} data-nav-disclosure key={group.label}>
      <button
        type="button"
        aria-expanded={openMenu === group.label}
        onClick={() => setOpenMenu(openMenu === group.label ? null : group.label)}
      >
        {group.label}<span aria-hidden="true">⌄</span>
      </button>
      {openMenu === group.label && (
        <div className={styles.navPopover}>
          {group.links.map(([label, href]) => <a href={href} key={label} onClick={() => setOpenMenu(null)}>{label}</a>)}
        </div>
      )}
    </div>
  );

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <nav className={styles.nav} aria-label="Primary navigation">
        <a className={styles.logoLink} href="#top" aria-label="Macroscope home">
          <Image src="/assets/macroscope/brand/logo-black.svg" alt="Macroscope" width={136} height={25} />
        </a>
        <div className={styles.desktopNav}>
          {renderDisclosure(navGroups[0])}
          <button type="button" className={styles.navPricingButton} onClick={showPricing}>Pricing</button>
          <a href="https://docs.macroscope.com">Docs</a>
          {renderDisclosure(navGroups[1])}
        </div>
        <div className={styles.navActions}>
          <a className={styles.demoLink} href="https://macroscope.com/book-demo">Book Demo</a>
          <button type="button" className={styles.mobilePricingLink} onClick={showPricing}>Pricing</button>
          <button ref={menuButtonRef} type="button" className={styles.menuButton} onClick={openMobile} aria-label="Open menu">
            <span /><span />
          </button>
          <a className={styles.signupLink} href="https://app.macroscope.com">
            <Image src="/assets/macroscope/brand/github-white.svg" alt="" width={18} height={18} />
            Sign up
          </a>
        </div>
      </nav>
      <dialog ref={dialogRef} className={styles.mobileDialog} onCancel={(event) => { event.preventDefault(); closeMobile(); }} onClose={() => { document.documentElement.style.overflow = ""; }}>
        <div className={styles.mobileDialogTop}>
          <Image src="/assets/macroscope/brand/logo-black.svg" alt="Macroscope" width={136} height={25} />
          <button type="button" onClick={closeMobile} aria-label="Close menu">×</button>
        </div>
        <div className={styles.mobileLinks}>
          {mobileMenuLinks.map(([label, href]) => label === "Pricing"
            ? <button type="button" key={label} onClick={showPricing}>{label}</button>
            : <a href={href} key={label} onClick={closeMobile}>{label}</a>)}
        </div>
        <div className={styles.mobileDialogActions}>
          <a href="https://macroscope.com/book-demo" onClick={closeMobile}>Book Demo</a>
          <a className={styles.mobileSignup} href="https://app.macroscope.com">Sign up</a>
        </div>
      </dialog>
    </header>
  );
}
