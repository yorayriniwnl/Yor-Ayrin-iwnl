# Production Freeze

Date: 2026-04-08

Status: ACTIVE — Feature development is frozen for the production delivery window.

Purpose
- Freeze new feature work so the team can focus on stability, performance, and clarity prior to production release.

Scope (allowed changes)
- Bug fixes that address regressions, correctness issues, or production crashes.
- Performance improvements that demonstrably reduce critical-path cost (must include short before/after notes).
- Clarity and copy edits (UI text, documentation) that improve recruiter/reader understanding.
- Security patches and critical incident fixes (must be documented and prioritized).

Restrictions (not allowed)
- No new features, product experiments, or UX expansions.
- No UI redesigns or exploratory integrations unless they are required to fix a critical bug.

Process / PR rules
- Branch naming: `fix/<short-description>`.
- PR description must list: what is fixed, scope, risk level, and verification steps.
- Include tests or reproduction steps when feasible; CI must pass before merge.
- Performance changes should include one-line before/after measurement.
- All PRs require at least one reviewer sign-off from the core team.

Emergency exceptions
- Security patches or hotfixes that block production are permitted; mark the PR with `urgent` and document why it was allowed.

Owner
- Ayush Roy

Notes
- This file is a standing agreement to pause new-feature work and prioritize shipping a stable, performant, and clear product. Remove or update this file only after a formal unfreeze decision and a tagged release.
