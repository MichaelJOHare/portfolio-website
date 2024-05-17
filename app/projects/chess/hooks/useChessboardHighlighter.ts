import { useState } from "react";
import { ChessboardHighlighter } from "../types";

export const useChessboardHighlighter = (
  setArrowCoordinates: React.Dispatch<
    React.SetStateAction<{ x1: number; y1: number; x2: number; y2: number }>
  >
): ChessboardHighlighter => {
  /*   const [highlightedSquares, setHighlightedSquares] =
    useState<HighlightedSquares>({
      drawnOnSquares: [],
      stockfishBestMoveSquares: [],
    }); */
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 2) {
      const rect = e.currentTarget.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      setIsDrawing(true);
      setStartX(startX);
      setStartY(startY);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.buttons === 2 && isDrawing) {
      const rect = e.currentTarget.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      setEndX(endX);
      setEndY(endY);
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 2 && isDrawing) {
      setIsDrawing(false);
      const rect = e.currentTarget.getBoundingClientRect();
      const boardWidth = rect.width;
      const boardHeight = rect.height;

      const arrowCoordinates = {
        x1: (startX / boardWidth) * 100,
        y1: (startY / boardHeight) * 100,
        x2: (endX / boardWidth) * 100,
        y2: (endY / boardHeight) * 100,
      };
      // change to allow multiple arrows/circles
      setArrowCoordinates(arrowCoordinates);
      console.log("Arrow coordinates:", arrowCoordinates);
    }
  };

  return { onMouseDown, onMouseMove, onMouseUp };
};
