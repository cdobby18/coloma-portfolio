import { useState, useEffect, useRef } from "react";
import { Icon, ArrowUpRight, FileDown, CopyIcon, CheckIcon, ClockIcon, PinIcon, SunIcon, MoonIcon, SparkIcon, GitHubIcon, LinkedInIcon, MailIcon, useInView, useManilaTime, Reveal, Section, SectionHead, timeAgo, escapeHtml, TOKEN_RE, highlightLine, runIdeInline, runIdeCode, IdeWindow, BackToTop } from "../components/primitives";
import { NAV_LINKS, SECTION_SPY, SKILL_GROUPS, EXPERIENCE, PROJECTS, CERTIFICATIONS, HOW_I_WORK, IDE_DEFAULT_CODE, IDE_DEFAULT_OUTPUT, EMAIL, EMAIL_RE, GH_START } from "../content";
import { useColors } from "../theme";

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
          {SKILL_GROUPS.map((group, i) => (
            <section className="stack-group" key={group.label}>
              <div className="stack-group-head">
                <h3 className="stack-label">
                  <span className="stack-num">{String(i + 1).padStart(2, "0")}</span>
                  {group.label}
                </h3>
                <span className="stack-count">{String(group.skills.length).padStart(2, "0")}</span>
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
