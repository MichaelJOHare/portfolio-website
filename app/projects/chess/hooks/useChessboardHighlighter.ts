import { useState } from "react";
import { ChessboardHighlighter, ArrowProps, CircleProps } from "../types";

export const useChessboardHighlighter = (
  setArrowHighlighterState: (arrowCoordinates: ArrowProps) => void,
  setCircleHighlighterState: (circleCoordinates: CircleProps) => void
): ChessboardHighlighter => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [circleDrawn, setCircleDrawn] = useState(false);
  const [hasMovedOutOfSquare, setHasMovedOutOfSquare] = useState(false);
  const [originalSquare, setOriginalSquare] = useState<{
    row: number;
    col: number;
  }>();

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      clearArrowHighlighterState();
      clearCircleHighlighterState();
    }
    if (e.button === 2) {
      const square = getSquareFromCoordinates(e.clientX, e.clientY);
      setOriginalSquare(square);
      setIsDrawing(true);
      setHasMovedOutOfSquare(false);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.buttons === 2 && isDrawing) {
      const currentSquare = getSquareFromCoordinates(e.clientX, e.clientY);
      if (currentSquare && originalSquare) {
        const isInOriginalSquare =
          currentSquare.row === originalSquare.row &&
          currentSquare.col === originalSquare.col;
        if (!isInOriginalSquare) {
          clearCircleHighlighterState();
          setArrowHighlighterState({
            x1: originalSquare.col * 12.5 + 6.25,
            y1: originalSquare.row * 12.5 + 6.25,
            x2: currentSquare.col * 12.5 + 6.25,
            y2: currentSquare.row * 12.5 + 6.25,
          });
          setHasMovedOutOfSquare(true);
          setCircleDrawn(false);
        } else if (isInOriginalSquare && hasMovedOutOfSquare) {
          clearArrowHighlighterState();
          setCircleHighlighterState({
            cx: originalSquare.col * 12.5 + 6.25,
            cy: originalSquare.row * 12.5 + 6.25,
          });
          setHasMovedOutOfSquare(false);
          setCircleDrawn(true);
        }
      }
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 2 && isDrawing) {
      if (!hasMovedOutOfSquare && !circleDrawn && originalSquare) {
        setCircleHighlighterState({
          cx: originalSquare.col * 12.5 + 6.25,
          cy: originalSquare.row * 12.5 + 6.25,
        });
      }
      setIsDrawing(false);
      setHasMovedOutOfSquare(false);
      setOriginalSquare(undefined);
      setCircleDrawn(false);
    }
  };

  const getSquareFromCoordinates = (x: number, y: number) => {
    const board = document.getElementById("chessboard");
    const rect = board && board.getBoundingClientRect();
    if (rect) {
      const relX = x - rect.left;
      const relY = y - rect.top;
      const squareSize = board.clientWidth / 8;

      const dpi = window.devicePixelRatio || 1;
      const scaleX = (rect.width * dpi) / board.offsetWidth;
      const scaleY = (rect.height * dpi) / board.offsetHeight;
      let col = Math.floor((relX * scaleX) / squareSize);
      let row = Math.floor((relY * scaleY) / squareSize);
      const square = { row, col };

      return square;
    }
  };

  const clearArrowHighlighterState = () => {
    setArrowHighlighterState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  };
  const clearCircleHighlighterState = () => {
    setCircleHighlighterState({ cx: 0, cy: 0 });
  };

  return { onMouseDown, onMouseMove, onMouseUp };
};
