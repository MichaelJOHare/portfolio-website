import { useCallback, useEffect, useState } from "react";
import { useGameContext } from "./useGameContext";
import { useStockfish, AnalysisType } from "./useStockfish";
import { toFEN, getSquareFromNotation } from "../utils";
import { BoardState } from "../types";

export const useAnalysis = (
  isStockfishClassicalChecked: boolean,
  isStockfishNnueChecked: boolean,
  boardState: BoardState,
  setBoardState: React.Dispatch<React.SetStateAction<BoardState>>
) => {
  const [arrowCoordinates, setArrowCoordinates] = useState({
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  });

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
    console.log(
      "generateCurrentFen",
      currentPlayerIndex,
      players[currentPlayerIndex]
    );
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

  function getArrowFromBestMove() {
    if (engineMove) {
      const from = getSquareFromNotation(engineMove.from);
      const to = getSquareFromNotation(engineMove.to);
      setArrowCoordinates({
        x1: from.col * 12.5 + 6.25,
        y1: from.row * 12.5 + 6.25,
        x2: to.col * 12.5 + 6.25,
        y2: to.row * 12.5 + 6.25,
      });
    }
  }

  useEffect(() => {
    if (analysisType && !boardState.engineInitialized) {
      initializeEngine();
      setBoardState((prevState) => ({
        ...prevState,
        engineInitialized: true,
      }));
    } else if (!analysisType && boardState.engineInitialized) {
      cleanUpEngine();
      setBoardState((prevState) => ({
        ...prevState,
        engineInitialized: false,
      }));
    }
  }, [
    analysisType,
    boardState.engineInitialized,
    initializeEngine,
    cleanUpEngine,
  ]);
  useEffect(() => {
    setBoardState((prevState) => {
      if (!prevState.engineRunning && prevState.engineInitialized) {
        findMove(generateCurrentFen());
        return {
          ...prevState,
          engineRunning: true,
        };
      }
      return prevState;
    });
  }, [generateCurrentFen, boardState.engineInitialized, findMove]);
  useEffect(() => {
    if (boardState.engineRunning && engineMove) {
      setBoardState((prevState) => ({
        ...prevState,
        engineRunning: false,
      }));
      getArrowFromBestMove();
    }
  }, [engineMove, boardState.engineRunning]);

  return { arrowCoordinates, setArrowCoordinates };
};
