"use client";

import { useCallback, useEffect, useState } from "react";
import Board from "../board/Board";
import GameLog from "./GameLog";
import Button from "./Button";
import GameProvider from "../../providers/GameProvider";
import {
  Square,
  HighlighterState,
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

  /*   const [highlightedSquares, setHighlightedSquares] =
    useState<HighlightedSquares>({
      drawnOnSquares: [],
      stockfishBestMoveSquares: [],
    }); */ // Use to track which are drawn and which are analysis arrows ->
  //                  drawn arrows removed on left click, analysis arrows stay until move made/analysis toggled off

  const setLegalMoveHighlighterState = (newLegalMoveSquare: Move) => {
    setHighlighterState((prevState) => ({
      ...prevState,
      legalMoveSquares: [...prevState.legalMoveSquares, newLegalMoveSquare],
    }));
  };

  const clearLegalMoveHighlighterState = () => {
    setHighlighterState((prevState) => ({
      ...prevState,
      legalMoveSquares: [],
    }));
  };

  const setSelectedPieceHighlighterState = (piece: Piece) => {
    setHighlighterState((prevState) => ({
      ...prevState,
      selectedPiece: piece,
    }));
  };

  const clearSelectedPieceHighlighterState = () => {
    setHighlighterState((prevState) => ({
      ...prevState,
      selectedPiece: undefined,
    }));
  };

  const setArrowHighlighterState = (newArrowCoords: ArrowProps) => {
    setHighlighterState((prevState) => ({
      ...prevState,
      arrowCoordinates: newArrowCoords,
    }));
  };

  const setCircleHighlighterState = (newCircleCoords: CircleProps) => {
    setHighlighterState((prevState) => ({
      ...prevState,
      circleCoordinates: newCircleCoords,
    }));
  };

  const clearArrowHighlights = () => {
    setHighlighterState((prevState) => ({
      ...prevState,
      arrowCoordinates: { x1: 0, y1: 0, x2: 0, y2: 0 },
    }));
  };

  const clearCircleHighlights = () => {
    setHighlighterState((prevState) => ({
      ...prevState,
      circleCoordinates: { cx: 0, cy: 0 },
    }));
  };

  const clearArrowCircleHighlights = useCallback(() => {
    clearArrowHighlights();
    clearCircleHighlights();
  }, []);

  const clearAllHighlights = useCallback(() => {
    clearArrowCircleHighlights();
    clearLegalMoveHighlighterState();
    clearSelectedPieceHighlighterState();
  }, [clearArrowCircleHighlights]);

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

  const highlighter = {
    highlighterState,
    setSelectedPieceHighlighterState,
    clearSelectedPieceHighlighterState,
    setLegalMoveHighlighterState,
    clearLegalMoveHighlighterState,
    setArrowHighlighterState,
    setCircleHighlighterState,
    clearArrowCircleHighlights,
  };

  useEffect(() => {
    if (!stockfishClassicalChecked && !stockfishNnueChecked) {
      clearArrowHighlights(); // change to just stockfish arrows once implemented
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
            className={`h-[90vmin] w-5 overflow-hidden lg:h-[70vmin] border-[1px] border-slate-100 border-spacing-0 ml-0.5 ${
              stockfishClassicalChecked || stockfishNnueChecked
                ? "visible"
                : "hidden"
            }`}
          >
            <progress
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
            <GameLog
              stockfishClassicalChecked={stockfishClassicalChecked}
              stockfishNnueChecked={stockfishNnueChecked}
              onStockfishClassicalChange={handleStockfishClassicalChange}
              onStockfishNnueChange={handleStockfishNnueChange}
            />
          </div>
        </div>
      </GameProvider>
    </div>
  );
}

/* have footer below on this page, make cgc take 100vh */
