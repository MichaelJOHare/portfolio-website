"use client";

import React from "react";
import { useChessGame } from "../../hooks/useChessGame";

export default function Board() {
  const { board } = useChessGame();
  return (
    <div className="grid grid-cols-8 w-[90vmin] h-[90vmin] lg:w-[70vmin] lg:h-[70vmin]">
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`flex justify-center items-center w-full h-full aspect-square ${
              (rowIndex + colIndex) % 2 === 0
                ? "bg-orange-200"
                : "bg-yellow-900"
            }`}
          >
            {square.piece && (
              <img
                className="h-3/4"
                src={`/assets/images/${square.piece.color}-${square.piece.type}.svg`}
                alt=""
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
