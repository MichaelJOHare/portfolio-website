import { Move, MovementStrategy } from "../types";
import { createSquare, createMove, getPieceAt } from "../utils";

export const bishopMovementStrategy: MovementStrategy = (board, piece) => {
  let legalMoves: Move[] = [];
  let row = piece.currentSquare.row;
  let col = piece.currentSquare.col;

  const directions = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ];

  directions.forEach(([dRow, dCol]) => {
    let newRow = row;
    let newCol = col;

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      newRow += dRow;
      newCol += dCol;

      if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

      const targetSquare = createSquare(newRow, newCol);
      const capturedPiece = getPieceAt(board, newRow, newCol);
      legalMoves.push(
        createMove(piece, piece.currentSquare, targetSquare, capturedPiece)
      );
      break;
    }
  });
  return legalMoves;
};
