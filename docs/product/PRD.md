# Relevance Studio — requirements and decisions

## Intended route

A learner selects a goal, maximum duration and highest level; optionally declares completed sample courses; previews and confirms preferences; inspects all eligible results and Why this; compares deterministic policies; hides and restores an item; changes to a no-match limit and recovers through reviewed constraints or catalog inspection.

## Acceptance mapping

| Work package | Implemented requirement | Observable evidence |
|---|---|---|
| S021 | Primary learner, smallest outcome, alternative and fictional boundary | Product brief |
| S022 | Eight original records, strict local state and action contract | Sample contract; schema tests |
| S023 | React/TypeScript/Vite static entry, working view navigation and CI | Production build; browser entry route |
| S024 | Goal, level, duration, explicit prerequisites and completion | Catalog exclusion reasons; eligibility tests |
| S025 | Explicit cold-start questions; no inferred history | Cold-start browser flow; no results before confirmation |
| S026 | Goal-fit and exploration order with visible formulas and tie rules | Independent rank expectations; browser policy switch |
| S027 | Why drawer, immediate scoped not-for-me, restoration and reviewed preferences | Explanation and feedback browser flows |
| S028 | Empty state; constraint editing; whole catalog with every exclusion | Data + 20-minute test; recovery walkthrough |
| S029 | Frozen judgments, coverage and rejected denominators, policy tradeoff | Quality calculation tests and comparison screen |
| S030 | Preview/cancel/confirm, refresh, strict invalid storage, reset and Undo, stale protection | Browser storage, cross-tab and recovery tests |
| S031 | Responsive 320/390, keyboard, focus return/wrap, announcements and documented evidence | Production browser suite and inspected screenshots |
| S032 | Local release gate and reviewer artifacts | Release/publication and personal review gates remain in Validation |

## Product rules

A positive match (1–3) is a relevance eligibility threshold; changing goal can change both eligibility and order. Required duration, level and prerequisites are never relaxed automatically. Declared completed items are excluded. Hidden items are excluded for this sample only. Goal fit sorts by match × 10. Exploration sorts by author-assigned breadth × 10 + match. Both use ascending minutes, then course ID for ties. All eligible courses are shown; top-three cutoff applies only to the frozen evaluation fixture.

Preference saves, policy changes, reset, saved-state loading and Undo require a review dialog and confirmation. Cancel and Escape mutate no state. Not-for-me and Restore intentionally apply immediately; nearby copy declares the effect and Undo scope. Undo is one prior full snapshot, valid only against the exact current content, lasts in this tab and is replaced by the next successful change. Restoring feedback does not override other eligibility limits.

No recommendations appear before preferences are confirmed. Invalid or unsupported saved inputs produce an explicit warning and preserve the raw data until confirmed reset. A stale preview checks exact in-memory and raw-storage content, not just revision. Persistence failure retains the current tab and explains refresh risk. Read failure never causes an unknown saved snapshot to be overwritten.

## Boundaries

No login, analytics, real enrollment, services, live AI, training, external requests, customer results or hidden personalization. Research and commercial measures are proposals. Provisional choices include the positive-fit threshold, exploration breadth values, top-three evaluation cutoff and one-step Undo; validate with people before using these rules operationally.
