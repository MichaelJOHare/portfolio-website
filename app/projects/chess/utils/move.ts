import { Move, CastlingMove, Square, Piece, MoveType } from "../types";

// createMove interface? need to allow for creating a move -> depending on type it creates the correct move type

export const createStandardMove = (
  piece: Piece,
  from: Square,
  to: Square,
  capturedPiece?: Piece,
  isPromotion?: boolean,
  isCapture?: boolean
): Move => ({
  type: MoveType.STNDRD,
  from,
  to,
  capturedPiece,
  piece,
  isPromotion,
  isCapture,
});

export const createCastlingMove = (
  king: Piece,
  rook: Piece,
  kingFrom: Square,
  kingTo: Square,
  rookFrom: Square,
  rookTo: Square
): CastlingMove => ({
  type: MoveType.CASTLE,
  from: kingFrom,
  to: kingTo,
  capturedPiece: undefined,
  piece: king,
  rook: rook,
  isPromotion: false,
  isCapture: false,
  kingFrom,
  kingTo,
  rookFrom,
  rookTo,
});

// createEnPassantMove
// createPromotionMove
