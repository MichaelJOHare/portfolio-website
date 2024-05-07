import { useRef, useState, useEffect } from "react";
import { Square, SquareProps } from "../../types";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { isSquare, CanMove, HandleMove } from "../../utils";

type HoveredState = "idle" | "validMove" | "invalidMove";

export const ChessSquare = ({ square, children }: SquareProps) => {
  const ref = useRef(null);
  const [state, setState] = useState<HoveredState>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({ square }),
      onDragEnter: ({ source }) => {
        if (!isSquare(source.data.square)) {
          return false;
        }
        const movingPiece = source.data.square.piece;
        if (movingPiece && CanMove(movingPiece, square)) {
          setState("validMove");
        } else {
          setState("invalidMove");
        }
      },
      onDragLeave: () => setState("idle"),
      canDrop: ({ source }) => {
        if (!isSquare(source.data.square)) {
          return false;
        }
        return !isSameSquare(source.data.square, square);
      },
      onDrop: ({ source }) => {
        if (!isSquare(source.data.square)) {
          return false;
        }
        const movingPiece = source.data.square.piece;
        movingPiece && HandleMove(movingPiece, square);
        setState("idle");
      },
    });
  }, [square]);

  const isDark = (square.row + square.col) % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex justify-center items-center w-full h-full aspect-square ${getColor(
        state,
        isDark
      )}`}
    >
      {children}
    </div>
  );
};

function getColor(state: HoveredState, isDark: boolean): string {
  if (state === "validMove") {
    return "bg-green-400";
  } else if (state === "invalidMove") {
    return "bg-red-300";
  }
  return isDark ? "bg-orange-200" : "bg-yellow-900";
}

function isSameSquare(sourceSquare: Square, targetSquare: Square) {
  return (
    sourceSquare.row === targetSquare.row &&
    sourceSquare.col === targetSquare.col
  );
}
