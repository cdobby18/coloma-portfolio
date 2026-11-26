import { useState, useEffect, useRef } from "react";
import { Icon, ArrowUpRight, FileDown, CopyIcon, CheckIcon, ClockIcon, PinIcon, SunIcon, MoonIcon, SparkIcon, GitHubIcon, LinkedInIcon, MailIcon, useInView, useManilaTime, Reveal, Section, SectionHead, timeAgo, escapeHtml, TOKEN_RE, highlightLine, runIdeInline, runIdeCode, IdeWindow, BackToTop } from "../components/primitives";
import { NAV_LINKS, SECTION_SPY, SKILL_GROUPS, EXPERIENCE, PROJECTS, CERTIFICATIONS, HOW_I_WORK, IDE_DEFAULT_CODE, IDE_DEFAULT_OUTPUT, EMAIL, EMAIL_RE, GH_START } from "../content";
import { useColors } from "../theme";

const STACK_ICONS = {
  "Programming Languages": <><path d="m8 6-6 6 6 6" /><path d="m16 6 6 6-6 6" /></>,
  "Frameworks & Libraries": <><path d="m12 2 9 5-9 5-9-5 9-5z" /><path d="m3 12 9 5 9-5" /></>,
  "Generative AI & LLMs": <><path d="M12 3l1.9 5.4L19.5 10l-5.6 1.6L12 17l-1.9-5.4L4.5 10l5.6-1.6z" /></>,
  "AI & Developer Tools": <><path d="m4 17 6-6-6-6" /><path d="M12 19h8" /></>,
  "Databases": <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  "Currently Exploring": <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5z" /></>,
};

export function StackSection() {
  return (
    <Section id="stack">
      <Reveal>
        <SectionHead
          num="03"
          label="Stack"
          title="Technical toolkit"
          lede="The tools I reach for when building agentic systems, retrieval pipelines, and reliable backend services."
        />
        <div className="stack-grid">
          {SKILL_GROUPS.map((group) => (
            <section
              className={`stack-group${group.focus ? " stack-group--focus" : ""}`}
              key={group.label}
            >
              <div className="stack-group-head">
                <h3 className="stack-label">
                  <span className="stack-icon" aria-hidden="true">
                    <Icon size={13}>{STACK_ICONS[group.label]}</Icon>
                  </span>
                  {group.label}
                </h3>
                <span className="stack-group-meta">
                  {group.focus && <span className="stack-focus">Core focus</span>}
                  <span className="stack-count">{String(group.skills.length).padStart(2, "0")}</span>
                </span>
              </div>
              <div className="stack-items">
                {group.skills.map((skill) => (
                  <span className="skill" key={skill}>{skill}</span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
