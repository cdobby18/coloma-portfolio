import { useEffect, useState } from "react";
import { useColors } from "../theme";
import { GH_START } from "../content";
import { ArrowUpRight, ClockIcon, GitHubIcon, timeAgo } from "./primitives";

const monthLabel = (iso) =>
  new Date(iso + "T00:00:00").toLocaleString("en-US", { month: "short", year: "numeric" });

export function GitHubCard() {
  const COLORS = useColors();
  const [data, setData] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const user = "cdobby18";
        const [reposRes, eventsRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12`),
          fetch(`https://api.github.com/users/${user}/events/public?per_page=100`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`),
        ]);
        if (!reposRes.ok) throw new Error("repos fetch failed");
        const repos = await reposRes.json();
        const events = eventsRes.ok ? await eventsRes.json() : [];
        if (contribRes.ok) {
          const cj = await contribRes.json();
          if (alive) setContributions(cj);
        }
        const pushedEvents = Array.isArray(events) ? events.filter((e) => e.type === "PushEvent") : [];
        const lastPush = repos.length ? repos[0].pushed_at : null;
        const topRepos = repos
          .filter((r) => !r.fork && r.name !== "coloma-portfolio")
          .slice(0, 3)
          .map((r) => ({
            name: r.name,
            language: r.language,
            stars: r.stargazers_count,
            url: r.html_url,
          }));
        let latestCommit = null;

        // Public events don't always include commit details, so read the latest
        // commit straight from the most recently pushed repository instead.
        if (repos.length) {
          try {
            const latest = repos[0];
            const commitRes = await fetch(
              `https://api.github.com/repos/${latest.full_name}/commits?per_page=1`
            );
            if (commitRes.ok) {
              const commits = await commitRes.json();
              if (Array.isArray(commits) && commits[0]) {
                latestCommit = {
                  sha: commits[0].sha?.slice(0, 7),
                  message: (commits[0].commit?.message || "").split("\n")[0],
                  repo: latest.name,
                  date: commits[0].commit?.committer?.date || latest.pushed_at,
                };
              }
            }
          } catch {
            // Fall back to the events payload below.
          }
        }

        if (!latestCommit && pushedEvents.length) {
          const pe = pushedEvents[0];
          const commits = pe.payload?.commits || [];
          if (commits.length) {
            const last = commits[commits.length - 1];
            latestCommit = {
              sha: last.sha?.slice(0, 7),
              message: last.message,
              repo: pe.repo?.name,
              date: pe.created_at,
            };
          }
        }
        if (alive) setData({ lastPush, latestCommit, repos: topRepos });
      } catch {
        if (alive) setError("Couldn't load GitHub activity right now.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const days = (contributions?.contributions || []).filter((d) => d.date >= GH_START);
  const total = days.reduce((sum, d) => sum + (d.count || 0), 0);
  const activeDays = days.filter((d) => (d.count || 0) > 0).length;
  const bestDay = days.reduce((max, d) => Math.max(max, d.count || 0), 0);

  const weeks = [];
  let current = [];
  if (days.length) {
    const firstDow = new Date(days[0].date + "T00:00:00").getDay();
    for (let i = 0; i < firstDow; i++) current.push(null);
  }
  for (const day of days) {
    current.push(day);
    if (current.length === 7) { weeks.push(current); current = []; }
  }
  if (current.length) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  const palette = COLORS.isDark
    ? ["#1c1c1f", "#4a1a1c", "#7f1d22", "#c2282f", "#e5484d"]
    : ["#ebedf0", "#f6caca", "#ee9a9a", "#e05555", "#b91c1c"];

  const rangeLabel = days.length
    ? `${monthLabel(days[0].date)} – ${monthLabel(days[days.length - 1].date)}`
    : null;

  return (
    <div className="gh-card">
      <div className="gh-main">
        <div className="gh-head">
          <div>
            <span className="mono-label">@cdobby18</span>
            <p className="gh-total">
              {contributions ? (
                <>
                  <strong>{total.toLocaleString()}</strong>
                  <span>contribution{total === 1 ? "" : "s"} since March 2026</span>
                </>
              ) : loading ? "Loading contributions…" : "Contribution activity"}
            </p>
          </div>
          <a className="text-link" href="https://github.com/cdobby18" target="_blank" rel="noopener noreferrer">
            Follow on GitHub <ArrowUpRight size={13} />
          </a>
        </div>

        {weeks.length > 0 ? (
          <>
            <div className="gh-graph">
              {weeks.map((week, wi) => (
                <div className="gh-week" key={wi}>
                  {week.map((day, di) => {
                    if (!day) return <span className="gh-cell" key={di} style={{ background: "transparent" }} />;
                    const level = Math.min(4, Math.max(0, day.level || 0));
                    return (
                      <span
                        className="gh-cell"
                        key={di}
                        title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                        style={{ background: palette[level] }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="gh-legend">
              <span className="gh-range">{rangeLabel}</span>
              <span className="gh-scale">
                <span>Less</span>
                {palette.map((color) => (
                  <span className="gh-cell" key={color} style={{ background: color }} />
                ))}
                <span>More</span>
              </span>
            </div>
            <div className="gh-stats">
              <div className="gh-stat">
                <span className="gh-stat-num">{activeDays}</span>
                <span className="gh-stat-label">active days</span>
              </div>
              <div className="gh-stat">
                <span className="gh-stat-num">{bestDay}</span>
                <span className="gh-stat-label">best day</span>
              </div>
            </div>
          </>
        ) : (
          !loading && <p className="muted-note">{error || "Contribution graph unavailable right now."}</p>
        )}
      </div>

      <div className="gh-side">
        <div className="gh-repos">
          <span className="gh-repos-label">Recent repositories</span>
          {data?.repos?.length ? (
            data.repos.map((repo) => (
              <a className="gh-repo" key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer">
                <span className="gh-repo-name">{repo.name}</span>
                <span className="gh-repo-meta">
                  {repo.language && <span>{repo.language}</span>}
                  {repo.stars > 0 && <span>★ {repo.stars}</span>}
                </span>
                <ArrowUpRight size={12} />
              </a>
            ))
          ) : (
            <p className="muted-note">{loading ? "Loading repositories…" : "Repositories unavailable right now."}</p>
          )}
        </div>

        <div className="gh-foot">
          <div className="commit-card">
            {data?.latestCommit ? (
              <>
                <div className="commit-top">
                  <span className="commit-repo">{data.latestCommit.repo}</span>
                  <span className="commit-sha">{data.latestCommit.sha}</span>
                  {data.latestCommit.date && (
                    <span className="commit-time">{timeAgo(data.latestCommit.date)}</span>
                  )}
                </div>
                <p className="commit-msg">{data.latestCommit.message}</p>
              </>
            ) : (
              <p className="muted-note">{loading ? "Loading latest activity…" : "No recent public commits."}</p>
            )}
          </div>
          <div className="gh-meta">
            <span><ClockIcon size={12} /> Last push {timeAgo(data?.lastPush)}</span>
            <a href="https://github.com/cdobby18?tab=repositories" target="_blank" rel="noopener noreferrer">
              <GitHubIcon size={12} /> All repositories
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
