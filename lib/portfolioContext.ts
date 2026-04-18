import type { PortfolioEntry } from './portfolio'

export type ContextOptions = {
  tokenLimit?: number // approximate token limit (default 1500)
  bufferTokens?: number // reserve tokens for system instruction + question (default 120)
}

/** Rough token estimate: 1 token ≈ 4 chars (conservative). */
export function estimateTokens(text: string) {
  return Math.max(0, Math.ceil(text.length / 4))
}

function short(s: string | undefined, max = 120) {
  if (!s) return ''
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max - 3).trim() + '...'
}

function entryLine(i: number, e: PortfolioEntry) {
  const title = e.title || 'Untitled'
  const desc = short(e.description, 120)
  const tech = (e.tech || []).slice(0, 6).join(', ')
  const highlights = (e.highlights || []).slice(0, 2).map((h) => short(h, 60)).join(' | ')
  // compact, machine-friendly but readable
  return `${i}. ${title} — ${desc} | Tech: ${tech}${highlights ? ' | H: ' + highlights : ''} | ${e.url}`
}

/**
 * Build a compact context string from portfolio entries under a token limit.
 * Deterministic and conservative about tokens.
 */
export function buildContextFromPortfolio(entries: PortfolioEntry[], opts?: ContextOptions) {
  const tokenLimit = opts?.tokenLimit ?? 1500
  const buffer = opts?.bufferTokens ?? 120

  const header = 'PORTFOLIO CONTEXT — Use only the data below to answer. Do not invent facts. Each item: title — one-line description | Tech: comma list | H: highlights | url.'
  const lines: string[] = [header]

  let tokenCount = estimateTokens(header)

  // entries are expected pre-sorted by importance/score
  let i = 1
  for (const e of entries) {
    const line = entryLine(i, e)
    const t = estimateTokens(line)
    if (tokenCount + t + buffer > tokenLimit) break
    lines.push(line)
    tokenCount += t
    i += 1
  }

  const context = lines.join('\n')
  return { context, tokenCount }
}

/** Create a final prompt to send to an LLM along with the trimmed context. */
export function createPrompt(question: string, context: string) {
  const instr = `Answer concisely and only using the context below. If the answer is not present in the context, respond: "I don't have that information." Keep replies short and confident.`
  return [instr, '\nCONTEXT:\n' + context, '\nQUESTION:\n' + question].join('\n\n')
}

export default buildContextFromPortfolio
