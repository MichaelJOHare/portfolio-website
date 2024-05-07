/* import { executeMove } from "./move";
import { createSquare } from "./square";
import { Move, MoveHistory, PieceType, PlayerColor } from "../types";

export const creatMoveHistory = (): MoveHistory => ({
  history: [],
  undoneMoves: [],
  halfMoveClock: 0,
  fullMoveNumber: 1,
});


export const getEnPassantTarget = (moveHistory: MoveHistory) => {
  const move =
    moveHistory.history.length > 0
      ? moveHistory.history[moveHistory.history.length - 1]
      : null;
  if (
    move &&
    move.piece.type === PieceType.PAWN &&
    Math.abs(move.from.row - move.to.row) === 2
  ) {
    return createSquare((move.from.row + move.to.row) / 2, move.from.col);
  }
  return null;
}; 

Shifting this over to useGameManagement
*/
