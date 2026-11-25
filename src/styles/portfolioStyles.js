/* Global styles for the portfolio shell and sections.
   Kept as a template function because every token comes from the
   active theme object. */

import { SANS, DISPLAY, MONO } from "../theme";

export const buildStyles = (theme) => `
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: ${theme.bg};
          --surface: ${theme.surface};
          --surface-2: ${theme.surfaceHigh};
          --border: ${theme.border};
          --border-strong: ${theme.borderStrong};
          --text: ${theme.textPrimary};
          --text-2: ${theme.textSecondary};
          --muted: ${theme.textMuted};
          --accent: ${theme.accent};
          --accent-soft: ${theme.accentSoft};
          --accent-border: ${theme.accentBorder};
          --nav-bg: ${theme.navBg};
          --chip-bg: ${theme.chipBg};
          --chip-border: ${theme.chipBorder};
          --sans: ${SANS};
          --display: ${DISPLAY};
          --mono: ${MONO};
        }

        html { scroll-behavior: smooth; scroll-padding-top: 84px; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          font-kerning: normal;
        }
        #root { width: 100%; max-width: 100%; min-height: 100svh; text-align: left; }
        .skip-link {
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 200;
          padding: 10px 15px;
          border-radius: 8px;
          background: var(--text);
          color: var(--bg);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transform: translateY(-160%);
          transition: transform 0.18s ease;
        }
        .skip-link:focus,
        .skip-link:focus-visible { transform: translateY(0); }
        a { color: inherit; }
        button { font-family: inherit; }
        ::selection { background: var(--accent); color: #fff; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 8px; }
        a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }

        .shell {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding-left: clamp(20px, 5vw, 48px);
          padding-right: clamp(20px, 5vw, 48px);
        }
        .section { padding: clamp(64px, 8vw, 96px) 0; border-top: 1px solid var(--border); }
        .section-head { margin-bottom: clamp(32px, 4vw, 44px); }
        .eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .eyebrow em { color: var(--accent); font-style: normal; }
        .eyebrow::before {
          content: "";
          width: 22px;
          height: 1px;
          background: var(--accent);
          flex-shrink: 0;
        }
        .h2 {
          margin-top: 14px;
          font-family: var(--display);
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.035em;
          color: var(--text);
          text-wrap: balance;
        }
        .lede {
          margin-top: 14px;
          max-width: 620px;
          font-size: 15.5px;
          line-height: 1.75;
          color: var(--text-2);
        }
        .body { font-size: 15.5px; line-height: 1.85; color: var(--text-2); }
        .body-lg { font-size: 17px; line-height: 1.8; color: var(--text-2); }
        .prose > p + p { margin-top: 18px; }
        .muted { color: var(--muted) !important; }
        .muted-note { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .mono-label {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .fact-label {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .dot-sep { color: var(--muted); font-size: 12px; }

        /* fixed left rail + mobile top bar */
        .page { margin-left: 232px; }

        .rail {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          width: 232px;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 24px 20px;
          border-right: 1px solid var(--border);
          background: var(--bg);
        }
        .rail-head { flex-shrink: 0; display: flex; flex-direction: column; gap: 14px; }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text);
          font-family: var(--display);
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }
        .brand-mark {
          width: 26px; height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-strong);
          border-radius: 6px;
          background: var(--surface);
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .brand-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .brand-role {
          font-family: var(--mono);
          font-size: 9.5px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .rail-label {
          font-family: var(--mono);
          font-size: 9.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .rail-links {
          display: flex;
          flex-direction: column;
          margin-top: 24px;
          min-height: 0;
          overflow-y: auto;
        }
        .rail-link {
          position: relative;
          display: grid;
          grid-template-columns: 20px minmax(0, 1fr) 14px;
          align-items: center;
          gap: 8px;
          padding: 11px 0;
          border-bottom: 1px solid var(--border);
          font-size: 13.5px;
          font-weight: 450;
          color: var(--text-2);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .rail-link:first-child { border-top: 1px solid var(--border); }
        .rail-num {
          font-family: var(--mono);
          font-size: 9.5px;
          letter-spacing: 0.06em;
          font-variant-numeric: tabular-nums;
          color: var(--muted);
          transition: color 0.2s ease;
        }
        .rail-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: transform 0.2s ease;
        }
        .rail-link:hover .rail-text { transform: translateX(2px); }
        .rail-go {
          display: inline-flex;
          justify-content: flex-end;
          color: var(--muted);
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s ease, transform 0.2s ease, color 0.2s ease;
        }
        .rail-link:hover { color: var(--text); }
        .rail-link:hover .rail-num { color: var(--accent); }
        .rail-link:hover .rail-go { opacity: 1; transform: none; }
        .rail-link.active { color: var(--text); font-weight: 500; }
        .rail-link.active .rail-num { color: var(--accent); }
        .rail-link.active .rail-go { opacity: 1; transform: none; color: var(--accent); }
        .rail-link.active::before {
          content: "";
          position: absolute;
          left: -20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--accent);
        }

        .rail-actions {
          margin-top: auto;
          padding-top: 18px;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }
        .rail-ask { width: 100%; justify-content: flex-start; }
        .rail-ask .kbd { margin-left: auto; }
        .rail-actions .theme-switch {
          width: 100%;
          padding: 3px;
          border-radius: 8px;
          background: var(--chip-bg);
        }
        .rail-actions .theme-opt {
          flex: 1;
          width: auto;
          height: 26px;
          border-radius: 6px;
        }
        .rail-actions .theme-opt.is-active {
          background: var(--surface);
          color: var(--text);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.10);
        }
        .theme-switch {
          display: inline-flex;
          align-items: center;
          gap: 1px;
          padding: 2px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--surface);
        }
        .theme-opt {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .theme-opt:hover { color: var(--text); }
        .theme-opt.is-active { background: var(--chip-bg); color: var(--text); }
        .theme-opt svg { width: 13px; height: 13px; }

        .rail-contact {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .rail-contact .rail-label { display: block; margin-bottom: 7px; }
        .rail-contact p {
          font-size: 11.5px;
          line-height: 1.6;
          color: var(--muted);
        }
        .rail-contact a {
          display: inline-block;
          margin-top: 5px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text);
          text-decoration: none;
          border-bottom: 1px solid var(--border-strong);
          overflow-wrap: anywhere;
        }
        .rail-contact a:hover { color: var(--accent); border-color: var(--accent); }
        .icon-btn {
          width: 34px; height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 7px;
          background: transparent;
          color: var(--text-2);
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .icon-btn:hover { color: var(--text); border-color: var(--border-strong); background: var(--chip-bg); }
        .kbd-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px 6px 11px;
          border: 1px solid var(--border);
          border-radius: 7px;
          background: var(--surface);
          color: var(--text-2);
          font-size: 12.5px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .kbd-btn:hover { color: var(--text); border-color: var(--border-strong); }
        .kbd {
          font-family: var(--mono);
          font-size: 10px;
          padding: 2px 5px;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--chip-bg);
          color: var(--muted);
        }
        .topbar {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 60px;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 0 clamp(20px, 5vw, 48px);
          background: var(--nav-bg);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .topbar-actions { display: flex; align-items: center; gap: 6px; }
        .hamburger { display: none; }
        .menu {
          display: none;
          position: fixed;
          top: 60px; left: 0; right: 0;
          z-index: 99;
          flex-direction: column;
          padding: 10px clamp(20px, 5vw, 48px) 20px;
          background: ${theme.mobileMenuBg};
          border-bottom: 1px solid var(--border);
          box-shadow: 0 24px 48px rgba(0,0,0,0.18);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        .menu.open { display: flex; }
        .menu-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 13px 2px;
          font-size: 15px;
          color: var(--text-2);
          text-decoration: none;
          border-bottom: 1px solid var(--strip-border, var(--border));
        }
        .menu-link:hover { color: var(--text); }
        .menu-link-main { display: inline-flex; align-items: center; gap: 10px; }
        .menu-num {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          color: var(--muted);
        }
        .menu-foot { display: flex; gap: 8px; padding-top: 16px; flex-wrap: wrap; }
        .menu-contact { margin-top: 16px; }
        .menu-contact p { font-size: 13px; line-height: 1.6; color: var(--muted); }
        .menu-contact a {
          display: inline-block;
          margin-top: 4px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text);
          text-decoration: none;
          border-bottom: 1px solid var(--border-strong);
        }
        .menu-contact a:hover { color: var(--accent); border-color: var(--accent); }

        /* buttons & links */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          border: 1px solid transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.2;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .btn-primary { background: var(--text); color: var(--bg); border-color: var(--text); }
        .btn-primary:hover { opacity: 0.85; }
        .btn-secondary { background: var(--surface); color: var(--text); border-color: var(--border-strong); }
        .btn-secondary:hover { background: var(--surface-2); border-color: var(--text-2); }
        .text-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 500;
          color: var(--accent);
          text-decoration: none;
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
        }
        .text-link:hover { text-decoration: underline; text-underline-offset: 3px; }
        .chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border: 1px solid var(--accent-border);
          border-radius: 999px;
          background: var(--accent-soft);
          font-size: 12px;
          color: var(--accent);
        }

        /* hero */
        .hero {
          padding-top: clamp(30px, 4.5vw, 56px);
          padding-bottom: clamp(44px, 6vw, 72px);
        }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.82fr);
          gap: clamp(32px, 5vw, 64px);
          align-items: start;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px;
          border: 1px solid var(--accent-border);
          border-radius: 999px;
          background: var(--accent-soft);
          color: var(--text-2);
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
          flex-shrink: 0;
        }
        .hero-title {
          margin-top: 20px;
          font-family: var(--display);
          font-size: clamp(42px, 6vw, 68px);
          font-weight: 600;
          line-height: 1.02;
          letter-spacing: -0.045em;
          color: var(--text);
        }
        .hero-role {
          margin-top: 16px;
          font-size: 16px;
          font-weight: 500;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .hero-role-sep { color: var(--border-strong); font-weight: 400; }
        .hero-bio {
          margin-top: 18px;
          max-width: 560px;
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-2);
        }
        .hero-bio p { margin: 0 0 12px; }
        .hero-bio p:last-child { margin-bottom: 0; }
        .hero-bio strong { color: var(--text); font-weight: 600; }
        .hero-edu {
          margin-top: 8px;
          font-family: var(--mono);
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .hero-focus {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0;
          margin-top: 16px;
          font-family: var(--mono);
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .hero-focus span:not(:last-child)::after {
          content: "·";
          margin: 0 8px;
          color: var(--border-strong);
        }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .social-row { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 26px; }
        .social {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: var(--text-2);
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .social:hover { color: var(--accent); }
        .hero-stats {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(28px, 5vw, 56px);
          margin-top: 34px;
          padding-top: 22px;
          border-top: 1px solid var(--border);
        }
        .hero-stat { display: flex; flex-direction: column; gap: 3px; }
        .stat-num {
          font-family: var(--display);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--text);
        }
        .stat-label {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .hero-side { display: flex; flex-direction: column; }
        .portrait {
          position: relative;
          aspect-ratio: 4 / 5;
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          background: var(--surface-2);
          box-shadow: var(--shadow);
        }
        .portrait picture { display: block; width: 100%; height: 100%; }
        .portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 18%;
          display: block;
          filter: saturate(0.95);
        }
        .portrait-cap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .portrait-cap span { display: inline-flex; align-items: center; gap: 5px; }
        .ask-wrap { margin-top: clamp(44px, 6vw, 64px); scroll-margin-top: 88px; }

        /* experience */
        .exp-list { display: flex; flex-direction: column; }
        .exp-item {
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          gap: clamp(20px, 3vw, 36px);
          padding: 28px 0;
          border-top: 1px solid var(--border);
        }
        .exp-item:last-child { border-bottom: 1px solid var(--border); }
        .exp-meta { display: flex; flex-direction: column; gap: 4px; }
        .exp-period {
          font-family: var(--mono);
          font-size: 11.5px;
          letter-spacing: 0.02em;
          color: var(--muted);
        }
        .exp-company { font-size: 13.5px; font-weight: 500; color: var(--text); }
        .exp-role {
          font-family: var(--display);
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--text);
        }
        .bullets {
          list-style: none;
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .bullets li {
          position: relative;
          padding-left: 16px;
          font-size: 14.5px;
          line-height: 1.75;
          color: var(--text-2);
        }
        .bullets li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.72em;
          width: 5px;
          height: 1px;
          background: var(--accent);
        }

        /* projects */
        .proj-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border);
        }
        .proj-row {
          display: grid;
          grid-template-columns: 40px 148px minmax(0, 1fr);
          gap: 18px;
          padding: 18px 12px;
          margin: 0 -12px;
          border-bottom: 1px solid var(--border);
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        .proj-row:hover { background: var(--surface); }
        .proj-index {
          padding-top: 4px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--muted);
        }
        .proj-thumb {
          aspect-ratio: 16 / 10;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          background: var(--surface-2);
        }
        .proj-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .proj-main { min-width: 0; }
        .proj-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .proj-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          min-width: 0;
        }
        .proj-title {
          font-family: var(--display);
          font-size: 16.5px;
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: -0.02em;
          color: var(--text);
        }
        .proj-desc {
          margin-top: 4px;
          max-width: 780px;
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--text-2);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .proj-sub {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 7px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.02em;
          color: var(--muted);
        }
        .proj-sub .sep { opacity: 0.5; }
        .tag {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border: 1px solid var(--chip-border);
          border-radius: 5px;
          background: var(--chip-bg);
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-2);
        }
        .proj-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }


        /* projects */
        .tag-accent { border-color: var(--accent-border); background: var(--accent-soft); color: var(--accent); }
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
          gap: 20px;
        }
        .proj-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--surface);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .proj-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-strong);
          box-shadow: 0 14px 30px -24px rgba(0, 0, 0, 0.45);
        }
        .proj-card--featured {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          margin-bottom: 20px;
        }
        .proj-card--featured .proj-brand-plate {
          min-height: 100%;
          padding: 40px 32px;
          border-right: 1px solid rgba(9, 9, 11, 0.07);
          border-bottom: 0;
        }
        .proj-card--featured .proj-brand-plate img { max-width: min(100%, 340px); max-height: 170px; }
        .proj-card--featured .proj-card-inner { padding: 26px; }
        .proj-card-inner { display: flex; flex: 1; flex-direction: column; gap: 12px; padding: 20px; }
        .proj-brand-plate {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 34px 26px 22px;
          border-bottom: 1px solid rgba(9, 9, 11, 0.07);
          background: var(--proj-plate, var(--surface-2));
        }
        .proj-brand-plate img {
          display: block;
          width: auto;
          height: auto;
          max-width: min(100%, 320px);
          max-height: 120px;
          filter: drop-shadow(0 14px 26px rgba(74, 34, 24, 0.18));
        }
        .proj-featured-tag {
          position: absolute;
          top: 12px;
          left: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 9px;
          border: 1px solid rgba(9, 9, 11, 0.08);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(6px);
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6d4a43;
        }
        .proj-featured-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
        .proj-plate-actions {
          position: absolute;
          top: 12px;
          right: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .proj-status--plate,
        .proj-link--plate {
          border-color: rgba(9, 9, 11, 0.09);
          background: rgba(255, 255, 255, 0.74);
          backdrop-filter: blur(6px);
          color: #6d4a43;
        }
        .proj-link--plate:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: #ffffff;
        }
        .proj-card-top { display: flex; align-items: center; gap: 8px; }
        .proj-brand {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 11px;
          background: var(--surface-2);
          box-shadow: 0 8px 18px -12px rgba(0, 0, 0, 0.4);
        }
        .proj-brand img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .proj-card:hover .proj-brand img { transform: scale(1.06); }
        .proj-card-title { min-width: 0; }
        .proj-card .proj-title { font-size: 16px; line-height: 1.34; }
        .proj-title-link { color: inherit; text-decoration: none; transition: color 0.18s ease; }
        .proj-title-link:hover { color: var(--accent); }
        .proj-card--featured .proj-title { font-size: 19px; line-height: 1.3; }
        .proj-status {
          flex-shrink: 0;
          margin-left: auto;
        }
        .proj-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 6px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .proj-meta .sep { opacity: 0.45; }
        .proj-link { flex-shrink: 0; }
        .proj-tabs {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          width: 100%;
          border-bottom: 1px solid var(--border);
        }
        .proj-tab {
          position: relative;
          padding: 8px 4px 9px;
          border: 0;
          background: transparent;
          color: var(--muted);
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          text-align: center;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.18s ease;
        }
        .proj-tab:hover { color: var(--text); }
        .proj-tab.is-active { color: var(--text); }
        .proj-tab.is-active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: var(--accent);
        }
        .proj-pane { display: block; padding-top: 14px; }
        .proj-pane-panel {
          min-width: 0;
          display: none;
          flex-direction: column;
        }
        .proj-pane-panel.is-active { display: flex; }
        .proj-pane-body { flex: 1; min-width: 0; }
        .proj-pane-foot {
          margin-top: 14px;
          padding-top: 9px;
          border-top: 1px solid var(--border);
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.04em;
          line-height: 1.4;
          color: var(--muted);
        }
        .proj-block-label {
          display: block;
          margin-bottom: 7px;
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .proj-block-label--notes { margin-top: 12px; }
        .proj-flow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 5px;
        }
        .proj-flow-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border: 1px solid var(--border);
          border-radius: 7px;
          background: var(--bg);
          font-size: 11px;
          line-height: 1.3;
          white-space: nowrap;
          color: var(--text-2);
        }
        .proj-flow-num {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--accent);
        }
        .proj-flow-arrow {
          font-size: 12px;
          line-height: 1;
          color: var(--accent);
          opacity: 0.65;
        }
        .proj-layers {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .proj-layer {
          padding: 9px 11px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
        }
        .proj-layer-name {
          display: block;
          margin-bottom: 3px;
          font-family: var(--mono);
          font-size: 9.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .proj-layer-body { font-size: 11.5px; line-height: 1.5; color: var(--text-2); }
        .proj-points { list-style: none; display: flex; flex-direction: column; gap: 5px; }
        .proj-points li { position: relative; padding-left: 14px; font-size: 12px; line-height: 1.5; color: var(--text-2); }
        .proj-stack {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
        }
        .proj-stack li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text-2);
        }
        .proj-stack-dot {
          width: 5px;
          height: 5px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--accent);
        }
        .proj-points li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
        }
        .proj-card .proj-desc {
          margin: 0;
          max-width: none;
          display: block;
          overflow: visible;
          -webkit-line-clamp: unset;
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--text-2);
        }
        .icon-link {
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-strong);
          border-radius: 8px;
          color: var(--text-2);
          text-decoration: none;
          transition: all 0.18s ease;
        }
        .icon-link:hover { color: var(--accent); border-color: var(--accent); background: var(--accent-soft); }

        /* how i work — horizontal band */
        .gh-how {
          margin-top: 20px;
          padding: 22px 24px 24px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--surface);
        }
        .gh-how-head { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
        .gh-how-lede { max-width: 64ch; font-size: 13px; line-height: 1.6; color: var(--muted); }
        .gh-how-list {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          margin-top: 26px;
        }
        .gh-how-list li {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding-top: 18px;
          border-top: 1px solid var(--border);
        }
        .gh-how-num {
          position: absolute;
          top: -11px;
          left: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface);
          font-family: var(--mono);
          font-size: 11px;
          color: var(--muted);
        }
        .gh-how-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .gh-how-title { font-size: 13.5px; font-weight: 600; line-height: 1.35; color: var(--text); }
        .gh-how-body { font-size: 12.5px; line-height: 1.55; color: var(--muted); }

        .ide-card {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 11px;
          background: #1e1e1e;
          box-shadow: 0 18px 36px -26px rgba(0, 0, 0, 0.55);
          font-family: var(--mono);
        }
        .ide-bar { display: flex; align-items: center; gap: 8px; padding: 8px 11px; background: #181818; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .ide-dots { display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; }
        .ide-dots i { width: 8px; height: 8px; border-radius: 50%; background: #4a4a4a; }
        .ide-dots i:nth-child(1) { background: #ff5f57; }
        .ide-dots i:nth-child(2) { background: #febc2e; }
        .ide-dots i:nth-child(3) { background: #28c840; }
        .ide-title { flex: 1; min-width: 0; overflow: hidden; text-align: center; text-overflow: ellipsis; white-space: nowrap; font-size: 10px; letter-spacing: 0.04em; color: #8b8b8b; }
        .ide-actions { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .ide-act {
          padding: 2px 7px;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 4px;
          background: transparent;
          color: #cbd5e1;
          font-family: var(--mono);
          font-size: 9.5px;
          line-height: 1.5;
          cursor: pointer;
          transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .ide-act:hover:not(:disabled) { color: #fff; border-color: rgba(229,72,77,0.65); }
        .ide-act:disabled { opacity: 0.55; cursor: not-allowed; }
        .ide-act--run { border-color: #e5484d; background: #e5484d; color: #fff; font-weight: 600; }
        .ide-act--run:hover:not(:disabled) { background: #f05256; }
        .ide-tabs { display: flex; align-items: stretch; background: #252526; border-bottom: 1px solid #2d2d2d; overflow: hidden; }
        .ide-tab { display: inline-flex; align-items: center; gap: 6px; padding: 7px 11px; border-right: 1px solid #2d2d2d; font-size: 11px; color: #8b8b8b; white-space: nowrap; }
        .ide-tab--active { background: #1e1e1e; color: #d4d4d4; box-shadow: inset 0 2px 0 #e5484d; }
        .ide-edited { font-size: 7px; color: #e5484d; }
        .ide-file { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 3px; background: rgba(229,72,77,0.16); font-size: 7.5px; font-weight: 600; color: #e5484d; }
        .ide-code { padding: 10px 0 11px; font-size: 12px; line-height: 1.8; color: #d4d4d4; overflow-x: auto; }
        .ide-line { display: flex; gap: 10px; padding: 0 12px; white-space: pre; }
        .ide-ln { width: 14px; flex-shrink: 0; text-align: right; font-size: 10.5px; color: #5a5a5a; user-select: none; }
        .ide-src { display: block; }
        .ide-editor {
          display: block;
          width: 100%;
          min-height: 100px;
          margin: 0;
          padding: 10px 12px;
          border: 0;
          outline: 0;
          resize: vertical;
          background: #1e1e1e;
          color: #d4d4d4;
          caret-color: #e5484d;
          font-family: var(--mono);
          font-size: 12px;
          line-height: 1.8;
        }
        .tk-c { color: #6a9955; }
        .tk-k { color: #569cd6; }
        .tk-v { color: #9cdcfe; }
        .tk-f { color: #dcdcaa; }
        .tk-s { color: #ce9178; }
        .ide-term { display: flex; align-items: center; gap: 6px; padding: 7px 12px; border-top: 1px solid rgba(255,255,255,0.07); background: #181818; font-size: 10.5px; color: #d4d4d4; white-space: nowrap; overflow: hidden; }
        .ide-prompt { color: #e5484d; font-weight: 600; }
        .ide-caret { width: 5px; height: 11px; flex-shrink: 0; background: #d4d4d4; animation: ide-blink 1.1s steps(1) infinite; }
        @keyframes ide-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .ide-output {
          max-height: 86px;
          overflow-y: auto;
          padding: 6px 12px 8px;
          border-top: 1px solid rgba(255,255,255,0.04);
          background: #181818;
          font-size: 11px;
          line-height: 1.65;
          color: #89d185;
        }
        .ide-output--err { color: #f48771; }
        .ide-output--muted { color: #8b8b8b; }
        .ide-out-line { white-space: pre-wrap; overflow-wrap: anywhere; }

        /* hero logo portrait */
        .portrait--logo { aspect-ratio: 1 / 1; background: #fbfaf4; }
        .portrait--logo img { object-position: center; filter: none; transform: scale(1.28); transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .portrait--logo:hover img { transform: scale(1.32); }

        /* stack */
        .stack-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .stack-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--surface);
          transition: border-color 0.2s ease;
        }
        .stack-group:hover { border-color: var(--border-strong); }
        .stack-group-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .stack-label {
          display: flex;
          align-items: center;
          gap: 9px;
          font-family: var(--display);
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--text);
        }
        .stack-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface-2);
          font-family: var(--mono);
          font-size: 9.5px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: var(--accent);
        }
        .stack-count {
          flex-shrink: 0;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: var(--muted);
        }
        .stack-items { display: flex; flex-wrap: wrap; gap: 7px; }
        .skill {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border: 1px solid var(--chip-border);
          border-radius: 7px;
          background: var(--chip-bg);
          font-size: 12.5px;
          line-height: 1.2;
          color: var(--text-2);
          cursor: default;
          transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .skill:hover, .skill:focus-visible {
          color: var(--text);
          border-color: var(--accent-border);
          background: var(--accent-soft);
        }

        /* certifications */
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }
        .cert-card {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          overflow: hidden;
          text-decoration: none;
          transition: border-color 0.2s ease, transform 0.25s ease;
        }
        .cert-card:hover { border-color: var(--border-strong); transform: translateY(-2px); }
        .cert-img {
          height: 108px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
        }
        .cert-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .cert-body { display: flex; flex-direction: column; gap: 4px; flex: 1; padding: 14px 16px 16px; }
        .cert-name { font-family: var(--display); font-size: 15px; font-weight: 600; line-height: 1.35; color: var(--text); }
        .cert-issuer { font-size: 12.5px; color: var(--text-2); }
        .cert-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 12px;
        }

        /* github */
        .gh-card {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
          gap: 24px;
          margin-top: 24px;
          margin-bottom: 20px;
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--surface);
        }
        .gh-main { min-width: 0; container-type: inline-size; }
        .gh-side {
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-width: 0;
          padding-left: 24px;
          border-left: 1px solid var(--border);
        }
        .gh-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .gh-total {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
          font-size: 12.5px;
          color: var(--muted);
        }
        .gh-total strong {
          font-family: var(--display);
          font-size: 26px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--text);
        }
        .gh-graph { display: flex; gap: 2px; overflow-x: auto; padding-bottom: 6px; }
        .gh-week { display: flex; flex-direction: column; gap: 2px; }
        .gh-cell { width: 6px; height: 6px; border-radius: 2px; flex-shrink: 0; display: inline-block; }
        @container (min-width: 350px) { .gh-cell { width: 7px; height: 7px; } }
        @container (min-width: 400px) { .gh-cell { width: 8px; height: 8px; } }
        @container (min-width: 480px) {
          .gh-cell { width: 9px; height: 9px; }
          .gh-graph,
          .gh-week { gap: 3px; }
        }
        @container (min-width: 545px) { .gh-cell { width: 11px; height: 11px; } }
        .gh-legend {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 10px;
          font-family: var(--mono);
          font-size: 10.5px;
          color: var(--muted);
        }
        .gh-scale { display: inline-flex; align-items: center; gap: 4px; }
        .gh-scale span:first-child { margin-right: 3px; }
        .gh-scale span:last-child { margin-left: 3px; }
        .gh-stats {
          display: flex;
          gap: 24px;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .gh-stat { display: flex; flex-direction: column; gap: 2px; }
        .gh-stat-num { font-family: var(--display); font-size: 16px; font-weight: 600; line-height: 1; color: var(--text); }
        .gh-stat-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
        .gh-repos {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .gh-side .gh-repos { margin-top: 0; padding-top: 0; border-top: 0; }
        .gh-repos-label {
          margin-bottom: 4px;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .gh-repo {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 0;
          border-bottom: 1px solid var(--border);
          text-decoration: none;
          color: var(--text);
        }
        .gh-repo:last-child { border-bottom: 0; padding-bottom: 0; }
        .gh-repo-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: var(--mono);
          font-size: 12px;
          transition: color 0.18s ease;
        }
        .gh-repo-meta { display: inline-flex; gap: 8px; font-family: var(--mono); font-size: 10.5px; color: var(--muted); }
        .gh-repo svg { flex-shrink: 0; color: var(--muted); transition: color 0.18s ease, transform 0.18s ease; }
        .gh-repo:hover .gh-repo-name,
        .gh-repo:hover svg { color: var(--accent); }
        .gh-repo:hover svg { transform: translate(1px, -1px); }
        .gh-foot {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }
        .commit-card {
          border: 1px solid var(--border);
          border-radius: 9px;
          background: var(--bg);
          padding: 10px 12px;
          min-width: 0;
        }
        .commit-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
        .commit-repo { font-family: var(--mono); font-size: 11px; font-weight: 600; color: var(--accent); }
        .commit-sha { font-family: var(--mono); font-size: 11px; color: var(--muted); }
        .commit-time { margin-left: auto; font-family: var(--mono); font-size: 11px; color: var(--muted); }
        .commit-msg {
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .gh-meta {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 6px 16px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--muted);
          white-space: nowrap;
        }
        .gh-meta span,
        .gh-meta a { display: inline-flex; align-items: center; gap: 6px; }
        .gh-meta a { color: inherit; text-decoration: none; transition: color 0.18s ease; }
        .gh-meta a:hover { color: var(--accent); }

        /* contact */
        .contact-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: clamp(32px, 5vw, 56px);
          align-items: start;
        }
        .contact-list { display: flex; flex-direction: column; gap: 4px; margin-top: 28px; }
        .contact-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .contact-row:first-child { border-top: 1px solid var(--border); }
        .contact-icon {
          width: 30px; height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 7px;
          color: var(--text-2);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .contact-value {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 3px;
          font-size: 13.5px;
          color: var(--text);
        }
        .contact-value a { text-decoration: none; }
        .contact-value a:hover { color: var(--accent); }
        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border: 1px solid var(--chip-border);
          border-radius: 5px;
          background: var(--chip-bg);
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .copy-btn:hover { color: var(--text); border-color: var(--border-strong); }
        .form-card {
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--surface);
          padding: clamp(18px, 3vw, 26px);
        }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .field label {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .optional { text-transform: none; letter-spacing: 0.02em; opacity: 0.7; }
        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          font-size: 14px;
          line-height: 1.5;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .input::placeholder { color: var(--muted); }
        .input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .textarea { resize: vertical; min-height: 130px; }
        .hp-field {
          position: absolute;
          width: 1px; height: 1px;
          margin: -1px; padding: 0;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .form-note { margin-top: 10px; font-size: 11.5px; color: var(--muted); text-align: center; }
        .form-status { margin-top: 10px; font-size: 12.5px; line-height: 1.5; }
        .form-status.error { color: var(--accent); }
        .form-status.success { color: #2e9e5b; }
        .form-status.info { color: var(--muted); }

        /* footer */
        .footer { border-top: 1px solid var(--border); padding: 28px 0; }
        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 12.5px;
          color: var(--muted);
        }
        .footer-links { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .footer-links a { color: var(--muted); text-decoration: none; transition: color 0.18s ease; }
        .footer-links a:hover { color: var(--text); }
        .to-top {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 90;
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 9px;
          background: var(--nav-bg);
          color: var(--text-2);
          cursor: pointer;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: var(--shadow);
          transition: all 0.18s ease;
        }
        .to-top:hover { color: var(--text); border-color: var(--border-strong); transform: translateY(-2px); }

        @media (max-width: 960px) {
          .rail { display: none; }
          .page { margin-left: 0; padding-top: 60px; }
          .topbar { display: flex; }
          .hamburger { display: inline-flex; }
        }
        @media (min-width: 961px) {
          .menu { display: none !important; }
        }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
          .hero-side { order: -1; max-width: 300px; width: 100%; }
        }
        @media (max-width: 820px) {
          .contact-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
          .gh-foot { grid-template-columns: minmax(0, 1fr); }
          .gh-meta { flex-direction: row; flex-wrap: wrap; gap: 14px; }
        }
        @media (max-width: 760px) {
          .exp-item { grid-template-columns: minmax(0, 1fr); gap: 10px; padding: 24px 0; }
          .exp-meta { flex-direction: row; align-items: center; gap: 10px; flex-wrap: wrap; }
          .proj-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 0;
            padding: 16px 0;
            margin: 0;
            border-radius: 0;
          }
          .proj-index { display: none; }
          .proj-thumb { width: 100%; max-width: 360px; margin-bottom: 12px; }
          .proj-head { gap: 10px; }
          .proj-actions { justify-content: flex-start; width: 100%; margin-top: 4px; }
          .stack-row { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 14px 0; }
        }
        @media (max-width: 520px) {
          .form-row { grid-template-columns: minmax(0, 1fr); }
          .hero-stats { gap: 24px; }
          .portrait-cap { font-size: 10.5px; }
          .hero-role { flex-direction: column; align-items: flex-start; gap: 2px; }
          .hero-role-sep { display: none; }
        }
        @media (max-width: 1240px) {
          .gh-how-list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 900px) {
          .proj-card--featured { grid-template-columns: minmax(0, 1fr); }
          .proj-card--featured .proj-brand-plate {
            min-height: 0;
            border-right: 0;
            border-bottom: 1px solid rgba(9, 9, 11, 0.07);
          }
          .gh-card { grid-template-columns: minmax(0, 1fr); gap: 18px; }
          .gh-side { padding-left: 0; border-left: 0; }
          .gh-side .gh-repos { padding-top: 14px; border-top: 1px solid var(--border); }
          .gh-how-list { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 18px; }
        }
        @media (max-width: 720px) {
          .proj-grid { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 640px) {
          .proj-brand-plate { padding: 40px 22px 24px; }
          .proj-brand-plate img { max-height: 100px; }
          .proj-card--featured .proj-card-inner { padding: 20px; }
        }
        @media (max-width: 430px) {
          .proj-card-inner { padding: 18px; }
          .proj-layers,
          .proj-stack { grid-template-columns: minmax(0, 1fr); }
          .proj-plate-actions .proj-status { display: none; }
          .proj-featured-tag { font-size: 9px; letter-spacing: 0.08em; }
        }
        @media (max-width: 560px) {
          .gh-how-list { grid-template-columns: minmax(0, 1fr); }
          .gh-how { padding: 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          html { scroll-behavior: auto; }
        }
      `;
