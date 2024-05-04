"use client";

import React from "react";
import { ChessSquare } from "./ChessSquare";
import { ChessPiece } from "./ChessPiece";
import { useChessGame } from "../../hooks/useChessGame";
import { Square } from "../../types";
import { createSquare, createStandardMove, getPieceAt } from "../../utils";

export default function Board() {
  const { board } = useChessGame();
  return (
    <div className="grid grid-cols-8 w-[90vmin] h-[90vmin] lg:w-[70vmin] lg:h-[70vmin]">
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <ChessSquare
            key={`${rowIndex}-${colIndex}`}
            square={createSquare(rowIndex, colIndex)}
          >
            {square.piece && (
              <ChessPiece
                type={square.piece.type}
                color={square.piece.color}
                square={square}
              />
            )}
          </ChessSquare>
        ))
      )}
    </div>
  );
}

export function canMove(
  board: Square[][],
  startSquare: Square,
  targetSquare: Square
) {
  const movingPiece = getPieceAt(board, startSquare.row, startSquare.col); // undefined need to fix
  const capturedPiece = getPieceAt(board, targetSquare.row, targetSquare.col);
  if (
    movingPiece &&
    movingPiece.movementStrategy(board, movingPiece).includes(
      createStandardMove(
        // need to find a way to interface this so createMove can be any kind of move
        movingPiece,
        startSquare,
        targetSquare,
        capturedPiece
      )
    )
  ) {
    return true;
  }
  return false;
}
