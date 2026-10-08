# Relevance Studio

[Read the product documents](https://mvahedi2020.github.io/Relevance-Studio/docs/index.html) in a formatted, mobile-friendly reading view.

[Open the live demo](https://mvahedi2020.github.io/Relevance-Studio/) · [Public source](https://github.com/mvahedi2020/Relevance-Studio) · [Verified release evidence](docs/product/Validation.md)

Help a new learner choose a course that fits their goal, available time and experience. Explain why each course fits, and show when none qualifies. The suggestions use fixed rules. All records in this demo are fictional.

**Try it:** Choose a learning goal and time limit, inspect a suggestion’s explanation, then try a limit with no matching course. [Open the demo](https://mvahedi2020.github.io/Relevance-Studio/) · [Follow the walkthrough](docs/product/Sample_Walkthrough.md).

Mo owns Product / Program Management direction. AI assisted implementation and verification. No employer logic/data/results, trained ML, external AI, hidden history, accounts, services, analytics or real enrollment.

Product tradeoff: a positive stated-goal threshold prevents fabricated fit but may exclude useful adjacent learning. The next investment depends on learner choice and progression compared with catalog browsing. See the [case study](docs/product/Case_Study.md) for the proposed comparison and investment criteria.

## Try the product story

Start with data / 60 minutes / foundational / no completions. Preview and confirm. Goal fit orders foundations, story, questions, ethics; exploration orders ethics, story, questions, foundations. The exact Why drawer explains limits and score. Hide and restore a course; set 20 minutes for a genuine no-match state. Inspect the whole catalog and recover by reviewing limits. [Exact walkthrough](docs/product/Sample_Walkthrough.md).

The evaluation screen is one frozen authored persona, not real model performance: four eligible courses, three useful. Goal fit top-three useful coverage 3/3; exploration 2/3. Both show zero rejected courses (0/3); the rejected zero-fit outline is ineligible. Numerators, denominators and assumptions remain visible.

## Product evidence

- [Product brief](docs/product/Product_Brief.md): user, decision, alternative and limits.
- [PRD](docs/product/PRD.md): S021–S032 requirement mapping and acceptance.
- [Sample contract](docs/product/Sample_Contract.md): original catalog, state rules and independent calculations.
- [Case study](docs/product/Case_Study.md): product choice and limited synthetic outcomes.
- [Decisions and risks](docs/product/Decisions_and_Risks.md): provisional decisions and alternatives.
- [Validation](docs/product/Validation.md): actual software checks, proposed human evaluation and release status.
- [Walkthrough](docs/product/Sample_Walkthrough.md): exact primary and recovery route.

All saved changes require review except explicitly immediate, recoverable Hide/Restore. Invalid saved data is preserved until confirmed reset. Load clears the single Undo snapshot; Undo is consumed on confirmation and does not survive reload. Failed local saving retains the current tab, with refresh risk explained.

## Run locally

Node 24. No environment variables or credentials.

```sh
npm ci
npx playwright install chromium
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
npm run preview
```

Open `http://127.0.0.1:4188/Relevance-Studio/`. The browser suite starts and stops its own production preview; keep the port free before running it. The static base is `/Relevance-Studio/`. Build copies the public product documents into `dist/docs`. CI verifies and publishes via pinned GitHub actions. Generated build/test/runtime folders and environment files are ignored and guarded.
