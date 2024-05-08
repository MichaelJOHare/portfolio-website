import { useState, useCallback, useRef } from "react";
import {
  GameStateContext,
  GameState,
  Piece,
  PieceType,
  Player,
  PlayerType,
  Move,
  CastlingMove,
  PlayerColor,
  Square,
  MoveType,
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
  createPlayer,
  createPiece,
  createSquare,
  defaultBoard,
  isAttackedByOpponent,
} from "../utils";

export const useGameManagement = (): GameStateContext => {
  const [gameState, setGameState] = useState<GameState>({
    board: defaultBoard(),
    players: [
      createPlayer(PlayerColor.WHITE, PlayerType.HUMAN),
      createPlayer(PlayerColor.BLACK, PlayerType.HUMAN),
    ],
    piecesByPlayer: new Map<Player, Piece[]>(),
    capturedPieces: [],
    currentPlayerIndex: 0,
    moveHistory: [],
    undoneMoves: [],
    halfMoveClock: 0,
    fullMoveNumber: 1,
  });

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const player1 = gameState.players[0];
  const player2 = gameState.players[1];

  const switchPlayer = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      currentPlayerIndex: 1 - prevState.currentPlayerIndex,
    }));
  }, []);

  const clearBoard = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      board: defaultBoard(),
    }));
  }, []);

  const updateBoardAndPieces = (
    board: Square[][],
    piecesByPlayer: Map<Player, Piece[]>,
    move: Move,
    updatedPieces: Piece[]
  ) => {
    updatedPieces.forEach((updatedPiece) => {
      const playerPieces = piecesByPlayer.get(move.piece.player) || [];
      const updatedPlayerPieces = playerPieces.map((piece) =>
        piece.id === updatedPiece.id ? updatedPiece : piece
      );
      piecesByPlayer.set(move.piece.player, updatedPlayerPieces);

      if (move.capturedPiece) {
        move.capturedPiece.isAlive = false;
        board[move.to.row][move.to.col].piece = undefined;
      }
    });
  };

  const addMoveHistory = useCallback((move: Move) => {
    setGameState((prevState) => ({
      ...prevState,
      moveHistory: [...prevState.moveHistory, move],
    }));
  }, []);

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

          gameState.board[pieceRow][col].piece = piece;
          const playerPieces = gameState.piecesByPlayer.get(player) || [];
          gameState.piecesByPlayer.set(player, [...playerPieces, piece]);
        });
      });
    });

    initializeBoardCalled.current = true;
  }, [player1, player2, gameState.piecesByPlayer, gameState.board]);

  const canMove = useCallback(
    (movingPiece: Piece, targetSquare: Square) => {
      if (movingPiece.color !== currentPlayer.color) {
        return null;
      }

      // can optimize calling this only on drag start (maybe call after executemove, for next player,
      //   to also check for checkmate and use entire list of legal moves)
      const legalMoves =
        movingPiece.type === PieceType.PAWN
          ? movingPiece.movementStrategy(
              gameState.board,
              movingPiece,
              gameState.moveHistory
            )
          : movingPiece.movementStrategy(gameState.board, movingPiece);

      const foundMove = legalMoves.find((move) => {
        return (
          move.to.row === targetSquare.row && move.to.col === targetSquare.col
        );
      });

      return foundMove || null;
    },
    [gameState.board, currentPlayer.color, gameState.moveHistory]
  );

  const executeMove = useCallback(
    (
      move: Move,
      piecesByPlayerState: Map<Player, Piece[]>,
      boardState: Square[][]
    ) => {
      if (move.piece.color !== currentPlayer.color) {
        return;
      }
      switch (move.type) {
        case MoveType.STNDRD:
          const updatedPiece = {
            ...move.piece,
            currentSquare: move.to,
            hasMoved: true,
          };
          boardState[move.from.row][move.from.col].piece = undefined;

          const capturedPiece = move.capturedPiece;
          if (capturedPiece) {
            setGameState((prevState) => ({
              ...prevState,
              capturedPieces: [...prevState.capturedPieces, capturedPiece],
            }));
            capturedPiece.isAlive = false;
            boardState[move.to.row][move.to.col].piece = undefined;
          }

          boardState[move.to.row][move.to.col].piece = updatedPiece;
          updateBoardAndPieces(boardState, piecesByPlayerState, move, [
            updatedPiece,
          ]);
          break;

        case MoveType.CASTLE:
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

          boardState[castlingMove.kingFrom.row][
            castlingMove.kingFrom.col
          ].piece = undefined;
          boardState[castlingMove.rookFrom.row][
            castlingMove.rookFrom.col
          ].piece = undefined;

          boardState[castlingMove.kingTo.row][castlingMove.kingTo.col].piece =
            updatedKing;
          boardState[castlingMove.rookTo.row][castlingMove.rookTo.col].piece =
            updatedRook;
          updateBoardAndPieces(boardState, piecesByPlayerState, move, [
            updatedKing,
            updatedRook,
          ]);
          break;
      }
      if (move.piece.type === PieceType.PAWN || move.isCapture) {
        setGameState((prevState) => ({
          ...prevState,
          halfMoveClock: 0,
        }));
      } else {
        setGameState((prevState) => ({
          ...prevState,
          halfMoveClock: prevState.halfMoveClock + 1,
        }));
      }
      if (move.piece.color === PlayerColor.BLACK) {
        setGameState((prevState) => ({
          ...prevState,
          fullMoveNumber: prevState.fullMoveNumber + 1,
        }));
      }
    },
    [currentPlayer.color]
  );

  const isKingInCheck = useCallback(
    (
      copiedBoard: Square[][],
      copiedPlayer: Player,
      copiedPiecesByPlayer: Map<Player, Piece[]>
    ) => {
      const playersPieces = copiedPiecesByPlayer.get(copiedPlayer);
      let playersKing: Piece | undefined;
      if (playersPieces) {
        playersKing = playersPieces.find((piece) => {
          return piece.type === PieceType.KING;
        });
      }
      if (playersKing) {
        return isAttackedByOpponent(
          copiedBoard,
          playersKing.currentSquare.row,
          playersKing.currentSquare.col,
          copiedPlayer
        );
      }
      return true;
    },
    []
  );

  const wouldResultInCheck = useCallback(
    (move: Move) => {
      const { copiedBoard, copiedPiecesByPlayer } = copyBoard(gameState.board);
      executeMove(move, copiedPiecesByPlayer, copiedBoard);
      return isKingInCheck(
        copiedBoard,
        move.piece.player,
        copiedPiecesByPlayer
      );
    },
    [isKingInCheck, executeMove, gameState.board]
  );

  const finalizeMove = useCallback(
    (move: Move) => {
      executeMove(move, gameState.piecesByPlayer, gameState.board);
      addMoveHistory(move);
      switchPlayer();
    },
    [
      gameState.board,
      gameState.piecesByPlayer,
      executeMove,
      addMoveHistory,
      switchPlayer,
    ]
  );

  const handleMove = useCallback(
    (movingPiece: Piece, targetSquare: Square) => {
      const tempMove = canMove(movingPiece, targetSquare);
      if (tempMove) {
        if (!wouldResultInCheck(tempMove)) {
          finalizeMove(tempMove);
        }
      }
    },
    [canMove, wouldResultInCheck, finalizeMove]
  );

  const getEnPassantTarget = useCallback(() => {
    const move =
      gameState.moveHistory.length > 0
        ? gameState.moveHistory[gameState.moveHistory.length - 1]
        : null;
    if (
      move &&
      move.piece.type === PieceType.PAWN &&
      Math.abs(move.from.row - move.to.row) === 2
    ) {
      return createSquare((move.from.row + move.to.row) / 2, move.from.col);
    }
    return null;
  }, [gameState.moveHistory]);

  const undoLastMove = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      moveHistory: prevState.moveHistory.slice(0, -1),
    }));
    setGameState((prevState) => ({
      ...prevState,
      capturedPieces: prevState.capturedPieces.slice(0, -1),
    }));
    switchPlayer();
  }, [switchPlayer]);

  return {
    ...gameState,
    currentPlayer,
    initializeBoard,
    canMove,
    handleMove,
  };
};
