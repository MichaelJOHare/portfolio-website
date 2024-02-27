import { useContext } from "react";
import { BoardContext } from "../context/BoardStateContext";

export const useChessGame = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useChessGame must be used within a ChessGameProvider");
  }
  return context;
};
