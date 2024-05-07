"use client";

import React, { useEffect } from "react";
import { ChessSquare } from "./ChessSquare";
import { ChessPiece } from "./ChessPiece";
import { useGameContext } from "../../hooks/useGameContext";
import { createSquare } from "../../utils";

export default function Board() {
  const { board } = useGameContext();
  if (!board[0][0].piece) {
    return null;
  }

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
