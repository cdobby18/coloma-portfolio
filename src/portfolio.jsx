import { useState, useEffect } from "react";
import { buildStyles } from "./styles/portfolioStyles";
import { ThemeCtx, DARK, LIGHT } from "./theme";
import { NAV_LINKS, SECTION_SPY, EMAIL } from "./content";
import {
  Icon, ArrowUpRight, FileDown, SparkIcon, SunIcon, MoonIcon,
  GitHubIcon, LinkedInIcon, MailIcon, BackToTop,
} from "./components/primitives";
import { Hero } from "./sections/Hero";
import { AboutSection } from "./sections/About";
import { ExperienceSection } from "./sections/Experience";
import { ProjectsSection } from "./sections/Projects";
import { StackSection } from "./sections/Stack";
import { CertificationsSection } from "./sections/Certs";
import { ContactSection } from "./sections/Contact";

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem("op-theme");
      if (stored) return stored !== "light";
    } catch { /* ignore */ }
    return typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  });

  const theme = isDark ? DARK : LIGHT;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
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
    try { localStorage.setItem("op-theme", isDark ? "dark" : "light"); } catch { /* ignore */ }
  }, [theme, isDark]);

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

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="shell nav-inner">
          <a className="brand" href="#hero">
            <span className="brand-mark">
              <img
                src="/cjlogo.png"
                alt="CJ logo"
                style={{ width: 16, height: 16, objectFit: "contain", display: "block" }}
              />
            </span>
            <span>Carl Coloma</span>
          </a>

          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                className={`nav-link${active === link.id ? " active" : ""}`}
                href={link.href || `#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
              >
                {link.label}
                {link.external && <ArrowUpRight size={10} />}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button className="kbd-btn" type="button" onClick={focusAI}>
              <SparkIcon size={13} />
              Ask AI
              <span className="kbd">⌘K</span>
            </button>
            <button className="icon-btn" type="button" onClick={() => setIsDark((d) => !d)} aria-label="Toggle theme">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
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
        </div>
      </nav>

      <div className={`menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a key={link.id} className="menu-link" href={link.href || `#${link.id}`} onClick={closeMenu}>
            {link.label}
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
      </div>

      <main id="main">
        <Hero />
        <AboutSection />
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

      <BackToTop />
    </ThemeCtx.Provider>
  );
}
