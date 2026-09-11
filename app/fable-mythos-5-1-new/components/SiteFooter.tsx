"use client";

import React from "react";

export function SiteFooter() {
  return (
    <footer
      id="footer"
      className="bg-[#141413] text-[#faf9f5] pt-16 pb-12 px-6 sm:px-8 lg:px-12 font-anthropic-sans"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Top Section with Logo */}
        <div className="mb-12">
          <a href="/" aria-label="Return to homepage" className="inline-block">
            <svg
              className="w-[46px] h-[32px]"
              viewBox="0 0 46 32"
              fill="#faf9f5"
              aria-hidden="true"
            >
              <path d="M32.73 0h-6.945L38.45 32h6.945L32.73 0ZM12.665 0 0 32h7.082l2.59-6.72h13.25l2.59 6.72h7.082L19.929 0h-7.264Zm-.702 19.337 4.334-11.246 4.334 11.246h-8.668Z" />
            </svg>
          </a>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-16 border-b border-[#faf9f5]/15">
          {/* Column 1: Products & Models */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#87867f] mb-4">
                Products
              </h3>
              <ul className="space-y-2.5 text-[13px] text-[#b4b2a8]">
                {[
                  { name: "Claude", href: "https://claude.com/product/overview" },
                  { name: "Claude Code", href: "https://claude.com/product/claude-code" },
                  { name: "Claude Code Enterprise", href: "https://claude.com/product/claude-code/enterprise" },
                  { name: "Claude Cowork", href: "https://claude.com/product/cowork" },
                  { name: "@Claude", href: "https://claude.com/product/tag" },
                  { name: "Claude Design", href: "https://claude.com/product/design" },
                  { name: "Claude Science", href: "https://claude.com/product/claude-science" },
                  { name: "Claude Security", href: "https://claude.com/product/claude-security" },
                  { name: "Pricing", href: "https://claude.com/pricing" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#faf9f5] transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#87867f] mb-4">
                Models
              </h3>
              <ul className="space-y-2.5 text-[13px] text-[#b4b2a8]">
                {[
                  { name: "Mythos", href: "https://www.anthropic.com/claude/mythos" },
                  { name: "Fable", href: "https://www.anthropic.com/claude/fable" },
                  { name: "Opus", href: "https://www.anthropic.com/claude/opus" },
                  { name: "Sonnet", href: "https://www.anthropic.com/claude/sonnet" },
                  { name: "Haiku", href: "https://www.anthropic.com/claude/haiku" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="hover:text-[#faf9f5] transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Solutions & Platform */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#87867f] mb-4">
                Solutions
              </h3>
              <ul className="space-y-2.5 text-[13px] text-[#b4b2a8]">
                {[
                  "AI agents",
                  "Code modernization",
                  "Coding",
                  "Customer support",
                  "Financial services",
                  "Healthcare & Life Sciences",
                  "Government",
                ].map((name) => (
                  <li key={name}>
                    <a href="#" className="hover:text-[#faf9f5] transition-colors">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#87867f] mb-4">
                Platform
              </h3>
              <ul className="space-y-2.5 text-[13px] text-[#b4b2a8]">
                {[
                  "Overview",
                  "Developer Docs",
                  "API Console",
                  "Prompt Engineering",
                  "Cookbooks",
                ].map((name) => (
                  <li key={name}>
                    <a href="#" className="hover:text-[#faf9f5] transition-colors">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Research & Safety */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#87867f] mb-4">
                Research
              </h3>
              <ul className="space-y-2.5 text-[13px] text-[#b4b2a8]">
                {[
                  "Overview",
                  "Responsible Scaling Policy",
                  "Alignment Science",
                  "Interpretability",
                  "Frontier Risks",
                ].map((name) => (
                  <li key={name}>
                    <a href="#" className="hover:text-[#faf9f5] transition-colors">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#87867f] mb-4">
                Trust & Security
              </h3>
              <ul className="space-y-2.5 text-[13px] text-[#b4b2a8]">
                {[
                  "Trust Center",
                  "Enterprise Frontier Safeguards",
                  "Compliance & Certifications",
                  "Transparency Report",
                ].map((name) => (
                  <li key={name}>
                    <a href="#" className="hover:text-[#faf9f5] transition-colors">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#87867f] mb-4">
                Company
              </h3>
              <ul className="space-y-2.5 text-[13px] text-[#b4b2a8]">
                {[
                  "About",
                  "Careers",
                  "News",
                  "Events",
                  "Press",
                ].map((name) => (
                  <li key={name}>
                    <a href="#" className="hover:text-[#faf9f5] transition-colors">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#87867f] mb-4">
                Connect
              </h3>
              <ul className="space-y-2.5 text-[13px] text-[#b4b2a8]">
                {[
                  "X (Twitter)",
                  "LinkedIn",
                  "YouTube",
                  "GitHub",
                ].map((name) => (
                  <li key={name}>
                    <a href="#" className="hover:text-[#faf9f5] transition-colors">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#87867f]">
          <p className="m-0">© {new Date().getFullYear()} Anthropic PBC</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-[#faf9f5] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#faf9f5] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#faf9f5] transition-colors">
              Acceptable Use Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
