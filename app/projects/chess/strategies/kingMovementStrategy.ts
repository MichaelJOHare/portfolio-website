import { MovementStrategy, Piece, Square, Move, PieceType } from "../types";
import {
  createSquare,
  createMove,
  getPieceAt,
  isEmptyAndNotAttacked,
} from "../utils";

export const kingMovementStrategy: MovementStrategy = (board, piece) => {
  let legalMoves: Move[] = [];
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
      const capturedPiece = getPieceAt(board, newRow, newCol);
      legalMoves.push(
        createMove(piece, piece.currentSquare, targetSquare, capturedPiece)
      );
    }
    addCastlingMoves(board, piece, legalMoves);
  });

  const canCastleKingSide = (
    board: Square[][],
    king: Piece,
    rookCol: number
  ) => {
    const kingSideRookCol = rookCol;
    const pieceAtRookPos = getPieceAt(
      board,
      king.currentSquare.row,
      kingSideRookCol
    );
    const rook =
      pieceAtRookPos?.type === PieceType.ROOK ? pieceAtRookPos : undefined;

    const kingHasMoved = king.hasMoved;
    const rookHasMoved = rook?.hasMoved;

    if (kingHasMoved || rookHasMoved) return false;

    return isEmptyAndNotAttacked(
      board,
      king,
      king.currentSquare.col + 1,
      king.currentSquare.col + 2,
      king.player
    );
  };

  const canCastleQueenSide = (
    board: Square[][],
    king: Piece,
    rookCol: number
  ) => {
    const queenSideRookCol = rookCol;
    const pieceAtRookPos = getPieceAt(
      board,
      king.currentSquare.row,
      queenSideRookCol
    );
    const rook =
      pieceAtRookPos?.type === PieceType.ROOK ? pieceAtRookPos : undefined;

    const kingHasMoved = king.hasMoved;
    const rookHasMoved = rook?.hasMoved;

    if (kingHasMoved || rookHasMoved) return false;

    return isEmptyAndNotAttacked(
      board,
      king,
      king.currentSquare.col - 2,
      king.currentSquare.col - 1,
      king.player
    );
  };

  const addCastlingMoves = (
    board: Square[][],
    king: Piece,
    legalMoves: Move[]
  ) => {
    const rookPositions = {
      kingSideRookCol: 7,
      queenSideRookCol: 0,
    };

    if (canCastleKingSide(board, king, rookPositions.kingSideRookCol)) {
      legalMoves.push(
        createMove(
          // needs to be castling move when implemented
          king,
          king.currentSquare,
          createSquare(king.currentSquare.row, king.currentSquare.col + 2),
          undefined
        )
      );
    }

    if (canCastleQueenSide(board, king, rookPositions.queenSideRookCol)) {
      legalMoves.push(
        createMove(
          // needs to be castling move when implemented
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
