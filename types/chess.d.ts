declare module 'chess.js' {
  export type ChessColor = 'w' | 'b'
  export type ChessPieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

  export type ChessPiece = {
    color: ChessColor
    type: ChessPieceType
    square: string
  }

  export type ChessMove = {
    color: ChessColor
    from: string
    to: string
    san: string
    piece: ChessPieceType
    captured?: ChessPieceType
    promotion?: ChessPieceType
  }

  export class Chess {
    constructor(fen?: string)
    board(): Array<Array<ChessPiece | null>>
    fen(): string
    game_over(): boolean
    turn(): ChessColor
    in_check(): boolean
    in_checkmate(): boolean
    in_stalemate(): boolean
    in_threefold_repetition(): boolean
    insufficient_material(): boolean
    load(fen: string): boolean
    get(square: string): ChessPiece | null
    move(move: { from: string; to: string; promotion?: string }): ChessMove | null
    moves(options?: { square?: string; verbose?: false }): string[]
    moves(options: { square?: string; verbose: true }): ChessMove[]
    history(options?: { verbose?: false }): string[]
    history(options: { verbose: true }): ChessMove[]
    undo(): ChessMove | null
  }
}
