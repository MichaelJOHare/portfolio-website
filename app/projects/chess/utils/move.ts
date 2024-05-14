import {
  Move,
  CastlingMove,
  EnPassantMove,
  PromotionMove,
  Square,
  Piece,
  MoveType,
  PieceType,
} from "../types";
import { isEmpty, isAttackedByOpponent } from "./board";
import { createSquare } from "./square";
import { getMovementStrategyFromType } from "./piece";

export const createStandardMove = (
  piece: Piece,
  from: Square,
  to: Square,
  capturedPiece?: Piece,
  isCapture?: boolean
): Move => ({
  type: MoveType.STNDRD,
  from,
  to,
  capturedPiece,
  piece,
  isCapture,
});

export const createCastlingMove = (
  king: Piece,
  rook: Piece,
  kingFrom: Square,
  kingTo: Square,
  rookFrom: Square,
  rookTo: Square
): CastlingMove => ({
  type: MoveType.CASTLE,
  from: kingFrom,
  to: kingTo,
  capturedPiece: undefined,
  piece: king,
  rook: rook,
  isCapture: false,
  kingFrom,
  kingTo,
  rookFrom,
  rookTo,
});

export const createEnPassantMove = (
  piece: Piece,
  from: Square,
  to: Square,
  capturedPieceSquare: Square,
  capturedPiece: Piece
): EnPassantMove => ({
  type: MoveType.EP,
  piece: piece,
  from: from,
  to: to,
  capturedPieceSquare: capturedPieceSquare,
  capturedPiece: capturedPiece,
});

export const createPromotionMove = (
  piece: Piece,
  from: Square,
  to: Square,
  promotionType: PieceType,
  capturedPiece?: Piece
): PromotionMove => ({
  type: MoveType.PROMO,
  piece: piece,
  from: from,
  to: to,
  promotionType: promotionType,
  capturedPiece: capturedPiece,
});

export const executeStandardMove = (
  move: Move,
  boardState: Square[][],
  capturedPiece: Piece | undefined
): Piece[] | undefined => {
  const updatedPiece = {
    ...move.piece,
    currentSquare: move.to,
    hasMoved: true,
  };
  boardState[move.from.row][move.from.col].piece = undefined;
  if (updatedPiece) {
    boardState[move.to.row][move.to.col].piece = updatedPiece;
    const piecesToUpdate: Piece[] = [updatedPiece];
    if (capturedPiece) {
      piecesToUpdate.push(capturedPiece);
    }
    return piecesToUpdate;
  }
};

export const executeCastlingMove = (
  move: Move,
  boardState: Square[][]
): Piece[] => {
  const castlingMove = move as CastlingMove;
  const updatedKing = {
    ...castlingMove.piece,
    currentSquare: castlingMove.kingTo,
    hasMoved: true,
  };
  const updatedRook = {
    ...castlingMove.rook,
    currentSquare: castlingMove.rookTo,
    hasMoved: true,
  };

  boardState[castlingMove.kingFrom.row][castlingMove.kingFrom.col].piece =
    undefined;
  boardState[castlingMove.rookFrom.row][castlingMove.rookFrom.col].piece =
    undefined;

  boardState[castlingMove.kingTo.row][castlingMove.kingTo.col].piece =
    updatedKing;
  boardState[castlingMove.rookTo.row][castlingMove.rookTo.col].piece =
    updatedRook;

  return [updatedKing, updatedRook];
};

export const executeEnPassantMove = (
  move: Move,
  boardState: Square[][],
  epCapturedPiece: Piece | undefined
): Piece[] | undefined => {
  const enPassantMove = move as EnPassantMove;
  const updatedPawn = {
    ...enPassantMove.piece,
    currentSquare: enPassantMove.to,
  };
  boardState[enPassantMove.from.row][enPassantMove.from.col].piece = undefined;
  if (updatedPawn) {
    boardState[move.to.row][move.to.col].piece = updatedPawn;
    const piecesToUpdate: Piece[] = [updatedPawn];
    if (epCapturedPiece) {
      piecesToUpdate.push(epCapturedPiece);
    }
    return piecesToUpdate;
  }
};

export const executePromoMove = (
  move: Move,
  boardState: Square[][],
  capturedPiecePromo: Piece | undefined
): Piece[] | undefined => {
  const promotionMove = move as PromotionMove;
  const moveStrat = getMovementStrategyFromType(promotionMove.promotionType);
  const promotedPawn = moveStrat && {
    ...promotionMove.piece,
    currentSquare: promotionMove.to,
    type: promotionMove.promotionType,
    movementStrategy: moveStrat,
  };
  boardState[promotionMove.from.row][promotionMove.from.col].piece = undefined;
  if (promotedPawn) {
    boardState[move.to.row][move.to.col].piece = promotedPawn;
    const piecesToUpdate: Piece[] = [promotedPawn];
    if (capturedPiecePromo) {
      piecesToUpdate.push(capturedPiecePromo);
    }
    return piecesToUpdate;
  }
};

export const isValidCastlingMove = (
  move: CastlingMove,
  opponentMoves: Move[],
  board: Square[][]
) => {
  const king = move.piece;
  const kingSquare = king.currentSquare;

  const isSquareOccupiedOrAttacked = (row: number, col: number) => {
    if (
      !isEmpty(board, row, col) ||
      isAttackedByOpponent(opponentMoves, createSquare(row, col))
    ) {
      return true;
    }
    return false;
  };

  if (kingSquare.col - move.kingTo.col < 0) {
    if (
      !isSquareOccupiedOrAttacked(kingSquare.row, kingSquare.col + 1) &&
      !isSquareOccupiedOrAttacked(kingSquare.row, kingSquare.col + 2)
    ) {
      return true;
    }
    return false;
  } else {
    if (
      !isSquareOccupiedOrAttacked(kingSquare.row, kingSquare.col - 1) &&
      !isSquareOccupiedOrAttacked(kingSquare.row, kingSquare.col - 2)
    ) {
      return true;
    }
    return false;
  }
};
