import { NextResponse } from 'next/server'
import {
  clampChessEngineDepth,
  DEFAULT_CHESS_ENGINE_DEPTH,
  extractBestMove,
  isValidFen,
} from '../../../lib/chessEngine'

const ENGINE_ENDPOINT = 'https://stockfish.online/api/s/v2.php'
const ENGINE_TIMEOUT_MS = 8000

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fen = searchParams.get('fen')?.trim()
  const depth = clampChessEngineDepth(
    Number(searchParams.get('depth') ?? DEFAULT_CHESS_ENGINE_DEPTH),
  )

  if (!fen) {
    return NextResponse.json({ ok: false, error: 'Missing fen' }, { status: 400 })
  }

  if (!isValidFen(fen)) {
    return NextResponse.json({ ok: false, error: 'Invalid fen' }, { status: 400 })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), ENGINE_TIMEOUT_MS)

  try {
    const upstream = await fetch(
      `${ENGINE_ENDPOINT}?fen=${encodeURIComponent(fen)}&depth=${depth}`,
      {
        cache: 'no-store',
        signal: controller.signal,
      },
    )

    if (!upstream.ok) {
      return NextResponse.json({ ok: false, error: 'Engine unavailable' }, { status: 503 })
    }

    const payload = (await upstream.json()) as unknown
    const bestmove = extractBestMove(payload)

    if (!bestmove) {
      return NextResponse.json({ ok: false, error: 'No best move returned' }, { status: 502 })
    }

    return NextResponse.json({
      ok: true,
      bestmove,
      depth,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Engine request failed' }, { status: 503 })
  } finally {
    clearTimeout(timeoutId)
  }
}
