"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChartPatterns } from "./charts/ChartPatterns";

type BioTab = "speedup" | "cost";

export function ScienceSection() {
  const [activeBioTab, setActiveBioTab] = useState<BioTab>("speedup");
  const [videoPlaying, setVideoPlaying] = useState<boolean>(true);

  return (
    <section className="relative py-12 px-6 sm:px-8 bg-[#faf9f5]">
      <span id="scientific-research" className="block -mt-24 pt-24 invisible" />

      {/* Reading Column: Section Intro */}
      <div className="reading-column">
        <h2 className="post-heading">Scientific research</h2>
        <p className="post-text">
          We tested the scientific research capabilities of Claude Fable 5.1 and
          Claude Mythos 5.1 across a wide range of domains. What we found—which
          includes the early examples we share below—adds to the evidence that AI
          models will soon make important contributions to scientific discovery.
        </p>

        {/* Subsection: Molecular Design */}
        <p className="post-text">
          <strong>Molecular design<em>.</em> </strong>Many modern medicines work
          by binding to targets within the body to block, activate, or deliver
          something to them. High-affinity binders are necessary for drugs to
          work at lower doses; designing one is the first step in the development
          process for many common drug modalities. To see how well Claude Mythos
          5.1 could do at this task, we gave the model access to open-source
          protein design and folding tools and sent its designs to two external
          organizations for experimental validation. Mythos 5.1 proved able to
          design very high-affinity binders. On three targets,{" "}
          <sup className="text-xs font-sans text-[#73726c]">[3]</sup> its binding
          affinities were 10 times higher than the best designs submitted to{" "}
          <a
            href="https://proteinbase.com/competitions"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            Adaptyv Bio’s protein design competitions
          </a>
          . Its hit rate (that is, the number of designs that were viable binders)
          was the strongest we’ve measured to date: it reached nearly 50% across
          12 targets. (Hit rates of 10–15% are typical in protein design today.)
        </p>
      </div>

      {/* Media Column: Protein Binder Video */}
      <div className="media-column my-8">
        <figure className="space-y-2">
          <div className="relative overflow-hidden rounded-lg bg-[#141413] aspect-video">
            <video
              src="https://cdn.sanity.io/files/4zrzovbb/website/dd1483b60a862b1acb3ed4359631ec99653a84c7.webm"
              poster="https://cdn.sanity.io/images/4zrzovbb/website/4b8acf7ac952566415849134b65025b89a197bf6-1920x1080.jpg"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="text-xs sm:text-[13px] text-[#73726c] font-anthropic-sans leading-relaxed">
            Claude-designed protein binders (orange) for each of 12 targets
            (grey). Every design in the video was confirmed to bind in the lab.
            Structures shown are ESMFold2 predictions.
          </figcaption>
        </figure>
      </div>

      {/* Reading Column: Computational Analysis & Modeling */}
      <div className="reading-column">
        <p className="post-text">
          <strong>Computational analysis and modeling</strong>. Claude Fable 5.1
          trained a neural network to create a new, high-resolution elevation
          map of a third of the planet Venus. Its work was based on radar images
          taken by NASA’s Magellan mission more than 30 years ago and a{" "}
          <a
            href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2012EO120002"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            map
          </a>{" "}
          that already existed for one-fifth of the planet. Claude’s new map now
          reveals details down to two to three kilometers, rather than 10 to 20,
          and shows heights up to 25% more accurately than before.
        </p>
        <p className="post-text">
          We’re{" "}
          <a
            href="https://zenodo.org/records/22164484"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#73726c]"
          >
            releasing this map
          </a>{" "}
          under a Creative Commons license in advance of upcoming NASA VERITAS
          and ESA EnVision missions, in hopes that it might help them determine
          which geologic features to target for future observation.
        </p>
      </div>

      {/* Media Column: 4-Panel Venus Media Gallery */}
      <div className="media-column my-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item 1: Magellan Radar */}
          <figure className="space-y-1.5">
            <div className="relative aspect-square overflow-hidden rounded-md bg-[#141413]">
              <Image
                src="https://www-cdn.anthropic.com/images/4zrzovbb/website/4d8f06a743ecfc6ec87ccde0b1964e48175a141e-800x800.png"
                alt="Radar image (Magellan): bright cone, radian lava flows"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-xs text-[#73726c] font-anthropic-sans">
              Magellan radar
            </figcaption>
          </figure>

          {/* Item 2: Altimetry footprint */}
          <figure className="space-y-1.5">
            <div className="relative aspect-square overflow-hidden rounded-md bg-[#141413]">
              <Image
                src="https://www-cdn.anthropic.com/images/4zrzovbb/website/e374c070fc1a84872dcb1343b5bb0ed540ca3770-800x800.png"
                alt="Altimetry 10-20km footprint"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-xs text-[#73726c] font-anthropic-sans">
              Altimetry 10-20km footprint
            </figcaption>
          </figure>

          {/* Item 3: New DEM volcano */}
          <figure className="space-y-1.5">
            <div className="relative aspect-square overflow-hidden rounded-md bg-[#141413]">
              <Image
                src="https://www-cdn.anthropic.com/images/4zrzovbb/website/3dd626b47b88feb72082646cdea87944d49a3c7f-800x800.png"
                alt="New DEM (300m) a volcano 15km across"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-xs text-[#73726c] font-anthropic-sans">
              New DEM (300m) a volcano 15km across
            </figcaption>
          </figure>

          {/* Item 4: 3D Volcano Video */}
          <figure className="space-y-1.5">
            <div className="relative aspect-square overflow-hidden rounded-md bg-[#141413]">
              <video
                src="https://cdn.sanity.io/files/4zrzovbb/website/3a8b31b9b3525f607fc1da0c878b2ee1ea56e54c.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="text-xs text-[#73726c] font-anthropic-sans">
              A small shield volcano on Venus
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Reading Column: Computational Biology */}
      <div className="reading-column">
        <p className="post-text">
          <strong>Computational biology<em>.</em></strong> In computational
          biology, it’s common to run task-specific machine learning models on
          GPUs. The speed of these models is therefore a bottleneck to research
          progress. Mythos 5.1 provided one solution to this problem: by writing
          custom GPU kernels and caching their intermediate results, it sped up
          seven open-source deep learning models by up to 2.5 times (with
          identical outputs).
        </p>
        <p className="post-text">
          The benefits of such speed-ups accumulate quickly. In any given
          experiment, biologists might run these models thousands of times (for
          example, testing every possible mutation near every human gene). On
          analyses like these, the optimized models cut estimated GPU costs by
          30–60%. This kind of optimization would normally take a team of
          performance engineers weeks, and is often unaffordable for academic
          labs. Mythos 5.1 was able to do it in just days, using the publicly
          available source code alone. We plan to open-source these
          optimizations soon.
        </p>
      </div>

      {/* Media Column: Computational Biology ViewSwitcher Tabs */}
      <div className="media-column mt-8">
        <div
          role="tablist"
          aria-label="Computational biology views"
          className="flex flex-wrap items-center gap-6 sm:gap-8 border-b border-[#e8e6dc] pb-3 mb-6"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeBioTab === "speedup"}
            onClick={() => setActiveBioTab("speedup")}
            className={`font-anthropic-sans text-[15px] font-semibold transition-colors cursor-pointer ${
              activeBioTab === "speedup"
                ? "text-[#141413] border-b-2 border-[#141413] -mb-[13px] pb-2"
                : "text-[#73726c] hover:text-[#141413]"
            }`}
          >
            Inference speedup
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeBioTab === "cost"}
            onClick={() => setActiveBioTab("cost")}
            className={`font-anthropic-sans text-[15px] font-semibold transition-colors cursor-pointer ${
              activeBioTab === "cost"
                ? "text-[#141413] border-b-2 border-[#141413] -mb-[13px] pb-2"
                : "text-[#73726c] hover:text-[#141413]"
            }`}
          >
            Estimated cost savings on genome-wide analyses
          </button>
        </div>

        {/* Tab 1: Inference speedup chart (chart_5) */}
        {activeBioTab === "speedup" && (
          <figure className="space-y-4">
            <figcaption>
              <span className="font-anthropic-sans text-xl sm:text-2xl font-semibold text-[#141413]">
                Inference speedup
              </span>
            </figcaption>

            <div className="w-full overflow-x-auto border border-[#e8e6dc] rounded-lg p-4 bg-[#FAF9F5] shadow-xs">
              <svg
                className="w-full min-w-[780px] h-auto"
                viewBox="0 0 960 531"
                role="img"
                aria-label="Inference speedup"
              >
                <ChartPatterns />

                {/* X-Axis */}
                <g>
                  <line className="chart-axis-line" x1="168" x2="948" y1="464" y2="464" />
                  {[
                    { x: 168, val: "0" },
                    { x: 428, val: "1" },
                    { x: 688, val: "2" },
                    { x: 948, val: "3" },
                  ].map((tick) => (
                    <g key={tick.x} transform={`translate(${tick.x}, 0)`}>
                      <line className="chart-grid-line" y1="30" y2="464" />
                      <text className="chart-tick-text" y="474" dy="1em" textAnchor="middle">
                        {tick.val}
                      </text>
                    </g>
                  ))}
                  <text className="chart-label-text" x="558" y="504" dy="1em" textAnchor="middle">
                    Speedup on an NVIDIA H100 (×)
                  </text>
                </g>

                {/* Reference Line at 1.0 */}
                <g>
                  <line x1="428" x2="428" y1="30" y2="464" stroke="#87867f" strokeWidth="1" strokeDasharray="3,3" />
                  <text className="font-sans text-xs fill-[#73726c]" x="428" y="22" textAnchor="middle">
                    Original implementation
                  </text>
                </g>

                {/* Y-Axis Model Labels */}
                <g>
                  <line className="chart-axis-line" x1="168" x2="168" y1="30" y2="464" />
                  {[
                    { model: "ChromBPNet (6M)", note: "2.1-kb DNA sequence", yTitle: 49.5, yNote: 72.5 },
                    { model: "Flashzoi (200M)", note: "524-kb DNA sequence", yTitle: 111.5, yNote: 134.5 },
                    { model: "Enformer (250M)", note: "196-kb DNA sequence", yTitle: 173.5, yNote: 196.5 },
                    { model: "Profluent-E1 (600M)", note: "1,024-amino-acid protein", yTitle: 235.5, yNote: 258.5 },
                    { model: "ProGen2 (6.4B)", note: "512-amino-acid protein", yTitle: 297.5, yNote: 320.5 },
                    { model: "Evo 2 (7B)", note: "8-kb DNA sequence", yTitle: 359.5, yNote: 382.5 },
                    { model: "Evo 2 (40B)", note: "8-kb DNA sequence", yTitle: 421.5, yNote: 444.5 },
                  ].map((cat, i) => (
                    <g key={i}>
                      <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="158" y={cat.yTitle} dy="0.35em" textAnchor="end">
                        {cat.model}
                      </text>
                      <text className="font-anthropic-sans text-[11px] fill-[#73726c]" x="158" y={cat.yNote} dy="0.35em" textAnchor="end">
                        {cat.note}
                      </text>
                    </g>
                  ))}
                </g>

                {/* Bars */}
                {[
                  { y: 48, w: 416, val: "1.6×" },
                  { y: 110, w: 468, val: "1.8×" },
                  { y: 172, w: 364, val: "1.4×" },
                  { y: 234, w: 416, val: "1.6×" },
                  { y: 296, w: 650, val: "2.5×" },
                  { y: 358, w: 416, val: "1.6×" },
                  { y: 420, w: 364, val: "1.4×" },
                ].map((bar, idx) => (
                  <g key={idx}>
                    <rect
                      x="168"
                      y={bar.y}
                      width={bar.w}
                      height="26"
                      fill="#8C7B99"
                      className="transition-all duration-300 hover:opacity-90"
                    />
                    <text
                      x={168 + bar.w + 8}
                      y={bar.y + 13}
                      dy="0.35em"
                      className="font-anthropic-sans text-xs font-semibold fill-[#141413]"
                    >
                      {bar.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <p className="text-xs text-[#73726c] font-anthropic-sans pt-2">
              Inference speedup for seven open-source protein and genomics models on an NVIDIA H100
            </p>
          </figure>
        )}

        {/* Tab 2: Estimated cost savings (chart_6) */}
        {activeBioTab === "cost" && (
          <figure className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <figcaption>
                <span className="font-anthropic-sans text-xl sm:text-2xl font-semibold text-[#141413]">
                  Estimated cost savings on genome-wide analyses
                </span>
              </figcaption>

              <ul className="flex items-center gap-5 text-xs sm:text-sm font-anthropic-sans" aria-label="Series">
                <li className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                    <rect x="0.5" y="0.5" width="13" height="13" fill="#D97757" />
                  </svg>
                  <span className="text-[#141413]">Original implementation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 rounded-xs" viewBox="0 0 14 14">
                    <rect x="0.5" y="0.5" width="13" height="13" fill="#8C7B99" />
                  </svg>
                  <span className="text-[#141413]">Optimized</span>
                </li>
              </ul>
            </div>

            <div className="w-full overflow-x-auto border border-[#e8e6dc] rounded-lg p-4 bg-[#FAF9F5] shadow-xs">
              <svg
                className="w-full min-w-[780px] h-auto"
                viewBox="0 0 960 343"
                role="img"
                aria-label="Estimated cost savings on genome-wide analyses"
              >
                <ChartPatterns />

                {/* X-Axis */}
                <g>
                  <line className="chart-axis-line" x1="266" x2="948" y1="276" y2="276" />
                  {[
                    { x: 266, val: "0" },
                    { x: 461, val: "10" },
                    { x: 656, val: "20" },
                    { x: 851, val: "30" },
                  ].map((tick) => (
                    <g key={tick.x} transform={`translate(${tick.x}, 0)`}>
                      <line className="chart-grid-line" y1="12" y2="276" />
                      <text className="chart-tick-text" y="286" dy="1em" textAnchor="middle">
                        {tick.val}
                      </text>
                    </g>
                  ))}
                  <text className="chart-label-text" x="607" y="316" dy="1em" textAnchor="middle">
                    Estimated GPU cost (NVIDIA H100, cloud list price, USD thousands)
                  </text>
                </g>

                {/* Y-Axis */}
                <g>
                  <line className="chart-axis-line" x1="266" x2="266" y1="12" y2="276" />
                  {[
                    { title: "Enformer (250M)", note: "every mutation, 10-kb window around 20,000 genes", yTitle: 37, yNote: 60 },
                    { title: "Flashzoi (200M)", note: "every mutation, 10-kb window around 20,000 genes", yTitle: 125, yNote: 148 },
                    { title: "Evo 2 (40B)", note: "3 million ClinVar variants", yTitle: 220.5, yNote: 243.5 },
                  ].map((cat, i) => (
                    <g key={i}>
                      <text className="font-anthropic-sans text-xs font-semibold fill-[#141413]" x="256" y={cat.yTitle} dy="0.35em" textAnchor="end">
                        {cat.title}
                      </text>
                      <text className="font-anthropic-sans text-[11px] fill-[#73726c]" x="256" y={cat.yNote} dy="0.35em" textAnchor="end">
                        {cat.note}
                      </text>
                    </g>
                  ))}
                </g>

                {/* Bars */}
                {/* Row 1: Enformer */}
                <g transform="translate(0, 12)">
                  <rect x="266" y="14.3" width="585" height="26" fill="#D97757" />
                  <text x="859" y="27.3" dy="0.35em" className="font-anthropic-sans text-xs font-semibold fill-[#141413]">$30k</text>

                  <rect x="266" y="47.7" width="409" height="26" fill="#8C7B99" />
                  <text x="683" y="60.7" dy="0.35em" className="font-anthropic-sans text-xs font-semibold fill-[#141413]">$21k</text>
                </g>

                {/* Row 2: Flashzoi */}
                <g transform="translate(0, 100)">
                  <rect x="266" y="14.3" width="273" height="26" fill="#D97757" />
                  <text x="547" y="27.3" dy="0.35em" className="font-anthropic-sans text-xs font-semibold fill-[#141413]">$14k</text>

                  <rect x="266" y="47.7" width="136" height="26" fill="#8C7B99" />
                  <text x="410" y="60.7" dy="0.35em" className="font-anthropic-sans text-xs font-semibold fill-[#141413]">$7k</text>
                </g>

                {/* Row 3: Evo 2 */}
                <g transform="translate(0, 188)">
                  <rect x="266" y="14.3" width="351" height="26" fill="#D97757" />
                  <text x="625" y="27.3" dy="0.35em" className="font-anthropic-sans text-xs font-semibold fill-[#141413]">$18k</text>

                  <rect x="266" y="47.7" width="156" height="26" fill="#8C7B99" />
                  <text x="430" y="60.7" dy="0.35em" className="font-anthropic-sans text-xs font-semibold fill-[#141413]">$8k</text>
                </g>
              </svg>
            </div>

            <p className="text-xs text-[#73726c] font-anthropic-sans pt-2">
              Estimated GPU cost of three genome-wide analyses before and after optimization, at cloud list price. Evo 2 40B saves more on a whole job (2.3x) than per forward (1.4x) because some of its optimizations only pay off across many sequences.
            </p>
          </figure>
        )}
      </div>
    </section>
  );
}
