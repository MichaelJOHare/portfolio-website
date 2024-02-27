import { MovementStrategy, PreparedMove } from "../types";
import { createSquare } from "../utils/square";
import { createPreparedMove } from "../utils/move";
import { getPieceAt, isEmpty, isOccupiedByOpponent } from "../utils/board";

export const bishopMovementStrategy: MovementStrategy = (board, piece) => {
  let legalMoves: PreparedMove[] = [];
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
      if (isEmpty(board, newRow, newCol)) {
        legalMoves.push(
          createPreparedMove(piece, piece.currentSquare, targetSquare)
        );
      } else {
        if (isOccupiedByOpponent(board, newRow, newCol, piece.player)) {
          const capturedPiece = getPieceAt(board, newRow, newCol);
          legalMoves.push(
            createPreparedMove(
              piece,
              piece.currentSquare,
              targetSquare,
              capturedPiece
            )
          );
        }
        break;
      }
    }
  });

  return legalMoves;
};
