import {
  MovementStrategy,
  PreparedMove,
  Piece,
  Square,
  Player,
} from "../types";
import {
  createSquare,
  createPreparedMove,
  isEmpty,
  isOccupiedByOpponent,
  isAttackedByOpponent,
  getPieceAt,
} from "../utils";

export const kingMovementStrategy: MovementStrategy = (
  board,
  piece,
  moveHistory
) => {
  let legalMoves: PreparedMove[] = [];
  let row = piece.currentSquare.row;
  let col = piece.currentSquare.col;

  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  directions.forEach(([dRow, dCol]) => {
    let newRow = row + dRow;
    let newCol = col + dCol;

    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetSquare = createSquare(newRow, newCol);
      if (
        isEmpty(board, newRow, newCol) ||
        isOccupiedByOpponent(board, newRow, newCol, piece.player)
      ) {
        const capturedPiece = isOccupiedByOpponent(
          board,
          newRow,
          newCol,
          piece.player
        )
          ? getPieceAt(board, newRow, newCol)
          : undefined;
        legalMoves.push(
          createPreparedMove(
            piece,
            piece.currentSquare,
            targetSquare,
            capturedPiece
          )
        );
      }
    }
  });

  const isEmptyAndNotAttacked = (
    board: Square[][],
    king: Piece,
    startCol: number,
    endCol: number,
    player: Player
  ) => {
    for (let col = startCol; col <= endCol; col++) {
      if (
        !isEmpty(board, king.currentSquare.row, col) ||
        isAttackedByOpponent(board, king.currentSquare.row, col, player)
      ) {
        return false;
      }
    }
    return true;
  };

  const canCastleKingSide = (board, piece, moveHistory) => {
    // Implement the logic to check if king-side castling is possible.
    // This includes checking for the absence of moves for the king and the rook, no pieces in between, and no threats to the passing squares.
    return false; // Placeholder
  };

  const canCastleQueenSide = (board, piece, moveHistory) => {
    // Similarly, implement the logic for queen-side castling.
    return false; // Placeholder
  };

  // Assuming you've added the basic king moves to legalMoves already
  if (canCastleKingSide(board, piece, moveHistory)) {
    // Add the king-side castling move to legalMoves
  }

  if (canCastleQueenSide(board, piece, moveHistory)) {
    // Add the queen-side castling move to legalMoves
  }
  return legalMoves;
};
