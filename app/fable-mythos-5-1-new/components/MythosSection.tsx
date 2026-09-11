"use client";

import React from "react";

export function MythosSection() {
  return (
    <section className="relative py-12 px-6 sm:px-8 bg-[#faf9f5]">
      <span id="mythos" className="block -mt-24 pt-24 invisible" />

      <div className="reading-column">
        {/* Heading: Trusted access for Claude Mythos 5.1 */}
        <h2 className="post-heading">Trusted access for Claude Mythos 5.1</h2>

        <p className="post-text">
          Claude Mythos 5.1 is identical to Fable 5.1, but it offers more
          permissive safeguards for vetted individuals and organizations whose
          work is affected by the cybersecurity and life sciences restrictions
          outlined above. It will be available through two trusted access
          programs:
        </p>

        <ul className="list-disc pl-6 space-y-3 font-tiempos text-lg text-[#141413] mb-6">
          <li>
            <strong>Cyber Verification Program:</strong> The CVP currently
            provides access to certain Opus- and Sonnet-class models with reduced
            cyber safeguards for defensive security work. In the near future,
            this program will also include access to Claude Mythos-class models.{" "}
            <a
              href="https://portal.anthropic.com/programs/cvp"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[#73726c]"
            >
              Apply to join the CVP here
            </a>
            .
          </li>
          <li>
            <strong>Life Sciences Verification Program:</strong> The LSVP is
            designed so that life sciences professionals can use Claude Mythos
            5.1 with safeguards designed for professional research and development
            activities (while all other safeguards remain in place). In
            partnership with the US government, we have enrolled our first
            participants, and we plan to expand access to this program to the
            broader life sciences community.
          </li>
        </ul>

        <p className="post-text">
          In addition to these trusted access programs,{" "}
          <a
            href="https://claude.com/product/claude-security"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            Claude Security
          </a>
          , our product that scans codebases for vulnerabilities and suggests
          patches for human review, is now also powered by Claude Mythos 5.1.
        </p>

        {/* Heading: Compliance with the EU AI Act */}
        <span
          id="compliance-with-the-eu-ai-act"
          className="block -mt-24 pt-24 invisible"
        />
        <h2 className="post-heading mt-16">Compliance with the EU AI Act</h2>

        <p className="post-text">
          In July 2026, Anthropic (along with{" "}
          <a
            href="https://digital-strategy.ec.europa.eu/en/news/strong-backing-code-practice-transparency-ai-generated-content"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            190 other signatories
          </a>
          , including several other major AI model providers) signed the EU AI
          Act’s Code of Practice on Transparency of AI-Generated Content.
        </p>

        <p className="post-text">
          This required us to add a watermark—a numerical way of determining the
          likelihood that Claude was involved in writing a piece of text—to the
          outputs of models released after August 2, 2026. As we{" "}
          <a
            href="https://www.anthropic.com/news/claude-text-watermark"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            recently explained
          </a>
          , this watermark is invisible to anyone who does not have the
          detection API. It has no practical impact on the quality or content of
          Claude’s outputs and contains no information about the user, their
          organization, or their conversations with Claude.
        </p>

        <p className="post-text">
          The Act also required us to provide a way for users to tell whether a
          text likely contains the watermark. We are thus rolling out a
          detection API in private preview. It is currently available to eligible
          organizations (such as regulators, law enforcement, media,
          fact-checkers, independent researchers, educational organizations, and
          EU civil society groups) as required under EU law. It is also available
          for enterprises that are similarly obligated to verify watermarking for
          their own compliance with the Act. We plan to expand access to the
          detection API over time. You can register interest in access{" "}
          <a
            href="https://forms.gle/9tGA33hPJJwtHsMk9"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            here
          </a>
          .
        </p>
      </div>
    </section>
  );
}
