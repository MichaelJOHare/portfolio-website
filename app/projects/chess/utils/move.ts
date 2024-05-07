import { useChessGame } from "../hooks/useChessGame";
import { Move, CastlingMove, Square, Piece } from "../types";

// createMove interface? need to allow for creating a move -> depending on type it creates the correct move type

export const CanMove = (movingPiece: Piece, targetSquare: Square) => {
  const { board, currentPlayer } = useChessGame();

  if (movingPiece && movingPiece.color !== currentPlayer.color) {
    return;
  }
  const legalMoves = movingPiece.movementStrategy(board, movingPiece);

  const canMoveToTarget = legalMoves.some((move) => {
    return move.to.row === targetSquare.row && move.to.col === targetSquare.col;
  });

  return canMoveToTarget;
};

export const createStandardMove = (
  piece: Piece,
  from: Square,
  to: Square,
  capturedPiece?: Piece,
  isPromotion?: boolean,
  isCapture?: boolean
): Move => ({
  type: "Standard",
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
  type: "Castling",
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
