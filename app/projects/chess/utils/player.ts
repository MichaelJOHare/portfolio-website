import { Player } from "../types";

export const createPlayer = (color: string, type: string): Player => ({
  color: color,
  type: type,
});
