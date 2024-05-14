import { useCallback, useEffect, useState } from "react";

import {
  ENGINE_IS_LOADED,
  ENGINE_IS_READY,
  FOUND_BEST_MOVE,
  IS_SYSTEM_MESSAGE,
} from "./messages";
import { useEngine } from "./useEngine";
import {
  calculateDepth,
  calculateErrorProbability,
  calculateMaxError,
  formatMoveString,
  formatTimeString,
} from "./utils";
import { Move, MoveType, Square } from "../../types";
import { getPieceAt } from "../../utils";

export enum ChessEngineStatus {
  Loading,
  Loaded,
  Ready,
  Running,
}

export interface UseStockfishOptions {
  board: Square[][];
  duration: number;
  increment: number;
  skillLevel?: number;
  filepath?: string;
}

export type ChessEngineMove = Move | null;

export const useStockfish = ({
  board,
  duration,
  increment,
  skillLevel = 20,
  filepath = "stockfish.js",
}: UseStockfishOptions) => {
  const { setHandler: setEngineHandler, command: commandEngine } =
    useEngine(filepath);
  const { setHandler: setEvalerHandler, command: commandEvaler } =
    useEngine(filepath);
  const [status, setStatus] = useState(ChessEngineStatus.Loading);
  const [depth, setDepth] = useState<number | null>(null);
  const [move, setMove] = useState<ChessEngineMove>(null);
  const isReady = status === ChessEngineStatus.Ready;
  const isRunning = status === ChessEngineStatus.Running;

  const setSkillLevel = useCallback(
    (skillLevel: number) => {
      const depth = calculateDepth(skillLevel);
      const errorProbability = calculateErrorProbability(skillLevel);
      const maxError = calculateMaxError(skillLevel);
      setDepth(depth);
      commandEngine(`setoption name Skill Level value ${skillLevel}`);
      commandEngine(
        `setoption name Skill Level Maximum Error value ${maxError}`
      );
      commandEngine(
        `setoption name Skill Level Probability value ${errorProbability}`
      );
    },
    [commandEngine]
  );

  const findMove = useCallback(
    ({ history, accelerate }: { history: Move[]; accelerate?: boolean }) => {
      if (isRunning) {
        return;
      }
      const moveString = formatMoveString(history);
      setStatus(ChessEngineStatus.Running);
      setMove(null);
      commandEngine(`position startpos moves ${moveString}`);
      commandEvaler(`position startpos moves ${moveString}`);
      if (accelerate) {
        const timeString = formatTimeString({ depth, duration, increment });
        commandEngine(`go ${timeString}`);
      } else {
        commandEngine(`go`);
      }
    },
    [commandEngine, commandEvaler, depth, duration, increment, isRunning]
  );

  const handleEngineMessage = useCallback(
    (event: MessageEvent) => {
      const line = typeof event === "object" ? event.data : event;
      if (IS_SYSTEM_MESSAGE.test(line)) {
        return;
      }
      if (ENGINE_IS_LOADED.test(line)) {
        setStatus(ChessEngineStatus.Loaded);
        return;
      }
      if (ENGINE_IS_READY.test(line)) {
        setStatus(ChessEngineStatus.Ready);
        return;
      }
      if (FOUND_BEST_MOVE.test(line)) {
        const [, from, to, promotion] = line.match(FOUND_BEST_MOVE);
        const piece = getPieceAt(board, from.row, from.col);
        const type = MoveType.STNDRD;
        // find move type
        piece && setMove({ type, from, to, piece /* promotion */ });
        commandEvaler("eval");
        setStatus(ChessEngineStatus.Ready);
      }
      console.debug("engine", line);
    },
    [commandEvaler]
  );

  const handleEvalerMessage = useCallback((event: MessageEvent) => {
    const line = typeof event === "object" ? event.data : event;
    if (!IS_SYSTEM_MESSAGE.test(line)) {
      console.debug("evaler", line);
    }
  }, []);

  useEffect(() => {
    setEngineHandler(handleEngineMessage);
    setEvalerHandler(handleEvalerMessage);
  }, [
    setEngineHandler,
    setEvalerHandler,
    handleEngineMessage,
    handleEvalerMessage,
  ]);

  useEffect(() => {
    commandEngine("uci");
    commandEngine("setoption name Contempt value 0");
    commandEngine("setoption name Ponder value true");
    commandEngine("setoption name Minimum Thinking Time value 500");
  }, [commandEngine]);

  useEffect(() => {
    setSkillLevel(skillLevel);
  }, [setSkillLevel, skillLevel]);

  useEffect(() => {
    commandEngine("isready");
    commandEngine("ucinewgame");
  }, [commandEngine]);

  useEffect(() => {
    return () => {
      commandEngine("quit");
      commandEvaler("quit");
    };
  }, [commandEngine, commandEvaler]);

  return { move, findMove, isReady, isRunning };
};
