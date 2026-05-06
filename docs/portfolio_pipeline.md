Portfolio pipeline
==================

This module provides a small, deterministic pipeline to convert GitHub repository metadata and README content into structured portfolio entries.

Files added
- `lib/portfolio.ts` — main pipeline and helpers
- `scripts/generate-portfolio.ts` — minimal example script

Usage
-----

Call `buildPortfolio(repos, readmes)` where `repos` is an array of GitHub-like repo objects (see `lib/portfolio.ts` types) and `readmes` is an optional mapping from `repo.full_name` (or name) to README markdown text.

The output is an array of entries with `title`, `description`, `tech`, `highlights`, `url`, and a numeric `score` (0-100). Entries are sorted descending by score.

Design notes
------------
- Deterministic heuristics only — no external calls or randomness.
- Lightweight parsing: extracts first paragraph, tech sections, and bullet highlights where present.
- Scoring combines impact (stars/forks), complexity (size + code samples), and uniqueness (topics/uncommon languages).
