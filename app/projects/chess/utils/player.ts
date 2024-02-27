import { Player, PlayerColor, PlayerType } from "../types";

export const createPlayer = (color: PlayerColor, type: PlayerType): Player => ({
  color,
  type,
});
