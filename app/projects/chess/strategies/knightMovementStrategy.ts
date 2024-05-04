import { MovementStrategy, Move } from "../types";
import { createStandardMove, createSquare, getPieceAt } from "../utils";

export const knightMovementStrategy: MovementStrategy = (board, piece) => {
  let legalMoves: Move[] = [];
  let row = piece.currentSquare.row;
  let col = piece.currentSquare.col;

  const knightMoves = [
    [-2, 1],
    [-1, 2],
    [2, 1],
    [1, 2],
    [-2, -1],
    [-1, -2],
    [2, -1],
    [1, -2],
  ];

  knightMoves.forEach(([dRow, dCol]) => {
    let newRow = row + dRow;
    let newCol = col + dCol;
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
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
    }
  });

  return legalMoves;
};
