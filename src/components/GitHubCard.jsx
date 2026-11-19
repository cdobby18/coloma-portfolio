import { useEffect, useState } from "react";
import { useColors } from "../theme";
import { GH_START } from "../content";
import { ArrowUpRight, ClockIcon, GitHubIcon, timeAgo } from "./primitives";

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
        if (alive) setData({ lastPush, latestCommit });
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

  return (
    <>
        <div className="gh-card">
          <div className="gh-head">
            <div>
              <span className="mono-label">@cdobby18</span>
              <p className="gh-total">
                {contributions
                  ? `${total.toLocaleString()} contribution${total === 1 ? "" : "s"} since March 2026`
                  : loading ? "Loading contributions…" : "Contribution activity"}
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
                <span>Less</span>
                {palette.map((color) => (
                  <span className="gh-cell" key={color} style={{ background: color }} />
                ))}
                <span>More</span>
              </div>
            </>
          ) : (
            !loading && <p className="muted-note">{error || "Contribution graph unavailable right now."}</p>
          )}

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
              <span><GitHubIcon size={12} /> github.com/cdobby18</span>
            </div>
          </div>
        </div>
    </>
  );
}
