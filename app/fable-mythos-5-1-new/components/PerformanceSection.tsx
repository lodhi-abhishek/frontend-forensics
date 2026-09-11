"use client";

import React, { useState } from "react";
import { ChartPatterns } from "./charts/ChartPatterns";

type TabKey = "science" | "terminal" | "hle" | "cursor";

export function PerformanceSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("science");
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  return (
    <section className="relative py-12 px-6 sm:px-8 bg-[#faf9f5]">
      <span id="frontier" className="block -mt-24 pt-24 invisible" />

      {/* Reading Column Header */}
      <div className="reading-column">
        <h2 className="post-heading">A new performance frontier</h2>
        <p className="post-text">
          Claude Fable 5.1 sets a new standard for coding, knowledge work, and
          long-running problem-solving tasks. The charts below show that Fable 5.1
          is capable of much higher performance than its predecessor, Fable 5.
          And when set to Low or Medium effort, Fable 5.1 achieves results similar
          to or better than Fable 5’s at a much lower cost. (Note that Fable 5.1
          defaults to High effort in Claude Code, and to Medium in Claude Cowork
          and on Claude.ai.)
        </p>
      </div>

      {/* Media Column: ViewSwitcher */}
      <div className="media-column mt-8">
        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Benchmark Views"
          className="flex flex-wrap items-center gap-6 sm:gap-8 border-b border-[#e8e6dc] pb-3 mb-6"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "science"}
            onClick={() => setActiveTab("science")}
            className={`font-anthropic-sans text-[15px] font-semibold transition-colors cursor-pointer ${
              activeTab === "science"
                ? "text-[#141413] border-b-2 border-[#141413] -mb-[13px] pb-2"
                : "text-[#73726c] hover:text-[#141413]"
            }`}
          >
            Agentic scientific research
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "terminal"}
            onClick={() => setActiveTab("terminal")}
            className={`font-anthropic-sans text-[15px] font-semibold transition-colors cursor-pointer ${
              activeTab === "terminal"
                ? "text-[#141413] border-b-2 border-[#141413] -mb-[13px] pb-2"
                : "text-[#73726c] hover:text-[#141413]"
            }`}
          >
            Agentic terminal coding
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "hle"}
            onClick={() => setActiveTab("hle")}
            className={`font-anthropic-sans text-[15px] font-semibold transition-colors cursor-pointer ${
              activeTab === "hle"
                ? "text-[#141413] border-b-2 border-[#141413] -mb-[13px] pb-2"
                : "text-[#73726c] hover:text-[#141413]"
            }`}
          >
            Multidisciplinary reasoning
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "cursor"}
            onClick={() => setActiveTab("cursor")}
            className={`font-anthropic-sans text-[15px] font-semibold transition-colors cursor-pointer ${
              activeTab === "cursor"
                ? "text-[#141413] border-b-2 border-[#141413] -mb-[13px] pb-2"
                : "text-[#73726c] hover:text-[#141413]"
            }`}
          >
            Agentic coding
          </button>
        </div>

        {/* Tab Panels */}
        <div className="bg-[#faf9f5]">
          {/* TAB 1: Terminal-Bench-Science 0.1 */}
          {activeTab === "science" && (
            <figure className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <figcaption className="space-x-2">
                  <span className="font-anthropic-sans text-xl sm:text-2xl font-semibold text-[#141413]">
                    Terminal-Bench-Science 0.1
                  </span>
                  <span className="font-anthropic-sans text-sm text-[#73726c]">
                    Accuracy vs Cost
                  </span>
                </figcaption>

                {/* Series Legend */}
                <ul className="flex items-center gap-5 text-xs sm:text-sm font-anthropic-sans" aria-label="Series">
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="#2E5A44" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Fable 5.1</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="#6B7C85" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Fable 5</span>
                  </li>
                </ul>
              </div>

              {/* Vector SVG Chart Plot */}
              <div className="w-full overflow-x-auto border border-[#e8e6dc] rounded-lg p-4 bg-[#FAF9F5] shadow-xs">
                <svg
                  className="w-full min-w-[760px] h-auto"
                  viewBox="0 0 960 538"
                  role="img"
                  aria-label="Terminal-Bench-Science 0.1"
                >
                  <ChartPatterns />

                  {/* Y-Axis Grid & Ticks */}
                  <g>
                    {[
                      { y: 471, val: "0" },
                      { y: 395, val: "10" },
                      { y: 318, val: "20" },
                      { y: 242, val: "30" },
                      { y: 165, val: "40" },
                      { y: 88, val: "50" },
                      { y: 12, val: "60" },
                    ].map((tick) => (
                      <g key={tick.y} transform={`translate(0, ${tick.y})`}>
                        <line className="chart-grid-line" x1="75" x2="948" />
                        <text className="chart-tick-text" x="65" dy="0.35em" textAnchor="end">
                          {tick.val}
                        </text>
                      </g>
                    ))}
                    <line className="chart-axis-line" x1="75" x2="75" y1="12" y2="471" />
                    <text
                      className="chart-label-text"
                      transform="translate(12, 241.5) rotate(-90)"
                      dy="1em"
                      textAnchor="middle"
                    >
                      Score (%)
                    </text>
                  </g>

                  {/* X-Axis Ticks */}
                  <g>
                    <line className="chart-axis-line" x1="75" x2="948" y1="471" y2="471" />
                    {[
                      { x: 181, val: "10" },
                      { x: 374, val: "15" },
                      { x: 512, val: "20" },
                      { x: 705, val: "30" },
                      { x: 842, val: "40" },
                      { x: 948, val: "50" },
                    ].map((tick) => (
                      <g key={tick.x} transform={`translate(${tick.x}, 0)`}>
                        <text className="chart-tick-text" y="481" dy="1em" textAnchor="middle">
                          {tick.val}
                        </text>
                      </g>
                    ))}
                    <text className="chart-label-text" x="511.5" y="511" dy="1em" textAnchor="middle">
                      Mean cost per task (USD, log scale)
                    </text>
                  </g>

                  {/* Series 1: Fable 5.1 Line */}
                  <path
                    className="chart-line-draw"
                    d="M231,270L371,198L519,165L732,92L816,69"
                    fill="none"
                    stroke="#2E5A44"
                    strokeWidth="2.5"
                  />
                  {/* Series 2: Fable 5 Line */}
                  <path
                    className="chart-line-draw"
                    d="M437,377L618,307L768,280L792,292L888,282"
                    fill="none"
                    stroke="#6B7C85"
                    strokeWidth="2.5"
                  />

                  {/* Points: Fable 5.1 */}
                  {[
                    { cx: 231, cy: 270, label: "low", tip: "Fable 5.1 · low: 26.3% ($11.1)" },
                    { cx: 371, cy: 198, label: "med", tip: "Fable 5.1 · med: 35.7% ($14.9)" },
                    { cx: 519, cy: 165, label: "high", tip: "Fable 5.1 · high: 40.0% ($20.3)" },
                    { cx: 732, cy: 92, label: "xhigh", tip: "Fable 5.1 · xhigh: 49.5% ($31.8)" },
                    { cx: 816, cy: 69, label: "max", tip: "Fable 5.1 · max: 52.6% ($37.9)" },
                  ].map((pt) => (
                    <g
                      key={pt.cx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt.tip)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle cx={pt.cx} cy={pt.cy} r="6.5" fill="#2E5A44" stroke="#faf9f5" strokeWidth="1.5" />
                      <text x={pt.cx} y={pt.cy - 12} textAnchor="middle" className="text-[11px] font-sans fill-[#141413]">
                        {pt.label}
                      </text>
                    </g>
                  ))}

                  {/* Points: Fable 5 */}
                  {[
                    { cx: 437, cy: 377, label: "low", tip: "Fable 5 · low: 12.3% ($17.1)" },
                    { cx: 618, cy: 307, label: "med", tip: "Fable 5 · med: 21.4% ($25.0)" },
                    { cx: 768, cy: 280, label: "high", tip: "Fable 5 · high: 25.0% ($34.3)" },
                    { cx: 792, cy: 292, label: "xhigh", tip: "Fable 5 · xhigh: 23.4% ($36.0)" },
                    { cx: 888, cy: 282, label: "max", tip: "Fable 5 · max: 24.7% ($44.1)" },
                  ].map((pt) => (
                    <g
                      key={pt.cx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt.tip)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle cx={pt.cx} cy={pt.cy} r="6.5" fill="#6B7C85" stroke="#faf9f5" strokeWidth="1.5" />
                      <text x={pt.cx} y={pt.cy + 18} textAnchor="middle" className="text-[11px] font-sans fill-[#5e5d59]">
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {hoveredPoint && (
                <div className="p-2.5 bg-[#141413] text-[#faf9f5] text-xs font-mono rounded max-w-fit shadow">
                  {hoveredPoint}
                </div>
              )}

              <p className="text-xs text-[#73726c] font-anthropic-sans pt-2">
                Terminal-Bench-Science 0.1: The standard error is ±3.5–4.5 pts per model. The public leaderboard (3 trials/task, Claude Code harness) reports Claude Opus 5 at 30.0% and Claude Fable 5 at 21.4%; our setup reproduces them at 29.0% and 24.7%, respectively, both within noise.
              </p>
            </figure>
          )}

          {/* TAB 2: Terminal-Bench 4.0 */}
          {activeTab === "terminal" && (
            <figure className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <figcaption className="space-x-2">
                  <span className="font-anthropic-sans text-xl sm:text-2xl font-semibold text-[#141413]">
                    Terminal-Bench 4.0
                  </span>
                  <span className="font-anthropic-sans text-sm text-[#73726c]">
                    Accuracy vs Cost
                  </span>
                </figcaption>

                <ul className="flex items-center gap-5 text-xs sm:text-sm font-anthropic-sans" aria-label="Series">
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="url(#pattern-dots-matcha)" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Mythos 5.1</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="#2E5A44" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Fable 5.1</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="url(#pattern-dots-cloud)" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Mythos 5</span>
                  </li>
                </ul>
              </div>

              <div className="w-full overflow-x-auto border border-[#e8e6dc] rounded-lg p-4 bg-[#FAF9F5] shadow-xs">
                <svg
                  className="w-full min-w-[760px] h-auto"
                  viewBox="0 0 960 538"
                  role="img"
                  aria-label="Terminal-Bench 4.0"
                >
                  <ChartPatterns />

                  {/* Y-Axis */}
                  <g>
                    {[
                      { y: 443, val: "10" },
                      { y: 371, val: "20" },
                      { y: 299, val: "30" },
                      { y: 228, val: "40" },
                      { y: 156, val: "50" },
                      { y: 84, val: "60" },
                      { y: 12, val: "70" },
                    ].map((tick) => (
                      <g key={tick.y} transform={`translate(0, ${tick.y})`}>
                        <line className="chart-grid-line" x1="75" x2="948" />
                        <text className="chart-tick-text" x="65" dy="0.35em" textAnchor="end">
                          {tick.val}
                        </text>
                      </g>
                    ))}
                    <line className="chart-axis-line" x1="75" x2="75" y1="12" y2="471" />
                    <text className="chart-tick-text" x="65" y="471" dy="0.35em" textAnchor="end">0</text>
                    <text
                      className="chart-label-text"
                      transform="translate(12, 241.5) rotate(-90)"
                      dy="1em"
                      textAnchor="middle"
                    >
                      Score (%)
                    </text>
                  </g>

                  {/* X-Axis */}
                  <g>
                    <line className="chart-axis-line" x1="75" x2="948" y1="471" y2="471" />
                    {[
                      { x: 169, val: "5" },
                      { x: 366, val: "8" },
                      { x: 460, val: "10" },
                      { x: 630, val: "15" },
                      { x: 751, val: "20" },
                      { x: 921, val: "30" },
                    ].map((tick) => (
                      <g key={tick.x} transform={`translate(${tick.x}, 0)`}>
                        <text className="chart-tick-text" y="481" dy="1em" textAnchor="middle">
                          {tick.val}
                        </text>
                      </g>
                    ))}
                    <text className="chart-label-text" x="511.5" y="511" dy="1em" textAnchor="middle">
                      Mean cost per task (USD, log scale)
                    </text>
                  </g>

                  {/* Lines */}
                  <path d="M201,215L333,179L464,105L630,86L706,77" fill="none" stroke="#2E5A44" strokeWidth="2.5" />
                  <path d="M224,226L355,203L480,160L652,146L740,114" fill="none" stroke="#788c5d" strokeWidth="2.5" />
                  <path d="M547,360L641,281L704,235L804,203L872,186" fill="none" stroke="#6B7C85" strokeWidth="2.5" />

                  {/* Points Mythos 5.1 */}
                  {[
                    { cx: 201, cy: 215, label: "low", tip: "Mythos 5.1 · low: 41.7% ($5.4)" },
                    { cx: 333, cy: 179, label: "med", tip: "Mythos 5.1 · med: 46.7% ($7.4)" },
                    { cx: 464, cy: 105, label: "high", tip: "Mythos 5.1 · high: 57.1% ($10.1)" },
                    { cx: 630, cy: 86, label: "xhigh", tip: "Mythos 5.1 · xhigh: 59.7% ($15.0)" },
                    { cx: 706, cy: 77, label: "max", tip: "Mythos 5.1 · max: 60.9% ($18.0)" },
                  ].map((pt) => (
                    <g
                      key={pt.cx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt.tip)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle cx={pt.cx} cy={pt.cy} r="6.5" fill="url(#pattern-dots-matcha)" stroke="#2E5A44" strokeWidth="1.5" />
                      <text x={pt.cx} y={pt.cy - 12} textAnchor="middle" className="text-[11px] font-sans fill-[#141413]">
                        {pt.label}
                      </text>
                    </g>
                  ))}

                  {/* Points Fable 5.1 */}
                  {[
                    { cx: 224, cy: 226, label: "low", tip: "Fable 5.1 · low: 40.2% ($5.7)" },
                    { cx: 355, cy: 203, label: "med", tip: "Fable 5.1 · med: 43.4% ($7.8)" },
                    { cx: 480, cy: 160, label: "high", tip: "Fable 5.1 · high: 49.4% ($10.5)" },
                    { cx: 652, cy: 146, label: "xhigh", tip: "Fable 5.1 · xhigh: 51.3% ($15.8)" },
                    { cx: 740, cy: 114, label: "max", tip: "Fable 5.1 · max: 55.8% ($19.5)" },
                  ].map((pt) => (
                    <g
                      key={pt.cx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt.tip)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle cx={pt.cx} cy={pt.cy} r="6.5" fill="#2E5A44" stroke="#faf9f5" strokeWidth="1.5" />
                      <text x={pt.cx} y={pt.cy + 18} textAnchor="middle" className="text-[11px] font-sans fill-[#141413]">
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {hoveredPoint && (
                <div className="p-2.5 bg-[#141413] text-[#faf9f5] text-xs font-mono rounded max-w-fit shadow">
                  {hoveredPoint}
                </div>
              )}

              <p className="text-xs text-[#73726c] font-anthropic-sans pt-2">
                Terminal-Bench 4.0 scores by cost (log scale), at each effort level. Claude Fable 5.1 and Claude Mythos 5.1 are the same underlying model; the gap between them reflects the tasks on which our earlier, less precise cyber safeguards intervened.
              </p>
            </figure>
          )}

          {/* TAB 3: Humanity's Last Exam */}
          {activeTab === "hle" && (
            <figure className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <figcaption className="space-x-2">
                  <span className="font-anthropic-sans text-xl sm:text-2xl font-semibold text-[#141413]">
                    Humanity’s Last Exam
                  </span>
                  <span className="font-anthropic-sans text-sm text-[#73726c]">
                    Accuracy vs Cost
                  </span>
                </figcaption>

                <ul className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-anthropic-sans" aria-label="Series">
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="url(#pattern-hatch-matcha)" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Fable 5.1</span> (with tools)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="#2E5A44" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Fable 5.1</span> (no tools)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="url(#pattern-hatch-cloud)" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Fable 5</span> (with tools)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="#6B7C85" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Fable 5</span> (no tools)
                  </li>
                </ul>
              </div>

              <div className="w-full overflow-x-auto border border-[#e8e6dc] rounded-lg p-4 bg-[#FAF9F5] shadow-xs">
                <svg
                  className="w-full min-w-[760px] h-auto"
                  viewBox="0 0 960 538"
                  role="img"
                  aria-label="Humanity's Last Exam"
                >
                  <ChartPatterns />

                  {/* Y-Axis */}
                  <g>
                    {[
                      { y: 400, val: "50" },
                      { y: 292, val: "55" },
                      { y: 184, val: "60" },
                      { y: 77, val: "65" },
                    ].map((tick) => (
                      <g key={tick.y} transform={`translate(0, ${tick.y})`}>
                        <line className="chart-grid-line" x1="75" x2="948" />
                        <text className="chart-tick-text" x="65" dy="0.35em" textAnchor="end">
                          {tick.val}
                        </text>
                      </g>
                    ))}
                    <line className="chart-axis-line" x1="75" x2="75" y1="12" y2="471" />
                    <text className="chart-tick-text" x="65" y="471" dy="0.35em" textAnchor="end">0</text>
                    <text
                      className="chart-label-text"
                      transform="translate(12, 241.5) rotate(-90)"
                      dy="1em"
                      textAnchor="middle"
                    >
                      Pass rate (%)
                    </text>
                  </g>

                  {/* X-Axis */}
                  <g>
                    <line className="chart-axis-line" x1="75" x2="948" y1="471" y2="471" />
                    {[
                      { x: 151, val: "0.2" },
                      { x: 395, val: "0.5" },
                      { x: 579, val: "1" },
                      { x: 764, val: "2" },
                      { x: 948, val: "4" },
                    ].map((tick) => (
                      <g key={tick.x} transform={`translate(${tick.x}, 0)`}>
                        <text className="chart-tick-text" y="481" dy="1em" textAnchor="middle">
                          {tick.val}
                        </text>
                      </g>
                    ))}
                    <text className="chart-label-text" x="511.5" y="511" dy="1em" textAnchor="middle">
                      Mean cost per task (USD, log scale)
                    </text>
                  </g>

                  {/* Lines */}
                  <path d="M407,184L474,121L592,82L798,75L888,77" fill="none" stroke="#2E5A44" strokeWidth="2.5" />
                  <path d="M448,192L582,154L672,116L753,109L908,103" fill="none" stroke="#6B7C85" strokeWidth="2.5" />
                  <path d="M259,332L375,272L504,228L692,177L793,165" fill="none" stroke="#788c5d" strokeWidth="2.5" strokeDasharray="5,4" />
                  <path d="M112,387L336,273L451,252L554,240L720,233" fill="none" stroke="#87867f" strokeWidth="2.5" strokeDasharray="5,4" />

                  {/* Points Fable 5.1 (tools) */}
                  {[
                    { cx: 407, cy: 184, label: "low", tip: "Fable 5.1 (with tools) · low: 60.0% ($0.52)" },
                    { cx: 474, cy: 121, label: "", tip: "Fable 5.1 (with tools) · med: 63.0% ($0.67)" },
                    { cx: 592, cy: 82, label: "", tip: "Fable 5.1 (with tools) · high: 64.8% ($1.05)" },
                    { cx: 798, cy: 75, label: "", tip: "Fable 5.1 (with tools) · xhigh: 65.1% ($2.28)" },
                    { cx: 888, cy: 77, label: "max", tip: "Fable 5.1 (with tools) · max: 65.0% ($3.20)" },
                  ].map((pt, i) => (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt.tip)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle cx={pt.cx} cy={pt.cy} r="6.5" fill="url(#pattern-hatch-matcha)" stroke="#2E5A44" strokeWidth="1.5" />
                      {pt.label && (
                        <text x={pt.cx} y={pt.cy - 12} textAnchor="middle" className="text-[11px] font-sans fill-[#141413]">
                          {pt.label}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
              </div>

              {hoveredPoint && (
                <div className="p-2.5 bg-[#141413] text-[#faf9f5] text-xs font-mono rounded max-w-fit shadow">
                  {hoveredPoint}
                </div>
              )}

              <p className="text-xs text-[#73726c] font-anthropic-sans pt-2">
                Humanity’s Last Exam scores by cost (log scale), at each effort level.
              </p>
            </figure>
          )}

          {/* TAB 4: CursorBench 3.2.0 */}
          {activeTab === "cursor" && (
            <figure className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <figcaption className="space-x-2">
                  <span className="font-anthropic-sans text-xl sm:text-2xl font-semibold text-[#141413]">
                    CursorBench 3.2.0
                  </span>
                  <span className="font-anthropic-sans text-sm text-[#73726c]">
                    Accuracy vs Cost
                  </span>
                </figcaption>

                <ul className="flex items-center gap-5 text-xs sm:text-sm font-anthropic-sans" aria-label="Series">
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="#2E5A44" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Fable 5.1</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                      <rect x="0.5" y="0.5" width="13" height="13" fill="#6B7C85" />
                    </svg>
                    <span className="font-semibold text-[#141413]">Fable 5</span>
                  </li>
                </ul>
              </div>

              <div className="w-full overflow-x-auto border border-[#e8e6dc] rounded-lg p-4 bg-[#FAF9F5] shadow-xs">
                <svg
                  className="w-full min-w-[760px] h-auto"
                  viewBox="0 0 960 538"
                  role="img"
                  aria-label="CursorBench 3.2.0"
                >
                  <ChartPatterns />

                  {/* Y-Axis */}
                  <g>
                    {[
                      { y: 395, val: "60" },
                      { y: 275, val: "65" },
                      { y: 156, val: "70" },
                      { y: 36, val: "75" },
                    ].map((tick) => (
                      <g key={tick.y} transform={`translate(0, ${tick.y})`}>
                        <line className="chart-grid-line" x1="75" x2="948" />
                        <text className="chart-tick-text" x="65" dy="0.35em" textAnchor="end">
                          {tick.val}
                        </text>
                      </g>
                    ))}
                    <line className="chart-axis-line" x1="75" x2="75" y1="12" y2="471" />
                    <text className="chart-tick-text" x="65" y="471" dy="0.35em" textAnchor="end">0</text>
                    <text
                      className="chart-label-text"
                      transform="translate(12, 241.5) rotate(-90)"
                      dy="1em"
                      textAnchor="middle"
                    >
                      Score (%)
                    </text>
                  </g>

                  {/* X-Axis */}
                  <g>
                    <line className="chart-axis-line" x1="75" x2="948" y1="471" y2="471" />
                    {[
                      { x: 164, val: "2" },
                      { x: 290, val: "3" },
                      { x: 449, val: "5" },
                      { x: 664, val: "10" },
                      { x: 879, val: "20" },
                    ].map((tick) => (
                      <g key={tick.x} transform={`translate(${tick.x}, 0)`}>
                        <text className="chart-tick-text" y="481" dy="1em" textAnchor="middle">
                          {tick.val}
                        </text>
                      </g>
                    ))}
                    <text className="chart-label-text" x="511.5" y="511" dy="1em" textAnchor="middle">
                      Cost per task (USD, log scale)
                    </text>
                  </g>

                  {/* Lines */}
                  <path d="M280,247L341,204L436,170L551,89L652,74" fill="none" stroke="#2E5A44" strokeWidth="2.5" />
                  <path d="M413,345L544,271L623,239L713,194L834,144" fill="none" stroke="#6B7C85" strokeWidth="2.5" />

                  {/* Points Fable 5.1 */}
                  {[
                    { cx: 280, cy: 247, label: "low", tip: "Fable 5.1 · low: 66.2% ($2.90)" },
                    { cx: 341, cy: 204, label: "med", tip: "Fable 5.1 · med: 68.0% ($3.53)" },
                    { cx: 436, cy: 170, label: "high", tip: "Fable 5.1 · high: 69.4% ($4.80)" },
                    { cx: 551, cy: 89, label: "xhigh", tip: "Fable 5.1 · xhigh: 72.8% ($6.96)" },
                    { cx: 652, cy: 74, label: "max", tip: "Fable 5.1 · max: 73.4% ($9.64)" },
                  ].map((pt) => (
                    <g
                      key={pt.cx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt.tip)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle cx={pt.cx} cy={pt.cy} r="6.5" fill="#2E5A44" stroke="#faf9f5" strokeWidth="1.5" />
                      <text x={pt.cx} y={pt.cy - 12} textAnchor="middle" className="text-[11px] font-sans fill-[#141413]">
                        {pt.label}
                      </text>
                    </g>
                  ))}

                  {/* Points Fable 5 */}
                  {[
                    { cx: 413, cy: 345, label: "low", tip: "Fable 5 · low: 62.1% ($4.46)" },
                    { cx: 544, cy: 271, label: "med", tip: "Fable 5 · med: 65.2% ($6.80)" },
                    { cx: 623, cy: 239, label: "high", tip: "Fable 5 · high: 66.5% ($8.77)" },
                    { cx: 713, cy: 194, label: "xhigh", tip: "Fable 5 · xhigh: 68.4% ($11.73)" },
                    { cx: 834, cy: 144, label: "max", tip: "Fable 5 · max: 70.5% ($17.32)" },
                  ].map((pt) => (
                    <g
                      key={pt.cx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt.tip)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle cx={pt.cx} cy={pt.cy} r="6.5" fill="#6B7C85" stroke="#faf9f5" strokeWidth="1.5" />
                      <text x={pt.cx} y={pt.cy + 18} textAnchor="middle" className="text-[11px] font-sans fill-[#5e5d59]">
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {hoveredPoint && (
                <div className="p-2.5 bg-[#141413] text-[#faf9f5] text-xs font-mono rounded max-w-fit shadow">
                  {hoveredPoint}
                </div>
              )}

              <p className="text-xs text-[#73726c] font-anthropic-sans pt-2">
                CursorBench 3.2.0 by cost (log scale), at each effort level.
              </p>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
