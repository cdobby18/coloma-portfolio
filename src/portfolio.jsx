import { useState, useEffect } from "react";
import { buildStyles } from "./styles/portfolioStyles";
import { ThemeCtx, DARK, LIGHT } from "./theme";
import { NAV_LINKS, SECTION_SPY, EMAIL } from "./content";
import {
  Icon, ArrowUpRight, FileDown, SparkIcon, SunIcon, MoonIcon, MonitorIcon,
  GitHubIcon, LinkedInIcon, MailIcon, BackToTop,
} from "./components/primitives";
import { Hero } from "./sections/Hero";
import { ExperienceSection } from "./sections/Experience";
import { ProjectsSection } from "./sections/Projects";
import { StackSection } from "./sections/Stack";
import { CertificationsSection } from "./sections/Certs";
import { ContactSection } from "./sections/Contact";

const THEME_OPTIONS = [
  { value: "system", label: "System theme", icon: <MonitorIcon size={14} /> },
  { value: "light", label: "Light theme", icon: <SunIcon /> },
  { value: "dark", label: "Dark theme", icon: <MoonIcon /> },
];

function ThemeSwitch({ mode, onChange }) {
  return (
    <div className="theme-switch" role="group" aria-label="Theme">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`theme-opt${mode === option.value ? " is-active" : ""}`}
          onClick={() => onChange(option.value)}
          aria-label={option.label}
          aria-pressed={mode === option.value}
          title={option.label}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const stored = localStorage.getItem("op-theme");
      if (stored === "dark" || stored === "light" || stored === "system") return stored;
    } catch { /* ignore */ }
    return "system";
  });
  const [systemDark, setSystemDark] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const isDark = themeMode === "dark" || (themeMode === "system" && systemDark);
  const theme = isDark ? DARK : LIGHT;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => setSystemDark(event.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = "";
      for (const id of SECTION_SPY) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      // The last section can never reach the spy line on short pages.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        current = SECTION_SPY[SECTION_SPY.length - 1];
      }
      // Sections without a nav link (stack, certs) keep the bar neutral.
      setActive(NAV_LINKS.some((link) => link.id === current) ? current : "");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.background = theme.bg;
    document.body.style.background = theme.bg;
    document.body.style.color = theme.textPrimary;
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", theme.bg);
    });
    try { localStorage.setItem("op-theme", themeMode); } catch { /* ignore */ }
  }, [theme, isDark, themeMode]);

  const focusAI = () => {
    setMenuOpen(false);
    const panel = document.getElementById("ask");
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      const input = document.getElementById("portfolio-ai-input");
      if (input) input.focus({ preventScroll: true });
    }, 450);
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        focusAI();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <ThemeCtx.Provider value={theme}>
      <style>{buildStyles(theme)}</style>

      <a className="skip-link" href="#main">Skip to content</a>

      <aside className="rail" aria-label="Site">
        <div className="rail-head">
          <a className="brand" href="#hero">
            <span className="brand-mark">
              <img
                src="/cjlogo.png"
                alt="CJ logo"
                style={{ width: 16, height: 16, objectFit: "contain", display: "block" }}
              />
            </span>
            <span className="brand-text">
              <span className="brand-name">Carl Coloma</span>
              <span className="brand-role">AI &amp; Automation</span>
            </span>
          </a>
        </div>

        <nav className="rail-links" aria-label="Sections">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.id}
              className={`rail-link${active === link.id ? " active" : ""}`}
              href={link.href || `#${link.id}`}
              aria-current={active === link.id ? "true" : undefined}
            >
              <span className="rail-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="rail-text">{link.label}</span>
              <span className="rail-go" aria-hidden="true">
                {link.external ? <ArrowUpRight size={11} /> : "→"}
              </span>
            </a>
          ))}
        </nav>

        <div className="rail-actions">
          <button className="kbd-btn rail-ask" type="button" onClick={focusAI}>
            <SparkIcon size={13} />
            Ask AI
            <span className="kbd">⌘K</span>
          </button>
          <ThemeSwitch mode={themeMode} onChange={setThemeMode} />
        </div>

        <div className="rail-contact">
          <span className="rail-label">Contact</span>
          <p>For work, collabs &amp; everything else, reach me at</p>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </aside>

      <header className="topbar">
        <a className="brand" href="#hero" onClick={closeMenu}>
          <span className="brand-mark">
            <img
              src="/cjlogo.png"
              alt="CJ logo"
              style={{ width: 16, height: 16, objectFit: "contain", display: "block" }}
            />
          </span>
          <span>Carl Coloma</span>
        </a>
        <div className="topbar-actions">
          <ThemeSwitch mode={themeMode} onChange={setThemeMode} />
          <button
            className="icon-btn hamburger"
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen
              ? <Icon size={17}><path d="M18 6 6 18M6 6l12 12" /></Icon>
              : <Icon size={17}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>}
          </button>
        </div>
      </header>

      <div className={`menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link, i) => (
          <a key={link.id} className="menu-link" href={link.href || `#${link.id}`} onClick={closeMenu}>
            <span className="menu-link-main">
              <span className="menu-num">{String(i + 1).padStart(2, "0")}</span>
              {link.label}
            </span>
            {link.external && <ArrowUpRight size={12} />}
          </a>
        ))}
        <div className="menu-foot">
          <button className="kbd-btn" type="button" onClick={focusAI}>
            <SparkIcon size={13} /> Ask AI
          </button>
          <a className="btn btn-secondary" href="/cv-coloma.pdf" target="_blank" rel="noopener noreferrer">
            <FileDown /> Résumé
          </a>
        </div>
        <div className="menu-contact">
          <p>For work, collabs &amp; everything else, reach me at</p>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </div>

      <div className="page">
        <main id="main">
          <Hero />
          <ExperienceSection />
          <ProjectsSection />
          <StackSection />
          <CertificationsSection />
          <ContactSection />
        </main>

        <footer className="footer">
          <div className="shell footer-inner">
            <span>© {new Date().getFullYear()} Carl Joshua Coloma</span>
            <div className="footer-links">
              <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={`mailto:${EMAIL}`}>Email</a>
              <a href="/blog.html">Writing</a>
            </div>
          </div>
        </footer>
      </div>

      <BackToTop />
    </ThemeCtx.Provider>
  );
}
