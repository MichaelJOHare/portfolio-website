import { Square, Piece, Player } from "../types";

export const defaultBoard = (): Square[][] => {
  return Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({
      row,
      col,
      piece: undefined,
    }))
  );
};

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

export const isOccupiedByOpponent = (
  board: Square[][],
  row: number,
  col: number,
  player: Player
): boolean => {
  const piece = board[row][col].piece;
  return !!piece && piece.player !== player;
};
