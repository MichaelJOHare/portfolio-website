import { useCallback, useEffect, useState } from "react";

import {
  ENGINE_IS_LOADED,
  ENGINE_IS_READY,
  FOUND_BEST_MOVE,
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
  filepath: string;
  skillLevel?: number;
}

export type ChessEngineMove = {
  from: string;
  to: string;
  promotion?: string;
} | null;

export const useStockfish = ({
  analysisType,
  skillLevel = 20,
  filepath,
}: UseStockfishOptions) => {
  const {
    initializeWorker,
    setHandler: setEngineHandler,
    command: commandEngine,
    terminateEngine,
  } = useEngine(filepath);
  /*   const { setHandler: setEvalerHandler, command: commandEvaler } =
    useEngine(filepath); */
  const [status, setStatus] = useState(ChessEngineStatus.Loading);
  const [depth, setDepth] = useState<number | null>(null);
  const [move, setMove] = useState<ChessEngineMove>(null);
  const isReady = status === ChessEngineStatus.Ready;
  const isRunning = status === ChessEngineStatus.Running;

  const setSkillLevel = useCallback(
    (skillLevel: number) => {
      const depth = calculateDepth(skillLevel);
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

  const findMove = useCallback(
    (fen: string) => {
      if (isRunning) {
        return;
      }
      setStatus(ChessEngineStatus.Running);
      setMove(null);
      commandEngine(`position fen ${fen}`);
      commandEngine(`go depth ${depth}`);
    },
    [commandEngine, depth, isRunning]
  );

  const handleEngineMessage = useCallback((event: MessageEvent) => {
    const line = typeof event === "object" ? event.data : event;
    console.log(line);
    if (FOUND_BEST_MOVE.test(line)) {
      const [, from, to, promotion] = line.match(FOUND_BEST_MOVE);
      setMove({ from, to, promotion });
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
  }, []);

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

  return {
    move,
    findMove,
    initializeEngine,
    cleanUpEngine,
    isReady,
    isRunning,
  };
};
