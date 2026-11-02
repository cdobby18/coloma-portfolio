## Integrate the <AccordionGallery /> and <MagicBento /> components from React Bits

You are helping integrate two open-source React components into an existing application.

### Dependencies (combined)
- `gsap` — required for AccordionGallery
- `@hugeicons/react` — required for MagicBento
- `@hugeicons/core-free-icons` — required for MagicBento

---

## Component 1: AccordionGallery
### Variant: JavaScript + CSS

### Usage Example
```jsx
import AccordionGallery from './AccordionGallery'

const items = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

<AccordionGallery
  items={items}
  defaultIndex={2}
  expandRatio={0.52}
  trigger="hover"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | Array<{ image: string; label?: string; link?: string; alt?: string }> | 5 sample panels | The panels to render. Each needs an image, and optionally a label, link and alt text. |
| defaultIndex | number | 2 | Index of the panel that is expanded on load, so the gallery never looks dead. |
| accentColor | string | "#ffffff" | Colour of the caption accent bar and the focus ring. |
| overlayColor | string | "#060010" | Colour used for the bottom legibility gradient and the dimming of collapsed panels. |
| textColor | string | "#ffffff" | Colour of the caption text. |
| grayscale | boolean | true | Desaturate collapsed panels and restore full colour on the expanded one. |
| showLabels | boolean | true | Whether captions reveal on the expanded panel. |
| duration | number | 0.6 | Duration of the expand / collapse transition in seconds. |
| ease | string | "power3.out" | GSAP easing used for every transition. |
| parallax | number | 0.5 | Strength of the internal image drift as panels resize (0 disables it). |
| tilt | number | 8 | Degrees of 3D rotation applied to collapsed panels, easing to flat on the open one. |
| stagger | number | 0.06 | Delay between the caption bar and text reveal, in seconds. |
| trigger | "hover" \| "click" | "hover" | How a panel expands on pointer devices. Focus and tap always expand too. |
| height | number | 460 | Height of the row in pixels (width of the column when vertical). |
| gap | number | 10 | Gap between panels in pixels. |
| radius | number | 16 | Corner radius of each panel in pixels. |
| expandRatio | number | 0.52 | Fraction of the row the expanded panel occupies (0.2 – 0.9). |
| orientation | "horizontal" \| "vertical" | "horizontal" | Lay the accordion out as a row or a column. |

### Full Component Source
```jsx
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

import './AccordionGallery.css';

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

const AccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = ''
}) => {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const barRefs = useRef([]);
  const textRefs = useRef([]);
  const tlRef = useRef(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    animate => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = i => {
    if (trigger === 'hover') setActive(i);
  };

  const handleClick = (i, e) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
      }}
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link ? 'a' : 'div';
        return (
          <Tag
            key={i}
            ref={el => (panelRefs.current[i] = el)}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={el => (mediaRefs.current[i] = el)}>
                <img src={item.image} alt={item.alt || item.label || ''} draggable="false" />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span className="ag-panel__bar" ref={el => (barRefs.current[i] = el)} />
                <span className="ag-panel__text" ref={el => (textRefs.current[i] = el)}>
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
```

### Component CSS
```css
.accordion-gallery {
  --ag-accent: #ffffff;
  --ag-overlay: #060010;
  --ag-text: #ffffff;
  --ag-gap: 10px;
  --ag-radius: 16px;
  --ag-media-size: 320px;

  display: flex;
  flex-direction: row;
  gap: var(--ag-gap);
  width: 100%;
  max-width: 100%;
  perspective: 1400px;
  perspective-origin: 50% 50%;
}

.accordion-gallery--vertical {
  flex-direction: column;
}

.ag-panel {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--ag-radius);
  cursor: pointer;
  display: block;
  text-decoration: none;
  outline: none;
  transform-style: preserve-3d;
  transform-origin: center center;
  background: #0a0713;
  box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.8);
  will-change: flex-grow, transform;
  -webkit-tap-highlight-color: transparent;
}

.ag-panel:focus-visible {
  box-shadow:
    0 0 0 2px var(--ag-accent),
    0 10px 30px -18px rgba(0, 0, 0, 0.8);
}

.ag-panel__frame {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
}

.ag-panel__media {
  --ag-gray: 1;
  --ag-dim: 0.35;
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--ag-media-size);
  height: 100%;
  filter: grayscale(var(--ag-gray));
  will-change: transform, filter;
}

.accordion-gallery--vertical .ag-panel__media {
  width: 100%;
  height: var(--ag-media-size);
}

.ag-panel__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.ag-panel__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, transparent 45%, color-mix(in srgb, var(--ag-overlay) 78%, transparent) 100%),
    color-mix(in srgb, var(--ag-overlay) calc(var(--ag-dim, 0.35) * 100%), transparent);
}

.ag-panel__label {
  position: absolute;
  left: 20px;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: none;
  z-index: 2;
}

.ag-panel__bar {
  flex: 0 0 auto;
  width: 3px;
  height: 26px;
  border-radius: 3px;
  background: var(--ag-accent);
  opacity: 0;
  box-shadow: 0 0 12px color-mix(in srgb, var(--ag-accent) 60%, transparent);
}

.ag-panel__text {
  color: var(--ag-text);
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(1rem, 1.4vw, 1.4rem);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55);
}

@media (max-width: 520px) {
  .accordion-gallery {
    flex-direction: column;
    perspective: none;
    height: auto !important;
  }
  .ag-panel {
    min-height: 84px;
    transform: none !important;
  }
  .accordion-gallery .ag-panel__media {
    width: 100%;
    height: var(--ag-media-size);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ag-panel,
  .ag-panel__media {
    will-change: auto;
  }
}
```

---

## Component 2: MagicBento
### Variant: JavaScript + CSS

### Usage Example
```jsx
import MagicBento from './MagicBento';

<MagicBento
  columns={4}
  rowHeight={200}
  gap={12}
  radius={20}
  enableBorderGlow={true}
  enableSpotlight={true}
  spotlightRadius={300}
  clickEffect={true}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | MagicBentoItem[] | Six feature cards | Cards to show. Each takes label, title, description, icon, image, visual, content, href, onClick, colSpan and rowSpan. |
| items[].visual | ReactNode \| string | - | Artwork between the header and the text. Use your own node, or a built-in one: analytics, dashboard, collaboration, automation, integration or security. |
| items[].content | ReactNode | - | Replaces the whole inside of the card. The lights, border and click wave still apply. |
| items[].image | string | - | Photo that fills the card, with a soft shade under the text. |
| columns | number | 4 | Columns on wide screens. Drops to 2, then 1, as the grid gets narrower. |
| rowHeight | number | 200 | Height of one row, in px. |
| gap | number | 12 | Space between cards, in px. |
| radius | number | 20 | Corner radius of the cards, in px. |
| theme | 'dark' \| 'light' | 'dark' | Color theme of the cards. |
| glowColor | string | Text color | Color of the lights and the accents in the artwork. Takes hex or "r, g, b". |
| enableBorderGlow | boolean | true | Lights up the card edges near the cursor, across neighboring cards too. |
| enableSpotlight | boolean | true | A soft light follows the cursor inside the hovered card. |
| spotlightRadius | number | 300 | Size of the cursor light, in px. |
| enableStars | boolean | false | Fine specks of light drift up around the cursor in the hovered card. |
| particleCount | number | 24 | Number of specks in each card. |
| enableTilt | boolean | false | Tilts the hovered card toward the cursor. |
| enableMagnetism | boolean | false | The hovered card leans a few pixels toward the cursor. |
| clickEffect | boolean | true | Clicking sends a ring of light across the grid and replays the card artwork. |
| textAutoHide | boolean | true | Keeps titles to one line and descriptions to two. |
| intro | boolean | true | Cards rise in one by one and their artwork plays when the grid scrolls into view. |
| disableAnimations | boolean | false | Turns off all motion. Reduced motion settings do the same. |
| onItemClick | (item, index) => void | - | Called when a card is clicked. Cards become focusable buttons. |
| className | string | '' | Extra class names for the grid. |
| style | CSSProperties | - | Inline styles for the grid. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FigmaIcon,
  FingerPrintIcon,
  GitBranchIcon,
  GithubIcon,
  Key01Icon,
  NotionIcon,
  SlackIcon,
  SparklesIcon,
  Tick02Icon
} from '@hugeicons/core-free-icons';

import './MagicBento.css';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const THEMES = {
  dark: {
    '--mb-surface': 'linear-gradient(180deg, #1a1820 0%, #121116 100%)',
    '--mb-edge': 'rgba(255, 255, 255, 0.07)',
    '--mb-highlight': 'rgba(255, 255, 255, 0.06)',
    '--mb-shadow': '0 24px 48px -28px rgba(0, 0, 0, 0.85), 0 8px 18px -12px rgba(0, 0, 0, 0.6)',
    '--mb-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
    '--mb-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--mb-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--mb-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--mb-well': 'rgba(255, 255, 255, 0.03)',
    '--mb-well-edge': 'rgba(255, 255, 255, 0.06)',
    '--mb-ink': '#f4f4f5',
    '--mb-muted': 'rgba(244, 244, 245, 0.6)',
    '--mb-faint': 'rgba(244, 244, 245, 0.3)',
    '--mb-line': 'rgba(244, 244, 245, 0.1)',
    '--mb-secondary': '#a1a1aa',
    '--mb-secondary-ink': '#121016',
    '--mb-cursor-stroke': 'rgba(18, 16, 22, 0.9)',
    '--mb-ring': 'rgba(18, 16, 22, 0.85)',
    '--mb-focus': 'rgba(244, 244, 245, 0.5)',
    '--mb-glow-alpha': 0.85,
    '--mb-spot-alpha': 0.07
  },
  light: {
    '--mb-surface': 'linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)',
    '--mb-edge': 'rgba(24, 24, 27, 0.08)',
    '--mb-highlight': 'rgba(255, 255, 255, 1)',
    '--mb-shadow': '0 24px 48px -30px rgba(24, 24, 27, 0.28), 0 8px 18px -14px rgba(24, 24, 27, 0.16)',
    '--mb-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
    '--mb-tile-edge': 'rgba(24, 24, 27, 0.08)',
    '--mb-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--mb-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.22)',
    '--mb-well': 'rgba(24, 24, 27, 0.025)',
    '--mb-well-edge': 'rgba(24, 24, 27, 0.06)',
    '--mb-ink': '#18181b',
    '--mb-muted': 'rgba(24, 24, 27, 0.6)',
    '--mb-faint': 'rgba(24, 24, 27, 0.3)',
    '--mb-line': 'rgba(24, 24, 27, 0.08)',
    '--mb-secondary': '#71717a',
    '--mb-secondary-ink': '#ffffff',
    '--mb-cursor-stroke': '#ffffff',
    '--mb-ring': '#ffffff',
    '--mb-focus': 'rgba(24, 24, 27, 0.4)',
    '--mb-glow-alpha': 0.5,
    '--mb-spot-alpha': 0.035
  }
};

const INK = { dark: [244, 244, 245], light: [24, 24, 27] };
const MIN_CELL = 150;
const MIN_PAIR = 200;
const STAGGER = 80;
const TILT = 6;
const MAGNET = 6;

const DEFAULT_ITEMS = [
  { title: 'Analytics', description: 'Track user behavior', visual: 'analytics' },
  { title: 'Dashboard', description: 'Centralized data view', visual: 'dashboard' },
  {
    title: 'Collaboration',
    description: 'Work together seamlessly',
    visual: 'collaboration',
    colSpan: 2,
    rowSpan: 2
  },
  { title: 'Automation', description: 'Streamline workflows', visual: 'automation', colSpan: 2, rowSpan: 2 },
  { title: 'Integration', description: 'Connect favorite tools', visual: 'integration' },
  { title: 'Security', description: 'Enterprise-grade protection', visual: 'security' }
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const vars = values => values;

const parseRgb = value => {
  if (!value) return null;
  const text = String(value).trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const full = hex[1].length === 3 ? hex[1].replace(/./g, digit => digit + digit) : hex[1];
    return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16));
  }
  const numbers = text.match(/[\d.]+/g);
  if (numbers && numbers.length >= 3 && /^(rgba?\(|[\d.\s,]+$)/i.test(text)) {
    return numbers.slice(0, 3).map(channel => clamp(Math.round(parseFloat(channel)), 0, 255));
  }
  return null;
};

const inkFor = rgb => {
  const [r, g, b] = rgb.map(channel => channel / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? '#121016' : '#ffffff';
};

const CHART = [3.1, 3.8, 3.5, 4.9, 4.4, 5.8, 5.3, 6.9, 6.5, 8.2, 9.4, 12.4];

const curve = (values, width, height) => {
  const top = 6;
  const bottom = 2;
  const low = Math.min(...values) * 0.7;
  const high = Math.max(...values);
  const points = values.map((value, index) => [
    (index / (values.length - 1)) * width,
    top + (1 - (value - low) / (high - low)) * (height - top - bottom)
  ]);
  const count = points.length;
  const slopes = [];
  for (let i = 0; i < count - 1; i++) {
    slopes.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
  }
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === count - 1) return slopes[count - 2];
    return slopes[i - 1] * slopes[i] > 0 ? (slopes[i - 1] + slopes[i]) / 2 : 0;
  });
  for (let i = 0; i < count - 1; i++) {
    if (slopes[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
      continue;
    }
    const a = tangents[i] / slopes[i];
    const b = tangents[i + 1] / slopes[i];
    const length = a * a + b * b;
    if (length > 9) {
      const scale = 3 / Math.sqrt(length);
      tangents[i] = scale * a * slopes[i];
      tangents[i + 1] = scale * b * slopes[i];
    }
  }
  let line = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  const samples = [];
  for (let i = 0; i < count - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const third = (x1 - x0) / 3;
    const c1 = [x0 + third, y0 + tangents[i] * third];
    const c2 = [x1 - third, y1 - tangents[i + 1] * third];
    line += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`;
    for (let step = 0; step < 12; step++) {
      const t = step / 12;
      const u = 1 - t;
      samples.push([
        u * u * u * x0 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * x1,
        u * u * u * y0 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * y1
      ]);
    }
  }
  samples.push(points[count - 1]);
  const area = `${line} L${width.toFixed(2)},${height.toFixed(2)} L0,${height.toFixed(2)} Z`;
  return { line, area, samples };
};

const sampleAt = (samples, x) => {
  let index = 1;
  while (index < samples.length - 1 && samples[index][0] < x) index++;
  const [x0, y0] = samples[index - 1];
  const [x1, y1] = samples[index];
  const t = x1 === x0 ? 0 : clamp((x - x0) / (x1 - x0), 0, 1);
  return y0 + (y1 - y0) * t;
};

const AnalyticsVisual = () => {
  const chartRef = useRef(null);
  const plotRef = useRef(null);
  const scrubRef = useRef(null);
  const dotRef = useRef(null);
  const valueRef = useRef(null);
  const noteRef = useRef(null);
  const [size, setSize] = useState(null);

  useIsomorphicLayoutEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const update = () => {
      const next = { width: plot.clientWidth, height: plot.clientHeight };
      setSize(previous =>
        previous && previous.width === next.width && previous.height === next.height ? previous : next
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);

  const shape = useMemo(
    () => (size && size.width > 4 && size.height > 4 ? curve(CHART, size.width, size.height) : null),
    [size]
  );

  const scrub = event => {
    const plot = plotRef.current;
    const chart = chartRef.current;
    const line = scrubRef.current;
    const dot = dotRef.current;
    const label = valueRef.current;
    const note = noteRef.current;
    if (!shape || !plot || !chart || !line || !dot || !label || !note) return;
    const rect = plot.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = sampleAt(shape.samples, x);
    const position = (x / Math.max(1, rect.width)) * (CHART.length - 1);
    const index = Math.floor(position);
    const next = Math.min(CHART.length - 1, index + 1);
    const value = CHART[index] + (CHART[next] - CHART[index]) * (position - index);
    chart.dataset.scrub = '';
    line.style.transform = `translateX(${x.toFixed(1)}px)`;
    dot.style.transform = `translateY(${y.toFixed(1)}px)`;
    label.textContent = `${value.toFixed(1)}k`;
    note.textContent = `Oct ${Math.round(position) + 1}`;
  };

  const rest = () => {
    if (chartRef.current) delete chartRef.current.dataset.scrub;
    if (valueRef.current) valueRef.current.textContent = `${CHART[CHART.length - 1].toFixed(1)}k`;
    if (noteRef.current) noteRef.current.textContent = '+18%';
  };

  return (
    <div
      ref={chartRef}
      className="magic-bento__chart"
      onPointerMove={scrub}
      onPointerDown={scrub}
      onPointerLeave={rest}
    >
      <div className="magic-bento__figure">
        <span ref={valueRef} className="magic-bento__figure-value">
          {CHART[CHART.length - 1].toFixed(1)}k
        </span>
        <span ref={noteRef} className="magic-bento__figure-note">
          +18%
        </span>
      </div>
      <div ref={plotRef} className="magic-bento__plot">
        {shape && size && (
          <svg viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
            <path className="magic-bento__chart-area" d={shape.area} />
            <path className="magic-bento__chart-line" d={shape.line} pathLength="1" />
          </svg>
        )}
        <span ref={scrubRef} className="magic-bento__scrub">
          <span ref={dotRef} className="magic-bento__scrub-dot" />
        </span>
      </div>
    </div>
  );
};

const BARS = [42, 58, 49, 71, 63, 88, 76];

const DashboardVisual = () => (
  <div className="magic-bento__bars">
    <div className="magic-bento__figure">
      <span className="magic-bento__figure-value">$48.2k</span>
      <span className="magic-bento__figure-note">Weekly</span>
    </div>
    <div className="magic-bento__bars-plot">
      {BARS.map((height, index) => (
        <span
          key={index}
          className="magic-bento__bar"
          data-peak={height === Math.max(...BARS) ? '' : undefined}
          style={vars({ '--h': height / 100, '--i': index })}
        />
      ))}
    </div>
  </div>
);

const ARROW = (
  <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
    <path
      d="M2.2 1.6 13.4 9.9c.5.4.3 1.2-.4 1.3l-4.6.6-2.2 4.2c-.3.6-1.2.5-1.4-.1L1.2 2.4c-.2-.6.5-1.1 1-.8Z"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const CollaborationVisual = () => (
  <div className="magic-bento__collab magic-bento__well">
    <span className="magic-bento__doc-title">Launch plan</span>
    <div className="magic-bento__lines">
      <span className="magic-bento__line" style={vars({ '--w': '92%' })} />
      <span className="magic-bento__line" style={vars({ '--w': '78%' })} />
      <span className="magic-bento__line" style={vars({ '--w': '86%' })} />
      <span className="magic-bento__line" style={vars({ '--w': '44%' })} />
      <span className="magic-bento__line magic-bento__line--gap" style={vars({ '--w': '88%' })} />
      <span className="magic-bento__line" style={vars({ '--w': '70%' })}>
        <span className="magic-bento__selection" style={vars({ '--from': '18%', '--span': '58%' })}>
          <span className="magic-bento__caret" />
        </span>
      </span>
      <span className="magic-bento__line" style={vars({ '--w': '82%' })} />
    </div>
    <span
      className="magic-bento__cursor magic-bento__cursor--primary"
      style={vars({ '--x': '58%', '--y': '52%', '--i': 0, '--path': 'magic-bento-path-a' })}
    >
      {ARROW}
      <span className="magic-bento__cursor-name">Maya</span>
    </span>
    <span
      className="magic-bento__cursor magic-bento__cursor--secondary"
      style={vars({ '--x': '30%', '--y': '24%', '--i': 1, '--path': 'magic-bento-path-b' })}
    >
      {ARROW}
      <span className="magic-bento__cursor-name">Leo</span>
    </span>
  </div>
);

const STEPS = [
  { label: 'Install', time: '8s' },
  { label: 'Build', time: '12s' },
  { label: 'Test', time: '48s' },
  { label: 'Deploy', time: '9s' }
];

const AutomationVisual = () => (
  <div className="magic-bento__flow" style={vars({ '--n': STEPS.length })}>
    <div className="magic-bento__flow-trigger magic-bento__tile">
      <span className="magic-bento__flow-glyph">
        <HugeiconsIcon icon={GitBranchIcon} size={15} strokeWidth={1.8} />
      </span>
      <span className="magic-bento__flow-copy">
        <span className="magic-bento__flow-name">Push to main</span>
        <span className="magic-bento__flow-meta magic-bento__flow-hash">a1c9f3e</span>
      </span>
    </div>
    <ol className="magic-bento__steps magic-bento__well">
      <span className="magic-bento__rail" aria-hidden="true">
        <span className="magic-bento__rail-fill" />
      </span>
      {STEPS.map((step, index) => (
        <li key={step.label} className="magic-bento__step" style={vars({ '--i': index })}>
          <span className="magic-bento__status">
            <span className="magic-bento__pending" />
            <span className="magic-bento__spinner" />
            <span className="magic-bento__done">
              <HugeiconsIcon icon={Tick02Icon} size={11} strokeWidth={2.6} />
            </span>
          </span>
          {step.label}
          <span className="magic-bento__step-time">{step.time}</span>
        </li>
      ))}
    </ol>
  </div>
);

const APPS = [
  { icon: SlackIcon, x: '17%', y: '24%' },
  { icon: GithubIcon, x: '83%', y: '24%' },
  { icon: FigmaIcon, x: '17%', y: '78%' },
  { icon: NotionIcon, x: '83%', y: '78%' }
];

const IntegrationVisual = () => (
  <div className="magic-bento__hub">
    <svg className="magic-bento__hub-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {APPS.map(app => (
        <line key={app.x + app.y} x1={parseFloat(app.x)} y1={parseFloat(app.y)} x2="50" y2="51" pathLength="1" />
      ))}
    </svg>
    {APPS.map((app, index) => (
      <span
        key={`packet-${index}`}
        className="magic-bento__packet"
        style={vars({ '--x': app.x, '--y': app.y, '--i': index })}
      />
    ))}
    {APPS.map((app, index) => (
      <span
        key={app.x + app.y}
        className="magic-bento__hub-node magic-bento__tile"
        style={vars({ '--x': app.x, '--y': app.y, '--s': '26px', '--i': index + 1 })}
      >
        <HugeiconsIcon icon={app.icon} size={14} strokeWidth={1.8} />
      </span>
    ))}
    <span
      className="magic-bento__hub-node magic-bento__tile"
      style={vars({ '--x': '50%', '--y': '51%', '--s': '34px', '--i': 0 })}
    >
      <HugeiconsIcon icon={SparklesIcon} size={17} strokeWidth={1.8} />
    </span>
  </div>
);

const SETTINGS = [
  { icon: Key01Icon, label: 'SSO' },
  { icon: FingerPrintIcon, label: '2FA' }
];

const SecurityVisual = () => (
  <div className="magic-bento__shield">
    {SETTINGS.map((setting, index) => (
      <div key={setting.label} className="magic-bento__setting magic-bento__tile">
        <HugeiconsIcon icon={setting.icon} size={14} strokeWidth={1.8} />
        <span className="magic-bento__setting-label">{setting.label}</span>
        <span className="magic-bento__switch" style={vars({ '--i': index })} />
      </div>
    ))}
  </div>
);

const VISUALS = {
  analytics: AnalyticsVisual,
  dashboard: DashboardVisual,
  collaboration: CollaborationVisual,
  automation: AutomationVisual,
  integration: IntegrationVisual,
  security: SecurityVisual
};

const REPLAY = new Set([
  'magic-bento-draw',
  'magic-bento-fade',
  'magic-bento-grow',
  'magic-bento-pop',
  'magic-bento-select',
  'magic-bento-wait',
  'magic-bento-run',
  'magic-bento-check',
  'magic-bento-rail',
  'magic-bento-switch-track',
  'magic-bento-switch-knob'
]);

const FLOW = new Set([
  'magic-bento-wait',
  'magic-bento-run',
  'magic-bento-check',
  'magic-bento-rail',
  'magic-bento-fade'
]);

const finite = animation => {
  const timing = animation.effect?.getTiming?.();
  return timing ? timing.iterations !== Infinity : false;
};

const nameOf = animation => animation.animationName || '';

const MagicBento = ({
  items = DEFAULT_ITEMS,
  columns = 4,
  rowHeight = 200,
  gap = 12,
  radius = 20,
  theme = 'dark',
  glowColor,
  textAutoHide = true,
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 300,
  enableStars = false,
  particleCount = 24,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  intro = true,
  disableAnimations = false,
  onItemClick,
  className = '',
  style
}) => {
  const rootRef = useRef(null);
  const cellRefs = useRef([]);
  const cardRefs = useRef([]);
  const starRefs = useRef([]);
  const engineRef = useRef(null);
  const [cols, setCols] = useState(Math.max(1, Math.round(columns)));

  const palette = theme === 'light' ? 'light' : 'dark';
  const glow = parseRgb(glowColor) ?? INK[palette];
  const settings = {
    items,
    columns: Math.max(1, Math.round(columns)),
    gap: Math.max(0, gap),
    enableBorderGlow,
    enableSpotlight,
    spotlightRadius: Math.max(40, spotlightRadius),
    enableStars,
    particleCount: clamp(Math.round(particleCount), 0, 120),
    enableTilt,
    enableMagnetism,
    clickEffect,
    intro,
    disableAnimations,
    onItemClick,
    glow
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motion = !settingsRef.current.disableAnimations && !reduced;
    const playIntro = motion && settingsRef.current.intro;
    if (motion) root.dataset.motion = '';
    else delete root.dataset.motion;
    if (playIntro) root.dataset.intro = '';
    else delete root.dataset.intro;

    const pointer = { x: -1e5, y: -1e5, inside: false, down: -1 };
    const light = { x: -1e5, y: -1e5, near: 0, ready: false };
    const states = [];
    const wave = { x: 0, y: 0, t: -1, duration: 1.1, reach: 800 };
    let rects = [];
    let bounds = null;
    let dirty = true;
    let raf = 0;
    let last = 0;
    let visible = true;
    let entered = !playIntro;
    let settleTimer = 0;
    let introTimer = 0;
    const lastFlow = [];

    const stateFor = index => {
      if (!states[index]) {
        states[index] = {
          hot: 0,
          rx: 0,
          ry: 0,
          tx: 0,
          ty: 0,
          vrx: 0,
          vry: 0,
          vtx: 0,
          vty: 0,
          press: 1,
          vpress: 0,
          stars: 0,
          particles: null,
          active: false,
          written: {}
        };
      }
      return states[index];
    };

    const write = (element, state, name, value) => {
      if (state.written[name] === value) return;
      state.written[name] = value;
      element.style.setProperty(name, value);
    };

    const measure = () => {
      dirty = false;
      bounds = root.getBoundingClientRect();
      rects = cellRefs.current.map(cell => (cell ? cell.getBoundingClientRect() : null));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      starRefs.current.forEach((canvas, index) => {
        const rect = rects[index];
        if (!canvas || !rect) return;
        const width = Math.max(1, Math.round(rect.width * ratio));
        const height = Math.max(1, Math.round(rect.height * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      });
    };

    const seed = (index, rect) => {
      const count = settingsRef.current.particleCount;
      const state = stateFor(index);
      if (state.particles && state.particles.length === count) return state.particles;
      state.particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 6,
        vy: -4 - Math.random() * 10,
        size: 0.6 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        rate: 1.2 + Math.random() * 2.4
      }));
      return state.particles;
    };

    const drawStars = (index, rect, state, lx, ly, dt, now) => {
      const canvas = starRefs.current[index];
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;
      const ratio = canvas.width / Math.max(1, rect.width);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (state.stars < 0.004) return;
      const s = settingsRef.current;
      const particles = seed(index, rect);
      const reach = s.spotlightRadius * 0.75;
      const [r, g, b] = s.glow;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      for (const particle of particles) {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        if (particle.y < -4) {
          particle.y = rect.height + 4;
          particle.x = Math.random() * rect.width;
        }
        if (particle.x < -4) particle.x = rect.width + 4;
        if (particle.x > rect.width + 4) particle.x = -4;
        const distance = Math.hypot(particle.x - lx, particle.y - ly) / reach;
        if (distance >= 1) continue;
        const falloff = 1 - distance * distance * (3 - 2 * distance);
        const twinkle = 0.55 + 0.45 * Math.sin(now * 0.001 * particle.rate + particle.phase);
        const alpha = state.stars * falloff * twinkle;
        if (alpha < 0.01) continue;
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
    };

    const replay = (card, filter) => {
      if (!motion || !card.getAnimations) return;
      for (const animation of card.getAnimations({ subtree: true })) {
        if (!filter.has(nameOf(animation)) || !finite(animation)) continue;
        const target = animation.effect instanceof KeyframeEffect ? animation.effect.target : null;
        if (target instanceof Element && target.classList.contains('magic-bento__cursor')) continue;
        animation.currentTime = 0;
        animation.play();
      }
    };

    const startWave = (x, y, duration) => {
      if (!motion || !bounds) return;
      wave.x = x;
      wave.y = y;
      wave.t = 0;
      wave.duration = duration;
      wave.reach =
        Math.max(
          Math.hypot(x - bounds.left, y - bounds.top),
          Math.hypot(x - bounds.right, y - bounds.top),
          Math.hypot(x - bounds.left, y - bounds.bottom),
          Math.hypot(x - bounds.right, y - bounds.bottom)
        ) + 140;
    };

    const frame = now => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (dirty) measure();
      const s = settingsRef.current;
      const cards = cardRefs.current;
      let busy = false;

      const margin = s.spotlightRadius * 0.5;
      const near =
        pointer.inside &&
        bounds &&
        pointer.x > bounds.left - margin &&
        pointer.x < bounds.right + margin &&
        pointer.y > bounds.top - margin &&
        pointer.y < bounds.bottom + margin
          ? 1
          : 0;
      if (!light.ready && near) {
        light.x = pointer.x;
        light.y = pointer.y;
        light.ready = true;
      }
      const follow = 1 - Math.exp(-dt / 0.05);
      light.x += (pointer.x - light.x) * follow;
      light.y += (pointer.y - light.y) * follow;
      const fade = 1 - Math.exp(-dt / (near > light.near ? 0.12 : 0.4));
      light.near += (near - light.near) * fade;
      if (Math.abs(near - light.near) < 0.002) light.near = near;
      else busy = true;
      if (Math.abs(pointer.x - light.x) + Math.abs(pointer.y - light.y) > 0.3) busy = true;

      let waveRadius = 0;
      let waveAlpha = 0;
      if (wave.t >= 0) {
        wave.t += dt;
        const progress = Math.min(1, wave.t / wave.duration);
        waveRadius = wave.reach * (1 - Math.pow(1 - progress, 2.2));
        waveAlpha = Math.pow(1 - progress, 1.3);
        if (progress >= 1) {
          wave.t = -1;
          waveAlpha = 0;
        } else busy = true;
      }

      cards.forEach((card, index) => {
        const rect = rects[index];
        if (!card || !rect) return;
        const state = stateFor(index);
        const lx = light.x - rect.left;
        const ly = light.y - rect.top;
        const px = pointer.x - rect.left;
        const py = pointer.y - rect.top;
        const inside = pointer.inside && entered && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;

        if (inside !== state.active) {
          state.active = inside;
          if (inside) {
            card.dataset.active = '';
            if (now - (lastFlow[index] || -1e9) > 3200 && card.querySelector('.magic-bento__steps')) {
              lastFlow[index] = now;
              replay(card, FLOW);
            }
          } else delete card.dataset.active;
        }

        const hotTarget = inside && s.enableSpotlight ? 1 : 0;
        state.hot += (hotTarget - state.hot) * (1 - Math.exp(-dt / (hotTarget > state.hot ? 0.14 : 0.32)));
        if (Math.abs(hotTarget - state.hot) < 0.002) state.hot = hotTarget;
        else busy = true;

        const u = clamp(px / Math.max(1, rect.width), 0, 1) - 0.5;
        const v = clamp(py / Math.max(1, rect.height), 0, 1) - 0.5;
        const tilt = inside && s.enableTilt && motion;
        const magnet = inside && s.enableMagnetism && motion;
        const targets = [
          tilt ? -v * 2 * TILT : 0,
          tilt ? u * 2 * TILT : 0,
          magnet ? u * 2 * MAGNET : 0,
          magnet ? v * 2 * MAGNET : 0
        ];
        const keys = [
          ['rx', 'vrx'],
          ['ry', 'vry'],
          ['tx', 'vtx'],
          ['ty', 'vty']
        ];
        const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
        const h = dt / steps;
        keys.forEach(([key, velocity], k) => {
          for (let step = 0; step < steps; step++) {
            state[velocity] += (170 * (targets[k] - state[key]) - 20 * state[velocity]) * h;
            state[key] += state[velocity] * h;
          }
          if (Math.abs(targets[k] - state[key]) < 0.002 && Math.abs(state[velocity]) < 0.01) {
            state[key] = targets[k];
            state[velocity] = 0;
          } else busy = true;
        });
        const pressTarget = pointer.down === index && s.clickEffect && motion ? 0.985 : 1;
        for (let step = 0; step < steps; step++) {
          state.vpress += (420 * (pressTarget - state.press) - 28 * state.vpress) * h;
          state.press += state.vpress * h;
        }
        if (Math.abs(pressTarget - state.press) < 0.0002 && Math.abs(state.vpress) < 0.001) {
          state.press = pressTarget;
          state.vpress = 0;
        } else busy = true;

        write(card, state, '--mb-x', `${lx.toFixed(1)}px`);
        write(card, state, '--mb-y', `${ly.toFixed(1)}px`);
        write(card, state, '--mb-near', (s.enableBorderGlow ? light.near : 0).toFixed(3));
        write(card, state, '--mb-hot', state.hot.toFixed(3));
        write(card, state, '--mb-rx', `${state.rx.toFixed(3)}deg`);
        write(card, state, '--mb-ry', `${state.ry.toFixed(3)}deg`);
        write(card, state, '--mb-tx', `${state.tx.toFixed(2)}px`);
        write(card, state, '--mb-ty', `${state.ty.toFixed(2)}px`);
        write(card, state, '--mb-press', state.press.toFixed(4));
        write(card, state, '--mb-wx', `${(wave.x - rect.left).toFixed(1)}px`);
        write(card, state, '--mb-wy', `${(wave.y - rect.top).toFixed(1)}px`);
        write(card, state, '--mb-wr', `${waveRadius.toFixed(1)}px`);
        write(card, state, '--mb-wa', waveAlpha.toFixed(3));

        if (s.enableStars && starRefs.current[index]) {
          const starTarget = inside && motion ? 1 : 0;
          state.stars += (starTarget - state.stars) * (1 - Math.exp(-dt / (starTarget ? 0.3 : 0.5)));
          if (state.stars < 0.004 && !starTarget) state.stars = 0;
          if (state.stars > 0 || starTarget) {
            drawStars(index, rect, state, lx, ly, dt, now);
            state.drawn = true;
            busy = true;
          } else if (state.drawn) {
            drawStars(index, rect, state, lx, ly, dt, now);
            state.drawn = false;
          }
        }
      });

      if (busy && visible) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const cardIndex = target => {
      if (!(target instanceof Element)) return -1;
      const card = target.closest('.magic-bento__card');
      return card instanceof HTMLElement ? cardRefs.current.indexOf(card) : -1;
    };

    const onPointerMove = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      wake();
    };

    const onPointerOut = event => {
      if (event.relatedTarget) return;
      pointer.inside = false;
      pointer.down = -1;
      wake();
    };

    const onPointerDown = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      pointer.down = cardIndex(event.target);
      wake();
    };

    const release = () => {
      if (pointer.down < 0) return;
      pointer.down = -1;
      wake();
    };

    const activate = (index, x, y) => {
      const s = settingsRef.current;
      const card = cardRefs.current[index];
      if (!card) return;
      if (s.clickEffect) {
        if (dirty) measure();
        startWave(x, y, 1.1);
        replay(card, REPLAY);
        lastFlow[index] = performance.now();
      }
      wake();
    };

    const onClick = event => {
      const index = cardIndex(event.target);
      const card = cardRefs.current[index];
      if (!card) return;
      if (event.detail === 0) {
        const rect = card.getBoundingClientRect();
        activate(index, rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else activate(index, event.clientX, event.clientY);
    };

    const onKeyDown = event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = cardRefs.current[cardIndex(event.target)];
      if (!card || event.target !== card || card.tagName === 'A') return;
      event.preventDefault();
      card.click();
    };

    const onScroll = () => {
      dirty = true;
      wake();
    };

    const resizeObserver = new ResizeObserver(() => {
      const s = settingsRef.current;
      const width = root.clientWidth;
      const cell = count => (width - s.gap * (count - 1)) / count;
      const next = cell(s.columns) >= MIN_CELL ? s.columns : s.columns >= 2 && cell(2) >= MIN_PAIR ? 2 : 1;
      setCols(next);
      dirty = true;
      wake();
    });
    resizeObserver.observe(root);

    const enter = () => {
      entered = true;
      let order = 0;
      cellRefs.current.forEach(cell => {
        if (!cell) return;
        cell.style.setProperty('--mb-delay', `${order++ * STAGGER}ms`);
        cell.dataset.state = 'in';
      });
      if (dirty) measure();
      introTimer = window.setTimeout(() => {
        if (bounds) startWave(bounds.left, bounds.top, 1.7);
        wake();
      }, 260);
      settleTimer = window.setTimeout(
        () => {
          cellRefs.current.forEach(cell => cell?.style.setProperty('--mb-delay', '0ms'));
        },
        order * STAGGER + 2600
      );
      wake();
    };

    let gate = null;
    if (playIntro && typeof IntersectionObserver !== 'undefined') {
      gate = new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some(entry => entry.isIntersecting)) return;
          observer.disconnect();
          enter();
        },
        { threshold: 0.15 }
      );
      gate.observe(root);
    } else {
      cellRefs.current.forEach(cell => {
        if (!cell) return;
        cell.style.setProperty('--mb-delay', '0ms');
        cell.dataset.state = 'in';
      });
      if (motion) {
        for (const animation of root.getAnimations ? root.getAnimations({ subtree: true }) : []) {
          if (REPLAY.has(nameOf(animation)) && finite(animation)) animation.finish();
        }
      }
    }

    const visibility = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        dirty = true;
        wake();
      }
    });
    visibility.observe(root);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', release, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('pointerout', onPointerOut);
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKeyDown);

    engineRef.current = {
      sync: () => {
        cellRefs.current.forEach(cell => {
          if (!cell || (!entered && playIntro)) return;
          if (cell.dataset.state !== 'in') {
            cell.style.setProperty('--mb-delay', '0ms');
            cell.dataset.state = 'in';
          }
        });
        dirty = true;
        wake();
      }
    };

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      window.clearTimeout(introTimer);
      gate?.disconnect();
      visibility.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('pointerout', onPointerOut);
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeyDown);
      engineRef.current = null;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    engineRef.current?.sync();
  }, [items, cols, rowHeight, gap, radius, enableStars, enableSpotlight, enableBorderGlow]);

  const ink = INK[palette];
  const accent = parseRgb(glowColor) ?? ink;
  const corner = Math.max(0, radius);
  const span = Math.max(1, cols);

  cellRefs.current.length = items.length;
  cardRefs.current.length = items.length;
  starRefs.current.length = items.length;

  return (
    <div
      ref={rootRef}
      className={`magic-bento ${className}`.trim()}
      data-autohide={textAutoHide ? '' : undefined}
      data-motion={disableAnimations ? undefined : ''}
      data-intro={intro && !disableAnimations ? '' : undefined}
      style={{
        ...vars({
          ...THEMES[palette],
          '--mb-glow-rgb': glow.join(', '),
          '--mb-accent-rgb': accent.join(', '),
          '--mb-accent-ink': inkFor(accent),
          '--mb-radius': `${corner}px`,
          '--mb-inner-radius': `${Math.round(clamp(corner * 0.5, 6, 12))}px`,
          '--mb-pad': `${Math.round(clamp(corner * 0.85, 14, 20))}px`,
          '--mb-spot-size': `${Math.max(40, spotlightRadius)}px`,
          '--mb-border-size': `${Math.round(Math.max(40, spotlightRadius) * 0.75)}px`
        }),
        gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))`,
        gridAutoRows: span === 1 ? `minmax(${rowHeight}px, auto)` : `${rowHeight}px`,
        gap: `${Math.max(0, gap)}px`,
        ...style
      }}
    >
      {items.map((item, index) => {
        const entry = item ?? {};
        const Visual = typeof entry.visual === 'string' ? VISUALS[entry.visual] : null;
        const visual = Visual ? <Visual /> : typeof entry.visual === 'string' ? null : entry.visual;
        const clickable = Boolean(entry.href || entry.onClick || onItemClick);
        const handleClick = event => {
          entry.onClick?.(event);
          onItemClick?.(entry, index);
        };
        const cardProps = {
          ref: element => {
            cardRefs.current[index] = element;
          },
          className: 'magic-bento__card',
          'data-clickable': clickable ? '' : undefined,
          'data-image': entry.image ? '' : undefined,
          onClick: clickable ? handleClick : undefined
        };
        const body = (
          <>
            {entry.image && <img className="magic-bento__image" src={entry.image} alt="" draggable={false} />}
            {entry.image && <span className="magic-bento__scrim" />}
            {enableSpotlight && <span className="magic-bento__light" />}
            {enableStars && (
              <canvas
                ref={element => {
                  starRefs.current[index] = element;
                }}
                className="magic-bento__stars"
                aria-hidden="true"
              />
            )}
            <div className="magic-bento__content">
              {entry.content ?? (
                <>
                  {(entry.icon || entry.label) && (
                    <div className="magic-bento__header">
                      {entry.icon && <span className="magic-bento__icon">{entry.icon}</span>}
                      {entry.label && <span className="magic-bento__label">{entry.label}</span>}
                    </div>
                  )}
                  {visual && (
                    <div className="magic-bento__visual" aria-hidden="true">
                      {visual}
                    </div>
                  )}
                  {(entry.title || entry.description) && (
                    <div className="magic-bento__text">
                      {entry.title && <h3 className="magic-bento__title">{entry.title}</h3>}
                      {entry.description && <p className="magic-bento__description">{entry.description}</p>}
                    </div>
                  )}
                </>
              )}
            </div>
            <span className="magic-bento__rim" />
            <span className="magic-bento__border" />
          </>
        );

        return (
          <div
            key={entry.id ?? index}
            ref={element => {
              cellRefs.current[index] = element;
            }}
            className="magic-bento__cell"
            style={{
              gridColumn: `span ${Math.min(span, Math.max(1, Math.round(entry.colSpan ?? 1)))}`,
              gridRow: `span ${Math.max(1, Math.round(entry.rowSpan ?? 1))}`
            }}
          >
            {entry.href ? (
              <a {...cardProps} href={entry.href} target={entry.target} rel={entry.rel}>
                {body}
              </a>
            ) : (
              <div
                {...cardProps}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-label={clickable ? entry.title : undefined}
              >
                {body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MagicBento;
```

### Component CSS
```css
.magic-bento {
  --mb-spring: cubic-bezier(0.34, 1.4, 0.64, 1);
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-auto-flow: row dense;
  width: 100%;
  color: var(--mb-ink);
  font-feature-settings: 'tnum' 0;
  -webkit-tap-highlight-color: transparent;
}

@supports (transition-timing-function: linear(0, 1)) {
  .magic-bento {
    --mb-spring: linear(
      0,
      0.0603,
      0.2033,
      0.3821,
      0.5633,
      0.7258,
      0.8584,
      0.9574,
      1.0242,
      1.0634,
      1.0809,
      1.0828,
      1.0747,
      1.0613,
      1.046,
      1.0313,
      1.0186,
      1.0085,
      1.0012,
      0.9965,
      0.994,
      0.9931,
      0.9933,
      0.9941,
      0.9953,
      0.9966,
      0.9978,
      0.9988,
      1
    );
  }
}

.magic-bento__cell {
  position: relative;
  min-width: 0;
  min-height: 0;
  --mb-delay: 0ms;
}

.magic-bento[data-intro] .magic-bento__cell {
  opacity: 0;
  transform: translate3d(0, 16px, 0) scale(0.97);
}

.magic-bento[data-intro] .magic-bento__cell[data-state='in'] {
  opacity: 1;
  transform: none;
  transition:
    opacity 420ms cubic-bezier(0.22, 1, 0.36, 1) var(--mb-delay),
    transform 760ms var(--mb-spring) var(--mb-delay);
}

.magic-bento__card {
  position: relative;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--mb-radius);
  background: var(--mb-surface);
  box-shadow: var(--mb-shadow);
  color: var(--mb-ink);
  text-decoration: none;
  isolation: isolate;
  outline: none;
  transform: perspective(900px) translate3d(var(--mb-tx, 0px), var(--mb-ty, 0px), 0) rotateX(var(--mb-rx, 0deg))
    rotateY(var(--mb-ry, 0deg)) scale(var(--mb-press, 1));
  user-select: none;
  -webkit-user-select: none;
}

.magic-bento__card[data-clickable] {
  cursor: pointer;
}

.magic-bento__card:focus-visible {
  box-shadow:
    var(--mb-shadow),
    0 0 0 2px var(--mb-focus);
}

.magic-bento__image {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.magic-bento__scrim {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    to top,
    rgba(10, 9, 13, 0.82) 0%,
    rgba(10, 9, 13, 0.7) 14%,
    rgba(10, 9, 13, 0.46) 30%,
    rgba(10, 9, 13, 0.2) 46%,
    rgba(10, 9, 13, 0.05) 60%,
    rgba(10, 9, 13, 0) 72%
  );
  pointer-events: none;
}

.magic-bento__light {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  background: radial-gradient(
    var(--mb-spot-size) circle at var(--mb-x, -999px) var(--mb-y, -999px),
    rgba(var(--mb-glow-rgb), calc(var(--mb-spot-alpha) * var(--mb-hot, 0) * 1)) 0%,
    rgba(var(--mb-glow-rgb), calc(var(--mb-spot-alpha) * var(--mb-hot, 0) * 0.973)) 15%,
    rgba(var(--mb-glow-rgb), calc(var(--mb-spot-alpha) * var(--mb-hot, 0) * 0.837)) 30%,
    rgba(var(--mb-glow-rgb), calc(var(--mb-spot-alpha) * var(--mb-hot, 0) * 0.593)) 45%,
    rgba(var(--mb-glow-rgb), calc(var(--mb-spot-alpha) * var(--mb-hot, 0) * 0.317)) 60%,
    rgba(var(--mb-glow-rgb), calc(var(--mb-spot-alpha) * var(--mb-hot, 0) * 0.104)) 75%,
    rgba(var(--mb-glow-rgb), calc(var(--mb-spot-alpha) * var(--mb-hot, 0) * 0.009)) 90%,
    rgba(var(--mb-glow-rgb), 0) 100%
  );
  pointer-events: none;
}

.magic-bento__stars {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.magic-bento__rim {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--mb-edge),
    inset 0 1px 0 var(--mb-highlight);
  pointer-events: none;
}

.magic-bento__border {
  position: absolute;
  inset: 0;
  z-index: 4;
  box-sizing: border-box;
  padding: 1px;
  border-radius: inherit;
  background:
    radial-gradient(
      var(--mb-border-size) circle at var(--mb-x, -999px) var(--mb-y, -999px),
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-near, 0) * 1)) 0%,
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-near, 0) * 0.973)) 15%,
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-near, 0) * 0.837)) 30%,
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-near, 0) * 0.593)) 45%,
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-near, 0) * 0.317)) 60%,
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-near, 0) * 0.104)) 75%,
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-near, 0) * 0.009)) 90%,
      rgba(var(--mb-glow-rgb), 0) 100%
    ),
    radial-gradient(
      circle at var(--mb-wx, -999px) var(--mb-wy, -999px),
      rgba(var(--mb-glow-rgb), 0) calc(var(--mb-wr, 0px) - 110px),
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-wa, 0) * 0.1)) calc(var(--mb-wr, 0px) - 80px),
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-wa, 0) * 0.32)) calc(var(--mb-wr, 0px) - 52px),
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-wa, 0) * 0.68)) calc(var(--mb-wr, 0px) - 28px),
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-wa, 0) * 0.94)) calc(var(--mb-wr, 0px) - 10px),
      rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-wa, 0))) calc(var(--mb-wr, 0px) - 3px),
      rgba(var(--mb-glow-rgb), 0) var(--mb-wr, 0px)
    );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box exclude,
    linear-gradient(#000 0 0);
  pointer-events: none;
}

.magic-bento__content {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: var(--mb-pad);
}

.magic-bento__header {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  color: var(--mb-muted);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}

.magic-bento__icon {
  display: grid;
  width: 16px;
  height: 16px;
  flex: none;
  place-items: center;
  color: var(--mb-ink);
}

.magic-bento__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.magic-bento__visual {
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  container-type: size;
}

.magic-bento__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
}

.magic-bento__title {
  margin: 0;
  color: var(--mb-ink);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 20px;
}

.magic-bento__description {
  margin: 0;
  color: var(--mb-muted);
  font-size: 13px;
  line-height: 1.45;
}

.magic-bento[data-autohide] .magic-bento__title,
.magic-bento[data-autohide] .magic-bento__description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
}

.magic-bento[data-autohide] .magic-bento__title {
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.magic-bento[data-autohide] .magic-bento__description {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.magic-bento__card[data-image] .magic-bento__header,
.magic-bento__card[data-image] .magic-bento__description {
  color: rgba(244, 244, 245, 0.72);
}

.magic-bento__card[data-image] .magic-bento__title,
.magic-bento__card[data-image] .magic-bento__icon {
  color: #f4f4f5;
}

.magic-bento__well {
  position: relative;
  box-sizing: border-box;
  border-radius: var(--mb-inner-radius);
  background: var(--mb-well);
  box-shadow: inset 0 0 0 1px var(--mb-well-edge);
}

.magic-bento__tile {
  position: relative;
  box-sizing: border-box;
  border-radius: var(--mb-inner-radius);
  background: var(--mb-tile);
  box-shadow: var(--mb-tile-shadow);
}

.magic-bento__tile::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--mb-tile-edge),
    inset 0 1px 0 var(--mb-tile-highlight);
  pointer-events: none;
}

.magic-bento__chart {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  touch-action: pan-y;
}

.magic-bento__figure {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 6px;
  white-space: nowrap;
}

.magic-bento__figure-value {
  color: var(--mb-ink);
  font-size: 15px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 18px;
}

.magic-bento__figure-note {
  min-width: 0;
  overflow: hidden;
  color: var(--mb-muted);
  text-overflow: ellipsis;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  line-height: 14px;
}

.magic-bento__plot {
  position: relative;
  min-height: 0;
  flex: 1;
  margin-top: 6px;
}

.magic-bento__plot svg {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.magic-bento__chart-area {
  fill: rgba(var(--mb-accent-rgb), 0.14);
}

.magic-bento__chart-line {
  fill: none;
  stroke: rgb(var(--mb-accent-rgb));
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.magic-bento__scrub {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: linear-gradient(to bottom, rgba(var(--mb-accent-rgb), 0), rgba(var(--mb-accent-rgb), 0.35));
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease;
}

.magic-bento__scrub-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 7px;
  height: 7px;
  margin: -3.5px 0 0 -3px;
  border-radius: 50%;
  background: rgb(var(--mb-accent-rgb));
  box-shadow: 0 0 0 3px var(--mb-ring);
}

.magic-bento__chart[data-scrub] .magic-bento__scrub {
  opacity: 1;
}

.magic-bento__bars {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
}

.magic-bento__bars-plot {
  display: flex;
  min-height: 0;
  flex: 1;
  align-items: flex-end;
  gap: 5px;
  margin-top: 8px;
}

.magic-bento__bar {
  position: relative;
  height: calc(var(--h) * 100%);
  min-height: 3px;
  flex: 1;
  border-radius: 3px 3px 2px 2px;
  background: rgba(var(--mb-accent-rgb), 0.18);
  transform-origin: 50% 100%;
  transition:
    background-color 200ms ease,
    filter 200ms ease;
}

.magic-bento__bar[data-peak] {
  background: rgb(var(--mb-accent-rgb));
}

@media (hover: hover) {
  .magic-bento__bar:hover {
    background: rgba(var(--mb-accent-rgb), 0.42);
  }

  .magic-bento__bar[data-peak]:hover {
    background: rgb(var(--mb-accent-rgb));
    filter: brightness(1.1);
  }
}

.magic-bento__collab {
  position: relative;
  display: flex;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 16px 22px;
}

.magic-bento__doc-title {
  color: var(--mb-ink);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
}

.magic-bento__lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
}

.magic-bento__line {
  position: relative;
  width: var(--w);
  height: 6px;
  border-radius: 3px;
  background: var(--mb-line);
}

.magic-bento__line--gap {
  margin-top: 8px;
}

.magic-bento__selection {
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: var(--from);
  width: var(--span);
  border-radius: 3px;
  background: rgba(var(--mb-accent-rgb), 0.16);
}

.magic-bento__caret {
  position: absolute;
  top: -5px;
  right: -1px;
  bottom: -5px;
  width: 1.5px;
  border-radius: 1px;
  background: rgb(var(--mb-accent-rgb));
}

.magic-bento__cursor {
  position: absolute;
  top: var(--y);
  left: var(--x);
  z-index: 2;
  display: flex;
  align-items: flex-start;
  pointer-events: none;
}

.magic-bento__cursor svg {
  display: block;
  flex: none;
  filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.35));
}

.magic-bento__cursor-name {
  margin: 13px 0 0 -2px;
  padding: 2px 7px;
  border-radius: 7px;
  font-size: 10.5px;
  font-weight: 600;
  line-height: 14px;
  white-space: nowrap;
}

.magic-bento__cursor--primary svg path {
  fill: rgb(var(--mb-accent-rgb));
  stroke: var(--mb-cursor-stroke);
}

.magic-bento__cursor--primary .magic-bento__cursor-name {
  background: rgb(var(--mb-accent-rgb));
  color: var(--mb-accent-ink);
}

.magic-bento__cursor--secondary svg path {
  fill: var(--mb-secondary);
  stroke: var(--mb-cursor-stroke);
}

.magic-bento__cursor--secondary .magic-bento__cursor-name {
  background: var(--mb-secondary);
  color: var(--mb-secondary-ink);
}

.magic-bento__flow {
  position: relative;
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 8px;
}

.magic-bento__flow-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 8px;
}

.magic-bento__flow-glyph {
  display: grid;
  width: 28px;
  height: 28px;
  flex: none;
  place-items: center;
  border-radius: calc(var(--mb-inner-radius) - 2px);
  background: var(--mb-well);
  color: var(--mb-ink);
}

.magic-bento__flow-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.magic-bento__flow-name {
  overflow: hidden;
  color: var(--mb-ink);
  font-size: 13px;
  font-weight: 600;
  line-height: 17px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.magic-bento__flow-meta {
  overflow: hidden;
  color: var(--mb-muted);
  font-size: 11.5px;
  line-height: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.magic-bento__flow-hash {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
}

.magic-bento__steps {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 2px 0 0;
  list-style: none;
}

.magic-bento__rail {
  position: absolute;
  top: 16px;
  bottom: 16px;
  left: 21px;
  width: 1px;
  background: var(--mb-line);
}

.magic-bento__rail-fill {
  position: absolute;
  inset: 0;
  background: rgba(var(--mb-accent-rgb), 0.55);
  transform-origin: 50% 0;
}

.magic-bento__step {
  position: relative;
  display: flex;
  height: 33px;
  align-items: center;
  gap: 10px;
  padding: 0 12px 0 14px;
  color: var(--mb-ink);
  font-size: 13px;
  line-height: 16px;
}

.magic-bento__status {
  position: relative;
  display: grid;
  width: 16px;
  height: 16px;
  flex: none;
  place-items: center;
}

.magic-bento__status > * {
  grid-area: 1 / 1;
}

.magic-bento__pending {
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 1.5px dashed var(--mb-faint);
  border-radius: 50%;
  opacity: 0;
}

.magic-bento__spinner {
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  border: 1.5px solid rgba(var(--mb-accent-rgb), 0.22);
  border-top-color: rgb(var(--mb-accent-rgb));
  border-radius: 50%;
  opacity: 0;
}

.magic-bento__done {
  display: grid;
  width: 16px;
  height: 16px;
  place-items: center;
  border-radius: 50%;
  background: rgb(var(--mb-accent-rgb));
  color: var(--mb-accent-ink);
}

.magic-bento__step-time {
  margin-left: auto;
  color: var(--mb-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.magic-bento__hub {
  position: relative;
  width: 100%;
  max-width: 240px;
  min-height: 0;
  flex: 1;
  margin: 0 auto;
}

.magic-bento__hub-links {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.magic-bento__hub-links line {
  stroke: var(--mb-line);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.magic-bento__hub-node {
  --size: min(var(--s), 30cqh);
  position: absolute;
  top: var(--y);
  left: var(--x);
  display: grid;
  width: var(--size);
  height: var(--size);
  place-items: center;
  margin: calc(var(--size) * -0.5) 0 0 calc(var(--size) * -0.5);
  color: var(--mb-ink);
}

.magic-bento__hub-node.magic-bento__tile {
  border-radius: calc(var(--size) * 0.3);
}

.magic-bento__packet {
  position: absolute;
  top: var(--y);
  left: var(--x);
  width: 4px;
  height: 4px;
  margin: -2px 0 0 -2px;
  border-radius: 50%;
  background: rgb(var(--mb-accent-rgb));
  opacity: 0;
}

.magic-bento__shield {
  display: flex;
  width: 100%;
  max-width: 320px;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.magic-bento__setting {
  display: flex;
  height: 32px;
  flex: none;
  align-items: center;
  gap: 8px;
  padding: 0 8px 0 10px;
  color: var(--mb-ink);
  font-size: 12.5px;
  font-weight: 500;
  line-height: 16px;
}

.magic-bento__setting-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@container (max-height: 78px) {
  .magic-bento__setting ~ .magic-bento__setting {
    display: none;
  }
}

@container (max-height: 60px) {
  .magic-bento__hub {
    display: none;
  }
}

@container (max-height: 38px) {
  .magic-bento__shield,
  .magic-bento__chart,
  .magic-bento__bars {
    visibility: hidden;
  }
}

.magic-bento__switch {
  position: relative;
  width: 26px;
  height: 16px;
  flex: none;
  margin-left: auto;
  border-radius: 8px;
  background: rgb(var(--mb-accent-rgb));
  transition: background-color 220ms ease;
}

.magic-bento__switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--mb-accent-ink);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transform: translateX(10px);
  transition: transform 320ms var(--mb-spring);
}

.magic-bento__switch[data-off] {
  background: var(--mb-line);
}

.magic-bento__switch[data-off]::after {
  background: var(--mb-ink);
  transform: none;
}

.magic-bento[data-motion] .magic-bento__chart-line {
  stroke-dasharray: 1;
  animation: magic-bento-draw 1100ms cubic-bezier(0.65, 0, 0.35, 1) calc(var(--mb-delay) + 220ms) both paused;
}

.magic-bento[data-motion] .magic-bento__chart-area {
  animation: magic-bento-fade 700ms ease calc(var(--mb-delay) + 700ms) both paused;
}

.magic-bento[data-motion] .magic-bento__bar {
  animation: magic-bento-grow 760ms var(--mb-spring) calc(var(--mb-delay) + 200ms + var(--i) * 55ms) both paused;
}

.magic-bento[data-motion] .magic-bento__cursor {
  animation:
    magic-bento-pop 420ms var(--mb-spring) calc(var(--mb-delay) + 600ms + var(--i) * 160ms) both paused,
    var(--path) 9s ease-in-out calc(var(--i) * -3s) infinite paused;
}

.magic-bento[data-motion] .magic-bento__selection {
  animation: magic-bento-select 900ms cubic-bezier(0.65, 0, 0.35, 1) calc(var(--mb-delay) + 760ms) both paused;
}

.magic-bento[data-motion] .magic-bento__caret {
  animation: magic-bento-blink 1.1s steps(1) infinite paused;
}

.magic-bento[data-motion] .magic-bento__pending {
  animation: magic-bento-wait 1ms linear calc(var(--mb-delay) + 360ms + var(--i) * 520ms) both paused;
}

.magic-bento[data-motion] .magic-bento__spinner {
  animation:
    magic-bento-run 520ms linear calc(var(--mb-delay) + 360ms + var(--i) * 520ms) both paused,
    magic-bento-spin 700ms linear infinite paused;
}

.magic-bento[data-motion] .magic-bento__done {
  animation: magic-bento-check 420ms var(--mb-spring) calc(var(--mb-delay) + 880ms + var(--i) * 520ms) both paused;
}

.magic-bento[data-motion] .magic-bento__step-time {
  animation: magic-bento-fade 300ms ease calc(var(--mb-delay) + 880ms + var(--i) * 520ms) both paused;
}

.magic-bento[data-motion] .magic-bento__rail-fill {
  animation: magic-bento-rail calc(var(--n) * 520ms) linear calc(var(--mb-delay) + 360ms) both paused;
}

.magic-bento[data-motion] .magic-bento__hub-node {
  animation: magic-bento-pop 520ms var(--mb-spring) calc(var(--mb-delay) + 200ms + var(--i) * 70ms) both paused;
}

.magic-bento[data-motion] .magic-bento__hub-links line {
  stroke-dasharray: 1;
  animation: magic-bento-draw 700ms cubic-bezier(0.65, 0, 0.35, 1) calc(var(--mb-delay) + 360ms) both paused;
}

.magic-bento[data-motion] .magic-bento__card[data-active] .magic-bento__packet {
  animation: magic-bento-packet 1.8s cubic-bezier(0.45, 0, 0.55, 1) calc(var(--i) * 0.45s) infinite;
}

.magic-bento[data-motion] .magic-bento__switch {
  animation: magic-bento-switch-track 420ms ease calc(var(--mb-delay) + 520ms + var(--i) * 200ms) both paused;
}

.magic-bento[data-motion] .magic-bento__switch::after {
  animation: magic-bento-switch-knob 520ms var(--mb-spring) calc(var(--mb-delay) + 520ms + var(--i) * 200ms) both paused;
}

.magic-bento[data-motion] .magic-bento__switch[data-off],
.magic-bento[data-motion] .magic-bento__switch[data-off]::after {
  animation: none;
}

.magic-bento[data-motion]
  .magic-bento__cell[data-state='in']
  :is(
    .magic-bento__chart-line,
    .magic-bento__chart-area,
    .magic-bento__bar,
    .magic-bento__selection,
    .magic-bento__pending,
    .magic-bento__spinner,
    .magic-bento__done,
    .magic-bento__step-time,
    .magic-bento__rail-fill,
    .magic-bento__hub-node,
    .magic-bento__hub-links line,
    .magic-bento__switch
  ) {
  animation-play-state: running;
}

.magic-bento[data-motion] .magic-bento__cell[data-state='in'] .magic-bento__switch::after {
  animation-play-state: running;
}

.magic-bento[data-motion] .magic-bento__cell[data-state='in'] .magic-bento__cursor {
  animation-play-state: running, paused;
}

.magic-bento[data-motion] .magic-bento__cell[data-state='in'] .magic-bento__card[data-active] .magic-bento__cursor {
  animation-play-state: running, running;
}

.magic-bento[data-motion] .magic-bento__card[data-active] .magic-bento__caret {
  animation-play-state: running;
}

.magic-bento[data-motion] .magic-bento__cell[data-state='in'] .magic-bento__spinner {
  animation-play-state: running, running;
}

@keyframes magic-bento-draw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes magic-bento-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes magic-bento-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes magic-bento-pop {
  from {
    opacity: 0;
    scale: 0.6;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

@keyframes magic-bento-select {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes magic-bento-blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes magic-bento-wait {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes magic-bento-run {
  0% {
    opacity: 0;
  }
  1%,
  92% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes magic-bento-spin {
  to {
    rotate: 360deg;
  }
}

@keyframes magic-bento-check {
  from {
    opacity: 0;
    scale: 0.4;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

@keyframes magic-bento-rail {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes magic-bento-packet {
  0% {
    top: var(--y);
    left: var(--x);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    top: 50%;
    left: 50%;
    opacity: 0;
  }
}

@keyframes magic-bento-switch-track {
  from {
    background-color: var(--mb-line);
  }
  to {
    background-color: rgb(var(--mb-accent-rgb));
  }
}

@keyframes magic-bento-switch-knob {
  from {
    background: var(--mb-ink);
    transform: none;
  }
  to {
    background: var(--mb-accent-ink);
    transform: translateX(10px);
  }
}

@keyframes magic-bento-path-a {
  0%,
  100% {
    translate: 0 0;
  }
  30% {
    translate: 46px -18px;
  }
  62% {
    translate: 12px 26px;
  }
}

@keyframes magic-bento-path-b {
  0%,
  100% {
    translate: 0 0;
  }
  35% {
    translate: -40px 14px;
  }
  70% {
    translate: -8px -22px;
  }
}
```

---

### Integration Instructions (applies to both components)
1. Install all listed dependencies: `gsap`, `@hugeicons/react`, `@hugeicons/core-free-icons`.
2. Copy each component's source into the appropriate directory in the project (e.g. `AccordionGallery.jsx` / `AccordionGallery.css`, `MagicBento.jsx` / `MagicBento.css`).
3. Import each component's CSS file alongside its component.
4. Import and render each component using the usage examples above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props tables for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if these components aren't the right fit or the project needs more pieces.