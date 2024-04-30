import { useCallback, useState, useRef } from "react";
import {
  Piece,
  Player,
  Square,
  PlayerColor,
  PieceType,
  PlayerType,
} from "../types";
import { bishopMovementStrategy } from "../strategies/bishopMovementStrategy";
import { defaultBoard } from "../utils/board";
import { createPiece, createPlayer, createSquare } from "../utils";

export const useBoardManagement = () => {
  const player1 = createPlayer(PlayerColor.WHITE, PlayerType.HUMAN);
  const player2 = createPlayer(PlayerColor.BLACK, PlayerType.HUMAN);
  const [board, setBoard] = useState<Square[][]>(defaultBoard());
  const [piecesByPlayer, setPiecesByPlayer] = useState<Map<Player, Piece[]>>(
    new Map()
  );

  const clearBoard = useCallback(() => {
    setBoard(defaultBoard());
  }, []);

  const addPiece = useCallback((piece: Piece) => {
    setBoard((currentBoard) => {
      const updatedBoard = currentBoard.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          if (
            rowIndex === piece.currentSquare.row &&
            colIndex === piece.currentSquare.col
          ) {
            return { ...square, piece };
          }
          return square;
        })
      );

      return updatedBoard;
    });

    setPiecesByPlayer((currentPiecesByPlayer) => {
      const updatedPiecesByPlayer = new Map(currentPiecesByPlayer);
      const playerPieces = updatedPiecesByPlayer.get(piece.player) || [];
      updatedPiecesByPlayer.set(piece.player, [...playerPieces, piece]);
      return updatedPiecesByPlayer;
    });
  }, []);

  const removePiece = useCallback(
    (pieceToRemove: Piece) => {
      setPiecesByPlayer((currentPiecesByPlayer) => {
        const updatedPiecesByPlayer = new Map(currentPiecesByPlayer);
        const playerPieces =
          updatedPiecesByPlayer.get(pieceToRemove.player) || [];
        const filteredPlayerPieces = playerPieces.filter(
          (piece) => piece.id !== pieceToRemove.id
        );
        updatedPiecesByPlayer.set(pieceToRemove.player, filteredPlayerPieces);
        return updatedPiecesByPlayer;
      });

      setBoard((currentBoard) => {
        return currentBoard.map((row) =>
          row.map((square) => {
            if (square.piece && square.piece.id === pieceToRemove.id) {
              return { ...square, piece: undefined };
            }
            return square;
          })
        );
      });
    },
    [setPiecesByPlayer, setBoard]
  );

  const initializeBoardCalled = useRef(false);
  const initializeBoard = useCallback(() => {
    if (initializeBoardCalled.current) {
      return;
    }

    const setup = [
      {
        type: PieceType.ROOK,
        positions: [
          { row: 0, col: 0 },
          { row: 0, col: 7 },
        ],
      },
      {
        type: PieceType.KNIGHT,
        positions: [
          { row: 0, col: 1 },
          { row: 0, col: 6 },
        ],
      },
      {
        type: PieceType.BISHOP,
        positions: [
          { row: 0, col: 2 },
          { row: 0, col: 5 },
        ],
      },
      { type: PieceType.QUEEN, positions: [{ row: 0, col: 3 }] },
      { type: PieceType.KING, positions: [{ row: 0, col: 4 }] },
      {
        type: PieceType.PAWN,
        positions: Array.from({ length: 8 }, (_, col) => ({ row: 1, col })),
      },
    ];

    [PlayerColor.WHITE, PlayerColor.BLACK].forEach((color) => {
      const rowOffset = color === PlayerColor.WHITE ? 0 : 7;
      const pawnRow = color === PlayerColor.WHITE ? 1 : 6;

      setup.forEach(({ type, positions }) => {
        positions.forEach(({ row, col }) => {
          const player = color === PlayerColor.WHITE ? player1 : player2;
          const pieceRow =
            row + (type === PieceType.PAWN ? pawnRow - 1 : rowOffset);
          const square = createSquare(pieceRow, col);
          const hasMoved =
            type === PieceType.ROOK || type === PieceType.KING
              ? false
              : undefined;

          const piece = createPiece(
            player,
            type,
            color,
            square,
            bishopMovementStrategy, // placeholder
            true,
            hasMoved
          );

          addPiece(piece);
        });
      });
    });

    initializeBoardCalled.current = true;
  }, [player1, player2, addPiece]);

  return {
    player1,
    player2,
    board,
    piecesByPlayer,
    setPiecesByPlayer,
    addPiece,
    removePiece,
    clearBoard,
    initializeBoard,
  };
};
