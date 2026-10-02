import { useEffect, useRef, useState } from "react";
import {
  catalog,
  fresh,
  fixture,
  judgments,
  quality,
  rank,
  read,
  reasons,
  score,
  validPreferences,
  write,
  type Course,
  type Preferences,
  type State,
} from "./domain";
import { Dialog } from "./Dialog";
type Preview = {
  title: string;
  next: State;
  before: string;
  raw: string | null;
  unavailable: boolean;
  reset: boolean;
  refresh: boolean;
  scope: string;
};
const goalName = {
  data: "Make sense of data",
  story: "Communicate a finding",
  discovery: "Explore a new approach",
};
const label = (s: State) =>
  s.ready
    ? `${goalName[s.preferences.goal]} · ${s.preferences.maxMinutes} min maximum · ${s.preferences.maxLevel === 1 ? "Foundational only" : "Up to applied"} · ${s.preferences.completed.length} completed · ${s.hidden.length} hidden · ${s.policy === "goal" ? "Goal fit" : "Exploration"}`
    : "No preferences selected; no recommendations yet.";
export function App() {
  const [boot] = useState(read);
  const [state, setState] = useState<State>(boot.state ?? fresh());
  const raw = useRef(boot.raw);
  const [blocked, setBlocked] = useState(!boot.unavailable && !boot.state);
  const [message, setMessage] = useState(
    boot.unavailable
      ? "Local saving is unavailable. Changes stay in this tab; a refresh may lose them."
      : !boot.state
        ? "Saved data is invalid. It is preserved. Use Reset with confirmation to replace it; current work can continue in this tab."
        : "Your declared choices and completions stay in this browser. No tracked behavior is used.",
  );
  const [editing, setEditing] = useState(false);
  const preferenceHeading = useRef<HTMLHeadingElement>(null);
  const editingOpener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (editing) preferenceHeading.current?.focus();
    else if (editingOpener.current) {
      if (editingOpener.current.isConnected) editingOpener.current.focus();
      else document.querySelector<HTMLButtonElement>(".hero button")?.focus();
      editingOpener.current = null;
    }
  }, [editing]);
  const [draft, setDraft] = useState<Preferences>(state.preferences);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [why, setWhy] = useState<Course | null>(null);
  const [view, setView] = useState<"suggested" | "catalog" | "quality">(
    "suggested",
  );
  const [undo, setUndo] = useState<{
    previous: State;
    after: string;
    scope: string;
  } | null>(null);
  const current = useRef(state);
  current.current = state;
  const startPreview = (
    title: string,
    next: State,
    scope: string,
    reset = false,
    refresh = false,
  ) => {
    const r = read();
    if (!refresh && !reset && !r.unavailable && r.raw !== raw.current) {
      setMessage(
        "Saved data changed or became unavailable. Review Refresh saved choices before trying again.",
      );
      return;
    }
    setPreview({
      title,
      next,
      before: JSON.stringify(state),
      raw: r.raw,
      unavailable: r.unavailable,
      reset,
      refresh,
      scope,
    });
  };
  const save = (next: State, reset = false, unavailable = false) => {
    setState(next);
    if (unavailable) {
      setMessage(
        "Local saving is unavailable. Current changes remain in this tab; refresh may lose them.",
      );
      return;
    }
    if (blocked && !reset) {
      setMessage(
        "Changed in this tab. Invalid saved data remains untouched until you confirm Reset.",
      );
      return;
    }
    if (write(next)) {
      raw.current = JSON.stringify(next);
      setBlocked(false);
      setMessage(
        "Saved in this browser. Only declared choices and completions; no tracked behavior or model training.",
      );
    } else
      setMessage(
        "Local saving failed. Your current choices remain in this tab; refresh may lose them.",
      );
  };
  const confirm = () => {
    if (!preview) return;
    const r = read();
    if (
      JSON.stringify(current.current) !== preview.before ||
      r.raw !== preview.raw ||
      r.unavailable !== preview.unavailable
    ) {
      setPreview(null);
      setMessage(
        "This preview is stale. Nothing changed. Review current saved choices and create a new preview.",
      );
      return;
    }
    const next = {
      ...preview.next,
      revision: Math.max(state.revision, preview.next.revision) + 1,
    };
    if (preview.refresh) {
      setState(preview.next);
      raw.current = r.raw;
      setBlocked(false);
      setUndo(null);
      setDraft(preview.next.preferences);
      setMessage(
        "Loaded the reviewed saved choices. Previous tab-only changes were replaced.",
      );
    } else {
      setUndo(
        preview.title === "Undo last change"
          ? null
          : {
              previous: state,
              after: JSON.stringify(next),
              scope: preview.scope,
            },
      );
      save(next, preview.reset, preview.unavailable);
      setDraft(next.preferences);
    }
    setEditing(false);
    setPreview(null);
  };
  const immediate = (next: State, scope: string) => {
    const r = read();
    if (!r.unavailable && r.raw !== raw.current) {
      setMessage(
        "Saved choices changed in another tab. Review Refresh saved choices first.",
      );
      return;
    }
    const value = { ...next, revision: state.revision + 1 };
    setUndo({ previous: state, after: JSON.stringify(value), scope });
    save(value, false, r.unavailable);
  };
  const refresh = () => {
    const r = read();
    if (r.unavailable) {
      setMessage(
        "Cannot read local saving. Current choices remain in this tab.",
      );
      return;
    }
    if (!r.state) {
      setBlocked(true);
      setMessage(
        "Saved data is invalid and preserved. Reset is the only action that can replace it.",
      );
      return;
    }
    startPreview(
      "Load saved choices",
      r.state,
      "Replace current tab choices with saved choices",
      false,
      true,
    );
  };
  const recommendations = state.ready
    ? rank(state.preferences, state.hidden, state.policy)
    : [];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <a className="brand" href="#main">
          <span className="brand-mark">✳</span> Northstar{" "}
          <span> / Relevance Studio</span>
        </a>
        <span className="sample">Fictional learning sample</span>
      </header>
      <main id="main">
        <section className="hero">
          <div>
            <p className="eyebrow">A starting point you can question</p>
            <h1>
              Find your next
              <br />
              <em>learning spark.</em>
            </h1>
            <p className="lead">
              A little about your goal. A clear reason for every course. Your
              say in what comes next.
            </p>
            <div className="hero-actions">
              <button
                className="primary"
                onClick={() => {
                  editingOpener.current = document.activeElement as HTMLElement;
                  setDraft(state.preferences);
                  setEditing(true);
                }}
              >
                {state.ready
                  ? "Edit my preferences"
                  : "Choose my starting point"}{" "}
                <span aria-hidden="true">↗</span>
              </button>
              <button onClick={() => setView("catalog")}>
                Browse all 8 courses
              </button>
            </div>
            <p className="small">
              Deterministic rules · No trained model · No behavior history
            </p>
          </div>
          <svg
            className="hero-art"
            viewBox="0 0 280 240"
            role="img"
            aria-label="Three paths meet at a learning spark"
          >
            <path
              d="M20 200Q80 170 140 100M260 200Q200 170 140 100M140 230V100"
              fill="none"
              stroke="#bbd8c8"
              strokeWidth="3"
            />
            <circle cx="140" cy="80" r="58" fill="#dcece2" />
            <path
              d="M140 28L151 65L190 80L151 94L140 132L129 94L90 80L129 65Z"
              fill="#674473"
            />
            <circle cx="20" cy="200" r="8" fill="#674473" />
            <circle cx="260" cy="200" r="8" fill="#674473" />
            <circle cx="140" cy="230" r="8" fill="#674473" />
          </svg>
        </section>
        <section className="status-area">
          <p role="status" aria-live="polite">
            {message}
          </p>
          <div className="tools">
            <button onClick={refresh}>Refresh saved choices</button>
            <button
              onClick={() =>
                startPreview(
                  "Reset this sample",
                  fresh(),
                  "Restore all prior preferences, policy and hidden courses after reset",
                  true,
                )
              }
            >
              Reset sample
            </button>
            {undo && (
              <button
                onClick={() => {
                  if (JSON.stringify(state) !== undo.after) {
                    setMessage("Undo is stale. Nothing changed.");
                    return;
                  }
                  startPreview("Undo last change", undo.previous, undo.scope);
                }}
              >
                Undo last change
              </button>
            )}
          </div>
        </section>
        {editing && (
          <section className="preferences" aria-labelledby="prefs-title">
            <h2 id="prefs-title" ref={preferenceHeading} tabIndex={-1}>
              Your starting point
            </h2>
            <p>
              These declared choices are all we know. Duration, level and
              prerequisites are hard limits. Your goal excludes courses with
              match 0/3, then affects their rank.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!validPreferences(draft)) {
                  setMessage(
                    "Completed courses conflict: applied courses require Read a small dataset. Correct them before previewing.",
                  );
                  return;
                }
                startPreview(
                  "Save preference changes",
                  {
                    ...state,
                    ready: true,
                    preferences: draft,
                    hidden: state.hidden.filter(
                      (id) => !draft.completed.includes(id),
                    ),
                  },
                  "Restore prior preferences and hidden courses removed by completion",
                );
              }}
            >
              <div className="fields">
                <label>
                  Learning goal
                  <select
                    value={draft.goal}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        goal: e.target.value as Preferences["goal"],
                      })
                    }
                  >
                    <option value="data">Make sense of data</option>
                    <option value="story">Communicate a finding</option>
                    <option value="discovery">Explore a new approach</option>
                  </select>
                </label>
                <label>
                  Maximum course duration
                  <select
                    value={draft.maxMinutes}
                    onChange={(e) =>
                      setDraft({ ...draft, maxMinutes: Number(e.target.value) })
                    }
                  >
                    {[20, 30, 60, 90, 120].map((n) => (
                      <option key={n} value={n}>
                        {n} minutes
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Highest course level
                  <select
                    value={draft.maxLevel}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        maxLevel: Number(e.target.value) as 1 | 2,
                      })
                    }
                  >
                    <option value="1">Foundational</option>
                    <option value="2">Applied</option>
                  </select>
                </label>
              </div>
              <fieldset>
                <legend>
                  Courses you have completed in this fictional sample
                </legend>
                <div className="checks">
                  {catalog.map((c) => (
                    <label key={c.id}>
                      <input
                        type="checkbox"
                        checked={draft.completed.includes(c.id)}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            completed: e.target.checked
                              ? [...draft.completed, c.id]
                              : draft.completed.filter((id) => id !== c.id),
                          })
                        }
                      />
                      {c.title}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="actions">
                <button className="primary" type="submit">
                  Preview preferences
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setDraft(state.preferences);
                    setMessage(
                      "Preference edits canceled. Saved choices are unchanged.",
                    );
                  }}
                >
                  Cancel editing
                </button>
              </div>
            </form>
          </section>
        )}
        <nav className="tabs" aria-label="Learning views">
          {(["suggested", "catalog", "quality"] as const).map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              {v === "suggested"
                ? "For your goal"
                : v === "catalog"
                  ? "Whole catalog"
                  : "Policy comparison"}
            </button>
          ))}
        </nav>
        {view === "quality" ? (
          <Quality />
        ) : (
          <section className="results">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  {view === "catalog"
                    ? "Every course, with eligibility"
                    : "Based only on your declared choices"}
                </p>
                <h2>
                  {view === "catalog"
                    ? "The whole catalog"
                    : state.ready
                      ? "Your next possibilities"
                      : "Begin with a goal"}
                </h2>
              </div>
              {state.ready && view === "suggested" && (
                <div className="policy">
                  <span>Ranking policy</span>
                  <div>
                    {(["goal", "explore"] as const).map((p) => (
                      <button
                        key={p}
                        aria-pressed={state.policy === p}
                        onClick={() => {
                          if (p !== state.policy)
                            startPreview(
                              "Switch ranking policy",
                              { ...state, policy: p },
                              "Restore only the prior ranking choice",
                            );
                        }}
                      >
                        {p === "goal" ? "Goal fit" : "Exploration"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {state.ready && (
              <>
                <p className="summary">{label(state)}</p>
                <p className="small">
                  {state.policy === "goal"
                    ? "Goal fit: goal match × 10."
                    : "Exploration: author-assigned breadth × 10 + goal match."}{" "}
                  Higher scores first; ties use shorter duration, then course
                  ID. All hard limits and positive goal match apply before
                  sorting. Showing{" "}
                  {view === "catalog" ? 8 : recommendations.length} courses.
                </p>
              </>
            )}
            {view === "suggested" && !state.ready && (
              <div className="empty">
                <span aria-hidden="true">✳</span>
                <h3>We do not know your goal yet.</h3>
                <p>
                  Choose a goal, time limit and level to see a safe starting
                  point. You can also inspect the catalog without a
                  recommendation.
                </p>
              </div>
            )}
            {view === "suggested" &&
              state.ready &&
              recommendations.length === 0 && (
                <div className="empty">
                  <h3>No eligible courses</h3>
                  <p>
                    Nothing satisfies every required constraint and your
                    feedback. No fallback has been inserted.
                  </p>
                  <button
                    className="primary"
                    onClick={() => {
                      editingOpener.current =
                        document.activeElement as HTMLElement;
                      setDraft(state.preferences);
                      setEditing(true);
                    }}
                  >
                    Review constraints
                  </button>
                  <button onClick={() => setView("catalog")}>
                    Inspect catalog eligibility
                  </button>
                  <p className="small">
                    Try a longer duration or restore a hidden course. Preview
                    and confirm any preference change.
                  </p>
                </div>
              )}
            <div className="course-grid">
              {(view === "catalog" ? catalog : recommendations).map((c, i) => {
                const exclusions = reasons(c, state.preferences, state.hidden);
                const eligible = state.ready && exclusions.length === 0;
                return (
                  <article className="course" key={c.id}>
                    <div className="card-top">
                      <span>
                        {c.level === 1 ? "Foundational" : "Applied"} ·{" "}
                        {c.minutes} min
                      </span>
                      <span className="course-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                    <p className="prereq">
                      Prerequisites:{" "}
                      {c.requires.length
                        ? c.requires
                            .map(
                              (id) => catalog.find((x) => x.id === id)!.title,
                            )
                            .join(", ")
                        : "None"}
                    </p>
                    {view === "catalog" ? (
                      <div
                        className={
                          eligible ? "eligibility good" : "eligibility"
                        }
                      >
                        {!state.ready
                          ? "Eligibility not assessed: choose your preferences first."
                          : eligible
                            ? "Eligible under your current limits."
                            : exclusions.join(" ")}
                      </div>
                    ) : (
                      <p className="match">
                        Goal match {c.fit[state.preferences.goal]}/3 · Rank
                        score {score(c, state.preferences, state.policy)}
                      </p>
                    )}
                    <div className="card-actions">
                      <button onClick={() => setWhy(c)}>
                        Why this: {c.title}
                      </button>
                      {eligible && (
                        <button
                          onClick={() =>
                            immediate(
                              { ...state, hidden: [...state.hidden, c.id] },
                              `Restore ${c.title}; other choices unchanged`,
                            )
                          }
                        >
                          Not for me: {c.title}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            {state.hidden.length > 0 && (
              <section className="hidden">
                <h3>Hidden by you ({state.hidden.length})</h3>
                <p>
                  Not-for-me removes just that course immediately and saves when
                  available. It does not retrain a model. Restore makes it
                  eligible only if all other limits still fit.
                </p>
                {state.hidden.map((id) => (
                  <button
                    key={id}
                    onClick={() =>
                      immediate(
                        {
                          ...state,
                          hidden: state.hidden.filter((x) => x !== id),
                        },
                        `Hide ${catalog.find((c) => c.id === id)!.title} again; other choices unchanged`,
                      )
                    }
                  >
                    Restore {catalog.find((c) => c.id === id)!.title}
                  </button>
                ))}
              </section>
            )}
          </section>
        )}
        <footer>
          <p>
            Original Northstar scenario. Mo owns product direction; AI assisted
            implementation and verification. Judgments are fictional fixtures,
            not learner research or production performance.
          </p>
          <a href="docs/product/Case_Study.md">Product case study</a>
          <a href="docs/product/Sample_Walkthrough.md">Sample walkthrough</a>
        </footer>
      </main>
      {preview && (
        <Dialog
          title={preview.title}
          close={() => {
            setPreview(null);
            setMessage("Preview canceled. No choices changed.");
          }}
        >
          <p>
            {preview.refresh
              ? "Load the saved browser snapshot, replacing current tab choices."
              : preview.reset
                ? "Clear preferences, hidden courses and ranking choice. Invalid saved data will be replaced only on confirmation."
                : "Review the exact change before saving."}
          </p>
          <div className="preview-diff">
            <h3>Current</h3>
            <p>{label(state)}</p>
            <h3>After confirmation</h3>
            <p>{label(preview.next)}</p>
            <p>
              Completed:{" "}
              {preview.next.preferences.completed
                .map((id) => catalog.find((c) => c.id === id)!.title)
                .join(", ") || "None"}
            </p>
            <p>
              Hidden:{" "}
              {preview.next.hidden
                .map((id) => catalog.find((c) => c.id === id)!.title)
                .join(", ") || "None"}
            </p>
          </div>
          <p className="small">
            {preview.refresh
              ? "Loading replaces current tab-only work and clears Undo. No restoration is offered for this load."
              : preview.title === "Undo last change"
                ? `Undo restores: ${preview.scope}. This consumes the one prior snapshot. There is no history stack.`
                : `Undo scope: ${preview.scope}. Undo lasts in this tab until another action replaces it; refresh removes Undo.`}{" "}
            Confirmation checks both current content and saved content for stale
            changes.
          </p>
          <div className="actions">
            <button
              onClick={() => {
                setPreview(null);
                setMessage("Preview canceled. No choices changed.");
              }}
            >
              Cancel preview
            </button>
            <button className="primary" onClick={confirm}>
              Confirm{" "}
              {preview.reset ? "reset" : preview.refresh ? "load" : "change"}
            </button>
          </div>
        </Dialog>
      )}
      {why && (
        <Dialog
          drawer
          title={`Why this: ${why.title}`}
          close={() => setWhy(null)}
        >
          <p className="eyebrow">Transparent sample rules</p>
          <p>
            {state.ready
              ? `Goal match: ${why.fit[state.preferences.goal]}/3 for “${goalName[state.preferences.goal]}”.`
              : "There is no recommendation yet. This is a catalog inspection."}
          </p>
          <dl>
            <dt>Duration</dt>
            <dd>
              {why.minutes} minutes{" "}
              {state.ready
                ? `against your ${state.preferences.maxMinutes}-minute maximum`
                : ""}
            </dd>
            <dt>Level</dt>
            <dd>
              {why.level === 1 ? "Foundational" : "Applied"}{" "}
              {state.ready
                ? `against ${state.preferences.maxLevel === 1 ? "foundational" : "applied"} maximum`
                : ""}
            </dd>
            <dt>Prerequisites</dt>
            <dd>
              {why.requires.length
                ? why.requires
                    .map(
                      (id) =>
                        `${catalog.find((c) => c.id === id)!.title}: ${state.preferences.completed.includes(id) ? "declared completed" : "not completed"}`,
                    )
                    .join("; ")
                : "None required"}
            </dd>
            <dt>Eligibility</dt>
            <dd>
              {!state.ready
                ? "Not assessed"
                : reasons(why, state.preferences, state.hidden).length
                  ? reasons(why, state.preferences, state.hidden).join(" ")
                  : "Passes duration, level, prerequisites, completion and hide checks."}
            </dd>
            <dt>Ranking calculation</dt>
            <dd>
              {state.ready
                ? `${state.policy === "goal" ? `${why.fit[state.preferences.goal]} × 10` : `${why.curiosity} breadth × 10 + ${why.fit[state.preferences.goal]} goal match`} = ${score(why, state.preferences, state.policy)}. Tie: shorter course, then ID (${why.id}).`
                : "Choose preferences to calculate a score."}
            </dd>
          </dl>
          <p>
            The match (0–3) and breadth (1–5) are author-assigned catalog
            values. Only declared preferences and explicit feedback are used. No
            click history, trained model, prediction of success or external AI.
          </p>
          <button onClick={() => setWhy(null)}>Back to courses</button>
        </Dialog>
      )}
    </>
  );
}
function Quality() {
  return (
    <section className="quality">
      <p className="eyebrow">A tiny, recomputable fixture</p>
      <h2>Two policies. Different tradeoffs.</h2>
      <p>
        Frozen fictional learner: data goal, 60-minute limit, foundational
        level, no completed or hidden courses. Four courses are eligible. Three
        have an author-assigned useful judgment. Top 3 is an evaluation cutoff;
        the recommendation view shows every eligible course.
      </p>
      <div className="comparison">
        {(["goal", "explore"] as const).map((p) => {
          const q = quality(p);
          return (
            <article key={p}>
              <h3>{p === "goal" ? "Goal fit" : "Exploration"}</h3>
              <ol>
                {q.shown.map((c) => (
                  <li key={c.id}>
                    {c.title} <span>({judgments[c.id]})</span>
                  </li>
                ))}
              </ol>
              <dl>
                <dt>Useful among shown</dt>
                <dd>
                  {q.useful}/{q.shown.length} shown (
                  {Math.round((q.useful / q.shown.length) * 100)}%)
                </dd>
                <dt>Useful coverage</dt>
                <dd>
                  {q.useful}/{q.totalUseful} eligible useful (
                  {Math.round((q.useful / q.totalUseful) * 100)}%)
                </dd>
                <dt>Rejected among shown</dt>
                <dd>
                  {q.rejected}/{q.shown.length} shown
                </dd>
              </dl>
            </article>
          );
        })}
      </div>
      <h3>Inspect every fixture judgment</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Data match / 3</th>
              <th>Breadth / 5</th>
              <th>Eligible?</th>
              <th>Judgment</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map((c) => (
              <tr key={c.id}>
                <th>{c.title}</th>
                <td>{c.fit.data}</td>
                <td>{c.curiosity}</td>
                <td>{reasons(c, fixture).length === 0 ? "Yes" : "No"}</td>
                <td>{judgments[c.id]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Goal fit covers all three useful eligible courses in this fixture.
        Exploration favors breadth, bringing one neutral course into the top
        three. The rejected outline is ineligible for this goal, so both
        policies show zero rejected courses. This one persona and eight
        judgments cannot establish which policy works for real learners.
        Proposed human evaluation is documented separately.
      </p>
    </section>
  );
}
