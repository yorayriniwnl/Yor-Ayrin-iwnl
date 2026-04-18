import * as ChessJS from 'chess.js'

export const DEFAULT_CHESS_ENGINE_DEPTH = 12
export const MIN_CHESS_ENGINE_DEPTH = 6
export const MAX_CHESS_ENGINE_DEPTH = 18

type EnginePayload = {
  bestmove?: unknown
}

type ChessValidator = {
  load: (fen: string) => boolean
  validate_fen?: (fen: string) => { valid?: boolean } | boolean
}

const ChessCtor = (
  (ChessJS as { Chess?: unknown }).Chess
  ?? (ChessJS as { default?: { Chess?: unknown } }).default?.Chess
  ?? (ChessJS as { default?: unknown }).default
) as new (fen?: string) => ChessValidator

export function clampChessEngineDepth(depth: number): number {
  if (!Number.isFinite(depth)) return DEFAULT_CHESS_ENGINE_DEPTH

  const rounded = Math.trunc(depth)
  return Math.min(MAX_CHESS_ENGINE_DEPTH, Math.max(MIN_CHESS_ENGINE_DEPTH, rounded))
}

export function isValidFen(fen: string): boolean {
  try {
    const chess = new ChessCtor()
    const validation = chess.validate_fen?.(fen)

    if (typeof validation === 'boolean') return validation
    if (validation && typeof validation === 'object' && 'valid' in validation) {
      return Boolean(validation.valid)
    }

    return chess.load(fen)
  } catch {
    return false
  }
}

export function extractBestMove(payload: unknown): string | null {
  const raw = (payload as EnginePayload | null | undefined)?.bestmove
  if (typeof raw !== 'string') return null

  const candidate = raw.replace(/^bestmove\s+/i, '').trim().split(/\s+/)[0]?.toLowerCase()
  if (!candidate) return null

  return /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(candidate) ? candidate : null
}
