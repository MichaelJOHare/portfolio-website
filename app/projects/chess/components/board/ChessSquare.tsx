import { useRef, useState, useEffect } from "react";
import { SquareProps } from "../../types";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { canMove } from "./Board";
import { isSquare } from "../../utils";
import { useChessGame } from "../../hooks/useChessGame";

type HoveredState = "idle" | "validMove" | "invalidMove";

export const ChessSquare = ({ square, children }: SquareProps) => {
  const { board } = useChessGame();
  const ref = useRef(null);
  const [state, setState] = useState<HoveredState>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: ({ source }) => {
        if (!isSquare(source.data.square)) {
          return;
        }
        if (canMove(board, source.data.square, square)) {
          setState("validMove");
        } else {
          setState("invalidMove");
        }
      },
      onDragLeave: () => setState("idle"),
      onDrop: () => setState("idle"),
    });
  }, []);

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
