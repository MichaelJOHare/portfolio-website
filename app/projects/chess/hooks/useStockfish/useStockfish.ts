import { useCallback, useEffect, useState } from "react";

import {
  ENGINE_IS_LOADED,
  ENGINE_IS_READY,
  FOUND_BEST_MOVE,
  INFORMS_CURRENT_MOVE,
  INFORMS_DEPTH,
  INFORMS_MATE,
  INFORMS_SCORE,
  IS_SYSTEM_MESSAGE,
} from "./messages";
import { useEngine } from "./useEngine";
import { calculateDepth, calculateThreadsForNNUE } from "./utils";

export enum ChessEngineStatus {
  Loading,
  Loaded,
  Ready,
  Running,
}

export enum AnalysisType {
  CLASSICAL = "classical",
  NNUE = "NNUE",
}

export interface UseStockfishOptions {
  analysisType: AnalysisType | null;
  executeMove: (move: ChessEngineMove) => void;
  filepath: string;
  skillLevel: number;
}

export type ChessEngineMove = {
  from: string;
  to: string;
  promotion?: string;
} | null;

export const useStockfish = ({
  analysisType,
  executeMove,
  skillLevel,
  filepath,
}: UseStockfishOptions) => {
  const {
    initializeWorker,
    setHandler: setEngineHandler,
    command: commandEngine,
    terminateEngine,
  } = useEngine(filepath);
  const [status, setStatus] = useState(ChessEngineStatus.Loading);
  const [depth, setDepth] = useState<number | null>(null);
  const [lastDepthUpdate, setLastDepthUpdate] = useState(0);
  const [lastArrowUpdate, setLastArrowUpdate] = useState(0);
  const [evalCentipawn, setEvalCentipawn] = useState(50);
  const [bestMove, setBestMove] = useState<ChessEngineMove>(null);
  const [currentMove, setCurrentMove] = useState<ChessEngineMove>(null);
  const isReady = status === ChessEngineStatus.Ready;
  const isRunning = status === ChessEngineStatus.Running;

  const setSkillLevel = useCallback(
    (skillLevel: number) => {
      const depth = calculateDepth(skillLevel * 2);
      setDepth(depth);
      commandEngine(`setoption name Skill Level value ${skillLevel}`);
    },
    [commandEngine]
  );

  const setAnalysisType = useCallback(
    (analysisType: AnalysisType | null) => {
      const threads =
        analysisType === AnalysisType.NNUE ? calculateThreadsForNNUE() : 1;
      commandEngine(`setoption name Threads value ${threads}`);
      commandEngine(
        `setoption name ${
          analysisType === AnalysisType.NNUE
            ? "Use NNUE value true"
            : "Use NNUE value false"
        }`
      );
    },
    [commandEngine]
  );

  const stopAnalysis = useCallback(() => {
    commandEngine("stop");
  }, [commandEngine]);

  const findMove = useCallback(
    (fen: string) => {
      if (isRunning) {
        return;
      }
      setStatus(ChessEngineStatus.Running);
      setBestMove(null);
      setCurrentMove(null);
      commandEngine(`position fen ${fen}`);
      commandEngine(`go depth ${depth}`);
    },
    [commandEngine, depth, isRunning]
  );

  const handleEngineMessage = useCallback(
    (event: MessageEvent) => {
      const line = typeof event === "object" ? event.data : event;
      console.log(line);
      if (INFORMS_DEPTH.test(line)) {
        const currentDepth = parseInt(line.match(INFORMS_DEPTH)[1], 10);
        const currentTime = Date.now();
        const depthProgress = document.getElementById("depth-progress");

        if (depthProgress) {
          const depthPercentage = (currentDepth / 24) * 100;
          depthProgress.setAttribute("value", depthPercentage.toString());
        }

        if (
          currentDepth === 1 ||
          (currentDepth - lastDepthUpdate >= 3 &&
            currentTime - lastArrowUpdate >= 3000)
        ) {
          const moveData = line.match(INFORMS_CURRENT_MOVE);
          const from = moveData[1].substring(0, 2);
          const to = moveData[1].substring(2, 4);
          setCurrentMove({ from: from, to: to });
          setLastDepthUpdate(currentDepth);
          setLastArrowUpdate(currentTime);
        }
      }
      if (FOUND_BEST_MOVE.test(line)) {
        const [, from, to, promotion] = line.match(FOUND_BEST_MOVE);
        setCurrentMove(null);
        setBestMove({ from, to, promotion });
        executeMove({ from, to, promotion });
        setStatus(ChessEngineStatus.Ready);
      }
      if (ENGINE_IS_READY.test(line)) {
        setStatus(ChessEngineStatus.Ready);
        return;
      }
      if (ENGINE_IS_LOADED.test(line)) {
        setStatus(ChessEngineStatus.Loaded);
        return;
      }
      if (IS_SYSTEM_MESSAGE.test(line)) {
        return;
      }
      if (INFORMS_SCORE.test(line) || INFORMS_MATE.test(line)) {
        let evalValue = parseInt(line.match(INFORMS_SCORE)[2], 10);
        let evalProgress = 50;
        const evalCap = 500;

        if (evalValue > evalCap) evalValue = evalCap;
        if (evalValue < -evalCap) evalValue = -evalCap;

        evalProgress = ((evalValue + evalCap) / (2 * evalCap)) * 100;
        evalProgress = Math.max(0, Math.min(100, evalProgress));
        setEvalCentipawn(evalProgress);

        if (INFORMS_MATE.test(line)) {
          setEvalCentipawn(100);
        }
      }
    },
    [lastArrowUpdate, lastDepthUpdate, executeMove]
  );

  const initializeEngine = useCallback(() => {
    initializeWorker(filepath);
    setEngineHandler(handleEngineMessage);
    commandEngine("uci");
    commandEngine("setoption name Ponder value true");
    setSkillLevel(skillLevel);
    setAnalysisType(analysisType);
    commandEngine("ucinewgame");
    commandEngine("isready");
  }, [
    initializeWorker,
    setEngineHandler,
    handleEngineMessage,
    commandEngine,
    setSkillLevel,
    setAnalysisType,
    skillLevel,
    analysisType,
    filepath,
  ]);

  const cleanUpEngine = useCallback(() => {
    commandEngine("quit");
    terminateEngine();
  }, [commandEngine, terminateEngine]);

  useEffect(() => {
    return () => {
      cleanUpEngine();
    };
  }, [cleanUpEngine]);

  useEffect(() => {
    if (analysisType !== null) {
      setAnalysisType(analysisType);
    }
  }, [analysisType, setAnalysisType]);

  return {
    currentMove,
    bestMove,
    evalCentipawn,
    stopAnalysis,
    findMove,
    initializeEngine,
    cleanUpEngine,
    isReady,
    isRunning,
  };
};
