"use client";

import { useId, useMemo, useState } from "react";
import { pricingConstants } from "./macroscope.data";
import styles from "./macroscope.module.css";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

type ProductKey = "review" | "status" | "agent";

export function PricingCalculator() {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState(15);
  const [commits, setCommits] = useState(500);
  const [credits, setCredits] = useState(1000);
  const [enabled, setEnabled] = useState<Record<ProductKey, boolean>>({ review: true, status: true, agent: true });

  const total = useMemo(() => {
    const reviewCost = enabled.review
      ? Math.max(pricingConstants.minimumReviewCost, pricingConstants.averageReviewKb * pricingConstants.codeReviewPerKb) * reviews
      : 0;
    const statusCost = enabled.status ? commits * pricingConstants.statusPerCommit : 0;
    const agentCost = enabled.agent ? Math.max(0, credits - pricingConstants.includedAgentCredits) * pricingConstants.agentPerCredit : 0;
    return reviewCost + statusCost + agentCost;
  }, [commits, credits, enabled, reviews]);

  const toggleProduct = (product: ProductKey) => setEnabled((current) => ({ ...current, [product]: !current[product] }));

  return (
    <section className={styles.calculator} aria-labelledby={`${panelId}-title`}>
      <button
        type="button"
        className={styles.calculatorHeader}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((value) => !value)}
      >
        <span><b id={`${panelId}-title`}>Usage Cost Estimator</b><small>Avg review ≈ $0.95 · Median $0.50</small></span>
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        <span className={styles.visuallyHidden}>{expanded ? "Collapse calculator" : "Expand calculator"}</span>
      </button>
      <div id={panelId} hidden={!expanded} className={styles.calculatorBody}>
        <div className={styles.calculatorRows}>
          <label className={styles.calculatorRow}>
            <input type="checkbox" checked={enabled.review} onChange={() => toggleProduct("review")} />
            <span className={styles.calculatorProduct}><b>Code Review</b><small>$0.05/KB</small></span>
            <input type="range" min="1" max="1000" step="1" value={reviews} disabled={!enabled.review} onChange={(event) => setReviews(Number(event.target.value))} aria-label="Reviews per month" />
            <input type="number" min="1" max="1000" step="1" value={reviews} disabled={!enabled.review} onChange={(event) => setReviews(clamp(Number(event.target.value), 1, 1000))} aria-label="Reviews per month numeric value" />
            <span className={styles.calculatorUnit}>REVIEWS / MO</span>
          </label>
          <label className={styles.calculatorRow}>
            <input type="checkbox" checked={enabled.status} onChange={() => toggleProduct("status")} />
            <span className={styles.calculatorProduct}><b>Status</b><small>$0.05/COMMIT</small></span>
            <input type="range" min="0" max="2000" step="1" value={commits} disabled={!enabled.status} onChange={(event) => setCommits(Number(event.target.value))} aria-label="Commits per month" />
            <input type="number" min="0" max="2000" step="1" value={commits} disabled={!enabled.status} onChange={(event) => setCommits(clamp(Number(event.target.value), 0, 2000))} aria-label="Commits per month numeric value" />
            <span className={styles.calculatorUnit}>COMMITS / MO</span>
          </label>
          <label className={styles.calculatorRow}>
            <input type="checkbox" checked={enabled.agent} onChange={() => toggleProduct("agent")} />
            <span className={styles.calculatorProduct}><b>Agent</b><small>$0.01/CREDIT</small></span>
            <input type="range" min="0" max="5000" step="10" value={credits} disabled={!enabled.agent} onChange={(event) => setCredits(Number(event.target.value))} aria-label="Agent credits per month" />
            <input type="number" min="0" max="5000" step="10" value={credits} disabled={!enabled.agent} onChange={(event) => setCredits(clamp(Number(event.target.value), 0, 5000))} aria-label="Agent credits per month numeric value" />
            <span className={styles.calculatorUnit}>{credits <= pricingConstants.includedAgentCredits ? "FREE" : "CREDITS / MO"}</span>
          </label>
        </div>
        <div className={styles.calculatorTotal}>
          <span>ESTIMATED TOTAL</span>
          <output aria-live="polite">~{currency.format(total)}/mo</output>
          <p>Includes 1,000 free Agent credits every month.</p>
          <a href="https://app.macroscope.com/">Start For Free</a>
        </div>
      </div>
    </section>
  );
}
