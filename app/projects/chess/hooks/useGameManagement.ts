import { useState, useCallback } from "react";
import {
  GameStateContext,
  Piece,
  Player,
  Move,
  PlayerColor,
  CastlingMove,
} from "../types";
import { useBoardManagement } from "./useBoardManagement";

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
  const { addPiece, removePiece } = useBoardManagement();

  const switchPlayer = useCallback(() => {
    setCurrentPlayer((prevPlayer) =>
      prevPlayer.color === PlayerColor.WHITE ? player2 : player1
    );
  }, [player1, player2]);

  const executeMove = useCallback(
    (move: Move) => {
      switch (move.type) {
        case "Standard":
          const updatedPiece = {
            ...move.piece,
            currentSquare: move.to,
            hasMoved: true,
          };
          removePiece(move.piece);
          addPiece(updatedPiece);
          setMoveHistory((prev) => [...prev, move]);
          if (move.capturedPiece) {
            //setCapturedPieces((prev) => [...prev, move.capturedPiece]);
            removePiece(move.capturedPiece);
          }
          break;
        case "Castling":
          const castlingMove = move as CastlingMove;
          const updatedKing = {
            ...castlingMove.piece,
            currentSquare: castlingMove.kingTo,
            hasMoved: true,
          };
          const updatedRook = {
            ...castlingMove.rook,
            currentSquare: castlingMove.rookTo,
            hasMoved: true,
          };
          removePiece(castlingMove.piece);
          removePiece(castlingMove.rook);
          addPiece(updatedKing);
          addPiece(updatedRook);
          break;
      }
      switchPlayer();
    },
    [removePiece, addPiece, switchPlayer]
  );

  const undoLastMove = useCallback(() => {
    // placeholder
    setMoveHistory((prev) => prev.slice(0, -1));
    //setCapturedPieces((prev) => prev.slice(0, -1));
    switchPlayer();
  }, [switchPlayer]);

  const isKingInCheck = useCallback((player: Player) => {
    // check opponent legal moves if they can capture the king
    return false;
  }, []);

  return {
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
