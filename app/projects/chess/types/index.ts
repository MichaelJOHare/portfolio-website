import { ReactNode } from "react";

export type Square = {
  row: number;
  col: number;
  piece?: Piece;
};

export type SquareProps = {
  square: number[];
  legalMoveSquares: Move[];
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

export type PieceSetup = {
  type: PieceType;
  positions: { row: number; col: number }[];
  movementStrategy: MovementStrategy;
};

export interface GameState {
  board: Square[][];
  players: Player[];
  piecesByPlayer: Map<Player, Piece[]>;
  currentPlayerMoves: Move[];
  capturedPieces: Piece[];
  currentPlayerIndex: number;
  moveHistory: Move[];
  undoneMoves: Move[];
  halfMoveClock: number;
  fullMoveNumber: number;
}

export type GameStateContext = {
  board: Square[][];
  enPassantTarget?: Square;
  moveHistory: Move[];
  players: Player[];
  currentPlayerIndex: number;
  currentPlayerMoves: Move[];
  initializeBoard: () => void;
  playerCanMove: (piece: Piece, targetSquare: Square) => Move | null;
  handleMove: (piece: Piece, targetSquare: Square) => Move | undefined;
};

export enum MoveType {
  STNDRD = "Standard",
  CASTLE = "Castling",
  EP = "EnPassant",
  PROMO = "Promotion",
}

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

export interface EnPassantMove extends Move {
  capturedPieceSquare: Square;
}

export interface PromotionMove extends Move {
  promotionType: PieceType;
}

export interface MovementStrategy {
  (board: Square[][], piece: Piece, moveHistory?: Move[]): Move[];
}
