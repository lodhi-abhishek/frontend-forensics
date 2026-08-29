import type { Metadata } from "next";
import Script from "next/script";
import { BUN_WIDGETS } from "./widgets";
import "./bun-rewrite.css";

export const metadata: Metadata = {
  title: "Rewriting Bun in Rust — the interactive figures",
  description:
    "A faithful replica of the five interactive figures from bun.com's “Rewriting Bun in Rust” — same markup, same data, same animation code.",
};

const SECTIONS: Record<string, { heading: string; lead: string }> = {
  "01-adversarial-review": {
    heading: "Adversarial review",
    lead: "1 implementer, 2 or more adversarial reviewers per implementer. The reviewer’s only job: find bugs & reasons why the code does not work. The implementer doesn’t review. The reviewer doesn’t implement.",
  },
  "02-commit-histogram": {
    heading: "Finally writing the code",
    lead: "Thanks to all the parallelization & this prep work, at peak Claude wrote about 1,300 lines of code per minute. Every line of code was reviewed by two separate adversarial reviewers (also Claude) and went through a round of fixes before committing. Absolutely none of it worked yet.",
  },
  "03-phase-d": {
    heading: "Compiler errors as a work queue",
    lead: "After writing all the code, I asked Claude to write a workflow fixing every compiler error. We went crate-by-crate.",
  },
  "04-ci-race": {
    heading: "Get the test suite passing in CI",
    lead: "Two days after the first CI run, the failing list was down from 972 test files to 23. A day and a half after that, Linux went fully green — and for the first time, it felt like this Rust rewrite was actually going to work.",
  },
  "05-commit-replay": {
    heading: "Stats",
    lead: "At peak, we were running 4 of these workflows at once each in a separate worktree, each with 16 Claudes per workflow. About 64 Claudes at a time.",
  },
};

export default function BunRewritePage() {
  return (
    <div className="bun-rewrite min-h-screen font-sans antialiased">
      <div className="mx-auto w-full max-w-[46rem] px-[clamp(1.25rem,4vw,2.5rem)]">
        <header className="border-b border-[#28282b] pb-10 pt-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#80807e]">
            replica · bun.com/blog
          </p>
          <h1 className="font-archivo mt-4 text-[clamp(2.4rem,6vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#eaeae8]">
            Rewriting Bun in Rust
          </h1>
          <p className="mt-5 font-mono text-[12.5px] text-[#80807e]">
            Jarred Sumner · July 8, 2026 ·{" "}
            <a
              className="text-[#ff5cb0] underline decoration-[#ff5cb0]/40 underline-offset-4 transition-colors hover:decoration-[#ff5cb0]"
              href="https://bun.com/blog/bun-in-rust"
              target="_blank"
              rel="noreferrer"
            >
              original post ↗
            </a>
          </p>
          <p className="bun-lede mt-8">
            This page reproduces the post’s five interactive figures — the
            adversarial-review player, the 6,502-commit histogram, the phase D
            replay, the CI race to green, and the 11-day commit replay — using
            the original markup, the original data, and the original animation
            code, verbatim.
          </p>
        </header>

        <main className="pb-4 pt-2">
          {BUN_WIDGETS.map((w) => {
            const section = SECTIONS[w.key];
            return (
              <section key={w.id} aria-label={section?.heading}>
                <h2 className="bun-h2 mb-4 mt-14">
                  {section?.heading}
                  <a className="bun-anchor" href={`#${w.key}`} id={w.key}>
                    #
                  </a>
                </h2>
                <p className="bun-lede">{section?.lead}</p>
                <div dangerouslySetInnerHTML={{ __html: w.html }} />
              </section>
            );
          })}
        </main>

        <footer className="border-t border-[#28282b] py-10">
          <p className="font-mono text-[12px] leading-relaxed text-[#80807e]">
            Markup, data &amp; animation code from{" "}
            <a
              className="text-[#a8a8a5] underline decoration-[#80807e]/40 underline-offset-4 hover:text-[#eaeae8]"
              href="https://bun.com/blog/bun-in-rust"
              target="_blank"
              rel="noreferrer"
            >
              bun.com/blog/bun-in-rust
            </a>
            , replicated for study. 6,502 commits · 11 days · +1,009,272 lines
            landed.
          </p>
        </footer>
      </div>

      {BUN_WIDGETS.map((w) => (
        <Script key={w.id} src={w.script} strategy="afterInteractive" />
      ))}
    </div>
  );
}
