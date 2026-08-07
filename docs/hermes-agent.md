# `/hermes-agent` implementation notes

## Purpose

`/hermes-agent` is a close, route-local recreation of the Hermes Agent landing page at `https://hermes-agent.nousresearch.com/`. The route and product name now consistently use **Hermes Agent**.

The implementation recreates the reference page’s major content and flow:

1. Three-part navigation and Products menu
2. Editorial hero and platform-aware desktop download
3. macOS/Linux and Windows terminal commands
4. Desktop application showcase video
5. macOS, Windows, and Linux download cards
6. Six-feature white preview panel
7. Oversized HERMES wordmark
8. Scroll-revealed Nous Portal footer

## File architecture

```text
app/hermes-agent/
├── page.tsx                    Server route shell and metadata
├── hermes-agent.tsx            Client UI, state, observers, and motion
├── portal-figure-media.tsx     Alpha-video and Safari/iOS WebGL renderer
├── hermes-agent.data.ts        Typed copy, links, commands, and media URLs
└── hermes-agent.module.css     Route-scoped visual system and responsiveness
```

The supporting document is `docs/hermes-agent.md`.

### Server and Client Component boundary

`page.tsx` remains a Server Component so it can export route metadata and viewport settings. It loads two Google fonts through `next/font/google` and exposes them as route-local CSS variables:

- `--font-hermes-display`: Cormorant Garamond, used as a legal high-contrast editorial alternative to the reference site’s Sigurd font.
- `--font-hermes-mono`: Courier Prime, used for interface labels, commands, descriptions, and legal text.

`hermes-agent.tsx` is a Client Component because the page needs browser APIs for user-agent detection, Clipboard access, media queries, `IntersectionObserver`, scroll measurements, and keyboard/menu state.

No shared project files or existing routes are modified.

## Data registry

`hermes-agent.data.ts` keeps implementation data outside the JSX:

- Platform and installer TypeScript types
- Route-local Hermes image/video paths
- Install commands
- DMG and EXE links
- Platform card content
- Feature content
- Products menu destinations
- Current displayed Hermes version

This separation makes upstream maintenance straightforward. When Nous Research changes a release build URL or version number, update the registry instead of searching through the component and stylesheet.

## Component map

`HermesAgent` renders content in document order: the scrolling page, then the Portal footer, then the fixed decorative frame.

```text
HermesAgent
├── scrollLayer
│   ├── Hero
│   │   ├── Navigation
│   │   │   └── ProductsMenu
│   │   ├── PlatformCta
│   │   └── Installer
│   ├── Showcase
│   ├── DownloadCards
│   └── feature motion wrapper
│       ├── direct sticky Hermes badge
│       └── Features panel
│           ├── feature grid
│           └── giant HERMES stop/wipe edge
├── PortalFooter
│   └── PortalFigureMedia
└── viewportFrame
```

The scroll layer has a transparent `100dvh` bottom margin. The footer is fixed beneath it in standard motion, while the desktop frame remains above the complete composition. Because the footer follows the scroll layer in DOM order, reduced-motion mode can place it in normal flow after HERMES without reordering the document.

## CSS system

### Palette

The route uses the reference page’s restricted four-color system:

| Token | Value | Use |
|---|---|---|
| `--blue` | `#0000f2` | Main background, text on white, borders |
| `--paper` | `#f5f5f5` | Main foreground and button fill |
| `--white` | `#ffffff` | Feature panel and hover fill |
| `--acid` | `#edff45` | Focus, selection, and animated accents |

The route root explicitly sets its own background, color, typefaces, text transform, color scheme, links, buttons, and selection colors. This prevents the project-wide dark background and DM Sans defaults in `app/globals.css` from changing the replica.

### Typography

The reference combines monumental light serif typography with compact uppercase terminal typography. This implementation preserves that hierarchy:

- Display headings: Cormorant Garamond, light weights, tight line heights
- Labels and paragraphs: Courier Prime, uppercase, tracked lettering
- Commands: Courier Prime with normal casing and safe wrapping

Type sizes use `clamp()` so the poster-like desktop composition scales without abrupt jumps.

### Layout and spacing

Route tokens define responsive gutters, edges, gaps, and desktop frame thickness. Desktop sections use wide CSS Grid layouts and viewport-relative sizing. The major breakpoint is `767px`, matching the reference site’s approximate 48rem mobile transition.

The visual stack is deliberate:

| Layer | Purpose |
|---|---|
| 1 | Fixed Nous Portal footer and animated figure |
| 2 | Scrolling hero, showcase, and download cards |
| 30 | Final white feature panel and HERMES wipe edge |
| 30–40 | Navigation, sticky badge, and Products menu |
| 100 | Fixed electric-blue viewport frame |

### Texture and image treatment

The reference artwork is retained through public remote WebP assets. CSS adds the surrounding treatment:

- SVG fractal-noise data URLs
- Scanline overlays
- Blue vignettes
- `mix-blend-mode: lighten` and `screen`
- Cropped/oversized media inside fixed aspect ratios
- A masked animated gradient edge on download cards

The page uses native `<img>` and `<video>` elements rather than `next/image`. This avoids changing `next.config` for remote image hosts and keeps the implementation isolated. Explicit width, height, and aspect-ratio values prevent most layout movement while assets load.

The Portal figure is a transparent animated composition rather than a separate woman and globe. Chromium and Firefox display the public VP9 alpha WebM directly. Safari and iOS receive the vertically stacked RGB/alpha MP4 and a small WebGL renderer combines the two halves into a transparent canvas. The static WebP stays visible until an animated frame is ready and remains the fallback for reduced motion, autoplay rejection, decoding failure, WebGL failure, context loss, or CORS failure.

## Interactions

### Products menu

The Products trigger exposes `aria-haspopup`, `aria-expanded`, and `aria-controls`. The popup uses menu/menuitem roles and supports:

- Click to open and close
- Outside pointer dismissal
- Escape dismissal with focus restored to the trigger
- Arrow Up/Down navigation
- Home and End navigation

### Platform-aware desktop download

After hydration, the page checks `navigator.platform` and `navigator.userAgent` for Mac, Windows, Linux, or X11 indicators. It then selects the matching destination:

- macOS: DMG download
- Windows: EXE download
- Linux: terminal installation anchor
- Unknown: downloads section

The server always renders a neutral destination first, avoiding a hydration mismatch. On standard-motion desktop sessions, the detected label resolves through a short character-scramble effect. Reduced-motion sessions immediately receive the final text.

### Installer tabs

The installer uses a complete tab pattern:

- `role="tablist"`
- `role="tab"`
- `aria-selected`
- `role="tabpanel"`
- Arrow Left/Right, Home, and End keyboard handling

Windows users begin on the Windows command; other users begin on macOS/Linux.

### Clipboard feedback

The copy action calls `navigator.clipboard.writeText()`. A successful copy changes the icon and accessible name for two seconds. An `aria-live="polite"` region announces both success and clipboard failure. Failure never reports a false success; the interface directs the user to select and copy the visible command.

### Showcase video

An `IntersectionObserver` with negative vertical root margins plays the muted showcase while it occupies the central viewport band and pauses it elsewhere. The video uses:

- `muted`
- `loop`
- `playsInline`
- `preload="metadata"`
- A static poster

Rejected autoplay promises are ignored safely. Reduced-motion sessions keep the video paused and show the poster.

### Scroll animation and footer reveal

The final effect is a physical wipe, not a crossfade. The fully opaque scrolling wrapper ends after the white feature panel and contributes a transparent `100dvh` bottom margin. The fixed Portal footer sits at `z-index: 1` beneath it. As the white panel and HERMES word move upward, that transparent runway exposes the woman and revolving globe.

The feature-motion wrapper remains untransformed and provides stable document geometry. After mount, fonts, load, resize, and orientation changes, a measurement pass caches the wrapper top, HERMES stop offset, badge sticky bottom, image-box geometry, viewport height, and the baseline maximum scroll. When measurement occurs during a negative panel margin, the current `--feature-y` value is added back mathematically so the motion does not change its own scroll-height input.

A single passive scroll listener schedules one `requestAnimationFrame`. Each frame:

1. Computes feature lift with `clamp((viewportHeight - max(featureTop - scroll, 0)) × 0.14, 0, 0.18 × viewportHeight)`.
2. Writes the same negative value to the panel transform and `margin-bottom` through `--feature-y`.
3. Keeps the badge sticky normally, then translates it upward so its bottom remains 16px above the HERMES stop marker.
4. Computes each image’s normalized distance from viewport center and writes `--py-img`, allowing ±10% of the image-box height.
5. Computes footer opacity with `(0.72 × viewportHeight - remaining) / (0.38 × viewportHeight)`, clamped to 0–1.
6. Starts the Portal alpha video shortly before the footer appears, enables footer controls above 98% reveal, and pauses media after scrolling away.

The white panel uses `overflow: clip`, making its lower boundary and HERMES word the hard wipe edge. Lift begins when the feature wrapper enters the viewport and reaches an effective 14vh when its top reaches the viewport top, rather than waiting until the final footer runway.

Feature photographs use absolute centered media inside `666 / 574` boxes. The transform is `translate3d(0, var(--py-img), 0) scale(1.22)`, which enlarges from the center and prevents the previous top-left-biased crop.

Per-frame work consumes cached measurements and writes CSS custom properties directly. React state changes only when media activity or footer interactivity crosses a threshold.

### Portal orb alignment

On desktop, the `O` in the ghost PORTAL word is measured after fonts load and whenever the footer resizes. The figure is positioned from the source media’s embedded orb geometry:

- Orb anchor X: `0.1868`
- Orb anchor Y: `0.5582`
- Orb diameter: `0.2204` of figure width
- Figure aspect ratio: `0.8076`

This places the revolving globe inside the PORTAL `O` while keeping the woman, hand, and typography in one responsive composition. Mobile hides the ghost wordmark and centers the complete figure at the bottom, capped at `50dvh`.

## Responsive behavior

### Desktop

- Thick fixed blue viewport frame
- Absolute three-column navigation
- Right-side hero artwork
- Multi-column hero install controls
- Three platform cards in one row
- Three-column feature grid
- Direct sticky Hermes badge sized at `84u × 120u` with a scripted 16px HERMES stop
- Giant HERMES wordmark acting as the white wipe edge
- Stacked ghost NOUS / PORTAL typography
- Animated woman-and-orb alpha video aligned to the PORTAL O
- Fixed footer revealed through a transparent viewport-height margin

### Mobile (767px and below)

- Viewport frame removed
- Nous and header Install links hidden
- Hero artwork hidden
- Hero content anchored near the bottom of an 88svh section
- CTA and terminal card fill the width
- Commands wrap safely
- Download cards stack and switch to a 2:1 ratio
- Feature grid becomes one column
- Hermes badge and ghost portal wordmark are hidden
- Portal figure is centered at the bottom
- Touch controls remain at least approximately 44px high

Below 390px, the social icons are removed to prevent navigation collisions while keeping Docs, branding, and Products available.

## Accessibility

The route includes:

- Semantic `main`, `header`, `nav`, `section`, `article`, and `footer` structure
- One page-level `h1`
- Accessible names for social icon links
- Keyboard-complete Products and installer controls
- Visible focus treatment in acid yellow or blue
- Real selectable command text
- Clipboard live announcements
- Decorative artwork with empty alt text and `aria-hidden`
- New-tab protection through `rel="noopener noreferrer"`
- Hidden-footer links removed from the tab order until reveal
- A reduced-motion mode that preserves every section and action

## Reduced-motion behavior

JavaScript observes `prefers-reduced-motion: reduce`. When enabled:

- CTA scrambling stops
- Showcase autoplay stops
- Scroll-driven parallax, feature lift, and badge-stop translation are not installed
- Feature transform and negative-margin compensation reset to zero
- Feature photos retain the corrected centered `scale(1.22)` crop with `--py-img: 0px`
- Download edge animation is disabled
- The Portal footer moves into normal document flow after HERMES at full opacity
- The transparent `100dvh` reveal margin is removed
- The woman uses the static WebP poster; WebM, MP4, and WebGL rendering remain inactive
- Internal anchor movement is immediate instead of smooth

This ensures the page does not require motion to expose content or controls.

## External asset dependency

The recreation keeps its page media in:

- `public/assets/hermes-agent`

These files are referenced from `hermes-agent.data.ts`, so the rendered page no longer depends on upstream media hosts.

## Verification

Run from the project root:

```bash
pnpm exec tsc --noEmit
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3000/hermes-agent
```

Recommended visual sizes:

- 1440 × 900
- 1280 × 800
- 768 × 1024
- 390 × 844
- 360 × 800

Manually verify:

- Navigation alignment and menu behavior
- Hero line breaks and download selection
- Installer arrow-key navigation and copy feedback
- Video play/pause threshold
- Download-card hover and keyboard focus states
- Feature grid and centered `scale(1.22)` photo framing with no top-left bias
- Direct badge dimensions of `84u × 120u`, sticky top at `frame + 30u`, and a stop gap of approximately 16px above HERMES
- Feature-entry lift beginning at the viewport edge, with matched transform/margin and approximately `-14vh` at the feature-top crossing
- HERMES wordmark clipping and continuous footer transition without late jumps
- A hard white-panel wipe with no blue painted spacer or foreground opacity fade
- Footer opacity at the `0.72h → 0.34h` remaining-scroll interval
- Woman/orb WebM transparency and changing video `currentTime` in Chromium/Firefox
- Safari/iOS stacked-alpha MP4 reconstruction or clean poster fallback
- Orb alignment with the ghost PORTAL O after resizing
- Footer media prewarm/pause and 98% focus threshold
- No horizontal overflow or black media rectangle
- Static reduced-motion poster, zero reveal margin, and normal-flow footer

## Maintenance checklist

When synchronizing with a newer Hermes release, review these values in `hermes-agent.data.ts`:

1. `HERMES_VERSION`
2. macOS DMG build URL
3. Windows EXE build URL
4. Install shell and PowerShell commands
5. Feature copy
6. Static image asset filenames
7. Portal figure poster, alpha WebM, and stacked-alpha MP4 URLs
8. Nous Portal plan destination
