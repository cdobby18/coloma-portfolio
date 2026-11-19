import { useState, useEffect, useRef } from "react";
import { Icon, ArrowUpRight, FileDown, CopyIcon, CheckIcon, ClockIcon, PinIcon, SunIcon, MoonIcon, SparkIcon, GitHubIcon, LinkedInIcon, MailIcon, useInView, useManilaTime, Reveal, Section, SectionHead, timeAgo, escapeHtml, TOKEN_RE, highlightLine, runIdeInline, runIdeCode, IdeWindow, BackToTop } from "../components/primitives";
import { NAV_LINKS, SECTION_SPY, SKILL_GROUPS, EXPERIENCE, PROJECTS, CERTIFICATIONS, HOW_I_WORK, IDE_DEFAULT_CODE, IDE_DEFAULT_OUTPUT, EMAIL, EMAIL_RE, GH_START } from "../content";
import { useColors } from "../theme";
import Architecture from "../Architecture";
import { GitHubCard } from "../components/GitHubCard";

export function BrandImg({ project, ...rest }) {
  const src = project.logoWide || project.logo || project.img;
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      {...rest}
      onError={(e) => {
        const el = e.currentTarget;
        if (project.img && el.getAttribute("src") !== project.img) {
          el.src = project.img; // fall back to the original image if the optimized logo is missing
        } else {
          el.style.display = "none";
        }
      }}
    />
  );
}

export function ProjectCard({ project, featured = false, onArchitecture }) {
  const isPrivate = !!project.private;
  const primary = isPrivate ? "#contact" : project.link;
  const hasBrand = !project.noLogo && !!(project.logoWide || project.logo || project.img);
  const shownTags = project.tags.slice(0, 4);
  const extra = project.tags.length - shownTags.length;

  return (
    <article
      className={`proj-card${featured ? " proj-card--featured" : ""}`}
      style={{
        "--proj-accent": project.accent,
        "--proj-accent-soft": project.accentSoft,
        "--proj-plate": project.plate,
        "--proj-plate-glow": project.plateGlow,
      }}
    >
      {featured && hasBrand && (
        <div className="proj-brand-plate">
          <span className="proj-featured-tag">
            <span className="proj-featured-dot" aria-hidden="true" />
            Featured project
          </span>
          <span className="proj-plate-actions">
            <span className="tag proj-status proj-status--plate">{project.status}</span>
            <a
              className="icon-link proj-link proj-link--plate"
              href={primary}
              target={isPrivate ? undefined : "_blank"}
              rel={isPrivate ? undefined : "noopener noreferrer"}
              aria-label={isPrivate ? "Request details" : `View ${project.title} on GitHub`}
              title={isPrivate ? "Request details" : "View on GitHub"}
            >
              <ArrowUpRight size={15} />
            </a>
          </span>
          <BrandImg project={project} alt={`${project.title} logo`} loading="lazy" decoding="async" />
        </div>
      )}

      <div className="proj-card-inner">
        {(!featured || !hasBrand) && (
          <div className="proj-card-top">
            {!featured && hasBrand && (
              <span className="proj-brand">
                <BrandImg project={project} loading="lazy" decoding="async" />
              </span>
            )}

            <span className="tag proj-status">{project.status}</span>

            <a
              className="icon-link proj-link"
              href={primary}
              target={isPrivate ? undefined : "_blank"}
              rel={isPrivate ? undefined : "noopener noreferrer"}
              aria-label={isPrivate ? "Request details" : `View ${project.title} on GitHub`}
              title={isPrivate ? "Request details" : "View on GitHub"}
            >
              <ArrowUpRight size={15} />
            </a>
          </div>
        )}

        <div className="proj-card-title">
          <h3 className="proj-title">{project.title}</h3>
          <div className="proj-meta">
            <span>{project.type}</span>
            <span className="sep">·</span>
            <span>{project.year}</span>
          </div>
        </div>

        <p className="proj-desc">{project.desc}</p>

        <div className="proj-card-foot">
          <div className="proj-tags">
            {shownTags.map((tag) => <span className="proj-tag" key={tag}>{tag}</span>)}
            {extra > 0 && <span className="proj-tag proj-tag--more">+{extra}</span>}
          </div>
          <button className="btn-ghost-sm proj-arch-btn" type="button" onClick={onArchitecture}>
            System architecture
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const [arch, setArch] = useState(null);

  useEffect(() => {
    if (!arch) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setArch(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [arch]);

  const featured = PROJECTS.find((p) => p.featured) || PROJECTS[0];
  const ORDER = ["ReSOLVE", "Sunny", "Resume", "Document"];
  const orderOf = (p) => {
    const i = ORDER.findIndex((k) => p.title.startsWith(k));
    return i === -1 ? ORDER.length : i;
  };
  const rest = PROJECTS.filter((p) => p !== featured).sort((x, y) => orderOf(x) - orderOf(y));

  return (
    <Section id="projects">
      <Reveal>
        <SectionHead
          num="03"
          label="Projects"
          title="Selected work"
          lede="Applied AI systems across computer vision, NLP, and agentic workflows — built to be used, not just demoed."
        />

        <div className="proj-split">
          <div className="proj-col">
            <ProjectCard project={featured} featured onArchitecture={() => setArch(featured)} />
            <div className="proj-grid">
              {rest.map((project) => (
                <ProjectCard key={project.title} project={project} onArchitecture={() => setArch(project)} />
              ))}
            </div>
          </div>

          <aside className="side-col">
            <GitHubCard />
            <div className="gh-how">
              <p className="mono-label">How I work</p>
              <ol className="gh-how-list">
                {HOW_I_WORK.map(([n, title, body]) => (
                  <li key={n}>
                    <span className="gh-how-num">{n}</span>
                    <span className="gh-how-text">
                      <span className="gh-how-title">{title}</span>
                      <span className="gh-how-body">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <IdeWindow />
          </aside>
        </div>
      </Reveal>

      {arch && (
        <div className="modal-backdrop" onClick={() => setArch(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`System architecture for ${arch.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div className="modal-id">
                {!arch.noLogo && (arch.logoWide || arch.logo || arch.img) && (
                  <div className={`modal-logo${arch.logoWide ? " modal-logo--wide" : ""}`} aria-hidden="true">
                    <BrandImg project={arch} />
                  </div>
                )}
                <div>
                  <h3 className="modal-title">System Architecture</h3>
                  <p className="modal-sub">{arch.title}</p>
                </div>
              </div>
              <button className="icon-btn" onClick={() => setArch(null)} aria-label="Close">
                <Icon size={16}><path d="M18 6 6 18M6 6l12 12" /></Icon>
              </button>
            </div>
            <Architecture project={arch.title} />
          </div>
        </div>
      )}
    </Section>
  );
}
