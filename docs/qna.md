QnA over portfolio data
======================

This minimal system gives deterministic, retrieval-only answers from portfolio entries.

Files
- `lib/portfolioContext.ts` — builds a compact context under token limits and creates LLM prompt text.
- `lib/qna.ts` — simple intent detection and deterministic answerer that only uses portfolio entries.
- `scripts/qna-example.ts` — example runner showing usage.

Integration notes
- Build portfolio entries using `lib/portfolio.ts`.
- Create a compressed `context` with `buildContextFromPortfolio(entries, { tokenLimit })`.
- For LLM use: call `createPrompt(question, context)` and send to your model. The prompt already instructs the model to only use the context and to respond concisely.
- Local deterministic fallback: call `answerQuestion(question, entries)` which returns a short answer and explicit `sources` (project URLs).

Safety
- The `answerQuestion` function only reports facts that exist in `entries` (titles, tech lists, highlights, URLs). It will not invent details — if the data is missing it replies: "I don't have that information.".
