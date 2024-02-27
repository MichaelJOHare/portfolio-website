"use client";

import React, { useState, useEffect } from "react";
import { BoardContext } from "../context/BoardStateContext";
import { GameContext } from "../context/GameStateContext";
import { useBoardManagement } from "../hooks/useBoardManagement";
import { useGameManagement } from "../hooks/useGameManagement";
import { PlayerColor, PlayerType } from "../types";
import { createPlayer } from "../utils/player";

interface Props {
  children: React.ReactNode;
}

export default function GameProvider({ children }: Props) {
  const boardManagement = useBoardManagement();
  const [isBoardInitialized, setIsBoardInitialized] = useState(false);

  // placeholder
  const player1 = createPlayer(PlayerColor.WHITE, PlayerType.HUMAN);
  const player2 = createPlayer(PlayerColor.BLACK, PlayerType.HUMAN);

  const handleInitializeBoard = () => {
    if (!isBoardInitialized) {
      boardManagement.initializeBoard(player1, player2);
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
