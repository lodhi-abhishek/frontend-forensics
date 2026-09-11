"use client";

import React from "react";
import { ChartPatterns } from "./charts/ChartPatterns";

export function CostAvailability() {
  return (
    <section className="relative py-12 px-6 sm:px-8 bg-[#faf9f5]">
      <span id="cost-and-availability" className="block -mt-24 pt-24 invisible" />

      {/* Reading Column */}
      <div className="reading-column">
        <h2 className="post-heading">Cost and availability</h2>

        <p className="post-text">
          Claude Fable 5.1 is available today on all platforms, including Amazon
          Web Services, Google Cloud, and Microsoft Azure. Developers can get
          started with{" "}
          <code className="font-anthropic-mono text-sm bg-[#141413]/5 text-[#141413] px-1.5 py-0.5 rounded">
            claude-fable-5-1
          </code>{" "}
          on the Claude API.
        </p>

        <p className="post-text">
          As mentioned above, we have reduced the price of Fable 5.1’s cache reads
          (where the model reuses context it has already processed) wherever usage
          is billed by token, such as on our API. Cache reads now cost 75% less,
          or $0.25 per million tokens.
        </p>

        <p className="post-text">
          This change leads to a substantial reduction in the overall cost of
          running the model. For typical workloads, costs are reduced by around
          25% relative to Fable 5. For complex coding and highly agentic tasks,
          the savings could be up to around 45%. The graph below illustrates why
          this change makes such a big difference:
        </p>
      </div>

      {/* Media Column: Dual Panel Indexed Cost Chart */}
      <div className="media-column my-8">
        <figure className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <figcaption>
              <span className="font-anthropic-sans text-xl sm:text-2xl font-semibold text-[#141413]">
                Indexed cost of Fable usage
              </span>
            </figcaption>

            {/* Legend */}
            <ul className="flex items-center gap-5 text-xs sm:text-sm font-anthropic-sans" aria-label="Series">
              <li className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 rounded-xs border border-[#141413]/20" viewBox="0 0 14 14">
                  <rect x="0.5" y="0.5" width="13" height="13" fill="url(#pattern-hatch-cloud)" />
                </svg>
                <span className="text-[#141413]">Cache reads</span>
              </li>
              <li className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 rounded-xs border border-[#141413]/20" viewBox="0 0 14 14">
                  <rect x="0.5" y="0.5" width="13" height="13" fill="#6B7C85" />
                </svg>
                <span className="text-[#141413]">All other tokens</span>
              </li>
            </ul>
          </div>

          <div className="w-full overflow-x-auto border border-[#e8e6dc] rounded-lg p-4 bg-[#FAF9F5] shadow-xs">
            <svg
              className="w-full min-w-[780px] h-auto"
              viewBox="0 0 960 538"
              role="img"
              aria-label="Indexed cost of Fable usage"
            >
              <ChartPatterns />

              {/* Subpanel 1: Typical Workload */}
              <g transform="translate(0, 0)">
                <text className="font-anthropic-sans text-sm font-semibold fill-[#141413]" x="243.5" y="14" textAnchor="middle">
                  Typical workload
                </text>

                {/* Y-Axis */}
                <g>
                  {[
                    { y: 519, val: "0" },
                    { y: 409, val: "25" },
                    { y: 299, val: "50" },
                    { y: 190, val: "75" },
                    { y: 80, val: "100" },
                  ].map((tick) => (
                    <g key={tick.y} transform={`translate(0, ${tick.y})`}>
                      <line className="chart-grid-line" x1="43" x2="444" />
                      <text className="chart-tick-text" x="39" dy="0.35em" textAnchor="end">
                        {tick.val}
                      </text>
                    </g>
                  ))}
                  <line className="chart-axis-line" x1="43" x2="43" y1="36" y2="519" />
                  <text
                    className="chart-label-text"
                    transform="translate(2, 277.5) rotate(-90)"
                    dy="1em"
                    textAnchor="middle"
                  >
                    Indexed cost (Fable 5 = 100)
                  </text>
                </g>

                {/* X-Axis */}
                <g>
                  <line className="chart-axis-line" x1="43" x2="444" y1="519" y2="519" />
                  <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="143.25" y="523" dy="1em" textAnchor="middle">
                    Fable 5
                  </text>
                  <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="343.75" y="523" dy="1em" textAnchor="middle">
                    Fable 5.1
                  </text>
                </g>

                {/* Bar 1: Fable 5 */}
                <g transform="translate(43, 0)">
                  {/* Cache reads (hatch) */}
                  <rect x="48.6" y="343" width="103.2" height="176" fill="url(#pattern-hatch-cloud)" stroke="#6B7C85" strokeWidth="1" />
                  {/* Other tokens (solid) */}
                  <rect x="48.6" y="80" width="103.2" height="263" fill="#6B7C85" />
                  <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="100.25" y="72" textAnchor="middle">
                    100
                  </text>
                </g>

                {/* Bar 2: Fable 5.1 */}
                <g transform="translate(243.5, 0)">
                  {/* Cache reads (hatch) */}
                  <rect x="48.6" y="471" width="103.2" height="48" fill="url(#pattern-hatch-matcha)" stroke="#2E5A44" strokeWidth="1" />
                  {/* Other tokens (solid) */}
                  <rect x="48.6" y="190" width="103.2" height="281" fill="#2E5A44" />
                  <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="100.25" y="182" textAnchor="middle">
                    75 (~25% less)
                  </text>
                </g>
              </g>

              {/* Subpanel 2: Highly Agentic Workload */}
              <g transform="translate(504, 0)">
                <text className="font-anthropic-sans text-sm font-semibold fill-[#141413]" x="243.5" y="14" textAnchor="middle">
                  Highly agentic workload
                </text>

                {/* Y-Axis */}
                <g>
                  {[
                    { y: 519, val: "0" },
                    { y: 409, val: "25" },
                    { y: 299, val: "50" },
                    { y: 190, val: "75" },
                    { y: 80, val: "100" },
                  ].map((tick) => (
                    <g key={tick.y} transform={`translate(0, ${tick.y})`}>
                      <line className="chart-grid-line" x1="43" x2="444" />
                      <text className="chart-tick-text" x="39" dy="0.35em" textAnchor="end">
                        {tick.val}
                      </text>
                    </g>
                  ))}
                  <line className="chart-axis-line" x1="43" x2="43" y1="36" y2="519" />
                  <text
                    className="chart-label-text"
                    transform="translate(2, 277.5) rotate(-90)"
                    dy="1em"
                    textAnchor="middle"
                  >
                    Indexed cost (Fable 5 = 100)
                  </text>
                </g>

                {/* X-Axis */}
                <g>
                  <line className="chart-axis-line" x1="43" x2="444" y1="519" y2="519" />
                  <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="143.25" y="523" dy="1em" textAnchor="middle">
                    Fable 5
                  </text>
                  <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="343.75" y="523" dy="1em" textAnchor="middle">
                    Fable 5.1
                  </text>
                </g>

                {/* Bar 1: Fable 5 */}
                <g transform="translate(43, 0)">
                  <rect x="48.6" y="234" width="103.2" height="285" fill="url(#pattern-hatch-cloud)" stroke="#6B7C85" strokeWidth="1" />
                  <rect x="48.6" y="80" width="103.2" height="154" fill="#6B7C85" />
                  <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="100.25" y="72" textAnchor="middle">
                    100
                  </text>
                </g>

                {/* Bar 2: Fable 5.1 */}
                <g transform="translate(243.5, 0)">
                  <rect x="48.6" y="444" width="103.2" height="75" fill="url(#pattern-hatch-matcha)" stroke="#2E5A44" strokeWidth="1" />
                  <rect x="48.6" y="278" width="103.2" height="166" fill="#2E5A44" />
                  <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="100.25" y="270" textAnchor="middle">
                    55 (~45% less)
                  </text>
                </g>
              </g>
            </svg>
          </div>

          <p className="text-xs text-[#73726c] font-anthropic-sans pt-2">
            Indexed cost of running the same workloads on Fable 5 and Fable 5.1,
            at usage-based pricing measured at default effort over four weeks of
            actual usage in August 2026. Typical workload covers Fable usage
            across Claude Enterprise, Claude Code, and the API. Highly agentic
            workload covers context-heavy, tool-heavy work, where cache reads make
            up most of the cost.
          </p>
        </figure>
      </div>

      {/* Reading Column: Availability breakdown */}
      <div className="reading-column mt-12">
        <p className="post-text">
          Claude Fable 5.1 is rolling out today to users on:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-tiempos text-lg text-[#141413] mb-8">
          <li>
            <strong>Claude.ai:</strong> Free, Pro, and Team plan subscribers can
            select Claude Fable 5.1 in the model selector.
          </li>
          <li>
            <strong>Claude Code:</strong> Fable 5.1 is now the default model for
            all terminal-based coding workflows.
          </li>
          <li>
            <strong>Claude Enterprise:</strong> Organization administrators can
            enable Fable 5.1 with customized data residency and retention
            policies.
          </li>
          <li>
            <strong>Cloud Partners:</strong> Available on Amazon Bedrock, Google
            Cloud Vertex AI, and Microsoft Azure AI Foundry.
          </li>
        </ul>
      </div>
    </section>
  );
}
