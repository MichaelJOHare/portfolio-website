import {
  Piece,
  Player,
  PieceType,
  PlayerColor,
  Square,
  MovementStrategy,
} from "../types";

export const createPiece = (
  player: Player,
  type: PieceType,
  color: PlayerColor,
  currentSquare: Square,
  movementStrategy: MovementStrategy,
  isAlive: boolean
): Piece => ({
  player,
  type,
  color,
  currentSquare,
  movementStrategy,
  isAlive,
});

export const copyPiece = (piece: Piece): Piece => {
  return {
    ...piece,
    currentSquare: { ...piece.currentSquare },
  };
};
