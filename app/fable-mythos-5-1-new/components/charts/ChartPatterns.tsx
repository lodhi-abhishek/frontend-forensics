import React from "react";

export function ChartPatterns() {
  return (
    <defs>
      {/* Hatch Matcha */}
      <pattern id="hatch-matcha" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="var(--chart-matcha)" />
        <path d="M-1 1 l2 -2 M0 6 l6 -6 M5 7 l2 -2" stroke="var(--chart-ink)" strokeWidth="1" />
      </pattern>
      <pattern id="pattern-hatch-matcha" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="var(--chart-matcha)" />
        <path d="M-1 1 l2 -2 M0 6 l6 -6 M5 7 l2 -2" stroke="var(--chart-ink)" strokeWidth="1" />
      </pattern>
      <pattern id="hatch-matcha-mark" width="0.333" height="0.333" patternUnits="objectBoundingBox" patternContentUnits="objectBoundingBox">
        <rect width="0.334" height="0.334" fill="var(--chart-matcha)" />
        <path d="M-0.056 0.056 l0.111 -0.111 M0 0.334 l0.334 -0.334 M0.278 0.389 l0.111 -0.111" stroke="var(--chart-ink)" strokeWidth="0.06" />
      </pattern>

      {/* Hatch Cloud */}
      <pattern id="hatch-cloud" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="var(--chart-cloud)" />
        <path d="M-1 1 l2 -2 M0 6 l6 -6 M5 7 l2 -2" stroke="var(--chart-ink)" strokeWidth="1" />
      </pattern>
      <pattern id="pattern-hatch-cloud" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="var(--chart-cloud)" />
        <path d="M-1 1 l2 -2 M0 6 l6 -6 M5 7 l2 -2" stroke="var(--chart-ink)" strokeWidth="1" />
      </pattern>
      <pattern id="hatch-cloud-mark" width="0.333" height="0.333" patternUnits="objectBoundingBox" patternContentUnits="objectBoundingBox">
        <rect width="0.334" height="0.334" fill="var(--chart-cloud)" />
        <path d="M-0.056 0.056 l0.111 -0.111 M0 0.334 l0.334 -0.334 M0.278 0.389 l0.111 -0.111" stroke="var(--chart-ink)" strokeWidth="0.06" />
      </pattern>

      {/* Dots Matcha */}
      <pattern id="dots-matcha" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="var(--chart-matcha)" />
        <circle cx="1.5" cy="1.5" r="0.8" fill="var(--chart-ink)" />
        <circle cx="4.5" cy="4.5" r="0.8" fill="var(--chart-ink)" />
      </pattern>
      <pattern id="pattern-dots-matcha" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="var(--chart-matcha)" />
        <circle cx="1.5" cy="1.5" r="0.8" fill="var(--chart-ink)" />
        <circle cx="4.5" cy="4.5" r="0.8" fill="var(--chart-ink)" />
      </pattern>
      <pattern id="dots-matcha-mark" width="0.333" height="0.333" patternUnits="objectBoundingBox" patternContentUnits="objectBoundingBox">
        <rect width="0.334" height="0.334" fill="var(--chart-matcha)" />
        <circle cx="0.083" cy="0.083" r="0.05" fill="var(--chart-ink)" />
        <circle cx="0.25" cy="0.25" r="0.05" fill="var(--chart-ink)" />
      </pattern>

      {/* Dots Cloud */}
      <pattern id="dots-cloud" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="var(--chart-cloud)" />
        <circle cx="1.5" cy="1.5" r="0.8" fill="var(--chart-ink)" />
        <circle cx="4.5" cy="4.5" r="0.8" fill="var(--chart-ink)" />
      </pattern>
      <pattern id="pattern-dots-cloud" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="var(--chart-cloud)" />
        <circle cx="1.5" cy="1.5" r="0.8" fill="var(--chart-ink)" />
        <circle cx="4.5" cy="4.5" r="0.8" fill="var(--chart-ink)" />
      </pattern>
      <pattern id="dots-cloud-mark" width="0.333" height="0.333" patternUnits="objectBoundingBox" patternContentUnits="objectBoundingBox">
        <rect width="0.334" height="0.334" fill="var(--chart-cloud)" />
        <circle cx="0.083" cy="0.083" r="0.05" fill="var(--chart-ink)" />
        <circle cx="0.25" cy="0.25" r="0.05" fill="var(--chart-ink)" />
      </pattern>
    </defs>
  );
}
