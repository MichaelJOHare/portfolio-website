"use client";

import React from "react";
import { useRef, useState, useEffect } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useChessGame } from "../../hooks/useChessGame";
import { Square, SquareProps } from "../../types";

export default function Board() {
  const { board } = useChessGame();
  return (
    <div className="grid grid-cols-8 w-[90vmin] h-[90vmin] lg:w-[70vmin] lg:h-[70vmin]">
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            square={square}
          >
            <ChessPiece square={square} />
          </Square>
        ))
      )}
    </div>
  );
}

function Square({ col, row, children }: SquareProps & { square: Square }) {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  const isDark = (row + col) % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex justify-center items-center w-full h-full aspect-square ${getColor(
        isDraggedOver,
        isDark
      )}`}
    >
      {children}
    </div>
  );
}
function ChessPiece({ square }: { square: Square }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  return (
    square.piece && (
      <img
        ref={ref}
        className="h-3/4"
        style={{ opacity: dragging ? 0.5 : 1, cursor: "grab" }}
        src={`/assets/images/${square.piece.color}-${square.piece.type}.svg`}
        alt={`${square.piece.type}`}
      />
    )
  );
}

function getColor(isDraggedOver: boolean, isDark: boolean): string {
  if (isDraggedOver) {
    return "bg-green-200";
  }
  return isDark ? "bg-orange-200" : "bg-yellow-900";
}
