import { useState } from "react";
import { ChessboardHighlighter, HighlightedSquares } from "../types";

export const useChessboardHighlighter = (): ChessboardHighlighter => {
  const [highlightedSquares, setHighlightedSquares] =
    useState<HighlightedSquares>({
      drawnOnSquares: [],
      stockfishBestMoveSquares: [],
    });
  const [isDrawing, setIsDrawing] = useState(false);

  const onMouseDown = (e: MouseEvent) => {
    if (e.button === 2) {
      const startX = e.clientX;
      const startY = e.clientY;

      setIsDrawing(true);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (e.buttons === 2 && isDrawing) {
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (e.button === 2) {
    }
  };
  return { highlightedSquares, onMouseDown, onMouseMove, onMouseUp };
};
