"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function SiteHeader() {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 80 && y > lastY) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Research", hasDropdown: true },
    { label: "Policy", href: "/policy" },
    { label: "Commitments", hasDropdown: true },
    { label: "Learn", hasDropdown: true },
    { label: "News", href: "/news" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#faf9f5]/95 backdrop-blur-sm border-b border-[#e8e6dc]/80 transition-transform duration-300 ease-out ${
        isScrolledDown ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 h-16 sm:h-[68px] flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" aria-label="Anthropic Home" className="flex items-center text-[#141413] hover:opacity-85 transition-opacity">
          {/* Desktop Wordmark */}
          <svg
            className="h-4 w-auto hidden sm:block"
            viewBox="0 0 570 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Anthropic"
          >
            <path d="M139.492 12.9945H160.265V62.9392H173.525V12.9945H194.298V1.06077H139.492V12.9945Z" fill="currentColor" />
            <path d="M116.066 44.3757L88.221 1.06077H73.1934V62.9392H86.011V19.6243L113.856 62.9392H128.884V1.06077H116.066V44.3757Z" fill="currentColor" />
            <path d="M247.337 25.7238H218.166V1.06077H204.906V62.9392H218.166V37.6575H247.337V62.9392H260.597V1.06077H247.337V25.7238Z" fill="currentColor" />
            <path d="M24.663 1.06077L0 62.9392H13.7901L18.834 49.9447H44.6365L49.6796 62.9392H63.4696L38.8066 1.06077H24.663ZM23.2946 38.453L31.7348 16.7072L40.175 38.453H23.2946Z" fill="currentColor" />
            <path d="M370.475 0C352.619 0 339.978 13.2597 339.978 32.0884C339.978 50.7403 352.619 64 370.475 64C388.243 64 400.796 50.7403 400.796 32.0884C400.796 13.2597 388.243 0 370.475 0ZM370.475 51.6243C360.044 51.6243 353.68 44.1989 353.68 32.0884C353.68 19.8011 360.044 12.3757 370.475 12.3757C380.818 12.3757 387.094 19.8011 387.094 32.0884C387.094 44.1989 380.818 51.6243 370.475 51.6243Z" fill="currentColor" />
            <path d="M555.845 42.1657C553.547 48.1768 548.95 51.6243 542.674 51.6243C532.243 51.6243 525.878 44.1989 525.878 32.0884C525.878 19.8011 532.243 12.3757 542.674 12.3757C548.95 12.3757 553.547 15.8232 555.845 21.8343H569.901C566.453 8.57459 556.11 0 542.674 0C524.818 0 512.177 13.2597 512.177 32.0884C512.177 50.7403 524.818 64 542.674 64C556.199 64 566.541 55.337 569.989 42.1657H555.845Z" fill="currentColor" />
            <path d="M471.337 1.06077L496 62.9392H509.525L484.862 1.06077H471.337Z" fill="currentColor" />
            <path d="M443.403 1.06077H413.171V62.9392H426.431V40.4862H443.403C457.459 40.4862 466.033 33.0608 466.033 20.7735C466.033 8.48619 457.459 1.06077 443.403 1.06077ZM442.784 28.5525H426.431V12.9945H442.784C449.326 12.9945 452.773 15.6464 452.773 20.7735C452.773 25.9006 449.326 28.5525 442.784 28.5525Z" fill="currentColor" />
            <path d="M329.812 19.8895C329.812 8.22099 321.238 1.06077 307.182 1.06077H276.95V62.9392H290.21V38.7182H304.971L318.232 62.9392H332.906L318.223 36.8734C325.593 34.0402 329.812 28.0743 329.812 19.8895ZM290.21 12.9945H306.564C313.105 12.9945 316.552 15.3812 316.552 19.8895C316.552 24.3978 313.105 26.7845 306.564 26.7845H290.21V12.9945Z" fill="currentColor" />
          </svg>
          {/* Mobile Icon */}
          <svg className="h-6 w-auto sm:hidden" viewBox="0 0 46 32" fill="currentColor">
            <path d="M32.73 0h-6.945L38.45 32h6.945L32.73 0ZM12.665 0 0 32h7.082l2.59-6.72h13.25l2.59 6.72h7.082L19.929 0h-7.264Zm-.702 19.337 4.334-11.246 4.334 11.246h-8.668Z" />
          </svg>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-[#141413]">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:underline underline-offset-4 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                  className="flex items-center gap-1.5 hover:underline underline-offset-4 transition-colors cursor-pointer"
                >
                  <span>{item.label}</span>
                  <svg
                    className={`w-2.5 h-2.5 transition-transform duration-200 ${
                      activeDropdown === item.label ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 8 5"
                    fill="currentColor"
                  >
                    <path d="M7.3016 0.231808C7.44932 0.0678162 7.70306 0.0546398 7.86724 0.20212C8.03137 0.349888 8.04461 0.603568 7.89692 0.767766L4.29684 4.76791L4.23434 4.82417C4.16662 4.87328 4.08425 4.89995 3.99918 4.89995C3.88588 4.89989 3.77733 4.85213 3.70152 4.76791L0.10144 0.767766L0.0537825 0.702139C-0.040206 0.541753 -0.0124254 0.331356 0.131128 0.20212C0.274775 0.0728844 0.486972 0.0674593 0.636608 0.1779L0.696765 0.231808L3.99918 3.90148L7.3016 0.231808Z" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Right CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Split CTA button */}
          <div className="hidden sm:inline-flex items-center rounded bg-[#141413] text-[#faf9f5] text-[14px] font-medium overflow-hidden shadow-sm hover:bg-[#262624] transition-colors">
            <a
              href="https://claude.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 hover:bg-white/5 transition-colors"
            >
              Try Claude
            </a>
            <div className="h-4 w-[1px] bg-white/20" />
            <button
              type="button"
              aria-label="More Claude options"
              className="px-2.5 py-2 hover:bg-white/10 transition-colors"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 8 5" fill="currentColor">
                <path d="M7.3016 0.231808C7.44932 0.0678162 7.70306 0.0546398 7.86724 0.20212C8.03137 0.349888 8.04461 0.603568 7.89692 0.767766L4.29684 4.76791L4.23434 4.82417C4.16662 4.87328 4.08425 4.89995 3.99918 4.89995C3.88588 4.89989 3.77733 4.85213 3.70152 4.76791L0.10144 0.767766L0.0537825 0.702139C-0.040206 0.541753 -0.0124254 0.331356 0.131128 0.20212C0.274775 0.0728844 0.486972 0.0674593 0.636608 0.1779L0.696765 0.231808L3.99918 3.90148L7.3016 0.231808Z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#141413] hover:opacity-70 transition-opacity"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e8e6dc] bg-[#faf9f5] px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="block text-lg font-medium text-[#141413] py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <div className="text-lg font-medium text-[#141413] py-2">
                  {item.label}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 border-t border-[#e8e6dc]">
            <a
              href="https://claude.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-[#141413] text-[#faf9f5] rounded font-medium"
            >
              Try Claude
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
