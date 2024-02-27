export type Square = {
  row: number;
  col: number;
  piece?: Piece;
};

export type Player = {
  color: string;
  type: string;
};

export type Piece = {
  player: Player;
  type: string;
  color: string;
  currentSquare: Square;
  movementStrategy: MovementStrategy;
  isAlive: boolean;
};

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
};

export type moveHistory = {
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
