# Original Northstar sample and state contract

Eight fictional courses are source-owned. Every record has an ID, title, description, level (1 foundational / 2 applied), duration, prerequisites, match values for three goals (0–3), and author-assigned breadth (1–5). The latter values express design choices rather than learned probabilities.

| ID | Course | Level | Minutes | Prerequisites | Data / story / discovery | Breadth | Frozen data judgment |
|---|---|---|---|---|---|---|---|
| foundations | Read a small dataset | 1 | 30 | None | 3 / 1 / 2 | 1 | Useful |
| charts | Choose a chart with care | 2 | 60 | foundations | 3 / 3 / 1 | 2 | Useful |
| story | Tell the story behind a number | 1 | 30 | None | 2 / 3 / 1 | 4 | Useful |
| questions | Ask a better learning question | 1 | 45 | None | 2 / 1 / 3 | 3 | Useful |
| ethics | Notice what the data leaves out | 1 | 60 | None | 1 / 2 / 3 | 5 | Neutral |
| experiment | Design a tiny experiment | 2 | 90 | foundations | 3 / 1 / 3 | 2 | Useful |
| outline | Sketch an idea before building | 1 | 20 | None | 0 / 2 / 3 | 4 | Rejected |
| synthesis | Connect several sources | 2 | 120 | foundations | 2 / 3 / 2 | 3 | Neutral |

The frozen evaluation persona is data / 60 minutes / foundational / no completed / no hidden. Judgments are authored only for that persona. Four courses are eligible: foundations, story, questions, ethics. Three are useful. The rejected outline has zero data match and is ineligible. These assumptions are not transferable to real learners or other goals.

## Persistence and actions

The only key is `northstar-relevance-v1`. Schema v1 stores a nonnegative safe integer revision, ready flag, preferences, unique known hidden IDs and goal/explore policy. Preferences accept only data/story/discovery, duration 20/30/60/90/120, level 1/2 and unique known completed IDs. Completed applied courses require foundations also completed. Hidden/completed overlap, extra fields, unknown IDs, contradictory cold-start state and unsupported versions are invalid. No arbitrary user text is accepted or rendered. Rendering uses escaped React text; there is no HTML injection or user-text export.

Missing key starts empty. Compatible stored state loads on refresh. Corruption is preserved and reported; tab-only work remains possible, and confirmed Reset is the only replacement. External corruption can be explicitly reset without reloading. Reset preview captures the currently observed raw bytes, so a further external change still rejects confirmation. Save failure or unavailable storage getter/read retains current choices in the tab and warns that refresh can lose them. No unknown saved state is overwritten after a read failure.

Preview captures exact current and raw-storage content. Confirm rejects if either changes, even at the same revision or from another tab. Refresh saved choices explicitly previews replacement of tab state and clears Undo on load. Reset clears preferences, policy and hidden courses; Undo can restore the prior valid tab snapshot after review. Undo is consumed on confirmation, has no history stack, lasts only in this tab, is superseded by the next change and is unavailable after reload. Hide/Restore are immediate, narrowly change one ID and retain one reviewed Undo snapshot. They never relax constraints or retrain a model.

## Independently expected fixture arithmetic

Goal scores: foundations 30; story 20; questions 20; ethics 10. Shorter-duration tie gives foundations → story → questions → ethics. Exploration scores: foundations 13; story 42; questions 32; ethics 51, giving ethics → story → questions → foundations.

Top 3 goal fit: useful among shown 3/3 (100%); useful coverage 3/3 eligible useful (100%); rejected 0/3 shown. Top 3 exploration: useful 2/3 (67% rounded); coverage 2/3 eligible useful (67% rounded); rejected 0/3. Each denominator is stated in the UI. Neither policy shows the rejected fixture item; exploration introduces a neutral item. There is no production-performance claim.
