"use client";

import { useEffect, useRef, useState } from "react";
import { murmurEvents } from "./macroscope.data";
import styles from "./macroscope.module.css";
import { useReducedMotion } from "./use-reduced-motion";

export function MurmurEventDemo() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [autopilot, setAutopilot] = useState([true, true, true, true]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) { setStep(murmurEvents.length - 1); return; }
    if (!visible) return;
    const timer = window.setInterval(() => setStep((value) => (value + 1) % murmurEvents.length), 1800);
    return () => window.clearInterval(timer);
  }, [reduced, visible]);

  return (
    <div ref={ref} className={styles.prDemo} aria-live="polite">
      <div className={styles.autopilot}><header>◉ Autopilot <span>⚙</span></header>{["Handle review comments", "Fix failing checks", "Resolve merge conflicts", "Keep branch up to date"].map((label, index) => <label key={label}><span>{label}</span><input aria-label={label} type="checkbox" checked={autopilot[index]} onChange={() => setAutopilot(current => current.map((value, i) => i === index ? !value : value))} /></label>)}</div>
      <div className={styles.prSidebar}>
        {['backend', 'add-system-theme-option', 'corporate-homepage-murmur', 'msreview-skipcache'].map((item, index) => (
          <span className={index === step ? styles.prActive : ""} key={item}><i />{item}</span>
        ))}
      </div>
      <div className={styles.prTimeline}><div className={styles.prDemoTitle}>add-system-theme-option <span>↗ #13868</span></div>
        {murmurEvents.map(([event, detail], index) => (
          <div className={`${styles.prEvent} ${index <= step ? styles.prEventVisible : ""}`} key={event}>
            <span>{event}</span><b>{detail}</b>
          </div>
        ))}
        <div className={styles.agentWorking}>
          <span className={styles.codexGlyph}>✣</span>
          <div><b>Codex</b><small>Working</small></div>
          <p>{["Reading review comments", "Resolving ThemeProvider.tsx", "Running checks", "Rebasing onto origin/main"][step]}</p>
        </div>
      </div>
    </div>
  );
}

const terminalCopy = {
  "Claude Code": [
    "> fan out murmur agents to finish the homepage redesign",
    "I'll split the work across isolated sandboxes.",
    "⎿ Ran murmur spawn 6 --repo back",
    "⎿ 6 sandboxes ready (claude ×4, codex ×2)",
    "⎿ murmur status 4 running, 2 queued",
    "⎿ homepage-hero opened PR #436 checks passing",
    "✻ Formicating… (esc to interrupt)",
  ],
  Codex: [
    "> Use Murmur to fix every failing workspace check",
    "Spawning isolated workers for each failure.",
    "✓ auth-session · PR #438",
    "✓ billing-webhooks · PR #439",
    "… accessibility-audit running",
    "2 complete, 1 running",
  ],
} as const;

export function OrchestrationTerminal() {
  const [tab, setTab] = useState<keyof typeof terminalCopy>("Claude Code");
  return (
    <div className={styles.orchestrationTerminal}>
      <div className={styles.terminalTabs} role="tablist" aria-label="Agent terminal">
        {(Object.keys(terminalCopy) as Array<keyof typeof terminalCopy>).map((name) => (
          <button type="button" role="tab" aria-selected={tab === name} onClick={() => setTab(name)} key={name}>{name}</button>
        ))}
      </div>
      <div className={styles.terminalTranscript} role="tabpanel">
        {terminalCopy[tab].map((line, index) => <p className={index === 0 ? styles.terminalPrompt : ""} key={line}>{line}</p>)}
        <span className={styles.cursor} aria-hidden="true" />
      </div>
    </div>
  );
}

export function FixItDemo() {
  const reduced = useReducedMotion();
  const [fixing, setFixing] = useState(false);
  const [step, setStep] = useState(reduced ? 4 : 0);
  const labels = ["Fix", "Commit", "Checks", "Merge"];

  useEffect(() => {
    if (!fixing) return;
    if (step >= labels.length) return;
    const timer = window.setTimeout(() => setStep((value) => value + 1), reduced ? 0 : 650);
    return () => window.clearTimeout(timer);
  }, [fixing, reduced, step, labels.length]);

  return (
    <div className={styles.fixDemo}>
      <div className={styles.reviewComment}>
        <div className={styles.avatar}>JM</div>
        <div><b>Jordan Mills</b><p>Removes the settlementDate guard from invoice replay. Paused accounts can now be charged twice when the retry job replays a partial billing window.</p></div>
      </div>
      <div className={styles.reviewComment}>
        <div className={`${styles.avatar} ${styles.macroscopeAvatar}`}>M</div>
        <div><b>Macroscope</b><p>This drops the settlementDate guard before invoice replay. Paused accounts can be charged twice during partial-window retries.</p></div>
      </div>
      <ol className={styles.fixSteps} aria-label="Fix progress">
        {labels.map((label, index) => <li className={index < step ? styles.fixComplete : index === step && fixing ? styles.fixCurrent : ""} key={label}><span>{index < step ? "✓" : index + 1}</span>{label}</li>)}
      </ol>
      <button type="button" className={styles.fixButton} onClick={() => { setStep(0); setFixing(true); }} disabled={fixing && step < labels.length}>
        {step >= labels.length ? "Fix merged" : fixing ? "Macroscope is fixing it…" : "@Macroscope Fix it"}
      </button>
    </div>
  );
}

export function ConfigSwitches() {
  const [values, setValues] = useState([true, true, false, true, true]);
  const labels = ["Auto-assign Reviewer", "Skip Dependabot", "Review Draft PRs", "Summarize PRs on GitHub", "Check Run Agents"];
  return (
    <div className={styles.configPanel}>
      {labels.map((label, index) => (
        <label key={label}>
          <span>{label}</span>
          <input type="checkbox" checked={values[index]} onChange={() => setValues((current) => current.map((value, i) => i === index ? !value : value))} />
        </label>
      ))}
    </div>
  );
}

export function CliCopy() {
  const command = "curl -sSL https://raw.githubusercontent.com/prassoai/macroscope-local/main/install.sh | bash";
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const input = document.createElement("textarea");
      input.value = command;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={styles.cliCopy}>
      <code>$ {command}</code>
      <button type="button" onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
    </div>
  );
}
