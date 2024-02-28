import { v4 as uuidv4 } from "uuid";
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
  isAlive: boolean,
  hasMoved?: boolean
): Piece => ({
  id: uuidv4(),
  player,
  type,
  color,
  currentSquare,
  movementStrategy,
  isAlive,
  hasMoved,
});

export const copyPiece = (piece: Piece): Piece => {
  return {
    ...piece,
    currentSquare: { ...piece.currentSquare },
  };
};
