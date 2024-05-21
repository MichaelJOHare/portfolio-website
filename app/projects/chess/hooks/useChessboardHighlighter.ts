import { useState, useCallback, useEffect } from "react";
import {
  Piece,
  Move,
  HighlighterState,
  HighlightedSquares,
  CircleProps,
  ArrowProps,
  Highlighter,
} from "../types";

export const useChessboardHighlighter = (): Highlighter => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [circleDrawn, setCircleDrawn] = useState(false);
  const [hasMovedOutOfSquare, setHasMovedOutOfSquare] = useState(false);
  const [originalSquare, setOriginalSquare] = useState<{
    row: number;
    col: number;
  }>();
  const [tempDrawings, setTempDrawings] = useState<HighlighterState>({
    selectedPiece: undefined,
    legalMoveSquares: [],
    arrowCoordinates: { x1: 0, y1: 0, x2: 0, y2: 0 },
    circleCoordinates: {
      cx: 0,
      cy: 0,
    },
  });
  const [highlightedSquares, setHighlightedSquares] =
    useState<HighlightedSquares>({
      arrowsDrawnOnSquares: [],
      circlesDrawnOnSquares: [],
      stockfishBestMoveArrow: [],
    });

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      clearDrawnArrowCircles();
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
          clearTempCircle();
          setTempArrow({
            x1: originalSquare.col * 12.5 + 6.25,
            y1: originalSquare.row * 12.5 + 6.25,
            x2: currentSquare.col * 12.5 + 6.25,
            y2: currentSquare.row * 12.5 + 6.25,
          });
          setHasMovedOutOfSquare(true);
          setCircleDrawn(false);
        } else if (isInOriginalSquare && hasMovedOutOfSquare) {
          clearTempArrow();
          setTempCircle({
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
      const currentSquare = getSquareFromCoordinates(e.clientX, e.clientY);
      if (!hasMovedOutOfSquare && !circleDrawn && originalSquare) {
        const circleCoords = {
          cx: originalSquare.col * 12.5 + 6.25,
          cy: originalSquare.row * 12.5 + 6.25,
        };
        if (isCircleAtSquare(circleCoords)) {
          clearTempCircle();
          removeCircleAtSquare(circleCoords);
        } else {
          addDrawnCircle(circleCoords);
        }
      } else if (originalSquare && currentSquare && hasMovedOutOfSquare) {
        const arrowCoords = {
          x1: originalSquare.col * 12.5 + 6.25,
          y1: originalSquare.row * 12.5 + 6.25,
          x2: currentSquare.col * 12.5 + 6.25,
          y2: currentSquare.row * 12.5 + 6.25,
        };
        if (isArrowAtSquare(arrowCoords)) {
          clearTempArrow();
          removeArrowAtSquare(arrowCoords);
        } else {
          addDrawnArrow(arrowCoords);
        }
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

  const removeCircleAtSquare = (circleCoords: CircleProps) => {
    setHighlightedSquares((prevState) => ({
      ...prevState,
      circlesDrawnOnSquares: prevState.circlesDrawnOnSquares.filter(
        (circle) =>
          !(circle.cx === circleCoords.cx && circle.cy === circleCoords.cy)
      ),
    }));
  };

  const removeArrowAtSquare = (arrowCoords: ArrowProps) => {
    setHighlightedSquares((prevState) => ({
      ...prevState,
      arrowsDrawnOnSquares: prevState.arrowsDrawnOnSquares.filter(
        (arrow) =>
          !(
            arrow.x1 === arrowCoords.x1 &&
            arrow.y1 === arrowCoords.y1 &&
            arrow.x2 === arrowCoords.x2 &&
            arrow.y2 === arrowCoords.y2
          )
      ),
    }));
  };

  const isCircleAtSquare = (circleCoords: CircleProps) => {
    return highlightedSquares.circlesDrawnOnSquares.some(
      (circle) => circle.cx === circleCoords.cx && circle.cy === circleCoords.cy
    );
  };

  const isArrowAtSquare = (arrowCoords: ArrowProps) => {
    return highlightedSquares.arrowsDrawnOnSquares.some(
      (arrow) =>
        arrow.x1 === arrowCoords.x1 &&
        arrow.y1 === arrowCoords.y1 &&
        arrow.x2 === arrowCoords.x2 &&
        arrow.y2 === arrowCoords.y2
    );
  };

  const setTempArrow = (newArrowCoords: ArrowProps) => {
    setTempDrawings((prevState) => ({
      ...prevState,
      arrowCoordinates: newArrowCoords,
    }));
  };

  const clearTempArrow = () => {
    setTempDrawings((prevState) => ({
      ...prevState,
      arrowCoordinates: { x1: 0, y1: 0, x2: 0, y2: 0 },
    }));
  };

  const addDrawnArrow = (arrowCoords: ArrowProps) => {
    clearTempArrow();
    setHighlightedSquares((prevState) => ({
      ...prevState,
      arrowsDrawnOnSquares: [...prevState.arrowsDrawnOnSquares, arrowCoords],
    }));
  };

  const setTempCircle = (newCircleCoords: CircleProps) => {
    setTempDrawings((prevState) => ({
      ...prevState,
      circleCoordinates: newCircleCoords,
    }));
  };

  const clearTempCircle = () => {
    setTempDrawings((prevState) => ({
      ...prevState,
      circleCoordinates: { cx: 0, cy: 0 },
    }));
  };

  const addDrawnCircle = (circleCoords: CircleProps) => {
    clearTempCircle();
    setHighlightedSquares((prevState) => ({
      ...prevState,
      circlesDrawnOnSquares: [...prevState.circlesDrawnOnSquares, circleCoords],
    }));
  };

  const addStockfishBestMoveArrow = useCallback((arrowCoords: ArrowProps) => {
    setHighlightedSquares((prevState) => ({
      ...prevState,
      stockfishBestMoveArrow: [
        ...prevState.stockfishBestMoveArrow,
        arrowCoords,
      ],
    }));
  }, []);

  const clearStockfishBestMoveArrow = useCallback(() => {
    setHighlightedSquares((prevState) => ({
      ...prevState,
      stockfishBestMoveArrow: [],
    }));
  }, []);

  const clearDrawnArrowCircles = () => {
    setHighlightedSquares((prevState) => ({
      ...prevState,
      arrowsDrawnOnSquares: [],
      circlesDrawnOnSquares: [],
    }));
  };

  const clearAllDrawnOnSquares = () => {
    setHighlightedSquares({
      arrowsDrawnOnSquares: [],
      circlesDrawnOnSquares: [],
      stockfishBestMoveArrow: [],
    });
  };

  const setLegalMoveHighlights = (newLegalMoveSquare: Move) => {
    setTempDrawings((prevState) => ({
      ...prevState,
      legalMoveSquares: [...prevState.legalMoveSquares, newLegalMoveSquare],
    }));
  };

  const clearLegalMoveHighlights = () => {
    setTempDrawings((prevState) => ({
      ...prevState,
      legalMoveSquares: [],
    }));
  };

  const setSelectedPieceHighlight = (piece: Piece) => {
    setTempDrawings((prevState) => ({
      ...prevState,
      selectedPiece: piece,
    }));
  };

  const clearSelectedPieceHighlight = () => {
    setTempDrawings((prevState) => ({
      ...prevState,
      selectedPiece: undefined,
    }));
  };

  const clearAllHighlights = () => {
    clearAllDrawnOnSquares();
    clearLegalMoveHighlights();
    clearSelectedPieceHighlight();
  };

  const highlighter = {
    tempDrawings,
    highlightedSquares,
    setSelectedPieceHighlight,
    clearSelectedPieceHighlight,
    setLegalMoveHighlights,
    clearLegalMoveHighlights,
    setTempArrow,
    addDrawnArrow,
    isArrowAtSquare,
    removeArrowAtSquare,
    addStockfishBestMoveArrow,
    clearStockfishBestMoveArrow,
    setTempCircle,
    addDrawnCircle,
    isCircleAtSquare,
    removeCircleAtSquare,
    clearDrawnArrowCircles,
    clearAllDrawnOnSquares,
    clearAllHighlights,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };

  return {
    ...highlighter,
  };
};
