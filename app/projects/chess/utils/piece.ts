import { v4 as uuidv4 } from "uuid";
import {
  Piece,
  Player,
  PieceType,
  PlayerColor,
  Square,
  MovementStrategy,
} from "../types";

import { isSquare, createSquare } from "./square";
import { isPlayer, isPlayerColor } from "./player";
import {
  bishopMovementStrategy,
  knightMovementStrategy,
  queenMovementStrategy,
  rookMovementStrategy,
} from "./strategies";

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

export const getMovementStrategyFromType = (
  pieceType: PieceType
): MovementStrategy | undefined => {
  let moveStrat: MovementStrategy | undefined;
  switch (pieceType) {
    case PieceType.QUEEN:
      moveStrat = queenMovementStrategy;
      break;
    case PieceType.ROOK:
      moveStrat = rookMovementStrategy;
      break;
    case PieceType.BISHOP:
      moveStrat = bishopMovementStrategy;
      break;
    case PieceType.KNIGHT:
      moveStrat = knightMovementStrategy;
      break;
    default:
      moveStrat = undefined;
      break;
  }
  return moveStrat;
};

export const copyPiece = (piece: Piece): Piece => {
  return {
    ...piece,
  };
};

export function isPiece(token: unknown): token is Piece {
  if (typeof token !== "object" || token === null) {
    return false;
  }

  const piece = token as Piece;

  return (
    typeof piece.id === "string" &&
    isPlayer(piece.player) &&
    isPieceType(piece.type) &&
    isPlayerColor(piece.color) &&
    isSquare(piece.currentSquare) &&
    typeof piece.movementStrategy === "function" &&
    typeof piece.isAlive === "boolean" &&
    (typeof piece.hasMoved === "undefined" ||
      typeof piece.hasMoved === "boolean")
  );
}

export function isPieceType(token: unknown): token is PieceType {
  return (
    typeof token === "string" &&
    (token === PieceType.PAWN ||
      token === PieceType.ROOK ||
      token === PieceType.KNIGHT ||
      token === PieceType.BISHOP ||
      token === PieceType.QUEEN ||
      token === PieceType.KING)
  );
}

export function getPieceUnicode(type: PieceType) {
  switch (type) {
    case PieceType.KING:
      return "♚";
    case PieceType.QUEEN:
      return "♛";
    case PieceType.ROOK:
      return "♜";
    case PieceType.BISHOP:
      return "♝";
    case PieceType.KNIGHT:
      return "♞";
  }
}
