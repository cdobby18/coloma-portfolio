import { useState, useEffect, useRef } from "react";
import { Icon, ArrowUpRight, FileDown, CopyIcon, CheckIcon, ClockIcon, PinIcon, SunIcon, MoonIcon, SparkIcon, GitHubIcon, LinkedInIcon, MailIcon, useInView, useManilaTime, Reveal, Section, SectionHead, timeAgo, escapeHtml, TOKEN_RE, highlightLine, runIdeInline, runIdeCode, IdeWindow, BackToTop } from "../components/primitives";
import { NAV_LINKS, SECTION_SPY, SKILL_GROUPS, EXPERIENCE, PROJECTS, CERTIFICATIONS, HOW_I_WORK, IDE_DEFAULT_CODE, IDE_DEFAULT_OUTPUT, EMAIL, EMAIL_RE, GH_START } from "../content";
import { useColors } from "../theme";

export function CertificationsSection() {
  return (
    <Section id="certs">
      <Reveal>
        <SectionHead
          num="05"
          label="Certifications"
          title="Verified credentials"
          lede="Completed and verifiable certificates from Anthropic, Cisco, IBM, Certiport, and Udemy."
        />
        <div className="cert-grid">
          {CERTIFICATIONS.map((cert) => (
            <a
              className="cert-card"
              key={cert.name}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="cert-img">
                <img
                  src={cert.image}
                  alt={cert.name}
                  loading="lazy"
                  draggable={false}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <div className="cert-body">
                <span className="cert-name">{cert.name}</span>
                <span className="cert-issuer">{cert.issuer}</span>
                <span className="cert-foot">
                  <span className="mono-label">{cert.date}</span>
                  <span className="text-link">Verify <ArrowUpRight size={12} /></span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
