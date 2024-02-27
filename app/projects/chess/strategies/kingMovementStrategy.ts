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

  const canCastleKingSide = (board, king, rookPositions, moveHistory) => {
    const { kingSideRookCol } = rookPositions;
    const rook = getPieceAt(board, king.currentSquare.row, kingSideRookCol);

    const kingHasMoved = moveHistory.includes(king);
    const rookHasMoved = moveHistory.includes(rook);

    if (kingHasMoved || rookHasMoved) return false;

    return isEmptyAndNotAttacked(
      board,
      king,
      king.currentSquare.col + 1,
      king.currentSquare.col + 2,
      king.player
    );
  };

  const canCastleQueenSide = (board, king, rookPositions, moveHistory) => {
    const { queenSideRookCol } = rookPositions;
    const rook = getPieceAt(board, king.currentSquare.row, queenSideRookCol);

    const kingHasMoved = moveHistory.includes(king);
    const rookHasMoved = moveHistory.includes(rook);

    if (kingHasMoved || rookHasMoved) return false;

    return isEmptyAndNotAttacked(
      board,
      king,
      king.currentSquare.col - 2,
      king.currentSquare.col - 1,
      king.player
    );
  };

  const addCastlingMoves = (board, king, legalMoves, moveHistory) => {
    const rookPositions = {
      kingSideRookCol: 7,
      queenSideRookCol: 0,
    };

    if (canCastleKingSide(board, king, rookPositions, moveHistory)) {
      legalMoves.push(
        createPreparedMove(
          king,
          king.currentSquare,
          createSquare(king.currentSquare.row, king.currentSquare.col + 2),
          undefined
        )
      );
    }

    if (canCastleQueenSide(board, king, rookPositions, moveHistory)) {
      legalMoves.push(
        createPreparedMove(
          king,
          king.currentSquare,
          createSquare(king.currentSquare.row, king.currentSquare.col - 2),
          undefined
        )
      );
    }
  };
  return legalMoves;
};
