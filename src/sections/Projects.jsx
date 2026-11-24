import { Fragment, useState } from "react";
import { ArrowUpRight, Reveal, Section, SectionHead } from "../components/primitives";
import { PROJECTS, HOW_I_WORK } from "../content";
import { ARCHITECTURES } from "../Architecture";
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

const PROJECT_TABS = [
  ["overview", "Overview"],
  ["architecture", "Architecture"],
  ["stack", "Stack"],
];

export function ProjectCard({ project, featured = false }) {
  const [tab, setTab] = useState("overview");
  const isPrivate = !!project.private;
  const primary = isPrivate ? "#contact" : project.link;
  const hasBrand = !project.noLogo && !!(project.logoWide || project.logo || project.img);
  const archLayers = (ARCHITECTURES[project.title]?.layers || [])
    .filter((layer) => layer.name === "AI / ML" || layer.name === "Data");

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
          <h3 className="proj-title">
            <a
              className="proj-title-link"
              href={primary}
              target={isPrivate ? undefined : "_blank"}
              rel={isPrivate ? undefined : "noopener noreferrer"}
              title={isPrivate ? "Request details" : `Open ${project.title}`}
            >
              {project.title}
            </a>
          </h3>
          <div className="proj-meta">
            <span>{project.type}</span>
            <span className="sep">·</span>
            <span>{project.year}</span>
          </div>
        </div>

        <div className="proj-tabs" role="group" aria-label={`${project.title}: project details`}>
          {PROJECT_TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`proj-tab${tab === key ? " is-active" : ""}`}
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="proj-pane">
          <div
            className={`proj-pane-panel${tab === "overview" ? " is-active" : ""}`}
            aria-hidden={tab !== "overview"}
          >
            <div className="proj-pane-body">
              <p className="proj-desc">{project.desc}</p>
              <span className="proj-block-label proj-block-label--notes">What makes it work</span>
              <ul className="proj-points">
                {project.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </div>
            <div className="proj-pane-foot">{project.metric}</div>
          </div>

          <div
            className={`proj-pane-panel${tab === "architecture" ? " is-active" : ""}`}
            aria-hidden={tab !== "architecture"}
          >
            <div className="proj-pane-body">
              <span className="proj-block-label">Pipeline</span>
              <div className="proj-flow">
                {project.how.map((step, i) => (
                  <Fragment key={step}>
                    <span className="proj-flow-item">
                      <span className="proj-flow-num">{String(i + 1).padStart(2, "0")}</span>
                      {step}
                    </span>
                    {i < project.how.length - 1 && (
                      <span className="proj-flow-arrow" aria-hidden="true">→</span>
                    )}
                  </Fragment>
                ))}
              </div>
              <span className="proj-block-label proj-block-label--notes">Core layers</span>
              <div className="proj-layers">
                {archLayers.map((layer) => (
                  <div className="proj-layer" key={layer.name}>
                    <span className="proj-layer-name">{layer.name}</span>
                    <p className="proj-layer-body">{layer.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="proj-pane-foot">{project.metric}</div>
          </div>

          <div
            className={`proj-pane-panel${tab === "stack" ? " is-active" : ""}`}
            aria-hidden={tab !== "stack"}
          >
            <div className="proj-pane-body">
              <span className="proj-block-label">Tools &amp; frameworks</span>
              <ul className="proj-stack">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <span className="proj-stack-dot" aria-hidden="true" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="proj-pane-foot">{project.metric}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const featured = PROJECTS.find((p) => p.featured) || PROJECTS[0];
  const ORDER = ["ReSOLVE", "Sunny"];
  const orderOf = (p) => {
    const i = ORDER.findIndex((k) => p.title.startsWith(k));
    return i === -1 ? ORDER.length : i;
  };
  const rest = PROJECTS.filter((p) => p !== featured).sort((x, y) => orderOf(x) - orderOf(y));

  return (
    <Section id="projects">
      <Reveal>
        <SectionHead
          num="02"
          label="Projects"
          title="Selected work"
          lede="Applied AI systems across computer vision, retrieval, and agentic workflows — each with its architecture and stack laid out."
        />

        <ProjectCard project={featured} featured />

        <div className="proj-grid">
          {rest.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        <GitHubCard />

        <div className="gh-how">
          <div className="gh-how-head">
            <p className="mono-label">How I work</p>
            <p className="gh-how-lede">The same loop on every build — from a one-off script to a production service.</p>
          </div>
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
      </Reveal>
    </Section>
  );
}
