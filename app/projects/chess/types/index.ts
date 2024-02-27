export type Square = {
  row: number;
  col: number;
  piece?: Piece;
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
  player: Player;
  type: PieceType;
  color: PlayerColor;
  currentSquare: Square;
  movementStrategy: MovementStrategy;
  isAlive: boolean;
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
  piecesByPlayer: Map<Player, Piece[]>;
  initializeBoard: (player1: Player, player2: Player) => void;
  clearBoard: () => void;
  addPiece: (piece: Piece) => void;
  removePiece: (piece: Piece) => void;
};

export type GameStateContext = {
  halfMoveClock: number;
  fullMoveNumber: number;
  player1: Player;
  player2: Player;
  currentPlayer: Player;
  capturedPieces: Piece[];
  enPassantTarget?: Square;
  isKingInCheck: (player: Player) => boolean;
};

export type MoveHistory = {
  history: Move[];
  undoneMoves: Move[];
  halfMoveClock: number;
  fullMoveNumber: number;
};

export type Move = {
  from: Square;
  to: Square;
  piece: Piece;
  capturedPiece?: Piece;
  board: BoardStateContext;
  isPromotion?: boolean;
  isCapture?: boolean;
};

export type PreparedMove = {
  piece: Piece;
  from: Square;
  to: Square;
  capturedPiece?: Piece;
  isPromotion?: boolean;
  isCapture?: boolean;
};

export interface MovementStrategy {
  (board: Square[][], piece: Piece, moveHistory: Move[]): PreparedMove[];
}
