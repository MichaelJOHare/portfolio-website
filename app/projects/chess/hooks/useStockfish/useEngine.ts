import { useCallback, useEffect, useRef } from "react";

export const useEngine = (initialFilepath = "") => {
  const engine = useRef<Worker | null>(null);

  const initializeWorker = useCallback((filepath: string) => {
    if (engine.current) {
      engine.current.terminate();
    }
    engine.current = new Worker(filepath);
  }, []);

  const setHandler = useCallback((handler: (event: MessageEvent) => void) => {
    if (engine.current) engine.current.onmessage = handler;
  }, []);

  const command = useCallback((command: string) => {
    engine.current?.postMessage(command);
  }, []);

  const terminateEngine = useCallback(() => {
    engine.current?.terminate();
  }, []);

  useEffect(() => {
    initializeWorker(initialFilepath);
    return () => {
      terminateEngine();
    };
  }, [initialFilepath, initializeWorker, terminateEngine]);

  return { initializeWorker, setHandler, command, terminateEngine };
};
