import { useRef, useState, useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { Square, SquareProps } from "../../types";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  createSquare,
  getPieceAt,
  isSquare,
  isSameSquare,
  isEmpty,
} from "../../utils";

type HoveredState = "idle" | "validMove" | "invalidMove";

export const ChessSquare = ({
  square,
  legalMoveSquares,
  onSquareClick,
  children,
}: SquareProps) => {
  const { playerCanMove, board, isKingInCheck, kingSquare } = useGameContext();
  const ref = useRef(null);
  const [state, setState] = useState<HoveredState>("idle");

  const isDark = (square[0] + square[1]) % 2 === 0;
  const isColumn7 = square[1] === 7;
  const isRow7 = square[0] === 7;
  const isLegalMoveSquare = legalMoveSquares.some(
    (move) => move.to.row === square[0] && move.to.col === square[1]
  );

  const handleClick = (row: number, col: number) => {
    onSquareClick(row, col);
  };

  // add previous move highlights
  const getColor = (
    state: HoveredState,
    isDark: boolean,
    isKingInCheck?: boolean,
    kingSquare?: Square
  ): string => {
    if (state === "validMove") {
      return "bg-green-400";
    } else if (
      isKingInCheck &&
      square[0] === kingSquare?.row &&
      square[1] === kingSquare.col
    ) {
      return "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-current to-red-700";
    }
    return isDark ? "bg-orange-200" : "bg-yellow-900";
  };

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

  return (
    <div
      ref={ref}
      className={`relative flex justify-center items-center w-full h-full aspect-square ${getColor(
        state,
        isDark,
        isKingInCheck,
        kingSquare
      )}`}
      onClick={() => handleClick(square[0], square[1])}
    >
      {children}
      {isColumn7 && (
        <div
          className={`absolute top-0 right-0 pt-1 pr-1 text-xs lg:text-sm ${
            isDark ? "text-yellow-900" : "text-orange-200"
          } select-none`}
        >
          {8 - square[0]}
        </div>
      )}
      {isRow7 && (
        <div
          className={`absolute bottom-0 left-0 pl-1 text-xs lg:text-sm ${
            isDark ? "text-yellow-900" : "text-orange-200"
          } select-none`}
        >
          {String.fromCharCode(97 + square[1])}
        </div>
      )}
      {isEmpty(board, square[0], square[1]) && isLegalMoveSquare && (
        <div className="absolute w-4 h-4 rounded-full bg-green-600"></div>
      )}
      {!isEmpty(board, square[0], square[1]) && isLegalMoveSquare && (
        <div className="absolute w-full h-full flex justify-center items-center bg-green-600 overflow-hidden">
          <div
            className={`relative w-full h-full rounded-full ${getColor(
              state,
              isDark
            )} transform scale-110`}
          ></div>
        </div>
      )}
    </div>
  );
};
