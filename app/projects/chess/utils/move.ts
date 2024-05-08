import {
  Move,
  CastlingMove,
  EnPassantMove,
  PromotionMove,
  Square,
  Piece,
  MoveType,
  PieceType,
} from "../types";

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

export const createEnPassantMove = (
  piece: Piece,
  from: Square,
  to: Square,
  capturedPieceSquare: Square,
  capturedPiece: Piece
): EnPassantMove => ({
  type: MoveType.EP,
  piece: piece,
  from: from,
  to: to,
  capturedPieceSquare: capturedPieceSquare,
  capturedPiece: capturedPiece,
});

export const createPromotionMove = (
  piece: Piece,
  from: Square,
  to: Square,
  promotionType: PieceType,
  capturedPiece?: Piece
): PromotionMove => ({
  type: MoveType.PROMO,
  piece: piece,
  from: from,
  to: to,
  promotionType: promotionType,
  capturedPiece: capturedPiece,
});
