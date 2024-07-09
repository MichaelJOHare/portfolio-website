"use client";

import { useEffect } from "react";
import { initializeGame } from "./dino_game_js/game.js";

export default function Page() {
  useEffect(() => {
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    const cleanupGame = initializeGame(canvas);

    return () => {
      cleanupGame();
    };
  }, []);

  return <canvas id="game"></canvas>;
}
