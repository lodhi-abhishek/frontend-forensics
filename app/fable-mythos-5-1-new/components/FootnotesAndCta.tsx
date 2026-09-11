"use client";

import React from "react";

export function FootnotesAndCta() {
  return (
    <div className="bg-[#faf9f5] border-t border-[#e8e6dc]/60">
      {/* Get Started Section */}
      <section id="get-started" className="py-20 px-6 sm:px-8 border-b border-[#e8e6dc]">
        <div className="max-w-[640px] mx-auto text-center space-y-6">
          <h2 className="font-copernicus text-3xl sm:text-4xl text-[#141413]">
            Get started
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://claude.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#141413] text-[#faf9f5] font-anthropic-sans text-sm font-medium hover:bg-[#30302e] transition-colors"
            >
              Try Claude
            </a>
            <a
              href="https://platform.claude.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-[#141413] text-[#141413] font-anthropic-sans text-sm font-medium hover:bg-[#141413]/5 transition-colors"
            >
              Start building
            </a>
          </div>
        </div>
      </section>

      {/* Footnotes Section */}
      <section id="footnotes" className="py-16 px-6 sm:px-8 border-b border-[#e8e6dc]">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="font-copernicus text-2xl sm:text-3xl text-[#141413] mb-8">
            Footnotes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-anthropic-sans text-[13px] leading-relaxed text-[#73726c]">
            <div>
              <p className="m-0">
                <sup className="font-semibold text-[#141413] mr-1">1</sup>
                <strong className="text-[#141413]">Terminal-Bench-Science 0.1:</strong> The
                standard error is ±3.5–4.5 pts per model. The public leaderboard
                (3 trials/task, Claude Code harness) reports Claude Opus 5 at 30.0%
                and Claude Fable 5 at 21.4%; our setup reproduces them at 29.0% and
                24.7%, respectively, both within noise.
              </p>
            </div>

            <div>
              <p className="m-0">
                <sup className="font-semibold text-[#141413] mr-1">2</sup>
                <strong className="text-[#141413]">OSWorld 2.0:</strong> Scores are on the
                benchmark authors’ August 2026 task release; Fable 5 and Opus 5
                were re-run under the same conditions. Because the task files differ
                from earlier releases, these numbers aren&apos;t directly comparable
                to previously published OSWorld 2.0 results, which is why no competitor
                score is shown.
              </p>
            </div>

            <div>
              <p className="m-0">
                <sup className="font-semibold text-[#141413] mr-1">3</sup>
                These three targets are (EGFR, Nipah G, 15-PGDH) and come from{" "}
                <a
                  href="https://proteinbase.com/competitions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#141413]"
                >
                  Adaptyv Bio’s protein design competitions
                </a>
                . The Nipah G comparison is against <em>de novo</em> designs
                targeting the receptor-binding site on the G head (best: ~8–12 nM,{" "}
                <a
                  href="https://proteinbase.com/proteins/shy-otter-jade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#141413]"
                >
                  N1032
                </a>
                ). A <em>de novo</em> entry from{" "}
                <a
                  href="https://blog.escalante.bio/winning-the-de-novo-portion-of-the-adaptyv-nipah-binder-competition/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#141413]"
                >
                  Nick Boyd/Escalante Bio
                </a>{" "}
                that targets a different region (the stalk) reached ~1.4 nM (
                <a
                  href="https://proteinbase.com/proteins/shy-eagle-fern"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#141413]"
                >
                  design_7
                </a>
                ), comparable to our best binder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Further Reading Section */}
      <section id="further-reading" className="py-16 px-6 sm:px-8">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="font-copernicus text-2xl sm:text-3xl text-[#141413] mb-8">
            Further reading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 font-anthropic-sans text-[14px] leading-relaxed text-[#5e5d59]">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#141413]">1.</span>
              <p className="m-0">
                The Claude Fable 5.1 and Claude Mythos 5.1 system card.{" "}
                <a
                  href="https://www.anthropic.com/claude-fable-5-1-mythos-5-1-system-card"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#141413] hover:text-[#73726c]"
                >
                  View card
                </a>
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#141413]">2.</span>
              <p className="m-0">
                More detail on our Enterprise Frontier Safeguards.{" "}
                <a
                  href="https://www.anthropic.com/news/enterprise-frontier-safeguards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#141413] hover:text-[#73726c]"
                >
                  Learn more
                </a>
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#141413]">3.</span>
              <p className="m-0">
                Request access to our Enterprise Frontier Safeguards.{" "}
                <a
                  href="https://claude.com/form/enterprise-frontier-safeguards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#141413] hover:text-[#73726c]"
                >
                  Open form
                </a>
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#141413]">4.</span>
              <p className="m-0">
                An overview of our improvements to our biology safeguards.{" "}
                <a
                  href="https://www.anthropic.com/news/improving-fable-5-s-biology-safeguards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#141413] hover:text-[#73726c]"
                >
                  Learn more
                </a>
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#141413]">5.</span>
              <p className="m-0">
                Support for scientists.{" "}
                <a
                  href="https://www.anthropic.com/news/expanding-support-for-scientists"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#141413] hover:text-[#73726c]"
                >
                  Read more
                </a>
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#141413]">6.</span>
              <p className="m-0">
                Earlier work by Claude in protein design.{" "}
                <a
                  href="https://www.anthropic.com/research/Claude-accelerates-protein-design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#141413] hover:text-[#73726c]"
                >
                  Read more
                </a>
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#141413]">7.</span>
              <p className="m-0">
                Earlier work by Claude in mathematics.{" "}
                <a
                  href="https://www.anthropic.com/research/riemann-zeta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#141413] hover:text-[#73726c]"
                >
                  Read more
                </a>
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#141413]">8.</span>
              <p className="m-0">
                More about the Model Hardware Standard.{" "}
                <a
                  href="https://www.anthropic.com/news/model-hardware-standard-research-preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#141413] hover:text-[#73726c]"
                >
                  Learn more
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
