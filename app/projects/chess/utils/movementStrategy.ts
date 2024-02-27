import { BoardStateContext, Piece, Move, MoveHistory } from "../types";
import { createMove, copyPiece } from "./index";

const wouldResultInCheck = (
  boardContext: BoardStateContext,
  piece: Piece,
  moveHistory: MoveHistory,
  move: Move
): boolean => {
  const copiedBoardContext = boardContext.copy();
  const copiedMoveHistory = moveHistory.copy();
  const copiedPiece = copyPiece(piece);
  const copiedCapturedPiece = !!move.capturedPiece
    ? copyPiece(move.capturedPiece)
    : undefined;
  const copiedPlayer = copiedPiece.player;

  const copiedMove = createMove(
    copiedPiece,
    move.from,
    move.to,
    copiedBoardContext,
    copiedCapturedPiece
  );

  copiedMoveHistory.makeMove(copiedMove);
  //copiedBoard.initializePieceManager(); <- unneeded since BoardContext has piecesByPlayer map as a property?

  return copiedBoardContext.isKingInCheck(copiedPlayer);
};
