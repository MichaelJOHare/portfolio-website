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
        piece.player.color !== player.color &&
        piece
          .movementStrategy(board, piece)
          .some((m) => m.to.row === row && m.to.col === col)
      );
    })
  );
};

export const isEmptyAndNotAttacked = (
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
