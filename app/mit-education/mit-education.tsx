"use client";

import { ChevronLeft, ChevronRight, Pause, Play, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MitFooterLogo, MitHeaderLogo } from "./mit-logos";
import styles from "./mit-education.module.css";

const mitUrl = "https://www.mit.edu";

type EducationSection = {
  id: string;
  title: string;
  copy: React.ReactNode;
  resources: string[];
  action?: string;
};

const sections: EducationSection[] = [
  {
    id: "schools",
    title: "Schools, Departments & the College",
    copy: <><p>Across MIT, faculty help set the global standard of excellence in their disciplines: They are pioneering scholars who love to teach. Deeply engaged in practice, they topple conventional walls between fields in the push for deeper understanding and fresh ideas. In fact, many faculty actively work in at least one of MIT’s interdisciplinary labs, centers, initiatives, and institutes that target crucial challenges, from <a href="https://energy.mit.edu/">clean energy</a> to <a href="https://ki.mit.edu/">cancer</a>.</p><p>The MIT Schwarzman College of Computing is a cross-cutting entity with education and research links across all five schools.</p></>,
    action: "Explore Departments",
    resources: ["Departments by School", "School of Architecture and Planning", "School of Engineering", "School of Humanities, Arts, and Social Sciences", "MIT Sloan School of Management", "School of Science", "MIT Schwarzman College of Computing"],
  },
  {
    id: "teaching",
    title: "Teaching & Learning",
    copy: <p>Our campus is a workshop for inventing the future and we are all apprentices, learning from each other as we go. Because we like to make things, and we like to make an impact, iconic courses like <a href="https://web.mit.edu/2.009/www/index.html">2.009</a> emphasize designing, inventing, collaborating, and translating students’ expertise to reach the world. Through signature experiential learning programs like <a href="https://urop.mit.edu/">UROP</a>, UPOP, MISTI, PKG, IAP, D-Lab, NEET, and Sandbox, students can pursue virtually infinite co-curricular and extracurricular projects — here at MIT, throughout the Greater Boston innovation hub, and around the world. Honeycombed with legendary laboratories and dozens of <a href="https://project-manus.mit.edu/">makerspaces</a>, a wind tunnel, a research nuclear reactor, and a glass lab, our campus of idiosyncratically numbered buildings adds up to a prime spot to make the most of your potential.</p>,
    resources: ["Registrar’s Office", "Course Catalog (MIT Bulletin)", "DoingWell", "Office of the First Year", "Office of Graduate Education", "Office of Experiential Learning", "Teaching + Learning Lab", "Undergraduate Advising Center"],
  },
  {
    id: "open",
    title: "Open Learning",
    copy: <p>MIT is pioneering new ways of teaching and learning, on our campus and around the world, by inventing and leveraging digital technologies. <a href="https://learn.mit.edu/">MIT Learn</a> provides a convenient way for learners to explore the Institute’s non-degree learning opportunities. Educational resources come together under <a href="https://openlearning.mit.edu/">MIT Open Learning</a>, a catalyst transforming teaching and learning at MIT and around the globe.</p>,
    resources: ["MIT Learn", "MIT Open Learning", "MITx", "OpenCourseWare", "MITx MicroMasters", "Residential Digital Innovations"],
  },
  {
    id: "professional",
    title: "Professional & Executive Education",
    copy: <p>For executives, managers, entrepreneurs, and technical professionals eager to tap fresh thinking and new research from MIT, we offer dozens of executive and professional programs. Some are online. Some are on campus. Ranging from two days to 20 months, they all share MIT’s signature focus on practical solutions for the real world.</p>,
    resources: ["MIT Learn", "Professional & Executive Learning", "MIT Professional Education – School of Engineering", "Sloan School of Management Executive Education", "MIT xPRO"],
  },
  {
    id: "k12",
    title: "K-12 Resources",
    copy: <p>We delight in the beauty and creative power of science, technology, engineering, and math, and we make a special effort to spark that same passion in students from kindergarten through high school — in school, after school, and over the summer. Locally, we engage students, teachers, and families with a range of hands-on K-12 offerings, from structured field trips to MIT’s Edgerton Center to programs designed to encourage girls in their love of technology and science. We also offer an array of <a href="https://outreach.mit.edu/">resources for teachers</a>, to help them make science and engineering easy to grasp and irresistibly interesting.</p>,
    resources: ["K-12 Science & Engineering Opportunities", "K-12 Outreach", "App Inventor", "Scratch", "Teaching Systems Lab", "Lemelson-MIT Program", "MIT RAISE Initiative"],
  },
];

const gallery = [
  { src: `${mitUrl}/files/images/201804/17423368168_543e6c57c6_b.jpg`, alt: "A student wearing safety goggles and an instructor work together.", caption: "Working in the forge, part of the Merton C. Flemings Materials Processing Laboratory", large: true },
  { src: `${mitUrl}/files/images/201807/MIT-Everybody-01_0_0.jpg`, alt: "Several students on the set of a play.", caption: "“Everybody,” was the first MIT production to be designed, rehearsed, built, and staged in MIT’s new theater building." },
  { src: `${mitUrl}/files/images/201804/14220869298_2745a67115_b.jpg`, alt: "Students walk down the Infinite Corridor.", caption: "The Infinite Corridor connects many of MIT’s main buildings." },
  { src: `${mitUrl}/files/images/201804/8070940629_ea0cdbfc10_b.jpg`, alt: "Five students working together on the frame of a solar electric vehicle.", caption: "MIT students work on a solar electric vehicle.", large: true },
  { src: `${mitUrl}/files/images/201806/DSC5001-Photo%20by%20Christopher%20Harting_preview.jpeg`, alt: "Students and instructors gathered around tables.", caption: "Collaboration is a hallmark of an MIT education." },
  { src: `${mitUrl}/files/images/201807/7256117846_f8299f7ba1_o.jpg`, alt: "Students seated in a lecture hall.", caption: "MIT is dedicated to providing its students with an education that combines rigorous academic study and the excitement of discovery." },
];

export function MitEducation() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeImage, setActiveImage] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); setSearchOpen(false); setActiveImage(null); }
      if (activeImage !== null && event.key === "ArrowRight") setActiveImage((activeImage + 1) % gallery.length);
      if (activeImage !== null && event.key === "ArrowLeft") setActiveImage((activeImage - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeImage]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen, activeImage]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { void video.play(); setPaused(false); } else { video.pause(); setPaused(true); }
  };

  return <div className={styles.page}>
    <a className={styles.skip} href="#content">Skip to content ↓</a>
    <header className={styles.nav}>
      <a href="#content" className={styles.logo}><MitHeaderLogo className={styles.headerLogo} /></a>
      <nav className={styles.desktopNav} aria-label="Primary navigation">
        {["Education", "Research", "Innovation", "Admissions + Aid", "Campus Life", "News", "Alumni", "About MIT", "Lifelong Learning", "Give"].map((item) => <a className={item === "Education" ? styles.current : ""} href="#content" key={item}>{item}</a>)}
      </nav>
      <div className={styles.navTools}>
        <button className={styles.menuButton} onClick={() => setMenuOpen(true)}>Menu <span>↓</span></button>
        <button className={styles.searchButton} aria-label="Open search" onClick={() => setSearchOpen(true)}><Search size={23} strokeWidth={1.5} /></button>
      </div>
    </header>

    <main id="content" className={styles.main}>
      <aside className={styles.gutter}><span>Education</span></aside>
      <section className={styles.hero}>
        <div className={styles.crumbs}><a href="#content">Home</a><span>Education</span></div>
        <div className={styles.heroLead}>At MIT, we revel in a culture of learning by doing. In <a href="#schools">more than 30 departments across five schools and one college</a>, our students combine analytical rigor with curiosity, playful imagination, and an appetite for solving the hardest problems in <a href="#schools">service to society</a>. From science and engineering to the arts, humanities, social sciences, and interdisciplinary programs, we offer excellence across the board.</div>
        <div className={styles.heroCopy}>Our undergraduates work closely with faculty, tackle global challenges, pursue fundamental questions, and translate ideas into action. The core of the Institute’s teaching and research enterprise, our graduate students and postdocs represent one of the most talented and diverse cohorts in the world. To complement its academics, MIT offers a vibrant campus environment with a wide range of clubs, teams, programs, and activities so that all students can cultivate personal growth, build community, and prioritize wellbeing.</div>
        <figure className={styles.videoWrap}>
          <video ref={videoRef} autoPlay loop muted playsInline><source src={`${mitUrl}/files/images/201805/education-1_0.mp4`} type="video/mp4" /></video>
          <button onClick={toggleVideo} aria-label={paused ? "Play decorative video" : "Pause decorative video"}>{paused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}</button>
        </figure>
      </section>

      <div className={styles.sections}>
        {sections.map((section) => <section id={section.id} className={styles.contentSection} key={section.id}>
          <h2>{section.title}</h2>
          <div className={styles.description}>{section.copy}{section.action && <a className={styles.cta} href="#schools">{section.action}</a>}</div>
          <aside className={styles.resources}><h3>Top Resources</h3><ol>{section.resources.map((resource) => <li key={resource}><a href="#content">{resource}</a></li>)}</ol></aside>
        </section>)}
      </div>

      <section className={styles.gallery} aria-label="See Inside Education">
        <div className={styles.galleryRail}>See Inside Education</div>
        <div className={styles.galleryGrid}>{gallery.map((image, index) => <button key={image.src} className={`${styles.galleryItem} ${image.large ? styles.galleryLarge : ""} ${activeImage === index ? styles.gallerySelected : ""}`} onClick={() => setActiveImage(activeImage === index ? null : index)}>
          <img src={image.src} alt={image.alt} />
          <span>{image.caption}</span>
        </button>)}</div>
        {activeImage !== null && <div className={styles.galleryControls}><button onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)}><ChevronLeft /> Previous</button><button onClick={() => setActiveImage((activeImage + 1) % gallery.length)}>Next <ChevronRight /></button></div>}
      </section>
    </main>

    <footer className={styles.footer}>
      <a href="#content" className={styles.footerLogoLink}><MitFooterLogo className={styles.footerLogo} /></a>
      <nav>{["Education", "Research", "Innovation", "Admissions + Aid", "Campus Life", "News", "About MIT", "Alumni", "Lifelong Learning", "Give"].map((item) => <a href="#content" key={item}>{item}</a>)}</nav>
      <div className={styles.footerDetails}><p>Massachusetts Institute of Technology</p><a href="#content">77 Massachusetts Avenue, Cambridge, MA, USA</a><div>{["Visit", "Map", "Events", "People", "Jobs", "Contact", "Privacy", "Accessibility", "Social Media Hub", "X", "Facebook", "YouTube", "Instagram"].map((item) => <a href="#content" key={item}>{item}</a>)}</div></div>
    </footer>

    {(menuOpen || searchOpen) && <div className={styles.overlay} role="dialog" aria-modal="true">
      <button className={styles.overlayClose} onClick={() => { setMenuOpen(false); setSearchOpen(false); }} aria-label="Close"><X size={25} /></button>
      {searchOpen ? <div className={styles.searchOverlay}><p>Explore websites, people, and locations</p><label><Search size={29} /><input autoFocus placeholder="What are you looking for?" /></label><span>Suggestions or feedback?</span></div> : <div className={styles.menuOverlay}><MitHeaderLogo className={styles.menuLogo} /><nav>{["Education", "Research", "Innovation", "Admissions + Aid", "Campus Life", "News", "Alumni", "About MIT", "Lifelong Learning", "Give"].map((item) => <a onClick={() => setMenuOpen(false)} href="#content" key={item}>{item}<ChevronRight /></a>)}</nav></div>}
    </div>}
  </div>;
}
