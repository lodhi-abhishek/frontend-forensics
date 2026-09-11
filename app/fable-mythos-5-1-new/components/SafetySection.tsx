"use client";

import React from "react";

export function SafetySection() {
  return (
    <section className="relative py-12 px-6 sm:px-8 bg-[#faf9f5]">
      <span id="safety-security-and-alignment" className="block -mt-24 pt-24 invisible" />

      <div className="reading-column">
        <h2 className="post-heading">Safety, security, and alignment</h2>

        <p className="post-text">
          AI models’ agentic capabilities have become much more powerful over the
          past two years. But as we’ve{" "}
          <a
            href="https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            documented
          </a>
          , greater autonomy comes with new risks. Work on safety, security, and
          alignment needs to advance at the same pace as AI capabilities.
          Yesterday, we{" "}
          <a
            href="https://www.anthropic.com/news/improving-alignment-security-efforts"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            published a report
          </a>{" "}
          describing how we are improving our own alignment and security efforts.
        </p>

        <p className="post-text">
          Prior to releasing Claude Fable 5.1 and Claude Mythos 5.1, we (and, in
          some cases, external researchers) subjected the models to extensive
          testing for risks across many areas. We describe these efforts in full
          in our{" "}
          <a
            href="https://www.anthropic.com/claude-fable-5-1-mythos-5-1-system-card"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            System Card
          </a>
          ; below is a brief summary.
        </p>

        <p className="post-text">
          <strong>Chemical and biological risks</strong>. We tested the extent to
          which Claude Mythos 5.1 could help create chemical or biological
          weapons. This involved expert red-teaming, automated evaluations, and
          a tabletop exercise that paired PhD-level biologists with AI experts,
          testing whether the models could match human specialists’ performance.
          Mythos 5.1’s capabilities are greater than those of Mythos 5. However,
          our evaluations indicate that it still falls short of the next risk
          tier defined in our{" "}
          <a
            href="https://www.anthropic.com/responsible-scaling-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            Responsible Scaling Policy
          </a>
          . We are therefore deploying Mythos 5.1 with the{" "}
          <a
            href="https://www.anthropic.com/news/improving-fable-5-s-biology-safeguards"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            same safeguards
          </a>{" "}
          that we applied to Mythos 5, which restrict access to research biology
          capabilities.
        </p>

        <p className="post-text">
          <strong>Cyber risks</strong>. We ran a suite of evaluations to assess
          the cyber capabilities of Claude Mythos 5.1 (with cybersecurity
          safeguards off). Overall, the model demonstrates the strongest cyber
          capabilities of any model we’ve released, though it still falls within
          the lower category of risk in our{" "}
          <a
            href="https://www.anthropic.com/news/compliance-framework-SB53"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            Frontier Compliance Framework
          </a>
          . We also performed extensive stress-testing of our cybersecurity
          safeguards for Fable 5.1: in addition to our own dynamic evaluation of
          their robustness, we commissioned external testing from two
          organizations, along with automated testing by{" "}
          <a
            href="https://www.grayswan.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            Gray Swan
          </a>
          . As with Fable 5 and Opus 5, we have not found evidence of a{" "}
          <a
            href="https://www.anthropic.com/news/fable-safeguards-jailbreak-framework"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            critical-severity jailbreak
          </a>{" "}
          for these safeguards.
        </p>

        <p className="post-text">
          <strong>Agentic safety</strong>. We ran evaluations of how Claude
          Mythos 5.1 responds to malicious requests and prompt injections
          (adversarial instructions hidden within content processed by AI
          models). It refused malicious agentic coding and computer use requests
          at a comparable rate to Mythos 5, Sonnet 5, and Opus 5, and it is our
          most robust model to date on an external{" "}
          <a
            href="https://www.anthropic.com/claude-fable-5-1-mythos-5-1-system-card"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            prompt injection benchmark
          </a>
          .
        </p>

        <p className="post-text">
          <strong>Alignment<em>.</em></strong> We tested the model’s behavior
          through static and interactive behavioral evaluations, analyses of its
          internal thinking using{" "}
          <a
            href="https://www.anthropic.com/research/natural-language-autoencoders"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            natural language autoencoders
          </a>
          , misalignment-related capability evaluations, a review of our
          training data, and analyses of our internal pilot use. We also
          received reports from external testing.
        </p>

        <p className="post-text">
          Our automated behavioral audit found that Claude Mythos 5.1 is better
          aligned across most metrics than its predecessor, Mythos 5. The model
          is significantly less likely than Mythos 5 to try to access resources
          outside of its test environment when assigned an otherwise impossible
          task. It is also less likely than Mythos 5 to use motivated reasoning
          to justify its actions (for instance, by reasoning that the situation
          is a simulation or evaluation), and it is less likely to ignore explicit
          constraints in pursuit of users’ goals. From our review of its
          training data, Mythos 5.1 both attempts reward hacking (or cheating),
          and succeeds at it, at a lower overall rate than Mythos 5.
        </p>

        <p className="post-text">
          Though generally our alignment evaluations showed improvements, our
          testing found the model can still sometimes bypass approvals and
          auto-mode classifiers (as we discuss in more detail in our System
          Card). There are also limitations to the coverage provided by our
          alignment assessment. Currently, our automated behavioral audit
          provides less visibility into very long-context work and multi-agent
          settings. We also have less coverage of impossible tasks (which can
          elicit more abnormal and misaligned behavior) than we’d like, although
          we’ve recently made improvements in this domain and are working hard to
          continue doing so.
        </p>

        <p className="post-text">
          We have also improved our safeguards so that they allow our models to
          be more useful without compromising on safety. We describe these
          changes below.
        </p>

        <p className="post-text">
          <strong>Automated safeguards for enterprises<em>.</em></strong>{" "}
          <a
            href="https://www.anthropic.com/news/enterprise-frontier-safeguards"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            Enterprise Frontier Safeguards
          </a>{" "}
          (EFS) allows us to detect and respond to misuse of our models while
          still providing our enterprise customers the privacy of a zero data
          retention agreement. With EFS, customers store their data on their own
          cloud infrastructure, rather than on Anthropic’s systems; any human
          review is, by default, done by the customer themselves, rather than
          Anthropic. We developed EFS in close collaboration with more than 100
          customers across industries like financial services, healthcare,
          manufacturing, telecom, law, retail, and the public sector, and with
          our cloud partners at Amazon Web Services, Google Cloud, and Microsoft
          Azure.
        </p>

        <p className="post-text">
          EFS will be supported on Claude Code, Claude Enterprise, the Claude
          Platform, Amazon Bedrock, Claude Platform on AWS, Google’s Agent
          Platform, and Microsoft Foundry. It’s rolling out in phases, starting
          this fall. As noted above, customers who are eligible for EFS can use
          Fable 5.1 (and Fable 5) with zero data retention until EFS is ready.
          You can read more about EFS{" "}
          <a
            href="https://www.anthropic.com/news/enterprise-frontier-safeguards"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            here
          </a>
          ; to request access, please complete{" "}
          <a
            href="https://claude.com/form/enterprise-frontier-safeguards"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            this form
          </a>
          .
        </p>

        <p className="post-text">
          <strong>More precise safeguards for biology and cybersecurity<em>. </em></strong>
          In the past few months, we’ve made progress in making our safeguards
          for Fable 5.1 more precise: ensuring that they’re less likely to flag
          benign content (like queries about medical issues or cyberdefenders
          using the model to make their systems safer), but still ensuring they
          provide robust protection against genuine threats.
        </p>

        <p className="post-text">
          As we{" "}
          <a
            href="https://www.anthropic.com/news/improving-fable-5-s-biology-safeguards"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            recently shared
          </a>
          , our latest biology safeguards for Fable 5.1 and Fable 5 fire 85% less
          often for benign requests related to elementary biology and medical
          questions (relative to those that launched with Fable 5). However,
          queries related to research and development in the life sciences will
          still be directed to our Opus models. We’re making the model’s life
          sciences capabilities available to professionals through an access
          program for Claude Mythos 5.1 that we’ve developed in partnership with
          the US government, which we discuss below.
        </p>

        <p className="post-text">
          With Fable 5.1, we’re updating our cybersecurity safeguards to be more
          precise. We’re also now allowing Fable 5.1 to be used for identifying
          software vulnerabilities—that is, to conduct the kind of defensive
          work that improves software security. As a result of these changes,
          Claude Code users can expect an average of around 60% fewer
          interventions per session from our cyber safeguards, relative to the
          previous safeguards on Fable 5. Our safeguards do, however, still
          redirect several kinds of dual-use cybersecurity tasks (tasks that
          might have helpful <em>or</em> harmful applications) to our Opus
          models. This includes penetration testing, exploit generation, and
          binary-based vulnerability scanning.
        </p>

        <p className="post-text">
          <strong>Anti-distillation mechanisms<em>.</em></strong> Distillation
          is a method used to extract the capabilities of advanced models. It is
          often employed on an industrial scale, using thousands of fake
          accounts. Distillation is a safety risk, since the distilled
          capabilities can subsequently be released without adequate safeguards.
          Fable 5.1 comes with strengthened mechanisms to make distillation
          attacks harder. For example, it is no longer possible for new API
          accounts (those created from today onwards) to manually edit Claude’s
          prior context in a multi-turn conversation while preserving the
          transcript of Claude’s prior thinking. This closes off a common,
          publicly documented distillation technique, which allowed distillers to
          illicitly extract Claude’s thinking. We’re rolling out the change
          gradually, to minimize disruption: existing accounts are not currently
          affected by this change, though it will apply to all users with future
          model releases. A small number of customers’ custom integrations will
          then be affected. Our{" "}
          <a
            href="https://support.claude.com/en/articles/16761192"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            Help Center article
          </a>{" "}
          explains more about this change and the adjustments that developers
          can make.
        </p>
      </div>
    </section>
  );
}
