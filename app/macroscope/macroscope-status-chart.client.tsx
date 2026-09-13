"use client";

import { useId, useState } from "react";
import { statusPoints } from "./macroscope.data";
import styles from "./macroscope.module.css";

const width = 760;
const height = 330;
const plot = { left: 54, right: 28, top: 24, bottom: 44 };
const max = 10000;
const x = (index: number) => plot.left + (index * (width - plot.left - plot.right)) / (statusPoints.length - 1);
const y = (value: number) => plot.top + (1 - value / max) * (height - plot.top - plot.bottom);
const pathFor = (key: "pushed" | "landed") => {
  const points = statusPoints.map((point, i) => [x(i), y(point[key])]);
  return points.reduce((path, point, i) => {
    if (!i) return `M${point[0]},${point[1]}`;
    const before = points[Math.max(0, i - 2)], start = points[i - 1], after = points[Math.min(points.length - 1, i + 1)];
    return `${path} C${start[0] + (point[0] - before[0]) / 6},${start[1] + (point[1] - before[1]) / 6} ${point[0] - (after[0] - start[0]) / 6},${point[1] - (after[1] - start[1]) / 6} ${point[0]},${point[1]}`;
  }, "");
};

export function StatusChart() {
  const titleId = useId();
  const descriptionId = useId();
  const [active, setActive] = useState(2);
  const [tableOpen, setTableOpen] = useState(false);
  const point = statusPoints[active];
  const landedPercent = Math.round((point.landed / point.pushed) * 100);

  const move = (next: number) => setActive(Math.max(0, Math.min(statusPoints.length - 1, next)));

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartTopline}>
        <div>
          <h4 id={titleId}>Pushed vs. landed</h4>
          <div className={styles.chartLegend} aria-label="Series legend">
            <span><i className={styles.legendPushed} />Pushed</span>
            <span><i className={styles.legendLanded} />Landed</span>
          </div>
        </div>
        <div className={styles.chartFilters} aria-label="Chart filters">
          <span>Team Members <b>All</b></span><span>Project <b>All</b></span><span>Date Range <b>May 22-29</b></span>
        </div>
      </div>
      <div className={styles.chartPlot}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") { event.preventDefault(); move(active + 1); }
            if (event.key === "ArrowLeft") { event.preventDefault(); move(active - 1); }
            if (event.key === "Home") { event.preventDefault(); move(0); }
            if (event.key === "End") { event.preventDefault(); move(statusPoints.length - 1); }
          }}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const localX = ((event.clientX - rect.left) / rect.width) * width;
            const index = Math.round(((localX - plot.left) / (width - plot.left - plot.right)) * (statusPoints.length - 1));
            move(index);
          }}
        >
          <desc id={descriptionId}>Line chart of pushed and landed engineering work from May 22 through May 29. Use left and right arrow keys to inspect dates.</desc>
          {[0, 2000, 4000, 6000, 8000, 10000].map((value) => (
            <g key={value}>
              <line className={styles.chartGrid} x1={plot.left} x2={width - plot.right} y1={y(value)} y2={y(value)} />
              <text className={styles.chartAxis} x={plot.left - 12} y={y(value) + 4} textAnchor="end">{value === 0 ? "0" : `${value / 1000}k`}</text>
            </g>
          ))}
          {statusPoints.map((item, index) => <text className={styles.chartAxis} x={x(index)} y={height - 14} textAnchor="middle" key={item.day}>{item.day}</text>)}
          <path className={styles.chartPushed} d={pathFor("pushed")} />
          <path className={styles.chartLanded} d={pathFor("landed")} />
          {statusPoints.map((item, i) => <g key={item.day}><circle cx={x(i)} cy={y(item.pushed)} r="3" fill="#599fea" stroke="white" strokeWidth="1.5"/><circle cx={x(i)} cy={y(item.landed)} r="3" fill="#9452de" stroke="white" strokeWidth="1.5"/></g>)}
          <line className={styles.chartCrosshair} x1={x(active)} x2={x(active)} y1={plot.top} y2={height - plot.bottom} />
          <circle className={styles.chartPushedPoint} cx={x(active)} cy={y(point.pushed)} r="6" />
          <circle className={styles.chartLandedPoint} cx={x(active)} cy={y(point.landed)} r="6" />
          <g className={styles.chartTooltip} transform={`translate(${Math.min(x(active) + 12, width - 168)},${Math.max(8, y(Math.max(point.pushed, point.landed)) - 78)})`}>
            <rect width="154" height="70" rx="7" />
            <text x="12" y="20">May {point.day}, 2026</text>
            <text x="12" y="40">Pushed {point.pushed.toLocaleString()}</text>
            <text x="12" y="58">Landed {point.landed.toLocaleString()} · {landedPercent}% landed</text>
          </g>
          <text className={styles.chartDirectPushed} x={width - plot.right} y={y(statusPoints.at(-1)!.pushed) - 10} textAnchor="end">Pushed</text>
          <text className={styles.chartDirectLanded} x={width - plot.right} y={y(statusPoints.at(-1)!.landed) + 18} textAnchor="end">Landed</text>
        </svg>
      </div>
      <button className={styles.tableToggle} type="button" aria-expanded={tableOpen} aria-controls="status-chart-table" onClick={() => setTableOpen((value) => !value)}>
        {tableOpen ? "Hide data table" : "View data table"}
      </button>
      <div id="status-chart-table" hidden={!tableOpen} className={styles.chartTableWrap}>
        <table>
          <caption>Pushed and landed engineering work, May 22–29, 2026</caption>
          <thead><tr><th scope="col">Date</th><th scope="col">Pushed</th><th scope="col">Landed</th><th scope="col">Landed rate</th></tr></thead>
          <tbody>{statusPoints.map((item) => <tr key={item.day}><th scope="row">May {item.day}</th><td>{item.pushed.toLocaleString()}</td><td>{item.landed.toLocaleString()}</td><td>{Math.round((item.landed / item.pushed) * 100)}%</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
