import { useState, useCallback } from "react";
import { GameStateContext, Piece, Player, Move, PlayerColor } from "../types";

export const useGameManagement = (
  player1: Player,
  player2: Player
): GameStateContext => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(player1);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [undoneMoves, setUndoneMoves] = useState<Move[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);
  const [halfMoveClock, setHalfMoveClock] = useState<number>(0);
  const [fullMoveNumber, setFullMoveNumber] = useState<number>(1);

  const switchPlayer = useCallback(() => {
    setCurrentPlayer((prevPlayer) =>
      prevPlayer.color === PlayerColor.WHITE ? player2 : player1
    );
  }, []);

  const executeMove = useCallback(
    (move: Move) => {
      // integrate with useBoardManagement to update board
      setMoveHistory((prev) => [...prev, move]);
      if (move.capturedPiece) {
        //setCapturedPieces((prev) => [...prev, move.capturedPiece]);
      }
      switchPlayer();
    },
    [switchPlayer]
  );

  const undoLastMove = useCallback(() => {
    // placeholder
    setMoveHistory((prev) => prev.slice(0, -1));
    setCapturedPieces((prev) => prev.slice(0, -1));
    switchPlayer();
  }, [switchPlayer]);

  const isKingInCheck = useCallback((player: Player) => {
    // check opponent legal moves if they can capture the king
    return false;
  }, []);

  return {
    player1,
    player2,
    currentPlayer,
    capturedPieces,
    moveHistory,
    undoneMoves,
    halfMoveClock,
    fullMoveNumber,
    executeMove,
    undoLastMove,
    switchPlayer,
    isKingInCheck,
  };
};
