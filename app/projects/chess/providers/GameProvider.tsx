"use client";

import React, { useState, useEffect } from "react";
import { BoardContext } from "../context/BoardStateContext";
import { useBoardManagement } from "../hooks/useBoardManagement";
//import { GameContext } from "../context/GameStateContext";
//import { useGameManagement } from "../hooks/useGameManagement";

interface Props {
  children: React.ReactNode;
}

export default function GameProvider({ children }: Props) {
  const boardManagement = useBoardManagement();
  const [isBoardInitialized, setIsBoardInitialized] = useState(false);

  const handleInitializeBoard = () => {
    if (!isBoardInitialized) {
      boardManagement.initializeBoard();
      setIsBoardInitialized(true);
    }
  };

  useEffect(() => {
    handleInitializeBoard();
  }, [isBoardInitialized]);

  return (
    <BoardContext.Provider
      value={{
        ...boardManagement,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
