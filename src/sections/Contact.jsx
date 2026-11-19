import { useState, useEffect, useRef } from "react";
import { Icon, ArrowUpRight, FileDown, CopyIcon, CheckIcon, ClockIcon, PinIcon, SunIcon, MoonIcon, SparkIcon, GitHubIcon, LinkedInIcon, MailIcon, useInView, useManilaTime, Reveal, Section, SectionHead, timeAgo, escapeHtml, TOKEN_RE, highlightLine, runIdeInline, runIdeCode, IdeWindow, BackToTop } from "../components/primitives";
import { NAV_LINKS, SECTION_SPY, SKILL_GROUPS, EXPERIENCE, PROJECTS, CERTIFICATIONS, HOW_I_WORK, IDE_DEFAULT_CODE, IDE_DEFAULT_OUTPUT, EMAIL, EMAIL_RE, GH_START } from "../content";
import { useColors } from "../theme";

export function ContactSection() {
  const time = useManilaTime();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", company: "" });
  const [status, setStatus] = useState(null); // "sending" | "sent" | "error" | "fallback"
  const [copied, setCopied] = useState(false);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (status === "error") setStatus(null);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const mailtoFallback = () => {
    const subject = encodeURIComponent(form.subject.trim() || `Portfolio enquiry from ${form.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setStatus("fallback");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !EMAIL_RE.test(form.email.trim()) || !form.message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          company: form.company,
        }),
      });

      if (res.ok) {
        setForm({ name: "", email: "", subject: "", message: "", company: "" });
        setStatus("sent");
        return;
      }

      // 4xx means the submission itself was rejected; anything else
      // (endpoint missing locally, provider down) falls back to email.
      if (res.status >= 400 && res.status < 500 && res.status !== 404) {
        setStatus("failed");
        return;
      }
      mailtoFallback();
    } catch {
      mailtoFallback();
    }
  };

  return (
    <Section id="contact">
      <Reveal>
        <div className="contact-grid">
          <div>
            <SectionHead num="06" label="Contact" title="Let's build something reliable." />
            <div className="contact-list">
              <div className="contact-row">
                <span className="contact-icon"><MailIcon /></span>
                <div>
                  <span className="fact-label">Email</span>
                  <div className="contact-value">
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                    <button className="copy-btn" type="button" onClick={copyEmail}>
                      {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="contact-row">
                <span className="contact-icon"><LinkedInIcon /></span>
                <div>
                  <span className="fact-label">LinkedIn</span>
                  <div className="contact-value">
                    <a href="https://linkedin.com/in/carl-joshua-coloma" target="_blank" rel="noopener noreferrer">
                      in/carl-joshua-coloma
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-row">
                <span className="contact-icon"><GitHubIcon /></span>
                <div>
                  <span className="fact-label">GitHub</span>
                  <div className="contact-value">
                    <a href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer">
                      github.com/cdobby18
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-row">
                <span className="contact-icon"><ClockIcon /></span>
                <div>
                  <span className="fact-label">Local time</span>
                  <div className="contact-value muted">{time ? `${time} PHT` : "—"} · Manila, Philippines</div>
                </div>
              </div>
            </div>

            <a
              className="btn btn-secondary"
              href="/cv-coloma.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Carl-Coloma-Resume.pdf"
              style={{ marginTop: 26 }}
            >
              <FileDown /> Download résumé
            </a>
          </div>

          <form className="form-card" onSubmit={submit} noValidate>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="subject">Subject <span className="optional">(optional)</span></label>
              <input
                id="subject"
                className="input"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="What's this about?"
              />
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                className="input textarea"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell me about the role, project, or idea…"
                rows={6}
              />
            </div>

            <div className="hp-field" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              style={{ width: "100%" }}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Send message"} <ArrowUpRight />
            </button>

            <div aria-live="polite">
              {status === "error" && (
                <p className="form-status error">Please add your name, a valid email, and a message.</p>
              )}
              {status === "sent" && (
                <p className="form-status success">Message sent. Expect a reply within 24 hours.</p>
              )}
              {status === "fallback" && (
                <p className="form-status info">Couldn't reach the server — opening your email app instead.</p>
              )}
              {status === "failed" && (
                <p className="form-status error">
                  That didn't send. Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> directly.
                </p>
              )}
            </div>
            <p className="form-note">Goes straight to my inbox. Replies usually within 24 hours.</p>
          </form>
        </div>
      </Reveal>
    </Section>
  );
}
