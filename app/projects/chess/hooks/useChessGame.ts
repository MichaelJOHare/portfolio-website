import { useContext } from "react";
import { GameContext } from "../context/GameStateContext";

export const useChessGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useChessGame must be used within a GameProvider");
  }
  return context;
};
