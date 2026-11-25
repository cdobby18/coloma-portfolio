import { useState, useEffect, useRef } from "react";
import { Icon, ArrowUpRight, FileDown, CopyIcon, CheckIcon, ClockIcon, PinIcon, SunIcon, MoonIcon, SparkIcon, GitHubIcon, LinkedInIcon, MailIcon, useInView, useManilaTime, Reveal, Section, SectionHead, timeAgo, escapeHtml, TOKEN_RE, highlightLine, runIdeInline, runIdeCode, IdeWindow, BackToTop } from "../components/primitives";
import { NAV_LINKS, SECTION_SPY, SKILL_GROUPS, EXPERIENCE, PROJECTS, CERTIFICATIONS, HOW_I_WORK, IDE_DEFAULT_CODE, IDE_DEFAULT_OUTPUT, EMAIL, EMAIL_RE, GH_START } from "../content";
import { useColors } from "../theme";
import RagDemo from "../demo/RagDemo";

export function Hero() {
  const time = useManilaTime();

  return (
    <section id="hero" className="hero">
      <div className="shell">
        <div className="hero-grid">
          <div>
            <span className="status-pill">
              <span className="status-dot" />
              Available for AI engineering roles
            </span>

            <h1 className="hero-title">Carl Joshua{" "}<br />Coloma</h1>

            <p className="hero-role">
              AI &amp; Automation Engineer
              <span className="hero-role-sep">/</span>
              <span className="muted">Manila, Philippines</span>
            </p>

            <p className="hero-edu">BS Computer Science · FEU Tech · 2026</p>

            <div className="hero-bio">
              <p>
                I'm an aspiring AI engineer. I build retrieval and agent systems, and these
                days I'm focused on making LLM output <strong>hold up outside the demo</strong>.
              </p>
              <p>
                Right now I'm shipping small, honest AI systems and writing down what breaks.
                I love turning rough ideas into tools people actually trust.
              </p>
            </div>

            <div className="hero-focus">
              {["Agentic AI", "RAG", "LLM Evaluation", "Computer Vision"].map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">View projects <ArrowUpRight /></a>
              <a
                className="btn btn-secondary"
                href="/cv-coloma.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Carl-Coloma-Resume.pdf"
              >
                <FileDown /> Download résumé
              </a>
            </div>

            <div className="social-row">
              <a className="social" href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer">
                <GitHubIcon /> GitHub
              </a>
              <a className="social" href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer">
                <LinkedInIcon /> LinkedIn
              </a>
              <a className="social" href="mailto:carljoshuamcoloma@gmail.com">
                <MailIcon /> Email
              </a>
            </div>

            <div className="hero-stats">
              {[
                ["03", "Internships"],
                ["03", "Projects shipped"],
                ["01", "Best thesis award"],
              ].map(([n, label]) => (
                <div className="hero-stat" key={label}>
                  <span className="stat-num">{n}</span>
                  <span className="stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-side">
            <div className="portrait">
              <picture>
                <source srcSet="/pic-portrait.webp" type="image/webp" />
                <img
                  src="/pic.jpeg"
                  alt="Carl Joshua Coloma"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </picture>
            </div>
            <div className="portrait-cap">
              <span><PinIcon size={12} /> Manila, PH</span>
              <span>{time ? `${time} PHT` : "—"}</span>
            </div>
          </div>
        </div>

        <div id="ask" className="ask-wrap">
          <RagDemo />
        </div>
      </div>
    </section>
  );
}
