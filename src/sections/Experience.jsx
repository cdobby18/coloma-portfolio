import { useState, useEffect, useRef } from "react";
import { Icon, ArrowUpRight, FileDown, CopyIcon, CheckIcon, ClockIcon, PinIcon, SunIcon, MoonIcon, SparkIcon, GitHubIcon, LinkedInIcon, MailIcon, useInView, useManilaTime, Reveal, Section, SectionHead, timeAgo, escapeHtml, TOKEN_RE, highlightLine, runIdeInline, runIdeCode, IdeWindow, BackToTop } from "../components/primitives";
import { NAV_LINKS, SECTION_SPY, SKILL_GROUPS, EXPERIENCE, PROJECTS, CERTIFICATIONS, HOW_I_WORK, IDE_DEFAULT_CODE, IDE_DEFAULT_OUTPUT, EMAIL, EMAIL_RE, GH_START } from "../content";
import { useColors } from "../theme";

export function ExperienceSection() {
  return (
    <Section id="experience">
      <Reveal>
        <SectionHead
          num="02"
          label="Experience"
          title="Where I've worked"
          lede="Hands-on work building and evaluating AI systems in production-focused environments."
        />
        <div className="exp-list">
          {EXPERIENCE.map((exp) => (
            <article className="exp-item" key={`${exp.company}-${exp.period}`}>
              <div className="exp-meta">
                <span className="exp-period">{exp.period}</span>
                <span className="exp-company">{exp.company}</span>
              </div>
              <div>
                <h3 className="exp-role">{exp.role}</h3>
                <ul className="bullets">
                  {exp.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
