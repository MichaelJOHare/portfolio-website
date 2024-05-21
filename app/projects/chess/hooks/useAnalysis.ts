import { useCallback, useEffect, useState } from "react";
import { useGameContext } from "./useGameContext";
import { useStockfish, AnalysisType, ChessEngineMove } from "./useStockfish";
import { toFEN, getSquareFromNotation } from "../utils";
import { ArrowProps, PlayerColor } from "../types";

export const useAnalysis = (
  isStockfishClassicalChecked: boolean,
  isStockfishNnueChecked: boolean,
  engineInitialized: boolean,
  engineRunning: boolean,
  setEngineInitState: (isInitialized: boolean) => void,
  setEngineRunningState: (isRunning: boolean) => void,
  addStockfishBestMoveArrow: (arrowCoordinates: ArrowProps) => void,
  clearStockfishBestMoveArrow: () => void
) => {
  const [evalGauge, setEvalGauge] = useState<HTMLElement | null>(null);
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
    currentMove: currentEngineMove,
    bestMove: bestEngineMove,
    evalCentipawn,
    findMove,
    stopAnalysis,
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

  const getArrowFromMove = useCallback(
    (move: ChessEngineMove) => {
      if (move) {
        const from = getSquareFromNotation(move.from);
        const to = getSquareFromNotation(move.to);
        addStockfishBestMoveArrow({
          x1: from.col * 12.5 + 6.25,
          y1: from.row * 12.5 + 6.25,
          x2: to.col * 12.5 + 6.25,
          y2: to.row * 12.5 + 6.25,
          isStockfish: true,
        });
      }
    },
    [addStockfishBestMoveArrow]
  );

  useEffect(() => {
    if (analysisType && !engineInitialized) {
      initializeEngine();
      setEvalGauge(document.getElementById("eval-gauge"));
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
      clearStockfishBestMoveArrow();
      findMove(currentFen);
      setStoredFen(currentFen);
      setEngineRunningState(true);
    } else if (engineRunning && currentEngineMove) {
      clearStockfishBestMoveArrow();
      getArrowFromMove(currentEngineMove);
    } else if (engineRunning && bestEngineMove) {
      clearStockfishBestMoveArrow();
      getArrowFromMove(bestEngineMove);
      setEngineRunningState(false);
    }
    /* else if (engineRunning && !engineMove && something to check undone after mate ) {
      // handle case where checkmate happens then user clicks undo move causing engine status to stay Running while engineMove === null
      clearStockfishBestMoveArrow();
      findMove(currentFen);
      setStoredFen(currentFen);
    } */
  }, [
    currentEngineMove,
    bestEngineMove,
    generateCurrentFen,
    engineInitialized,
    engineRunning,
    storedFen,
    setEngineRunningState,
    findMove,
    clearStockfishBestMoveArrow,
    getArrowFromMove,
  ]);
  useEffect(() => {
    if (evalGauge) {
      if (
        players[currentPlayerIndex].color === PlayerColor.BLACK &&
        evalCentipawn < 50
      ) {
        evalGauge.setAttribute("value", (100 - evalCentipawn).toString());
      } else if (
        players[currentPlayerIndex].color === PlayerColor.BLACK &&
        evalCentipawn > 50
      ) {
        evalGauge.setAttribute("value", (evalCentipawn * -1).toString());
      } else {
        evalGauge.setAttribute("value", evalCentipawn.toString());
      }
    }
  }, [evalCentipawn]);

  return { stopAnalysis };
};
