# Validation — evidence and limits

## Actual local software verification — October 1, 2026

Node 24.14.1, locked dependencies, static production build under `/Relevance-Studio/`, localhost port 4188. AI assisted implementation and verification. Mo owns product direction; personal comprehension and human research are unobserved.

- Lint plus tracked runtime/environment guard: passed.
- Strict TypeScript: passed.
- 22 domain/schema cases: passed. Independent expectations were written before assertions: data fixture goal order foundations/story/questions/ethics; exploration ethics/story/questions/foundations; goal useful coverage 3/3, exploration 2/3, both rejected 0/3 shown. Tests include positive-fit no-match, explicit prerequisite checks, completion, hidden feedback, unknown IDs/goals, impossible completion, duplicate IDs, extra fields and incompatible/corrupt schema.
- Production build including all seven product documents: passed.
- Dependency audit: zero vulnerabilities.
- 20 production Chromium browser flows: passed. Primary cold start, explanations, changed policy and refresh; canceled form/preview; hidden feedback and consumed Undo; no-match/catalog/recovery; prerequisite inconsistency and applied unlock; fixture arithmetic; reset/cancel/restore; invalid saved data preserved; same-revision different-content rejection; real cross-tab rejection; unavailable getter/getItem/setItem; keyboard Tab/Shift+Tab wrapping and Escape/focus return; 320/390 responsive drawer; no runtime errors or external requests; externally introduced corruption reset without reload; 1280×633 preference entry automatically focuses and reveals the task, with cancel/confirm focus return.
- Agent-browser production entry gut check: content and named controls rendered, no framework error overlay; desktop screenshot inspected. Actual 320/390 browser screenshots inspected for course readability and explanation drawer. This is bounded visual verification, not human accessibility research.

Two concrete browser iterations repaired behavior: native reverse Tab initially escaped the promised wrap, so explicit modal focus wrapping was added; revised consumed-Undo copy then omitted the precise restoration scope, which was restored in the review dialog. Independent desktop browser review then found preference entry was revealed below the viewport while focus stayed on the hero action. Preference entry now focuses its heading and scrolls it into view; cancel returns to the opener, and confirmation returns to a surviving opener or the main edit action. A real 1280×633 regression covers Choose, Edit and Review constraints without forced test focus. The final 20-flow suite passed after repairs. Independent source review identified zero-goal-fit fallback risk, external corruption reset blockage, load/Undo wording and declared-completion/history claim precision; these were corrected before local delivery.

## Proposed human evaluation — not performed

Ask 5–8 participants unfamiliar with the sample to choose a goal, explain why a course qualifies, change one limit, hide/restore a suggestion and recover a no-match state. Ask them to distinguish declared completions from tracked behavior and authored scores from trained predictions. Observe explanation correctness, safe change/recovery completion and misunderstanding of the fixture's limitations. Use observed failures to revise thresholds, explanation language and confirmation friction. Do not treat these proposed sample sizes as statistical proof or customer research already conducted.

No engagement, conversion, retention, commercial lift, actual learner relevance or Oracle performance is measured. One authored persona and eight authored judgments cannot establish general policy superiority. Accessibility checks do not substitute for screen-reader and human evaluation.

## Public release verification — October 1, 2026

The primary reviewer independently replayed cold start, both ranking policies and explanations, hide/restore, a 20-minute no-match and Undo recovery, fixture arithmetic, refresh and a 320px explanation drawer. The original 1280×633 entry problem was reproduced and then confirmed repaired: opening preferences moved focus to its heading and brought it into view. No page errors were reported.

Initial release `fa3e307d1862f1f90afc9ee33d692defe0d52cc2` passed [GitHub verification and Pages deployment](https://github.com/mvahedi2020/Relevance-Studio/actions/runs/36971958102). Local HEAD matched public main, the worktree was clean, and all **10 deployed files** matched the local production build and the GitHub deployment artifact byte for byte. The live page rendered its expected entry controls without reported page or console errors. The authored quality fixture remains separate from user choices and from human/model performance claims.

The public [profile](https://github.com/mvahedi2020) provides the case study, PRD, walkthrough and [live demo](https://mvahedi2020.github.io/Relevance-Studio/). These are point-in-time software and publication checks, not uptime, human validation or commercial results. Final documentation-only revisions repeat the repository verification/publication workflow; the private delivery ledger records final-head parity.

The assistant's implementation, verification, publication and reviewer-route work is complete. Mo's personal comprehension, endorsement of provisional choices and actual human research remain unobserved. They cannot be inferred from software checks. This section remains the publication-status record referenced by the other documents.
