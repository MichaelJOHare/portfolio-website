import { Move, Square, Piece, BoardStateContext } from "../types";

export const createMove = (
  piece: Piece,
  from: Square,
  to: Square,
  board: BoardStateContext,
  capturedPiece?: Piece,
  isPromotion?: boolean,
  isCapture?: boolean
): Move => ({
  from,
  to,
  board,
  capturedPiece,
  piece,
  isPromotion,
  isCapture,
});

export const createPreparedMove = (
  piece: Piece,
  from: Square,
  to: Square,
  capturedPiece?: Piece,
  isPromotion?: boolean,
  isCapture?: boolean
) => ({
  piece,
  from,
  to,
  capturedPiece,
  isPromotion,
  isCapture,
});

export const executeMove = (move: Move) => {
  const { to, piece, capturedPiece, board } = move;
  if (capturedPiece) {
    capturedPiece.isAlive = false;
    board.removePiece(capturedPiece);
    move.isCapture = true;
  }
  board.removePiece(piece);
  piece.currentSquare = to;
  board.addPiece({ ...piece, currentSquare: to });
};

export const undoMove = (move: Move) => {
  const { from, piece, capturedPiece, board } = move;
  if (capturedPiece) {
    capturedPiece.isAlive = true;
    board.addPiece(capturedPiece);
  }
  board.removePiece(piece);
  piece.currentSquare = from;
  board.addPiece({ ...piece, currentSquare: from });
};
