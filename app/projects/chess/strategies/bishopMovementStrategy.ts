import { Move, MovementStrategy } from "../types";
import { createSquare, createStandardMove, getPieceAt } from "../utils";

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
    let newRow = row + dRow;
    let newCol = col + dCol;

    while (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
      const targetSquare = createSquare(newRow, newCol);
      const targetPiece = getPieceAt(board, newRow, newCol);
      const capturedPiece =
        targetPiece && targetPiece.color !== piece.color
          ? targetPiece
          : undefined;
      if (targetPiece && targetPiece.color === piece.color) {
        break;
      }
      legalMoves.push(
        createStandardMove(
          piece,
          piece.currentSquare,
          targetSquare,
          capturedPiece
        )
      );
      if (capturedPiece) {
        break;
      }

      newRow += dRow;
      newCol += dCol;
    }
  });
  return legalMoves;
};
