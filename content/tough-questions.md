# Tough Questions — What didn’t work? & What would you improve?

Goal: answer concisely, show learning, demonstrate concrete follow-up actions. Use STAR (Situation, Task, Action, Result) and end with a short improvement plan.

---

## How to frame these answers
- Be honest and specific — name the problem or decision that failed.
- Explain the root cause briefly (design, process, testing, communication).
- Describe the concrete actions you took and what you learned.
- Finish with a clear improvement you would make next time (concrete, measurable).

Keep answers to ~30–60 seconds in interviews; deliver the one-line summary first, then the learning and the improvement.

---

## Question: "What didn’t work?" — short template
- One-line summary: what failed and why.
- Brief root cause (1–2 lines).
- Immediate actions and learning (2–3 lines).

Example A — rollout regression (technical)
- Short: "An initial release caused regressions in production because we lacked end-to-end tests and sufficient telemetry."
- Root cause: "We deployed a large change without feature flags and had limited observability into the user flows affected."
- Action & learning: "We rolled back, ran a focused postmortem, added targeted E2E acceptance tests, improved telemetry dashboards, and introduced feature flags and canary releases. I learned to assume gaps in observability and to instrument early."

One-liner to use: "We shipped a change that regressed production flows; I led the rollback and postmortem, then added tests, telemetry, and feature flags so we could detect and mitigate similar issues quickly."

Example B — over-engineering / scope creep (process)
- Short: "I allowed scope to creep early and spent effort optimizing before validating user value."
- Root cause: "Unclear acceptance criteria and premature focus on non-essential polish."
- Action & learning: "I introduced timeboxed spikes, clearer acceptance criteria, and MVP check-ins; we validated assumptions with a small user test before investing more. I learned to trade polish for validated learning."

One-liner to use: "I over-engineered an area; I now timebox spikes and require an MVP validation step before further investment."

---

## Question: "What would you improve?" — short template
- One-line summary: the improvement you would make going forward.
- Why it matters (1 line).
- Concrete steps you would take next time (2–4 bullet points).

Example answer (combined improvements)
- Short: "I would improve release safety and the decision process by adding feature flags, canary releases, clearer acceptance criteria, and better telemetry." 
- Why: "This reduces blast radius, accelerates learning, and gives confident rollback paths."
- Concrete steps:
  - Define acceptance criteria before engineering begins and gate completion on those tests.
  - Add feature flags and canary deployment for large changes.
  - Instrument key user journeys with telemetry and alerting before rollout.
  - Timebox spikes for unknowns and prioritize measurable MVP outcomes.

One-liner to use: "Next time I'll require acceptance criteria, instrument key flows, and release behind feature flags so we can verify impact and rollback safely."

---

## Quick answer scripts (practice)
- "What didn’t work? — We shipped a change that regressed production flows; I led the rollback and postmortem, then added tests, telemetry, and feature flags to prevent recurrence." 
- "What would you improve? — I'd require acceptance criteria, ship behind feature flags/canaries, and instrument the flow so we can measure impact and rollback if needed."

Practice cues: say the one-liner, pause 1s, give root cause, pause 1s, finish with the improvement plan (30–45s total).

Key phrases to include: postmortem, acceptance criteria, feature flags, canary release, telemetry, rollback plan, timebox, MVP, measurable outcome.

---

If you want, I can convert these into: a) flashcards for quick drilling, b) a 30–45s teleprompter script for each example, or c) a short checklist to run after any release to avoid these pitfalls.
