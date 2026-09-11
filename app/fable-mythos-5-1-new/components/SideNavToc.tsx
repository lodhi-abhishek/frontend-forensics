"use client";

import React, { useEffect, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: "introduction", label: "Introduction" },
  { id: "frontier", label: "A new performance frontier" },
  { id: "scientific-research", label: "Scientific research" },
  { id: "safety-security-and-alignment", label: "Safety" },
  { id: "mythos", label: "Claude Mythos 5.1" },
  { id: "cost-and-availability", label: "Cost and availability" },
];

export function SideNavToc() {
  const [activeId, setActiveId] = useState<string>("introduction");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Side nav only appears once we've scrolled past the hero section
      const heroHeight = window.innerHeight * 0.7;
      setIsVisible(window.scrollY > heroHeight);

      const scrollPosition = window.scrollY + 200;

      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const item = TOC_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      className="hidden xl:block fixed left-0 top-1/2 -translate-y-1/2 z-40 select-none"
      aria-label="Table of contents"
    >
      <nav aria-label="Table of contents" className="flex flex-col gap-3 pl-0 py-4">
        {TOC_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;
          const showPill = isActive || isHovered;

          return (
            <div
              key={item.id}
              className="group relative flex items-center"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Hairline Tick Indicator hugging the viewport left edge */}
              <a
                href={`#${item.id}`}
                aria-label={item.label}
                aria-current={isActive ? "true" : undefined}
                className="py-1 cursor-pointer flex items-center"
              >
                <span
                  className={`block h-[1.5px] transition-all duration-200 ${
                    isActive
                      ? "w-6 bg-[#141413] opacity-100"
                      : isHovered
                      ? "w-5 bg-[#141413] opacity-80"
                      : "w-4 bg-[#87867f] opacity-40 group-hover:opacity-80"
                  }`}
                />
              </a>

              {/* Black Capsule Tooltip / Label */}
              <div
                className={`absolute left-7 pointer-events-none transition-all duration-200 ease-out whitespace-nowrap ${
                  showPill
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2"
                }`}
              >
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#141413] text-[#faf9f5] font-anthropic-sans text-[11px] font-medium tracking-wide shadow-md">
                  [ {item.label} ]
                </span>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
