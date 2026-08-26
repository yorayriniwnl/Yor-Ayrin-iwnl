# Security and dependency status

This document records the verification path for the portfolio. Dependency
advisories must be re-run against the lockfile after every dependency update.

## Verification

```bash
npm audit --omit=dev
npm run build
npm run lint
npm run typecheck
```

Do not merge a dependency change until the audit and all three checks pass.

## Scope

The portfolio is a static one-page application. It does not expose API routes,
server actions, contact forms, dashboards, webhooks, or user-controlled image
URLs. Security fixes still require upgrading vulnerable packages rather than
relying only on application scope.
