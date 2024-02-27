import { Move } from "../types";
import { executeMove } from "./move";
import { moveHistory } from "../types";

const makeMove = (move: Move) => {
  executeMove(move);
  /*   if (move.piece.type === "pawn" || move.isCapture) {
    moveHistory.halfMoveClock = 0;
  } */
};
