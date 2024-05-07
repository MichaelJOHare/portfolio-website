import { MovementStrategy, Piece, Square, Move, PieceType } from "../types";
import {
  createSquare,
  createStandardMove,
  createCastlingMove,
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
    const kingSideRook = getPieceAt(
      board,
      king.currentSquare.row,
      rookPositions.kingSideRookCol
    );
    const queenSideRook = getPieceAt(
      board,
      king.currentSquare.row,
      rookPositions.queenSideRookCol
    );

    if (
      canCastleKingSide(board, king, rookPositions.kingSideRookCol) &&
      kingSideRook
    ) {
      legalMoves.push(
        createCastlingMove(
          king,
          kingSideRook,
          king.currentSquare,
          createSquare(king.currentSquare.row, king.currentSquare.col + 2),
          kingSideRook.currentSquare,
          createSquare(
            kingSideRook.currentSquare.row,
            kingSideRook.currentSquare.col - 2
          )
        )
      );
    }

    if (
      canCastleQueenSide(board, king, rookPositions.queenSideRookCol) &&
      queenSideRook
    ) {
      legalMoves.push(
        createCastlingMove(
          king,
          queenSideRook,
          king.currentSquare,
          createSquare(king.currentSquare.row, king.currentSquare.col - 2),
          queenSideRook.currentSquare,
          createSquare(
            queenSideRook.currentSquare.row,
            queenSideRook.currentSquare.col + 3
          )
        )
      );
    }
  };

  directions.forEach(([dRow, dCol]) => {
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
    addCastlingMoves(board, piece, legalMoves);
  });

  return legalMoves;
};
