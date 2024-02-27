import { createContext } from "react";
import { GameStateContext } from "../types";

export const GameContext = createContext<GameStateContext | undefined>(
  undefined
);
