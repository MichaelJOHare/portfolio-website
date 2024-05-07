import { useChessGame } from "../hooks/useChessGame";
import { Square, Piece } from "../types";
import { getPieceAt, createStandardMove, CanMove } from "../utils";

export const HandleMove = (movingPiece: Piece, targetSquare: Square) => {
  const {
    board,
    piecesByPlayer,
    executeMove,
    wouldResultInCheck,
    switchPlayer,
  } = useChessGame();

  if (CanMove(movingPiece, targetSquare)) {
    const capturedPiece = getPieceAt(board, targetSquare.row, targetSquare.col);
    const tempMove = createStandardMove(
      movingPiece,
      movingPiece.currentSquare,
      targetSquare,
      capturedPiece
    );
    if (!wouldResultInCheck(movingPiece, tempMove, piecesByPlayer)) {
      executeMove(tempMove);
      switchPlayer();
    }
  }
};
