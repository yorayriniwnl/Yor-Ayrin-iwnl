Security Advisory: Next.js vulnerability
======================================

Summary
-------
An `npm audit` identified a high-severity advisory affecting the installed `next` package (range: 9.5.0 - 15.5.13). The audit shows multiple advisories related to DoS, request deserialization, and image cache growth. The recorded fix is to upgrade `next` to `16.2.2`, which is a SemVer major upgrade and may require code changes.

Details
-------
- Vulnerable package: `next`
- Severity: High (1), Moderate (multiple)
- Fix available: `next@16.2.2` (semver-major)
- `npm audit` output: see `npm audit --json` for full details

Remediation options
-------------------
1. Upgrade to `next@16.2.2` (recommended):
   - Run `npm install next@16.2.2` and update any incompatible APIs.
   - Run full test/build cycle and fix any breaking changes.
   - This resolves the advisory but is a major upgrade and should be tested on a branch/CI.

2. Apply configuration mitigations (temporary):
   - Tighten `images.remotePatterns` or avoid using untrusted remote hosts for `next/image`.
   - Review rewrites/redirects and server components that deserialize user input.
   - Monitor disk usage for the image optimizer cache.

3. Keep dependency pinned and schedule an upgrade: create a release plan and test the upgrade in a branch.

Next steps I can take (pick one):
- Attempt the major upgrade now (`npm install next@16.2.2`), run build, and fix breakages.
- Create a branch `chore/upgrade-next` with the upgrade and run CI checks (recommended workflow).
- Only document the issue and leave the dependency as-is until you approve an upgrade.

Contact
-------
If you want me to proceed with the upgrade, say which option: `upgrade-now`, `create-branch-and-upgrade`, or `document-only`.
