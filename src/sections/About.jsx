import { useState, useEffect, useRef } from "react";
import { Icon, ArrowUpRight, FileDown, CopyIcon, CheckIcon, ClockIcon, PinIcon, SunIcon, MoonIcon, SparkIcon, GitHubIcon, LinkedInIcon, MailIcon, useInView, useManilaTime, Reveal, Section, SectionHead, timeAgo, escapeHtml, TOKEN_RE, highlightLine, runIdeInline, runIdeCode, IdeWindow, BackToTop } from "../components/primitives";
import { NAV_LINKS, SECTION_SPY, SKILL_GROUPS, EXPERIENCE, PROJECTS, CERTIFICATIONS, HOW_I_WORK, IDE_DEFAULT_CODE, IDE_DEFAULT_OUTPUT, EMAIL, EMAIL_RE, GH_START, LOOKING_FOR } from "../content";
import { useColors } from "../theme";

export function AboutSection() {
  const facts = [
    ["Latest role", "Backend AI Engineer Intern · FlyRank AI"],
    ["Focus", "Agentic AI · LLMs · RAG · Evaluation"],
    ["Education", "BS Computer Science · FEU Tech · 2026"],
    ["Upskilling", "Databricks · dbt · Airflow · Snowflake"],
    ["Location", "Manila, Philippines"],
  ];

  return (
    <Section id="about">
      <Reveal>
        <SectionHead num="01" label="About" title="A bit about me" />
        <div className="about-grid">
          <div className="prose">
            <p className="body-lg">
              Hey, I'm CJ — an aspiring AI engineer and computer science graduate student from the
              Philippines. I bridge research-grade machine learning with real-world deployment:
              systems that are reliable, observable, and maintainable beyond the notebook.
            </p>
            <p className="body">
              Most recently I was a Backend AI Engineer Intern at FlyRank AI, working on LLM content
              generation and semantic ranking. Before that I was an AI QA Intern at SoFi AI Tech
              Solutions, building adversarial prompt suites and tracking hallucination rates, and an
              AI Engineer Intern at Lamina Studios, shipping real-time computer vision pipelines.
            </p>
            <p className="body">
              My focus is LLM evaluation, retrieval-augmented generation, and production
              observability. I care about systems that keep working when models don't.
            </p>
            <div className="focus-row">
              {["Agentic AI", "LLMs", "RAG", "Computer Vision", "ML Evaluation"].map((f) => (
                <span className="chip" key={f}>{f}</span>
              ))}
            </div>
          </div>

          <div className="facts-card">
            {facts.map(([label, value]) => (
              <div className="fact-row" key={label}>
                <span className="fact-label">{label}</span>
                <span className="fact-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="looking">
          <div className="looking-head">
            <span className="mono-label">What I'm looking for</span>
            <span className="looking-tag">Open to full-time roles</span>
          </div>
          <p className="looking-lede">
            Teams building with LLMs where I can own a workflow end to end — retrieval,
            evaluation, guardrails, and the human review loop.
          </p>
          <div className="looking-grid">
            {LOOKING_FOR.map(({ label, value }) => (
              <div className="looking-cell" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
