import { MovementStrategy, Move } from "../types";
import { createStandardMove, getPieceAt, createSquare } from "../utils";

export const rookMovementStrategy: MovementStrategy = (board, piece) => {
  let legalMoves: Move[] = [];
  let row = piece.currentSquare.row;
  let col = piece.currentSquare.col;

  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  directions.forEach(([dRow, dCol]) => {
    let newRow = row + dRow;
    let newCol = col + dCol;

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetSquare = createSquare(newRow, newCol);
      const capturedPiece = getPieceAt(board, newRow, newCol);
      legalMoves.push(
        createStandardMove(
          piece,
          piece.currentSquare,
          targetSquare,
          capturedPiece
        )
      );

      if (board[newRow][newCol].piece) break;

      newRow += dRow;
      newCol += dCol;
    }
  });

  return legalMoves;
};
