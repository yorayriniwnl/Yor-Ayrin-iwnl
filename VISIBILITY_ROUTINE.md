# Weekly Visibility Routine

Purpose: stay visible with low-effort, high-quality updates. Each week do exactly:

- 1 LinkedIn post
- 1 GitHub update (small PR / docs / patch)
- 1 project improvement (timeboxed)

Schedule (suggested)
- Monday: pick the week's focus (project + improvement)
- Wednesday: implement and push a small GitHub change (docs, test, small fix)
- Thursday: post to LinkedIn with links to the change or project
- Weekend / Friday: finish the project improvement and open a PR

LinkedIn post template (2–3 lines)
- Short headline (one sentence outcome) + 1 supporting detail.
- Example: "Built the frontend for Yor Zenith — reduced planning time from weeks to days. Case study: <PORTFOLIO_URL>/projects/zenith • GitHub: https://github.com/yorayriniwnl • #React #Systems"

GitHub update examples
- Small, meaningful actions that are easy to review:
  - Improve README with a short project summary and screenshot.
  - Add a focused test or fix a small bug.
  - Add a short note to CHANGELOG or release notes.
- Commit message examples:
  - "docs(zenith): add overview and sample screenshot"
  - "fix(api): validate rooftop polygon inputs"

Project improvement ideas (pick one per week, timebox 2–4 hours)
- Reduce bundle size by 5% (profile + small change)
- Add one accessibility improvement (ARIA labels, keyboard nav)
- Write one integration test or add a CI check
- Create a short case-study screenshot or GIF for sharing

Process checklist
1. Create an issue titled "Weekly: <short focus>" and add labels `weekly-update` and the project name.
2. Branch, implement change, push commit, open PR.
3. Merge or keep PR open; link PR/commit in LinkedIn post.
4. Post to LinkedIn with a 2–3 line message and the link to the PR or project page.
5. Log the update in a simple tracking sheet: Company/Platform | Date | Post link | Repo/PR | Notes.

Metrics & follow-up
- Track simple signals: LinkedIn reactions/impressions, PR merges, repo stars, resume downloads.
- If a post performs well, expand into a short case-study or a longer thread.

Automation & tools
- Tag issues with `weekly-update` for easy querying.
- Use GitHub Actions if you want to automatically publish a screenshot to `public/screenshots` on PR merge.

Tips
- Keep posts factual and outcome-focused (metrics where possible).
- Prioritize quality over volume — one well-linked update per week is enough.
