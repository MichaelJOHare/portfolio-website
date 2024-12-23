"use client";

import { useEffect, useState } from "react";
import Board from "../board/Board";
import GameLog from "./GameLog";
import Button from "./Button";
import GameProvider from "../../providers/GameProvider";
import { Square } from "../../types";
import { useChessboardHighlighter } from "../../hooks/useChessboardHighlighter";

export default function ChessGameContainer() {
  const highlighter = useChessboardHighlighter();
  const [stockfishClassicalChecked, setStockfishClassicalChecked] =
    useState(false);
  const [stockfishNnueChecked, setStockfishNnueChecked] = useState(false);
  const [squaresToHide, setSquaresToHide] = useState<Square[]>([]);
  const [showPromotionPanel, setShowPromotionPanel] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [computerOpponentOptions, setComputerOpponentOptions] = useState<
    number[]
  >([]);

  const handleStockfishClassicalChange = (isChecked: boolean) => {
    setStockfishClassicalChecked(isChecked);
    setStockfishNnueChecked(false);
    setIsPlaying(false);
  };

  const handleStockfishNnueChange = (isChecked: boolean) => {
    setStockfishNnueChecked(isChecked);
    setStockfishClassicalChecked(false);
    setIsPlaying(false);
  };

  const handlePlayButtonClick = (
    strengthLevel: number,
    playerColor: number
  ) => {
    const playersColor =
      playerColor === 2 ? (Math.random() < 0.5 ? 0 : 1) : playerColor;
    setComputerOpponentOptions([strengthLevel, playersColor]);
    setStockfishClassicalChecked(false);
    setStockfishNnueChecked(false);
    setIsPlaying(!isPlaying);
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
    highlighter.clearAllHighlights();
    setSquaresToHide([]);
    setShowPromotionPanel(false);
  };

  useEffect(() => {
    if (!stockfishClassicalChecked && !stockfishNnueChecked) {
      if (highlighter.highlightedSquares.stockfishBestMoveArrow.length > 0) {
        highlighter.clearStockfishBestMoveArrow();
      }
    }
  }, [stockfishClassicalChecked, stockfishNnueChecked, highlighter]);

  return (
    <div className="flex flex-col justify-center lg:flex-row">
      <GameProvider>
        <div className="flex justify-center items-center">
          <Board
            isStockfishClassicalChecked={stockfishClassicalChecked}
            isStockfishNnueChecked={stockfishNnueChecked}
            playButtonClicked={isPlaying}
            computerOpponentOptions={computerOpponentOptions}
            highlighter={highlighter}
            squaresToHide={squaresToHide}
            handleSquaresToHide={handleSquaresToHide}
            showPromotionPanel={showPromotionPanel}
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
              stockfishClassicalChecked || stockfishNnueChecked ? "" : "lg:ml-5"
            } lg:w-[35vmin] lg:h-[70vmin] lg:mt-0 2xl:w-[50vmin]`}
          >
            <div className="flex justify-between h-[20vmin] w-full lg:pt-2 lg:h-[10vmin] lg:order-last">
              <Button
                direction={{ left: true, right: false }}
                clearAllHighlights={highlighter.clearAllHighlights}
                handleSquaresToHide={handleSquaresToHide}
                handleShowPromotionPanel={handleShowPromotionPanel}
              />
              <Button
                direction={{ left: false, right: true }}
                clearAllHighlights={highlighter.clearAllHighlights}
                handleSquaresToHide={handleSquaresToHide}
                handleShowPromotionPanel={handleShowPromotionPanel}
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
              onPlayButtonClick={handlePlayButtonClick}
              resetBoard={resetBoard}
            />
          </div>
        </div>
      </GameProvider>
    </div>
  );
}

/* have footer below on this page, make cgc take 100vh */
