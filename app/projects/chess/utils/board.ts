import {
  Square,
  Piece,
  Player,
  Move,
  PieceSetup,
  PieceType,
  PlayerColor,
  CastlingMove,
} from "../types";
import { copyPiece } from "./piece";
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
    Array.from({ length: 8 }, (_, col) => ({
      row,
      col,
      piece: undefined,
    }))
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
  row: number,
  col: number,
  player: Player
): boolean => {
  console.log(opponentMoves);
  return opponentMoves.some((move) => {
    /*     const piece = move.piece;
    if (piece.type === PieceType.PAWN) {
      return isSquareAttackedByPawn(
        piece.currentSquare.row,
        piece.currentSquare.col,
        row,
        col,
        player
      );
    } */
    return (
      /*       piece &&
      piece.player.color !== player.color &&
      move.to.row === row &&
      move.to.col === col */
      move.capturedPiece && move.capturedPiece.type === PieceType.KING
    );
  });
};

export const isSquareAttackedByPawn = (
  pawnRow: number,
  pawnCol: number,
  kingRow: number,
  targetCol: number,
  player: Player
) => {
  if (player.color === PlayerColor.WHITE) {
    return (
      pawnRow + 1 === kingRow &&
      (pawnCol - 1 === targetCol || pawnCol + 1 === targetCol)
    );
  } else {
    return (
      pawnRow - 1 === kingRow &&
      (pawnCol - 1 === targetCol || pawnCol + 1 === targetCol)
    );
  }
};

export const isEmptyAndNotAttacked = (
  opponentMoves: Move[],
  board: Square[][],
  king: Piece,
  startCol: number,
  endCol: number,
  player: Player
) => {
  for (let col = startCol; col <= endCol; col++) {
    if (
      !isEmpty(board, king.currentSquare.row, col) ||
      isAttackedByOpponent(opponentMoves, king.currentSquare.row, col, player)
    ) {
      return false;
    }
  }
  return true;
};

export const isValidCastlingMove = (
  move: CastlingMove,
  opponentMoves: Move[],
  board: Square[][]
) => {
  return isEmptyAndNotAttacked(
    opponentMoves,
    board,
    move.piece,
    move.kingFrom.col,
    move.kingTo.col,
    move.piece.player
  );
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
