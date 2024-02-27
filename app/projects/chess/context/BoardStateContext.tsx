import { createContext } from "react";
import { BoardStateContext } from "../types";

export const BoardContext = createContext<BoardStateContext | undefined>(
  undefined
);
