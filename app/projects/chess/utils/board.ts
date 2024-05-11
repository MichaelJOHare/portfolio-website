import {
  Square,
  Piece,
  Player,
  Move,
  PieceSetup,
  PieceType,
  CastlingMove,
} from "../types";
import { copyPiece } from "./piece";
import { createSquare } from "./square";
import {
  rookMovementStrategy,
  knightMovementStrategy,
  bishopMovementStrategy,
  queenMovementStrategy,
  kingMovementStrategy,
  pawnMovementStrategy,
} from "./strategies";

export const defaultBoard = (): Square[][] => {
  return Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => createSquare(row, col, undefined))
  );
};

export const setupPieces: PieceSetup[] = [
  {
    type: PieceType.ROOK,
    positions: [
      { row: 0, col: 0 },
      { row: 0, col: 7 },
    ],
    movementStrategy: rookMovementStrategy,
  },
  {
    type: PieceType.KNIGHT,
    positions: [
      { row: 0, col: 1 },
      { row: 0, col: 6 },
    ],
    movementStrategy: knightMovementStrategy,
  },
  {
    type: PieceType.BISHOP,
    positions: [
      { row: 0, col: 2 },
      { row: 0, col: 5 },
    ],
    movementStrategy: bishopMovementStrategy,
  },
  {
    type: PieceType.QUEEN,
    positions: [{ row: 0, col: 3 }],
    movementStrategy: queenMovementStrategy,
  },
  {
    type: PieceType.KING,
    positions: [{ row: 0, col: 4 }],
    movementStrategy: kingMovementStrategy,
  },
  {
    type: PieceType.PAWN,
    positions: Array.from({ length: 8 }, (_, col) => ({ row: 1, col })),
    movementStrategy: pawnMovementStrategy,
  },
];

export const getPieceAt = (
  board: Square[][],
  row: number,
  col: number
): Piece | undefined => {
  return board[row][col].piece;
};

export const isEmpty = (
  board: Square[][],
  row: number,
  col: number
): boolean => {
  return !board[row][col].piece;
};

export const isAttackedByOpponent = (
  opponentMoves: Move[],
  targetSquare: Square
): boolean => {
  return opponentMoves.some((move) => {
    return (
      (move.to.row === targetSquare.row && move.to.col === targetSquare.col) ||
      (move.capturedPiece && move.capturedPiece.type === PieceType.KING)
    );
  });
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

export const copyBoard = (board: Square[][]) => {
  const copiedBoard = board.map((row) =>
    row.map((square) => ({
      ...square,
      piece: square.piece ? copyPiece(square.piece) : undefined,
    }))
  );
  const copiedPiecesByPlayer = [...board.flat()].reduce((acc, square) => {
    const piece = square.piece;
    if (piece) {
      const player = piece.player;
      if (!acc.has(player)) {
        acc.set(player, []);
      }
      acc.get(player)?.push(copyPiece(piece));
    }
    return acc;
  }, new Map<Player, Piece[]>());
  return { copiedBoard, copiedPiecesByPlayer };
};
