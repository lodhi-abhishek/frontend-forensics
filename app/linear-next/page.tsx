"use client";

import { ArrowUpRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./linear-next.module.css";
import { ParticleLogo } from "./particle-logo";

const paragraphs = [
  "It was built for a handoff model of software development. A PM scoped the work, engineers picked it up later, and the system filled with prioritization, negotiation, and workflows to bridge the gap. That ceremony came from real constraints. Engineering time was scarce.",
  "But over time, complexity started to look like sophistication. The more process a system could absorb, the more advanced it seemed. Overhead kept growing, and the process became the work.",
  "Linear has always been built on the opposite belief: the best systems remove overhead so teams can focus on building.",
  "Agents push that further. Planning, implementation, and code review begin to compress as agents absorb more of the procedural work. People can spend more time on intent, judgment, and taste, and less time managing the mechanics of the process.",
  "In this new world, the next system is not designed around handoffs. It is designed around context and agents.",
  "Agents are not mind readers. They become useful through context. Customer feedback, internal ideas, strategic direction, decisions, and code all need to be captured in a system that humans and agents can work from together.",
  "Linear is the shared product system that turns context into execution. It holds feedback, intent, decisions, plans, and code, shapes that context into work, and helps humans and agents carry it all the way to production.",
];

export default function LinearNextPage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href="#top" aria-label="Linear home">
          <span className={styles.brandDot} />
          <span>Linear</span>
        </a>
        <nav className={styles.links} aria-label="Primary navigation">
          <a>Product</a>
          <a>Resources</a>
          <a>Customers</a>
          <a>Pricing</a>
          <a>Now</a>
          <a>Contact</a>
        </nav>
        <div className={styles.actions}>
          <a className={styles.login}>Log in</a>
          <Button className={styles.signup}>Sign up</Button>
          <Button aria-label="Open menu" className={styles.menu}>
            <Menu size={17} strokeWidth={1.8} />
          </Button>
        </div>
      </header>

      <section className={styles.hero} id="top">
        <ParticleLogo />
      </section>

      <article className={styles.essay}>
        <div className={styles.meta}>
          <span>Linear.app/next</span>
          <span>24 March 2026</span>
        </div>
        <h1>Issue tracking is dead.</h1>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <section className={styles.launches} aria-label="Launches">
          <p>Toward this vision, today we are launching:</p>
          <div>
            <strong>Linear Agent.</strong> A native agent interface to work
            within your product context, analyze user feedback, and craft
            projects, issues, and documents.
          </div>
          <div>
            <strong>Skills.</strong> Codify reusable workflows and trigger them
            manually or automatically when relevant.
          </div>
          <div>
            <strong>Automations.</strong> Trigger agent workflows the moment
            new context enters the system.
          </div>
        </section>

        <div className={styles.diagram} aria-hidden="true">
          <div className={cn(styles.diagramFrame, styles.diagramOuter)}>
            <span>Linear</span>
            <div className={cn(styles.diagramFrame, styles.diagramContext)}>
              <span>Context</span>
              <div className={styles.diagramCopy}>
                <p>Plans</p>
                <p>Discussions</p>
                <p>Specs</p>
                <p>Technical designs</p>
                <p>Decisions</p>
                <p>Code</p>
              </div>
              <div className={cn(styles.diagramFrame, styles.diagramRules)}>
                <span>Rules</span>
                <p>Automations</p>
                <p>Skills</p>
                <p>Permissions</p>
              </div>
              <div className={cn(styles.diagramFrame, styles.diagramAgent)}>
                <span>Agents</span>
                <i />
              </div>
            </div>
          </div>
        </div>

        <p className={styles.close}>
          Issue tracking was built for handoffs.
          <br />
          Linear turns context into execution.
        </p>
        <a className={styles.more} href="#top">
          Learn more <ArrowUpRight size={15} />
        </a>
      </article>
    </main>
  );
}
