import { Square, PlayerColor, PieceType, Player, Move } from "../types";
import { getPieceAt } from "./board";
import { createSquare, squareToString } from "./square";

export function toFEN(
  board: Square[][],
  players: Player[],
  currentPlayerIndex: number,
  moveHistory: Move[],
  halfMoveClock: number,
  fullMoveNumber: number
): string {
  let fen = "";

  const pieceToFENMap = {
    [PieceType.KING]: { [PlayerColor.WHITE]: "K", [PlayerColor.BLACK]: "k" },
    [PieceType.QUEEN]: { [PlayerColor.WHITE]: "Q", [PlayerColor.BLACK]: "q" },
    [PieceType.ROOK]: { [PlayerColor.WHITE]: "R", [PlayerColor.BLACK]: "r" },
    [PieceType.BISHOP]: { [PlayerColor.WHITE]: "B", [PlayerColor.BLACK]: "b" },
    [PieceType.KNIGHT]: { [PlayerColor.WHITE]: "N", [PlayerColor.BLACK]: "n" },
    [PieceType.PAWN]: { [PlayerColor.WHITE]: "P", [PlayerColor.BLACK]: "p" },
  };
  const epTarget = getEnPassantTarget(moveHistory);

  // 1. Piece placement
  for (let row = 0; row < 8; row++) {
    let emptySquares = 0;
    for (let col = 0; col < 8; col++) {
      const piece = getPieceAt(board, row, col);
      if (piece === undefined) {
        emptySquares++;
      } else {
        if (emptySquares !== 0) {
          fen += emptySquares;
          emptySquares = 0;
        }
        const pieceFEN = piece && pieceToFENMap[piece.type][piece.color];
        fen += pieceFEN;
      }
    }
    if (emptySquares !== 0) {
      fen += emptySquares;
    }
    if (row < 7) {
      fen += "/";
    }
  }

  // Append other FEN parts (simplified for brevity)
  fen +=
    " " + (players[currentPlayerIndex].color === PlayerColor.WHITE ? "w" : "b");
  fen += " " + generateCastlingAvailability(board);
  fen += " " + (epTarget !== null ? squareToString(epTarget) : "-");
  fen += " " + halfMoveClock;
  fen += " " + fullMoveNumber;

  return fen;
}

function generateCastlingAvailability(board: Square[][]) {
  let castlingAvailability = "";

  function checkSide(
    majorPieceRow: number,
    queenSideRookColumn: number,
    kingSideRookColumn: number,
    isWhite: boolean
  ) {
    const king = board[majorPieceRow][4].piece;
    if (king && king.type === PieceType.KING && !king.hasMoved) {
      const rookPositions = [kingSideRookColumn, queenSideRookColumn];
      for (let position of rookPositions) {
        const rook = board[majorPieceRow][position].piece;
        if (rook && rook.type === PieceType.ROOK && !rook.hasMoved) {
          castlingAvailability += isWhite
            ? position === kingSideRookColumn
              ? "K"
              : "Q"
            : position === kingSideRookColumn
            ? "k"
            : "q";
        }
      }
    }
  }

  checkSide(7, 0, 7, true);

  checkSide(0, 0, 7, false);

  return castlingAvailability || "-";
}

function getEnPassantTarget(moveHistory: Move[]) {
  const move =
    moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
  if (
    move &&
    move.piece.type === PieceType.PAWN &&
    Math.abs(move.from.row - move.to.row) === 2
  ) {
    return createSquare((move.from.row + move.to.row) / 2, move.from.col);
  }
  return null;
}
