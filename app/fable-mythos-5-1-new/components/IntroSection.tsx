"use client";

import React from "react";

export function IntroSection() {
  return (
    <section className="relative pt-20 pb-8 px-6 sm:px-8 bg-[#faf9f5]">
      <span id="introduction" className="block -mt-24 pt-24 invisible" />

      <div className="reading-column">
        {/* Article Summary Lead Paragraph */}
        <p className="article-summary">
          We’re introducing Claude Fable 5.1 and Claude Mythos 5.1. They’re the
          world’s most advanced models for coding and knowledge work—and their
          research capabilities offer an early glimpse of how AI models will
          contribute to scientific progress.
        </p>

        {/* Editorial Body Paragraphs */}
        <p className="post-text">
          Claude Fable 5.1 and Claude Mythos 5.1 are the same model, but with
          different levels of safeguards. Fable 5.1 is generally available, while
          Mythos 5.1 is available only through our trusted access programs; its
          safeguards are specifically designed to support work in cybersecurity
          and the life sciences.
        </p>

        <p className="post-text">
          Alongside its increased capabilities, Fable 5.1 takes important steps
          towards addressing the feedback we’ve received from customers on price,
          data retention, and safeguards.
        </p>

        <p className="post-text">
          <strong>Price<em>.</em></strong> Fable 5.1 will cost an estimated 25%
          less than Fable 5 for typical workloads, wherever usage is billed by
          token. This is because we’re reducing our pricing on cache reads (where
          the model reads inputs that have already been processed and stored). For
          highly agentic work, the savings will often be much larger—up to
          approximately 45%.
        </p>

        <p className="post-text">
          <strong>Data retention<em>. </em></strong>Our new system of Enterprise
          Frontier Safeguards (EFS) gives customers complete privacy (the same as
          a zero data retention policy) while still being state-of-the-art at
          preventing adversarial use. EFS works by storing data in cloud
          infrastructure controlled entirely by the customer, not Anthropic. It
          will be made available to enterprise customers in phases, beginning
          later this fall. Until EFS is available, eligible customers will be
          able to use Fable 5.1 with zero data retention.
        </p>

        <p className="post-text">
          <strong>Safeguards<em>. </em></strong>We’ve improved our safeguards to
          reduce false positives (where the system flags benign content). In
          cybersecurity, our newest safeguards block 60% fewer false positives
          than before. In part, this is because Fable 5.1 can now be used to
          discover software vulnerabilities—though not to develop exploits for
          them. In biology, we’ve established an access program, developed in
          partnership with the US government, to enable access to Claude Mythos
          5.1’s advanced biology capabilities. We expect to open enrollment for
          scientists soon.
        </p>
      </div>
    </section>
  );
}
