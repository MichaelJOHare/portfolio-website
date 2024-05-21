"use client";

import { useCallback, useEffect, useState } from "react";
import Board from "../board/Board";
import GameLog from "./GameLog";
import Button from "./Button";
import GameProvider from "../../providers/GameProvider";
import {
  Square,
  HighlighterState,
  HighlightedSquares,
  ArrowProps,
  CircleProps,
  Move,
  Piece,
} from "../../types";

export default function ChessGameContainer() {
  const [stockfishClassicalChecked, setStockfishClassicalChecked] =
    useState(false);
  const [stockfishNnueChecked, setStockfishNnueChecked] = useState(false);
  const [squaresToHide, setSquaresToHide] = useState<Square[]>([]);
  const [showPromotionPanel, setShowPromotionPanel] = useState(false);
  const [highlighterState, setHighlighterState] = useState<HighlighterState>({
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
    setHighlighterState((prevState) => ({
      ...prevState,
      arrowCoordinates: newArrowCoords,
    }));
  };

  const clearTempArrow = () => {
    console.log("clearing");
    setHighlighterState((prevState) => ({
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
    setHighlighterState((prevState) => ({
      ...prevState,
      circleCoordinates: newCircleCoords,
    }));
  };

  const clearTempCircle = () => {
    setHighlighterState((prevState) => ({
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
    setHighlighterState((prevState) => ({
      ...prevState,
      legalMoveSquares: [...prevState.legalMoveSquares, newLegalMoveSquare],
    }));
  };

  const clearLegalMoveHighlights = () => {
    setHighlighterState((prevState) => ({
      ...prevState,
      legalMoveSquares: [],
    }));
  };

  const setSelectedPieceHighlight = (piece: Piece) => {
    setHighlighterState((prevState) => ({
      ...prevState,
      selectedPiece: piece,
    }));
  };

  const clearSelectedPieceHighlight = () => {
    setHighlighterState((prevState) => ({
      ...prevState,
      selectedPiece: undefined,
    }));
  };

  const clearAllHighlights = useCallback(() => {
    clearAllDrawnOnSquares();
    clearLegalMoveHighlights();
    clearSelectedPieceHighlight();
  }, []);

  const handleStockfishClassicalChange = (isChecked: boolean) => {
    setStockfishClassicalChecked(isChecked);
    setStockfishNnueChecked(false);
  };

  const handleStockfishNnueChange = (isChecked: boolean) => {
    setStockfishNnueChecked(isChecked);
    setStockfishClassicalChecked(false);
  };

  const handleSquaresToHide = (squares: Square[]) => {
    setSquaresToHide(squares);
  };

  const handleShowPromotionPanel = (isShown: boolean) => {
    setShowPromotionPanel(isShown);
  };

  const resetBoard = () => {
    setStockfishClassicalChecked(false);
    setStockfishNnueChecked(false);
    clearAllHighlights();
    setSquaresToHide([]);
    setShowPromotionPanel(false);
  };

  const highlighter = {
    highlighterState,
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
  };

  useEffect(() => {
    if (!stockfishClassicalChecked && !stockfishNnueChecked) {
      setHighlightedSquares((prevState) => ({
        ...prevState,
        stockfishBestMoveArrow: [],
      }));
    }
  }, [stockfishClassicalChecked, stockfishNnueChecked]);

  return (
    <div className="flex flex-col justify-center lg:flex-row">
      <GameProvider>
        <div className="flex justify-center items-center">
          <Board
            isStockfishClassicalChecked={stockfishClassicalChecked}
            isStockfishNnueChecked={stockfishNnueChecked}
            squaresToHide={squaresToHide}
            handleSquaresToHide={handleSquaresToHide}
            showPromotionPanel={showPromotionPanel}
            highlighter={highlighter}
            handleShowPromotionPanel={handleShowPromotionPanel}
          />
          <div
            className={`h-[90vmin] w-5 overflow-hidden lg:h-[70vmin] border-[1px] border-slate-800 dark:border-slate-100 border-spacing-0 mx-0.5 ${
              stockfishClassicalChecked || stockfishNnueChecked
                ? "visible"
                : "hidden"
            }`}
          >
            <progress
              id="eval-gauge"
              className="transform -rotate-90 translate-y-[90vmin] lg:translate-y-[70vmin] origin-top-left w-[90vmin] h-5 lg:w-[70vmin] progress-filled:bg-slate-100 progress-unfilled:bg-stone-900"
              value={50}
              max={100}
            ></progress>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div
            className={`flex flex-col justify-center w-[90vmin] mt-4 ${
              stockfishClassicalChecked || stockfishNnueChecked ? "" : "lg:px-5"
            } lg:w-[35vmin] lg:h-[70vmin] lg:mt-0 2xl:w-[50vmin]`}
          >
            <div className="flex justify-between h-[20vmin] w-full lg:pt-2 lg:h-[10vmin] lg:order-last">
              <Button
                direction={{ left: true, right: false }}
                handleSquaresToHide={handleSquaresToHide}
                handleShowPromotionPanel={handleShowPromotionPanel}
                clearHighlights={clearAllHighlights}
              />
              <Button
                direction={{ left: false, right: true }}
                handleSquaresToHide={handleSquaresToHide}
                handleShowPromotionPanel={handleShowPromotionPanel}
                clearHighlights={clearAllHighlights}
              />
            </div>
            <div
              className={`w-full h-1.5 pr-0.5 flex justify-center items-center relative ${
                stockfishClassicalChecked || stockfishNnueChecked
                  ? "visible"
                  : "hidden"
              }`}
            >
              <progress
                id="depth-progress"
                className="h-1.5 w-[97%] rounded-tl-full rounded-tr-full overflow-hidden progress-filled:bg-green-700 progress-unfilled:bg-stone-900"
                value={0}
                max={100}
              ></progress>
            </div>
            <GameLog
              stockfishClassicalChecked={stockfishClassicalChecked}
              stockfishNnueChecked={stockfishNnueChecked}
              onStockfishClassicalChange={handleStockfishClassicalChange}
              onStockfishNnueChange={handleStockfishNnueChange}
              resetBoard={resetBoard}
            />
          </div>
        </div>
      </GameProvider>
    </div>
  );
}

/* have footer below on this page, make cgc take 100vh */
