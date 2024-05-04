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
    let newRow = row;
    let newCol = col;

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      newRow += dRow;
      newCol += dCol;

      const targetSquare = createSquare(newRow, newCol);
      const targetPiece = getPieceAt(board, newRow, newCol);
      const capturedPiece =
        targetPiece && targetPiece.color !== piece.color
          ? targetPiece
          : undefined;
      legalMoves.push(
        createStandardMove(
          piece,
          piece.currentSquare,
          targetSquare,
          capturedPiece
        )
      );
      break;
    }
  });
  return legalMoves;
};
