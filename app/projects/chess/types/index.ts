import { ReactNode } from "react";

export type Square = {
  row: number;
  col: number;
  piece?: Piece;
};

export type SquareProps = {
  row: number;
  col: number;
  children: ReactNode;
};

export type Player = {
  color: PlayerColor;
  type: PlayerType;
};

export enum PlayerType {
  HUMAN = "Human",
  COMPUTER = "Computer",
}

export enum PlayerColor {
  WHITE = "white",
  BLACK = "black",
}

export type Piece = {
  id: string;
  player: Player;
  type: PieceType;
  color: PlayerColor;
  currentSquare: Square;
  movementStrategy: MovementStrategy;
  isAlive: boolean;
  hasMoved?: boolean;
};

export enum PieceType {
  PAWN = "pawn",
  ROOK = "rook",
  KNIGHT = "knight",
  BISHOP = "bishop",
  QUEEN = "queen",
  KING = "king",
}

export type BoardStateContext = {
  board: Square[][];
  player1: Player;
  player2: Player;
  piecesByPlayer: Map<Player, Piece[]>;
};

export type GameStateContext = {
  currentPlayer: Player;
  capturedPieces: Piece[];
  moveHistory: Move[];
  undoneMoves: Move[];
  halfMoveClock: number;
  fullMoveNumber: number;
  enPassantTarget?: Square;
  executeMove: (move: Move) => void;
  undoLastMove: () => void;
  switchPlayer: () => void;
  isKingInCheck: (player: Player) => boolean;
};

export type MoveType = "Standard" | "Castling" | "EnPassant" | "Promotion";

export interface Move {
  type: MoveType;
  from: Square;
  to: Square;
  piece: Piece;
  capturedPiece?: Piece;
  isPromotion?: boolean;
  isCapture?: boolean;
}

export interface CastlingMove extends Move {
  rook: Piece;
  kingFrom: Square;
  kingTo: Square;
  rookFrom: Square;
  rookTo: Square;
}

export interface MovementStrategy {
  (board: Square[][], piece: Piece, moveHistory: Move[]): Move[];
}