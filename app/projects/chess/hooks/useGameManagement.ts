import { useState, useCallback, useRef } from "react";
import {
  GameStateContext,
  Piece,
  PieceType,
  Player,
  PlayerType,
  Move,
  CastlingMove,
  PlayerColor,
  Square,
} from "../types";
import {
  pawnMovementStrategy,
  rookMovementStrategy,
  knightMovementStrategy,
  bishopMovementStrategy,
  queenMovementStrategy,
  kingMovementStrategy,
} from "../strategies/index";
import {
  copyBoard,
  copyPiece,
  createStandardMove,
  createPlayer,
  createPiece,
  createSquare,
  defaultBoard,
  isAttackedByOpponent,
} from "../utils";

export const useGameManagement = (): GameStateContext => {
  const player1 = createPlayer(PlayerColor.WHITE, PlayerType.HUMAN);
  const player2 = createPlayer(PlayerColor.BLACK, PlayerType.HUMAN);
  const [board, setBoard] = useState<Square[][]>(defaultBoard());
  const [piecesByPlayer, setPiecesByPlayer] = useState<Map<Player, Piece[]>>(
    new Map()
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(player1);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [undoneMoves, setUndoneMoves] = useState<Move[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);
  const [halfMoveClock, setHalfMoveClock] = useState<number>(0);
  const [fullMoveNumber, setFullMoveNumber] = useState<number>(1);

  const clearBoard = useCallback(() => {
    setBoard(defaultBoard());
  }, []);

  const addPiece = useCallback((piece: Piece) => {
    setBoard((currentBoard) => {
      const updatedBoard = currentBoard.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          if (
            rowIndex === piece.currentSquare.row &&
            colIndex === piece.currentSquare.col
          ) {
            return { ...square, piece };
          }
          return square;
        })
      );

      return updatedBoard;
    });

    setPiecesByPlayer((currentPiecesByPlayer) => {
      const updatedPiecesByPlayer = new Map(currentPiecesByPlayer);
      const playerPieces = updatedPiecesByPlayer.get(piece.player) || [];
      updatedPiecesByPlayer.set(piece.player, [...playerPieces, piece]);
      return updatedPiecesByPlayer;
    });
  }, []);

  const removePiece = useCallback(
    (pieceToRemove: Piece) => {
      setPiecesByPlayer((currentPiecesByPlayer) => {
        const updatedPiecesByPlayer = new Map(currentPiecesByPlayer);
        const playerPieces =
          updatedPiecesByPlayer.get(pieceToRemove.player) || [];
        let filteredPlayerPieces;
        if (playerPieces) {
          filteredPlayerPieces = playerPieces.filter(
            (piece) => piece.id !== pieceToRemove.id
          );
          updatedPiecesByPlayer.set(pieceToRemove.player, filteredPlayerPieces);
        }
        return updatedPiecesByPlayer;
      });

      setBoard((currentBoard) => {
        return currentBoard.map((row) =>
          row.map((square) => {
            if (square.piece && square.piece.id === pieceToRemove.id) {
              return { ...square, piece: undefined };
            }
            return square;
          })
        );
      });
    },
    [setPiecesByPlayer, setBoard]
  );

  const initializeBoardCalled = useRef(false);
  const initializeBoard = useCallback(() => {
    if (initializeBoardCalled.current) {
      return;
    }

    const setup = [
      {
        type: PieceType.ROOK,
        positions: [
          { row: 0, col: 0 },
          { row: 0, col: 7 },
        ],
        movementStrategy: rookMovementStrategy,
      },
      {
        type: PieceType.KNIGHT,
        positions: [
          { row: 0, col: 1 },
          { row: 0, col: 6 },
        ],
        movementStrategy: knightMovementStrategy,
      },
      {
        type: PieceType.BISHOP,
        positions: [
          { row: 0, col: 2 },
          { row: 0, col: 5 },
        ],
        movementStrategy: bishopMovementStrategy,
      },
      {
        type: PieceType.QUEEN,
        positions: [{ row: 0, col: 3 }],
        movementStrategy: queenMovementStrategy,
      },
      {
        type: PieceType.KING,
        positions: [{ row: 0, col: 4 }],
        movementStrategy: kingMovementStrategy,
      },
      {
        type: PieceType.PAWN,
        positions: Array.from({ length: 8 }, (_, col) => ({ row: 1, col })),
        movementStrategy: pawnMovementStrategy,
      },
    ];

    [PlayerColor.WHITE, PlayerColor.BLACK].forEach((color) => {
      const rowOffset = color === PlayerColor.WHITE ? 7 : 0;
      const pawnRow = color === PlayerColor.WHITE ? 6 : 1;

      setup.forEach(({ type, positions, movementStrategy }) => {
        positions.forEach(({ row, col }) => {
          const player = color === PlayerColor.WHITE ? player1 : player2;
          const pieceRow =
            row + (type === PieceType.PAWN ? pawnRow - 1 : rowOffset);
          const square = createSquare(pieceRow, col);
          const hasMoved =
            type === PieceType.ROOK || type === PieceType.KING
              ? false
              : undefined;

          const piece = createPiece(
            player,
            type,
            color,
            square,
            movementStrategy,
            true,
            hasMoved
          );

          addPiece(piece);
        });
      });
    });

    initializeBoardCalled.current = true;
  }, [player1, player2, addPiece]);

  const executeMove = useCallback(
    (move: Move) => {
      if (move.piece.color !== currentPlayer.color) {
        return;
      }
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
    },
    [removePiece, addPiece, currentPlayer.color]
  );

  const isKingInCheck = useCallback(
    (player: Player, copiedPiecesByPlayer: Map<Player, Piece[]>) => {
      const playersPieces = copiedPiecesByPlayer.get(player);
      let playersKing: Piece | undefined;
      if (playersPieces) {
        playersKing = playersPieces.find((piece) => {
          return piece.type === PieceType.KING;
        });
      }
      if (playersKing) {
        return isAttackedByOpponent(
          board,
          playersKing.currentSquare.row,
          playersKing.currentSquare.col,
          player
        );
      }
      return true;
    },
    [board]
  );

  const switchPlayer = useCallback(() => {
    setCurrentPlayer((prevPlayer) =>
      prevPlayer.color === PlayerColor.WHITE ? player2 : player1
    );
  }, [player1, player2]);

  const wouldResultInCheck = useCallback(
    (piece: Piece, move: Move, piecesByPlayer: Map<Player, Piece[]>) => {
      const { copiedBoard, copiedPiecesByPlayer } = copyBoard(
        board,
        piecesByPlayer
      );
      const copiedPiece =
        copiedBoard[piece.currentSquare.row][piece.currentSquare.col].piece;
      const copiedCapturedPiece = move.capturedPiece
        ? copyPiece(move.capturedPiece)
        : undefined;
      if (copiedPiece) {
        executeMove(
          createStandardMove(
            copiedPiece,
            move.to,
            move.from,
            copiedCapturedPiece
          )
        );
        return isKingInCheck(copiedPiece.player, copiedPiecesByPlayer);
      }
      return false;
    },
    [board, executeMove, isKingInCheck]
  );

  const undoLastMove = useCallback(() => {
    // placeholder
    setMoveHistory((prev) => prev.slice(0, -1));
    //setCapturedPieces((prev) => prev.slice(0, -1));
    switchPlayer();
  }, [switchPlayer]);

  return {
    player1,
    player2,
    board,
    piecesByPlayer,
    currentPlayer,
    capturedPieces,
    moveHistory,
    undoneMoves,
    halfMoveClock,
    fullMoveNumber,
    executeMove,
    undoLastMove,
    switchPlayer,
    initializeBoard,
    wouldResultInCheck,
  };
};
