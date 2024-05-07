import { useRef, useState, useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { Square, SquareProps, Piece, Move } from "../../types";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { isSquare, getPieceAt, createStandardMove } from "../../utils";

type HoveredState = "idle" | "validMove" | "invalidMove";

export const ChessSquare = ({ square, children }: SquareProps) => {
  const {
    board,
    currentPlayer,
    piecesByPlayer,
    executeMove,
    wouldResultInCheck,
    switchPlayer,
    addMoveHistory,
  } = useGameContext();
  const ref = useRef(null);
  const [state, setState] = useState<HoveredState>("idle");

  const canMove = (movingPiece: Piece, targetSquare: Square) => {
    if (movingPiece && movingPiece.color !== currentPlayer.color) {
      return false;
    }

    // can optimize calling this only on drag start (maybe calll after executemove, for next player,
    //   to also check for checkmate and use entire list of legal moves)
    const legalMoves = movingPiece.movementStrategy(board, movingPiece);

    return legalMoves.some((move) => {
      return (
        move.to.row === targetSquare.row && move.to.col === targetSquare.col
      );
    });
  };

  const handleMove = (movingPiece: Piece, targetSquare: Square) => {
    if (canMove(movingPiece, targetSquare)) {
      const capturedPiece = getPieceAt(
        board,
        targetSquare.row,
        targetSquare.col
      );
      const tempMove = createStandardMove(
        movingPiece,
        movingPiece.currentSquare,
        targetSquare,
        capturedPiece
      );
      if (!wouldResultInCheck(movingPiece, tempMove, piecesByPlayer)) {
        executeMove(tempMove);
        addMoveHistory(tempMove);
        switchPlayer();
      }
    }
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
        const movingPiece = source.data.square.piece;
        if (movingPiece && canMove(movingPiece, square)) {
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
        movingPiece && handleMove(movingPiece, square);
        setState("idle");
      },
    });
  }, [square, canMove, handleMove]);

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
