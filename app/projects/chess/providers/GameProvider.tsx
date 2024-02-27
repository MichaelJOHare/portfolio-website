"use client";

import React, { useState, useCallback, useEffect } from "react";
import { BoardContext } from "../context/BoardStateContext";
import { GameContext } from "../context/GameStateContext";
import { defaultBoard } from "../utils/board";
import { Square, Player, Piece } from "../types";
import { bishopMovementStrategy } from "../strategies/bishopMovementStrategy";
import { createPlayer } from "../utils/player";

interface Props {
  children: React.ReactNode;
}

export default function GameProvider({ children }: Props) {
  const [board, setBoard] = useState<Square[][]>(defaultBoard());
  const [piecesByPlayer, setPiecesByPlayer] = useState<Map<Player, Piece[]>>(
    new Map()
  );

  // placeholder
  const player1 = createPlayer("white", "Human");
  const player2 = createPlayer("black", "Human");

  const addPiece = useCallback(
    (piece: Piece) => {
      const { row, col } = piece.currentSquare;
      const updatedBoard = board.map((row, rowIndex) =>
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
      updatedBoard[row][col] = { ...updatedBoard[row][col], piece };

      const updatedPiecesByPlayer = new Map(piecesByPlayer);
      console.log("Before adding:", updatedBoard, updatedPiecesByPlayer);
      const playerPieces = updatedPiecesByPlayer.get(piece.player) || [];
      updatedPiecesByPlayer.set(piece.player, [...playerPieces, piece]);

      setBoard(updatedBoard);
      setPiecesByPlayer(updatedPiecesByPlayer);
      console.log("After adding:", updatedBoard, updatedPiecesByPlayer);
    },
    [board, piecesByPlayer]
  );

  const initializeBoard = useCallback(() => {
    const newBoard = defaultBoard();

    const setup = [
      {
        type: "rook",
        positions: [
          { row: 0, col: 0 },
          { row: 0, col: 7 },
        ],
      },
      {
        type: "knight",
        positions: [
          { row: 0, col: 1 },
          { row: 0, col: 6 },
        ],
      },
      {
        type: "bishop",
        positions: [
          { row: 0, col: 2 },
          { row: 0, col: 5 },
        ],
      },
      { type: "queen", positions: [{ row: 0, col: 3 }] },
      { type: "king", positions: [{ row: 0, col: 4 }] },
      {
        type: "pawn",
        positions: Array.from({ length: 8 }, (_, col) => ({ row: 1, col })),
      },
    ];

    ["white", "black"].forEach((color) => {
      const rowOffset = color === "white" ? 0 : 7;
      const pawnRow = color === "white" ? 1 : 6;

      setup.forEach(({ type, positions }) => {
        positions.forEach(({ row, col }) => {
          const piece = {
            player: color === "white" ? player1 : player2,
            type,
            color,
            currentSquare: {
              row: row + (type === "pawn" ? pawnRow - 1 : rowOffset),
              col,
            },
            movementStrategy: bishopMovementStrategy, // placeholder
            isAlive: true,
          };

          addPiece(piece);
        });
      });
    });

    setBoard(newBoard);
  }, [addPiece]);

  useEffect(() => {
    initializeBoard();
  }, []);

  const removePiece = useCallback(
    (piece: Piece) => {
      // logic to remove piece from piecesByPlayer/board
    },
    [piecesByPlayer]
  );

  const clearBoard = useCallback(() => {
    setBoard(defaultBoard());
  }, []);

  return (
    <BoardContext.Provider
      value={{
        board,
        initializeBoard,
        clearBoard,
        piecesByPlayer,
        addPiece,
        removePiece,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
