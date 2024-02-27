import { Square, Piece, Player } from "../types";
import { copyPiece } from "./piece";

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

export const isAttackedByOpponent = (
  board: Square[][],
  row: number,
  col: number,
  player: Player
): boolean => {
  return board.some((r) =>
    r.some((s) => {
      const piece = s.piece;
      return (
        piece &&
        piece.player !== player &&
        piece
          .movementStrategy(board, piece, [])
          .some((m) => m.to.row === row && m.to.col === col)
      );
    })
  );
};

export const copyBoard = (board: Square[][]): Square[][] => {
  return board.map((row) =>
    row.map((square) => ({
      ...square,
      piece: square.piece ? copyPiece(square.piece) : undefined,
    }))
  );
};
