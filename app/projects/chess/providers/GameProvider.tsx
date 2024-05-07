"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GameContext } from "../context/GameStateContext";
import { useGameManagement } from "../hooks/useGameManagement";

interface Props {
  children: React.ReactNode;
}

export default function GameProvider({ children }: Props) {
  const gameManagement = useGameManagement();
  const [isBoardInitialized, setIsBoardInitialized] = useState(false);

  const handleInitializeBoard = useCallback(() => {
    if (!isBoardInitialized) {
      gameManagement.initializeBoard();
      setIsBoardInitialized(true);
    }
  }, [gameManagement, isBoardInitialized]);

  useEffect(() => {
    handleInitializeBoard();
  }, [handleInitializeBoard]);

  return (
    <GameContext.Provider value={{ ...gameManagement }}>
      {children}
    </GameContext.Provider>
  );
}
