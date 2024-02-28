import { Move, Square, Piece } from "../types";

export const createMove = (
  piece: Piece,
  from: Square,
  to: Square,
  capturedPiece?: Piece,
  isPromotion?: boolean,
  isCapture?: boolean
): Move => ({
  from,
  to,
  capturedPiece,
  piece,
  isPromotion,
  isCapture,
});

// createCastlingMove
// createEnPassantMove
// createPromotionMove
