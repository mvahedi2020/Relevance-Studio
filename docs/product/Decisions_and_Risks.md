# Decisions, alternatives and open risks

| Decision | Why chosen for this sample | Alternative / risk |
|---|---|---|
| Ask for explicit goal, duration and level | A new learner can declare limited evidence | Inferring preferences needs actual behavior and consent; questions add effort |
| Enforce hard limits before both policies | No recommendation silently violates requirements | A catalog-first route preserves inspection but costs effort |
| Exclude zero goal match | An authored zero must not become an implied match | May miss useful adjacent courses; threshold is provisional |
| Compare deterministic goal fit and exploration | Exact inputs/order can be traced | These values are not trained or validated predictions |
| Show all eligible courses | Avoid unexplained top-k omissions | A long catalog would need additional navigation |
| Immediate not-for-me + Restore | A narrowly scoped recoverable action feels direct | Mistakes are possible; visible restore and one-step Undo address them |
| Preview preference, policy, reset, load and Undo | Users see replacement before saving | Additional confirmation effort must be evaluated |
| Raw-content stale checks | Same revision can still contain different choices | A browser write is not a server transaction; concurrent writes after final check remain a limitation |
| Preserve corruption until reset | Avoid silently discarding saved choices | No arbitrary import/export or recovery of corrupt data is offered |
| One consumed Undo snapshot | Precise recovery with simple expectations | No history stack, no Undo after reload, another action replaces snapshot; loading offers none |
| Frozen fixture comparison | Recomputable limited evidence | One persona and authored judgments cannot select a production policy |

Security and privacy: original static data only, no accounts/services/analytics, no external resources or user-text HTML. Strict schema rejects unknown IDs and impossible completion combinations. Browser storage is local, shared across tabs and may be unavailable or cleared. Current tab state is retained on persistence failure, with explicit refresh risk.

Accessibility checks cover named controls, native modal semantics, explicit Tab wrapping, Escape, focus restoration, status announcements and 320/390-width views. Software checks do not replace screen-reader or human accessibility testing.

Mo owns product direction; AI assisted implementation and verification. These design choices are visibly provisional. [Validation](Validation.md) holds actual evidence, proposed human evaluation and the single release-status record.
