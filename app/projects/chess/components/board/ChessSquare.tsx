import { useRef, useState, useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { Square, SquareProps } from "../../types";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { createSquare, getPieceAt, isSquare } from "../../utils";

type HoveredState = "idle" | "validMove" | "invalidMove";

export const ChessSquare = ({ square, children }: SquareProps) => {
  const { playerCanMove, board } = useGameContext();
  const ref = useRef(null);
  const [state, setState] = useState<HoveredState>("idle");

  const isColumn7 = square[1] === 7;
  const isRow7 = square[0] === 7;

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
        const squareArray = source.data.square;
        const movingPiece = getPieceAt(board, squareArray[0], squareArray[1]);
        if (
          movingPiece &&
          playerCanMove(movingPiece, createSquare(square[0], square[1]))?.piece
            .id === movingPiece.id
        ) {
          setState("validMove");
        }
      },
      onDragLeave: () => setState("idle"),
      canDrop: ({ source }) => {
        if (!isSquare(source.data.square)) {
          return false;
        }
        return !isSameSquare(source.data.square, [square[0], square[1]]);
      },
      onDrop: () => {
        setState("idle");
      },
    });
  }, [square, board, playerCanMove]);

  const isDark = (square[0] + square[1]) % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex justify-center items-center w-full h-full aspect-square ${getColor(
        state,
        isDark
      )}`}
    >
      {children}
      {isColumn7 && (
        <div
          className={`absolute top-0 right-0 pt-1 pr-1 text-xs ${
            isDark ? "text-yellow-900" : "text-orange-200"
          } select-none`}
        >
          {8 - square[0]}
        </div>
      )}
      {isRow7 && (
        <div
          className={`absolute bottom-0 left-0 pl-1 text-xs ${
            isDark ? "text-yellow-900" : "text-orange-200"
          } select-none`}
        >
          {String.fromCharCode(97 + square[1])}
        </div>
      )}
    </div>
  );
};

function getColor(state: HoveredState, isDark: boolean): string {
  if (state === "validMove") {
    return "bg-green-400";
  }
  return isDark ? "bg-orange-200" : "bg-yellow-900";
}

function isSameSquare(sourceSquare: number[], targetSquare: number[]) {
  return (
    sourceSquare[0] === targetSquare[0] && sourceSquare[1] === targetSquare[1]
  );
}
