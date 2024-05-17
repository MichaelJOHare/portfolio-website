import { ReactNode } from "react";

export type Square = {
  row: number;
  col: number;
  piece?: Piece;
};

export type SquareProps = {
  square: number[];
  legalMoveSquares: Move[];
  onSquareClick: (row: number, col: number) => void;
  children: ReactNode;
};

export type BoardProps = {
  isStockfishClassicalChecked: boolean;
  isStockfishNnueChecked: boolean;
  squaresToHide: Square[];
  showPromotionPanel: boolean;
  handleSquaresToHide: (squares: Square[]) => void;
  handleShowPromotionPanel: (isShown: boolean) => void;
};

export type HighlightedSquares = {
  drawnOnSquares: Square[];
  stockfishBestMoveSquares: Square[];
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

export interface BoardState {
  legalMoveSquares: Move[];
  engineInitialized: boolean;
  engineRunning: boolean;
  promotionSquare: Square | undefined;
  promotionColor: PlayerColor | undefined;
  promotingPawn: Piece | undefined;
  selectedPiece: Piece | undefined;
}

export interface GameState {
  board: Square[][];
  players: Player[];
  piecesByPlayer: Map<Player, Piece[]>;
  currentPlayerMoves: Move[];
  capturedPieces: Piece[];
  isKingInCheck: boolean;
  kingSquare: Square | undefined;
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
  isKingInCheck: boolean;
  kingSquare: Square | undefined;
  halfMoveClock: number;
  fullMoveNumber: number;
  initializeBoard: () => void;
  playerCanMove: (
    piece: Piece,
    targetSquare: Square,
    promotionMove?: PromotionMove
  ) => Move | undefined;
  handleMove: (
    piece: Piece,
    targetSquare: Square,
    promotionMove?: PromotionMove
  ) => void;
  undoMove: () => void;
  redoMove: () => void;
};

export interface ChessboardHighlighter {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

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
