import { useCallback, useEffect, useRef } from "react";

export const useEngine = (filepath = "stockfish.js") => {
  const engine = useRef<Worker>();

  useEffect(() => {
    engine.current = new Worker(filepath);
  }, [filepath]);

  const setHandler = useCallback((handler: (event: MessageEvent) => void) => {
    if (engine.current) engine.current.onmessage = handler;
  }, []);
  const command = useCallback((command: string) => {
    engine.current?.postMessage(command);
  }, []);

  return { setHandler, command };
};
