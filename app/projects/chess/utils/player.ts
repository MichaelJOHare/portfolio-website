import { Player, PlayerColor, PlayerType } from "../types";

export const createPlayer = (color: PlayerColor, type: PlayerType): Player => ({
  color,
  type,
});

export function isPlayer(token: unknown): token is Player {
  if (typeof token !== "object" || token === null) {
    return false;
  }

  const player = token as Player;

  return isPlayerColor(player.color) && isPlayerType(player.type);
}

export function isPlayerColor(token: unknown): token is PlayerColor {
  return (
    typeof token === "string" &&
    (token === PlayerColor.WHITE || token === PlayerColor.BLACK)
  );
}

export function isPlayerType(token: unknown): token is PlayerType {
  return (
    typeof token === "string" &&
    (token === PlayerType.HUMAN || token === PlayerType.COMPUTER)
  );
}
