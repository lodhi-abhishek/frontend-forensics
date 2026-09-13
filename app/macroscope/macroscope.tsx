import Image from "next/image";
import { DotField } from "./dot-field.client";
import {
  commitFeed,
  customerLogos,
  footerGroups,
  heroPillars,
  murmurFaq,
  murmurPricing,
  pricingFaq,
  pricingPlans,
  pricingProducts,
  securityClaims,
  socialLinks,
  spendControls,
  sprintItems,
  testimonials,
} from "./macroscope.data";
import { DisclosureList } from "./macroscope-disclosure.client";
import { MacroscopeHeader } from "./macroscope-header.client";
import {
  CliCopy,
  ConfigSwitches,
  FixItDemo,
  MurmurEventDemo,
  OrchestrationTerminal,
} from "./macroscope-product-demos.client";
import { PricingCalculator } from "./macroscope-pricing-calculator.client";
import { PricingReveal } from "./macroscope-pricing-reveal.client";
import { SignupTelemetry } from "./macroscope-signup-telemetry.client";
import { StatusChart } from "./macroscope-status-chart.client";
import { VideoGallery } from "./macroscope-video-dialog.client";
import styles from "./macroscope.module.css";
import { HeroPillarGraphic } from "./hero-pillar-graphic";

const integrations = [
  ["linear.svg", "Linear"], ["slack.svg", "Slack"], ["sentry.svg", "Sentry"],
  ["jira.svg", "Jira"], ["posthog.svg", "PostHog"], ["amplitude.svg", "Amplitude"],
] as const;

function SectionLead({ label, title, body, dark = false }: { label: string; title: string; body: string; dark?: boolean }) {
  return (
    <div className={`${styles.sectionLead} ${dark ? styles.sectionLeadDark : ""}`}>
      <p>{label}</p><h2>{title}</h2><div>{body}</div>
    </div>
  );
}

function IntegrationOrbit({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`${styles.integrationOrbit} ${dark ? styles.integrationOrbitDark : ""}`} aria-label="Connected integrations">
      <div className={styles.orbitCore}><Image src={`/assets/macroscope/brand/icon-${dark ? "white" : "black"}.svg`} alt="Macroscope" width={42} height={42} /></div>
      {integrations.map(([icon, name], index) => (
        <div className={styles.orbitIcon} style={{ "--orbit-index": index } as React.CSSProperties} key={name}>
          <Image src={`/assets/macroscope/integrations/${icon}`} alt={name} width={28} height={28} />
        </div>
      ))}
      <span className={styles.orbitRing} /><span className={styles.orbitRingInner} />
    </div>
  );
}

function ExecutiveSummary() {
  return (
    <div className={styles.summaryWindow}>
      <div className={styles.summarySidebar}><b>m</b>{["Home", "Areas", "Plan", "Macros", "Commits", "Code Review", "Settings"].map((item) => <span key={item}>{item}</span>)}</div>
      <div className={styles.summaryBody}>
        <div className={styles.summaryHeader}><span>IS</span><div><b>Executive summary</b><small>A clear view of what changed across your workspace.</small></div><button type="button" aria-label="Search">⌕</button></div>
        <div className={styles.summaryDate}>‹ <b>Jun 3–16</b> ›</div>
        <div className={styles.summaryDonut}><svg viewBox="0 0 150 150" aria-label="164 hours coding time"><circle cx="75" cy="75" r="54" fill="none" stroke="#5b4dff" strokeWidth="16" strokeDasharray="126 340" transform="rotate(-90 75 75)"/><circle cx="75" cy="75" r="54" fill="none" stroke="#e65d82" strokeWidth="16" strokeDasharray="90 340" strokeDashoffset="-132" transform="rotate(-90 75 75)"/><circle cx="75" cy="75" r="54" fill="none" stroke="#62c79e" strokeWidth="16" strokeDasharray="65 340" strokeDashoffset="-228" transform="rotate(-90 75 75)"/><circle cx="75" cy="75" r="54" fill="none" stroke="#548be0" strokeWidth="16" strokeDasharray="35 340" strokeDashoffset="-299" transform="rotate(-90 75 75)"/><text x="75" y="75" textAnchor="middle" fontSize="18" fill="#3e4a70">164h</text><text x="75" y="89" textAnchor="middle" fontSize="7" fill="#9698ac">Coding Time</text></svg><div>◷ Project Focus<p><b>38%</b> Auth &amp; Security</p><p><b>27%</b> Payments</p><p><b>21%</b> Platform</p><p><b>14%</b> Growth</p></div></div><div className={styles.summaryColumns}>
          <div><h4>Sprint Summary</h4>{sprintItems.map(([title, copy]) => <article key={title}><b>{title}</b><p>{copy}</p></article>)}</div>
          <aside><span>Current sprint</span><b>12 days remaining</b><span>Areas</span><i style={{ width: "38%" }}>Auth &amp; Security 38%</i><i style={{ width: "27%" }}>Payments 27%</i><i style={{ width: "21%" }}>Platform 21%</i></aside>
        </div>
      </div>
    </div>
  );
}

function CodeDiff() {
  const oldLines = [
    ["05", "session: Session"], ["06", ") {"], ["07", "  if (session.expiresAt <"], ["08", "      Date.now()) {"], ["09", "    return true"], ["10", "  }"], ["11", "  return false"],
  ];
  const newLines = [
    ["05", "session: Session"], ["06", ") {"], ["07", "  if (session.expiresAt <"], ["08", "      Math.floor(Date.now() / 1000)) {"], ["09", "    return true"], ["10", "  }"], ["11", "  return false"],
  ];
  return (
    <div className={styles.diffWindow}>
      <div className={styles.diffCode}>
        <div>{oldLines.map(([n, code], index) => <code className={index === 2 || index === 3 ? styles.diffRemoved : ""} key={n}><span>{n}</span>{code}</code>)}</div>
        <div>{newLines.map(([n, code], index) => <code className={index === 2 || index === 3 ? styles.diffAdded : ""} key={n}><span>{n}</span>{code}</code>)}</div>
      </div>
      <div className={styles.findingPanel}><b>2 bugs detected by Macroscope</b><span>auth/session.ts</span><small>CRITICAL BUG · LINE 07–08</small><p>Date.now() returns milliseconds but expiresAt is stored in seconds. Every session will appear expired immediately after creation.</p><button type="button">Fix it for me</button></div>
    </div>
  );
}

function CheckAgents() {
  const agents = ["Security Review", "Web Event Tracking", "Ticket Requirements", "Accessibility Audit", "Production Errors"];
  return <div className={styles.agentChecks}><div><span>Check run agents in progress...</span><b>5 agents · defined in .macroscope/check-run-agents</b></div>{agents.map((agent, index) => <p key={agent}><i className={index < 3 ? styles.agentDone : ""}>{index < 3 ? "✓" : "·"}</i>{agent}<span>{index < 3 ? "Complete" : "Running"}</span></p>)}</div>;
}

function PrSummary() {
  return (
    <div className={styles.prSummary}>
      <span>Fix Shopify route page title fallbacks</span><small>PR #1738 · Open</small><p>Jordan wants to merge into <b>main</b></p><h4>Summary</h4><p>This PR fixes checkout titles for Shopify routes whose projected slug is flattened before the title resolver runs.</p><ul><li>Adds resolveRouteTitleFallback to recover store titles when a route exists but the generic resolver returns an empty value.</li><li>Keeps non-Shopify routes on the existing title resolution path.</li><li>Adds coverage for flattened slugs, nested product paths, and missing store metadata.</li></ul><p>Start review in src/routes/titleResolver.ts, where the fallback is applied after projection.</p><small>Written by Macroscope</small>
    </div>
  );
}

function CliTerminal() {
  return (
    <div className={styles.cliTerminal}>
      <div><span>macroscope — zsh</span><i>•••</i></div><code>❯ /macroscope:code-review</code><hr /><p>Reviewing staged changes against main…</p><b>✗ Correctness</b><span>4 issues · auth/session.ts</span><hr /><p>I&apos;ve fixed all four issues in a parallel worktree — want me to apply them?</p><small>✻ Cooked for 4m 18s</small>
    </div>
  );
}

function SlackThread() {
  return (
    <div className={styles.slackWindow}>
      <div className={styles.slackRail}><i /><i /><i /><i /></div>
      <div className={styles.slackChannel}><header><b># engineering</b><span>128 members</span></header><div className={styles.slackMessage}><span className={styles.slackAvatar}>AR</span><p><b>Alex Rivera <small>9:42 AM</small></b>What changed in payments this week?</p></div><div className={styles.slackMessage}><span className={`${styles.slackAvatar} ${styles.macroscopeAvatar}`}>M</span><div><p><b>Macroscope <small>APP · 9:42 AM</small></b>Payments landed 14 changes across billing, retries, and reconciliation.</p><ul><li>Stripe usage billing now finalizes invoices from webhooks.</li><li>Payment retry delivery failures are observable and replayable.</li><li>Ledger reconciliation now handles delayed disputes.</li></ul><button type="button">View 14 commits</button></div></div><div className={styles.slackComposer}>Message #engineering</div></div>
    </div>
  );
}

export function MacroscopePage() {
  return (
    <div className={styles.page} data-macroscope-page id="top">
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <MacroscopeHeader />
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="macroscope-title">
          <span id="macroscope-hero-sentinel" className={styles.heroSentinel} />
          <div className={styles.factoryScene} aria-hidden="true">
            <Image src="/assets/macroscope/hero/factory-light.webp" alt="" fill loading="eager" fetchPriority="high" sizes="100vw" />
            <div className={styles.factoryGlow} />
          </div>
          <div className={styles.heroCopy}>
            <h1 id="macroscope-title">Command your own<br />software factory</h1>
            <div className={styles.heroActions}><a className={styles.primaryButton} href="https://app.macroscope.com"><Image src="/assets/macroscope/brand/github-white.svg" alt="" width={18} height={18} />Start Free</a><a className={styles.secondaryButton} href="https://macroscope.com/book-demo">Book Demo</a></div>
            <a className={styles.announcement} href="https://macroscope.com/blog/introducing-murmur"><span>Introducing Murmur</span><b>Read the blog →</b></a>
          </div>
          <div className={styles.heroPillars}>{heroPillars.map((pillar, index) => <a href={pillar.href} key={pillar.title} className={styles.heroPillar} style={{ "--pillar-index": index } as React.CSSProperties}><HeroPillarGraphic index={index} /><span className={styles.heroPillarCopy}><span className={styles.heroPillarTitle}><b>{pillar.title}</b>{"badge" in pillar && <em><svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M17.5 10.4167C12.2917 10.4167 10 12.8356 10 18.3333C10 12.8356 7.70833 10.4167 2.5 10.4167C7.70833 10.4167 10 7.99769 10 2.5C10 7.99769 12.2917 10.4167 17.5 10.4167Z" stroke="currentColor" strokeWidth="1.66667" strokeLinejoin="round" /></svg>{pillar.badge}</em>}<i aria-hidden="true">→</i></span><p>{pillar.body}</p></span></a>)}</div>
        </section>

        <section id="customers" className={styles.logoBand} aria-label="Customers"><div>{customerLogos.map((logo) => <Image key={logo.alt} src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />)}</div></section>

        <section id="murmur" className={styles.murmurSection}>
          <DotField />
          <div className={styles.shell}>
            <div className={styles.murmurLead}><div><span>beta</span><Image src="/assets/macroscope/reference/murmur/logotype-dark.svg" alt="Murmur" width={380} height={96} /></div><div><h2>Cloud Agent Orchestration</h2><p>Run dozens of agents in parallel without babysitting them. Every agent writes code and verifies its own work in an isolated sandbox.</p><div className={styles.leadActions}><a className={styles.secondaryButton} href="https://docs.murmur.dev">Read Docs ↗</a><a className={styles.primaryButton} href="https://form.typeform.com/to/PrkzukAS">Apply to beta →</a></div></div></div>
            <div className={styles.selfDriving}><div className={styles.featureCopy}><h3>Self-driving PRs</h3><p>Murmur listens to GitHub and automatically deals with code review comments, failing checks, and merge conflicts.</p></div><div className={styles.flockScene}><MurmurEventDemo /></div></div>
            <div className={styles.murmurPair}>
              <article><div className={styles.featureCopy}><h3>Sandboxed</h3><p>Each agent runs in a dedicated cloud VM that can run your full stack. This allows agents to self verify their work, and to run longer since they&apos;re untethered from your local machine.</p></div><div className={styles.sandboxScene}><div className={styles.sandboxDemo}><div className={styles.vmList}>{[["turn-follow-up-composer", "8 vCPU · 16 GB · eu-west", "running"], ["workspace-agent-presence", "2 vCPU · 4 GB · us-west", "building"], ["desktop-shell-polish", "4 vCPU · 8 GB · us-east", "running"]].map(([name, spec, state]) => <p key={name}><i /><span><b>{name}</b><small>{spec}</small></span><em>{state}</em></p>)}</div><div className={styles.sandboxStack}><div className={styles.stackPreview}><b>Running stack</b><span>3 services</span><code>web <i>:3000</i></code><code>api <i>:8080</i></code><code>postgres <i>:5432</i></code><div>$ pnpm test<br />$ playwright screenshot<br />$ git push</div></div><ExecutiveSummary /></div></div></div></article>
              <article><div className={styles.featureCopy}><h3>Local orchestration</h3><p>Use your local machine to direct a fleet of cloud agents on Murmur using the CLI/MCP.</p></div><div className={styles.localScene}><OrchestrationTerminal /></div></article>
            </div>
            <div className={styles.murmurGrid}>
              <article><h3>Bring Your Own Keys</h3><p>Use your Claude or Codex subscription and manage your own API keys.</p><div className={styles.keysScene}><div className={styles.keyPanel}><label>Coding Agent API Key <span>encrypted</span></label><b>Choose an agent provider</b><div><button type="button">Claude Code</button><button type="button">Codex</button></div><code>sk-ant-••••••••••••7W2E</code><small>ENCRYPTED · Scoped to agent execution in this workspace</small></div></div></article>
              <article><h3>Run on our cloud or yours</h3><p>Choose the execution placement for every workload. Host VMs in Murmur Cloud, or manage them in your own GCP or AWS VPCs.</p><div className={styles.cloudScene}><div className={styles.placementPanel}><span>Runtime placement <b>ready</b></span><p>Choose where Murmur runs agents</p><button type="button">Murmur Cloud</button><button type="button">Your cloud</button><small>Dedicated cloud workers, managed for you. No infrastructure to manage.</small></div></div></article>
              <article><h3>Works where you work</h3><p>Murmur integrates with Slack, Linear, GitHub, or your own systems, making it easy for teams to coordinate agent work.</p><div className={styles.worksScene}><IntegrationOrbit /></div></article>
              <article><h3>Security &amp; customization</h3><p>Choose each VM&apos;s CPU, memory, and disk; bake your full stack into a custom image; and tune warm capacity and termination behavior.</p><div className={styles.enterpriseScene}><div className={styles.vmConfig}><b>Production workspace</b>{[["BASE IMAGE", "murmur-debian12"], ["RECIPE", "provision.sh"], ["BAKED IMAGE", "macroscope-dev"], ["CPU", "4 vCPU"], ["MEMORY", "16 GB"], ["DISK", "120 GB SSD"], ["MIN WARM VMS", "2"], ["TERMINATION", "Immediate"]].map(([label, value]) => <span key={label}><small>{label}</small>{value}</span>)}</div></div></article>
            </div>
            <div className={styles.faqBlock}><div><a className={styles.murmurVideo} href="https://macroscope.com/blog/introducing-murmur" aria-label="Learn about Murmur"><span>▶</span></a><h3>Learn more about Murmur</h3><a href="https://docs.murmur.dev">Want the technical details?<br /><b>Read the Docs</b></a></div><DisclosureList items={murmurFaq} initialOpen={0} /></div>
          </div>
        </section>

        <section id="code-review" className={styles.codeSection}>
          <DotField dark />
          <div className={styles.shell}>
            <div className={styles.reviewLead}><div><span>AUTOMATIC REVIEW AND VALIDATION</span><h2>Code Review</h2></div><div><h3>Catch real bugs</h3><p>Macroscope finds more bugs than any other code review tool, without spamming you with false positives.</p></div></div>
            <div className={styles.reviewPair}>
            <div className={styles.approvability}><div><h3>Approvability</h3><p>Take PR approvals off of your team&apos;s plate. Macroscope can auto-approve PRs that have no bugs and have minimal blast radius.</p></div><div className={styles.approvalScene}><div className={styles.approvalCard}><span>Clarify warning copy in checkout banner</span><b>#1842</b><small>Jordan Mills opened this pull request<br />✓ All checks have passed</small><i>✓ Approved by Macroscope</i></div></div></div>
            <div className={styles.codeFeature}><h3>Correctness Checks</h3><p>Out of the box, Macroscope finds more bugs than any other tool, without spamming you with false positives.</p><div className={styles.correctnessScene}><CodeDiff /></div></div></div>
            <div className={styles.benchmark}><div><h2>What makes our code review different?</h2><div className={styles.benchmarkBars}><div><span>◉ Macroscope</span><b>48.31% Recall</b><small>~$1/review</small></div><div><span>✳ Claude Code Reviewer</span><b>40.9% Recall</b><small>~$15–$25/review</small></div></div></div><p>We combine an agentic pipeline with purpose-built Abstract Syntax Tree (AST) walkers that we&apos;ve built for the most common programming languages. This allows our agent to deterministically gather rich context about every change, without relying solely on an LLM to search for that context itself. The result is faster, more token-efficient analysis and a deeper understanding of the codebase. This is one reason we achieve higher precision at 1/20th the cost of Claude&apos;s Code Reviewer, according to independent benchmarks.</p></div>
            <div className={styles.cliArtwork}><div className={styles.cliLandscape}><CliCopy /></div><div className={styles.cliArtworkCaption}><h3>Macroscope CLI</h3><p>Run Macroscope&apos;s correctness review locally on your machine<br />and catch real bugs before you push to your branch.</p></div></div>
            <div className={styles.benchmarkFeature}><h3>By the Benchmarks</h3><a href="https://macroscope.com/blog/code-review-benchmark">Read blog ↗</a><p>See how Macroscope compares to other tools according to our internal benchmark.</p><div className={styles.benchmarkChart}><svg viewBox="0 0 1000 430" role="img" aria-label="Bug detection rate: Macroscope 48.3%, CodeRabbit 46%, Cursor Bugbot 42.5%, Greptile 24%, Graphite Diamond 18%"><defs><linearGradient id="benchmark-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ba89e6" stopOpacity=".55"/><stop offset="1" stopColor="#e9d394" stopOpacity=".08"/></linearGradient></defs>{Array.from({length:11},(_,i)=><g key={i}><line x1="66" x2="972" y1={38+i*35} y2={38+i*35} stroke="#fff" strokeOpacity=".1"/><text x="30" y={42+i*35} fill="#c7bfd8" fontSize="9">{50-i*5}</text></g>)}<path d="M80 51 L285 67 L493 90 L702 220 L922 263 V388 H80Z" fill="url(#benchmark-fill)"/><path d="M80 51 L285 67 L493 90 L702 220 L922 263" fill="none" stroke="#a36fd5" strokeWidth="2.5"/>{[[80,51,"Macroscope"],[285,67,"CodeRabbit"],[493,90,"Cursor Bugbot"],[702,220,"Greptile"],[922,263,"Graphite Diamond"]].map(([x,y,label])=><g key={label}><circle cx={x} cy={y} r="4" fill="#d6b6eb"/><rect x={Number(x)-60} y={Number(y)-41} width="142" height="38" rx="7" fill="#0b0b18" stroke="#ffffff20"/><text x={Number(x)-47} y={Number(y)-17} fill="white" fontSize="12">{label}</text></g>)}</svg></div></div>
            <div className={styles.codeGrid}>
              <article><h3>Check Run Agents</h3><p>Define custom AI reviewers that automatically run within your PRs (each with access to all your connected tools or MCPs), enforcing your stylistic conventions and workflows at PR review time.</p><div className={styles.agentScene}><CheckAgents /></div></article>
              <article><h3>PR Summaries</h3><p>Every PR gets a clear summary with context for reviewers.</p><div className={styles.summaryScene}><PrSummary /></div></article>
              <article><h3>Fix It For Me</h3><p>Reply &quot;fix it&quot; on any review comment. Macroscope branches, writes the fix, runs your CI, and merges when checks pass.</p><div className={styles.fixScene}><FixItDemo /></div></article>
              <article><h3>Scalable Config</h3><p>Per-repo enable/disable, skip-by-label, file exclusion via .macroscope/ignore, manual triggers via @macroscope-app review. Personal preferences override workspace defaults.</p><div className={styles.configScene}><ConfigSwitches /></div></article>
              <article><h3>CLI <small>beta</small></h3><p>Run Macroscope&apos;s correctness review locally on your machine and catch real bugs before you push to your branch.</p><div className={styles.cliScene}><CliTerminal /></div></article>
            </div>

          </div>
        </section>

        <section id="status" className={styles.statusSection}>
          <DotField />
          <div className={styles.shell}>
            <SectionLead label="AUTOMATIC VISIBILITY" title="Status" body="Know what's shipping. Without asking." />
            <div className={styles.statusRow}><article><h3>Engineering Productivity</h3><p>Understand engineering output across your team. See how much engineering work is actually landing in production.</p><div className={styles.statusChartScene}><StatusChart /></div></article><article><h3>Integrations</h3><p>Native — Deep, first-party integrations that power Code Review, Status, and Agent.</p><IntegrationOrbit /></article></div>
            <div className={styles.statusPair}><article><h3>Macros — agentic automation</h3><p>Trigger recurring workflows, with guardrails, from inside your stack.</p><div className={styles.macroBlocks}><span>Every weekday at 9:00</span><b>Summarize production changes</b><i>Run with GitHub + Slack</i></div></article><article><h3>API — wire it into your stack</h3><p>Connect Macroscope to your CI, chat, support, and observability tools.</p><div className={styles.apiScene}><div><h4>Trigger URL</h4><code>POST</code><p>https://hooks.macroscope.com/api/v1/workflows</p><pre>{`{
  "repo": "checkout",
  "workflow": "release-risk"
}`}</pre></div></div></article></div>
            <div className={styles.statusPair}>
            <div className={styles.feedFeature}><div><h3>A newsfeed for code changes</h3><p>Exceptionally succinct and accurate summaries of each commit and PR, automatically distributed to your team in Slack.</p></div><div className={styles.commitFeed}>{commitFeed.map(([initials, name, time, update, coding]) => <article key={name}><span>{initials}</span><div><b>{name}<small>{time}</small></b><p>{update}</p></div><em><b>{coding}</b>coding time</em></article>)}</div></div>
            <div className={styles.featureSplitReverse}><ExecutiveSummary /><div className={styles.featureCopy}><h3>Executive Summaries</h3><p>High-level summaries of what&apos;s changing in your codebase, regenerated multiple times daily and surfaced on the home page and via email. Organized by Area, collapsible, scannable in seconds.</p></div></div>
            </div>
            <div className={styles.slackFeature}><div><h3>Slack — answers and actions</h3><p>Use it directly from Slack. Inspect code, diagnose failures, and ship.</p></div><SlackThread /></div>
          </div>
          <div className={styles.marquee} aria-label="Build faster. Always informed. Merge smarter. Real signal. Ship confidently."><div>BUILD FASTER <i>ALWAYS INFORMED</i> MERGE SMARTER <i>REAL SIGNAL</i> SHIP CONFIDENTLY BUILD FASTER <i>ALWAYS INFORMED</i> MERGE SMARTER</div></div>
        </section>

        <section className={styles.videosSection}>
          <div className={styles.shell}>
            <div className={styles.centerLead}><h2>See it in action</h2><p>How our team uses Macroscope on real work.</p></div>
            <VideoGallery />
            <div className={styles.videoCallout}><div><h3>Your software factory, in motion.</h3><p>Orchestrate coding agents in parallel, review every change automatically, and keep work moving from task to merge.</p></div><a className={styles.primaryButton} href="https://app.macroscope.com">Start For Free</a></div>
          </div>
        </section>

        <section id="security" className={styles.securitySection}>
          <div className={styles.shell}>
            <div className={styles.securityLead}><h2>Security</h2><p>Keeping your data secure is of paramount importance to us. We have rigorous technical, operational and contractual safeguards in place to protect customer data.</p></div>
            <div className={styles.securityGrid}>{securityClaims.map(([title, body], index) => <article key={title}><span className={styles.securityOrb}><Image src={`/assets/macroscope/reference/security-${index}.svg`} alt="" width={60} height={60} /></span><div><h3>{title}</h3><p>{body}</p>{index === 0 && <a href="https://trust.macroscope.com">Visit Trust Center →</a>}</div></article>)}</div>
          </div>
        </section>

        <PricingReveal>
        <section id="pricing" className={styles.pricingSection}>
          <div className={styles.shell}>
            <div className={styles.pricingHero}><div><h2>Pay for usage</h2><h2>not seats</h2></div><a className={styles.primaryButton} href="https://app.macroscope.com/">Sign up for $100 Free Usage</a></div>
            <div className={styles.pricingProducts}>{pricingProducts.map((product) => <article key={product.name}><h3>{product.name}</h3><p className={styles.pricingTagline}>{product.tagline}</p><b>{product.price}</b><span>{product.unit}</span>{"note" in product && <small>{product.note}</small>}{"modes" in product && <details className={styles.pricingModes}><summary>Detection modes</summary><div>{product.modes.map(([mode, price]) => <p key={mode}><span>{mode}</span><b>{price}</b></p>)}<a href="https://docs.macroscope.com/bug-detection-and-fixes#detection-mode">Learn more →</a></div></details>}<ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></article>)}</div>
            <div className={styles.murmurPricing}><div><h3>{murmurPricing.title}</h3><p>{murmurPricing.body}</p></div><a href={murmurPricing.href}>{murmurPricing.cta}</a></div>
            <div className={styles.planGrid}>{pricingPlans.map((plan, index) => <a className={index === 1 ? styles.enterprisePlan : ""} href={plan.href} key={plan.name}><h3>{plan.name}</h3><b>{plan.price}</b><span>{plan.cta}</span><ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></a>)}</div>
            <PricingCalculator />
            <div className={styles.spendControls}>{spendControls.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
            <div className={styles.pricingTrusted}><span>TRUSTED BY</span><div>{customerLogos.map((logo) => <Image key={logo.alt} src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />)}</div></div>
            <div className={styles.pricingFaq}><h3>FAQ</h3><DisclosureList items={pricingFaq} initialOpen={0} /></div>
          </div>
        </section>
        </PricingReveal>

        <section className={styles.testimonialsSection}>
          <div className={styles.shell}>
            <div className={styles.testimonialLead}><h2>People seem to like it...</h2></div>
            <div className={styles.testimonialGrid}>{testimonials.map((testimonial) => <figure key={testimonial.name}><figcaption><Image src={testimonial.portrait} alt="" width={44} height={44} /><div><b>{testimonial.name}</b><small>{testimonial.role}</small></div></figcaption><blockquote>{testimonial.quote}</blockquote></figure>)}</div>
          </div>
        </section>

        <section className={styles.signupSection} aria-label="Sign up">
          <div className={styles.shell}><SignupTelemetry /></div>
        </section>
      </main>

      <footer className={styles.footer}>
        
        <div className={styles.shell}>
          <div className={styles.footerBrand}><Image src="/assets/macroscope/brand/logo-black.svg" alt="Macroscope" width={131} height={28} /></div>
          <div className={styles.footerGroups}>{footerGroups.map((group) => <div key={group.label}><h3>{group.label}</h3>{group.links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</div>)}</div>
          <div className={styles.footerActions}><a href="https://macroscope.com/book-demo">Book Demo</a><a href="https://app.macroscope.com/"><Image src="/assets/macroscope/brand/github-black.svg" alt="" width={19} height={19} />Sign up</a></div>
          <div className={styles.footerSocial}>{socialLinks.map((link) => <a href={link.href} aria-label={link.label} key={link.label}><Image src={link.icon} alt="" width={20} height={20} /></a>)}</div>
        </div>
      </footer>
    </div>
  );
}
