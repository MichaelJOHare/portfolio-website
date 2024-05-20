import { useCallback, useEffect, useState } from "react";
import { useGameContext } from "./useGameContext";
import { useStockfish, AnalysisType } from "./useStockfish";
import { toFEN, getSquareFromNotation } from "../utils";
import { ArrowProps } from "../types";

export const useAnalysis = (
  isStockfishClassicalChecked: boolean,
  isStockfishNnueChecked: boolean,
  engineInitialized: boolean,
  engineRunning: boolean,
  setEngineInitState: (isInitialized: boolean) => void,
  setEngineRunningState: (isRunning: boolean) => void,
  setArrowHighlighterState: (arrowCoordinates: ArrowProps) => void
) => {
  const [storedFen, setStoredFen] = useState("");
  const {
    board,
    players,
    currentPlayerIndex,
    moveHistory,
    halfMoveClock,
    fullMoveNumber,
  } = useGameContext();
  const analysisType = isStockfishClassicalChecked
    ? AnalysisType.CLASSICAL
    : isStockfishNnueChecked
    ? AnalysisType.NNUE
    : null;
  const {
    move: engineMove,
    findMove,
    initializeEngine,
    cleanUpEngine,
  } = useStockfish({
    analysisType,
    skillLevel: 20, // get from modal
    filepath: "/stockfish/stockfish-nnue-16.js",
  });

  const generateCurrentFen = useCallback(() => {
    return toFEN(
      board,
      players,
      currentPlayerIndex,
      moveHistory,
      halfMoveClock,
      fullMoveNumber
    );
  }, [
    board,
    currentPlayerIndex,
    fullMoveNumber,
    halfMoveClock,
    moveHistory,
    players,
  ]);

  const getArrowFromBestMove = useCallback(() => {
    if (engineMove) {
      const from = getSquareFromNotation(engineMove.from);
      const to = getSquareFromNotation(engineMove.to);
      setArrowHighlighterState({
        x1: from.col * 12.5 + 6.25,
        y1: from.row * 12.5 + 6.25,
        x2: to.col * 12.5 + 6.25,
        y2: to.row * 12.5 + 6.25,
        isStockfish: true,
      });
    }
  }, [engineMove, setArrowHighlighterState]);

  useEffect(() => {
    if (analysisType && !engineInitialized) {
      initializeEngine();
      setEngineInitState(true);
    } else if (!analysisType && engineInitialized) {
      cleanUpEngine();
      setEngineInitState(false);
    }
  }, [
    analysisType,
    engineInitialized,
    setEngineInitState,
    initializeEngine,
    cleanUpEngine,
  ]);
  useEffect(() => {
    const currentFen = generateCurrentFen();
    if (!engineRunning && engineInitialized && currentFen !== storedFen) {
      findMove(currentFen);
      setStoredFen(currentFen);
      setEngineRunningState(true);
    } else if (engineRunning && engineMove) {
      setEngineRunningState(false);
      getArrowFromBestMove();
    }
  }, [
    engineMove,
    generateCurrentFen,
    engineInitialized,
    engineRunning,
    storedFen,
    setEngineRunningState,
    findMove,
    getArrowFromBestMove,
  ]);
};
