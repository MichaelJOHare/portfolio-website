import { useState, useCallback, useEffect } from "react";
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
  EnPassantMove,
  PromotionMove,
} from "../types";
import {
  copyBoard,
  createPlayer,
  createPiece,
  defaultBoard,
  isAttackedByOpponent,
  setupPieces,
  isValidCastlingMove,
  executeStandardMove,
  executeCastlingMove,
  executeEnPassantMove,
  executePromoMove,
  isKingInCheck,
} from "../utils";

export const useGameManagement = (): GameStateContext => {
  const [gameState, setGameState] = useState<GameState>({
    board: defaultBoard(),
    players: [
      createPlayer(PlayerColor.WHITE, PlayerType.HUMAN),
      createPlayer(PlayerColor.BLACK, PlayerType.HUMAN),
    ],
    piecesByPlayer: new Map<Player, Piece[]>(),
    currentPlayerMoves: [],
    capturedPieces: [],
    isKingInCheck: false,
    kingSquare: undefined,
    currentPlayerIndex: 0,
    moveHistory: [],
    undoneMoves: [],
    halfMoveClock: 0,
    fullMoveNumber: 1,
  });

  const player1 = gameState.players[0];
  const player2 = gameState.players[1];

  const executeMove = useCallback(
    (
      move: Move,
      piecesByPlayerState: Map<Player, Piece[]>,
      boardState: Square[][],
      psuedoMove?: boolean
    ) => {
      switch (move.type) {
        case MoveType.STNDRD:
          const capturedPiece = boardState[move.to.row][move.to.col].piece;
          if (capturedPiece) {
            // might mess with gen legal moves ... maybe pass in state
            setGameState((prevState) => ({
              ...prevState,
              capturedPieces: [...prevState.capturedPieces, capturedPiece],
            }));
            capturedPiece.isAlive = false;
            boardState[move.to.row][move.to.col].piece = undefined;
          }
          const standardPiecesToUpdate = executeStandardMove(
            move,
            boardState,
            capturedPiece
          );
          if (standardPiecesToUpdate) {
            updatePlayerPieces(piecesByPlayerState, standardPiecesToUpdate);
          }
          break;

        case MoveType.CASTLE:
          const castlingPiecesToUpdate = executeCastlingMove(move, boardState);
          updatePlayerPieces(piecesByPlayerState, castlingPiecesToUpdate);
          break;
        case MoveType.EP:
          const enPassantMove = move as EnPassantMove;
          const epCapturedPieceSquare = enPassantMove.capturedPieceSquare;
          const epCapturedPiece =
            boardState[epCapturedPieceSquare.row][epCapturedPieceSquare.col]
              .piece;
          if (epCapturedPiece) {
            // might mess with genLegalMoves
            setGameState((prevState) => ({
              ...prevState,
              capturedPieces: [...prevState.capturedPieces, epCapturedPiece],
            }));
            epCapturedPiece.isAlive = false;
            boardState[enPassantMove.capturedPieceSquare.row][
              enPassantMove.capturedPieceSquare.col
            ].piece = undefined;
          }
          const enPassantPiecesToUpdate = executeEnPassantMove(
            move,
            boardState,
            epCapturedPiece
          );
          if (enPassantPiecesToUpdate) {
            updatePlayerPieces(piecesByPlayerState, enPassantPiecesToUpdate);
          }
          break;
        case MoveType.PROMO:
          const capturedPiecePromo = boardState[move.to.row][move.to.col].piece;
          if (capturedPiecePromo) {
            // might mess with genLegalMoves
            setGameState((prevState) => ({
              ...prevState,
              capturedPieces: [...prevState.capturedPieces, capturedPiecePromo],
            }));
            capturedPiecePromo.isAlive = false;
            boardState[move.to.row][move.to.col].piece = undefined;
          }
          const promoPiecesToUpdate = executePromoMove(
            move,
            boardState,
            capturedPiecePromo
          );
          if (promoPiecesToUpdate) {
            updatePlayerPieces(piecesByPlayerState, promoPiecesToUpdate);
          }
          break;
      }
      if (!psuedoMove) {
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
      }
    },
    []
  );

  const getPlayerMoves = useCallback(
    (
      player: Player,
      piecesByPlayer: Map<Player, Piece[]>,
      board: Square[][]
    ) => {
      const playerPieces = piecesByPlayer.get(player);
      const playerMoves: Move[] = [];

      if (!playerPieces) return playerMoves;

      playerPieces.forEach((piece) => {
        if (piece.isAlive) {
          const pieceMoves =
            piece.type === PieceType.PAWN
              ? piece.movementStrategy(board, piece, gameState.moveHistory)
              : piece.movementStrategy(board, piece);
          playerMoves.push(...pieceMoves);
        }
      });

      return playerMoves;
    },
    [gameState.moveHistory]
  );

  const generateLegalMoves = useCallback(
    (moves: Move[]) => {
      const checkKingMoves = getPlayerMoves(
        gameState.players[1 - gameState.currentPlayerIndex],
        gameState.piecesByPlayer,
        gameState.board
      );
      if (isKingInCheck(checkKingMoves)) {
        setGameState((prevState) => ({
          ...prevState,
          isKingInCheck: true,
          kingSquare: playersKing?.currentSquare,
        }));
      } else {
        setGameState((prevState) => ({
          ...prevState,
          isKingInCheck: false,
          kingSquare: undefined,
        }));
      }

      let playersKing: Piece | undefined;
      const legalMoves: Move[] = [];

      moves.forEach((move) => {
        // can move this outside once i make undoMove take state as a param
        const { copiedBoard, copiedPiecesByPlayer } = copyBoard(
          gameState.board
        );

        if (move.type === MoveType.CASTLE) {
          const opponentMoves = getPlayerMoves(
            gameState.players[1 - gameState.currentPlayerIndex],
            copiedPiecesByPlayer,
            copiedBoard
          );
          if (
            isValidCastlingMove(
              move as CastlingMove,
              opponentMoves,
              copiedBoard
            )
          ) {
            legalMoves.push(move);
          }
        } else {
          executeMove(move, copiedPiecesByPlayer, copiedBoard, true);
          const playersPieces = copiedPiecesByPlayer.get(
            gameState.players[gameState.currentPlayerIndex]
          );
          if (playersPieces) {
            playersKing = playersPieces.find((piece) => {
              return piece.type === PieceType.KING;
            });
          }
          const opponentMoves = getPlayerMoves(
            gameState.players[1 - gameState.currentPlayerIndex],
            copiedPiecesByPlayer,
            copiedBoard
          );
          if (
            playersKing &&
            !isAttackedByOpponent(opponentMoves, playersKing.currentSquare)
          ) {
            legalMoves.push(move);
          }
        }
      });
      return legalMoves;
    },
    [
      executeMove,
      getPlayerMoves,
      gameState.board,
      gameState.currentPlayerIndex,
      gameState.players,
      gameState.piecesByPlayer,
    ]
  );

  const switchPlayer = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      currentPlayerIndex: 1 - prevState.currentPlayerIndex,
    }));
  }, []);

  const updatePlayerPieces = (
    piecesByPlayer: Map<Player, Piece[]>,
    updatedPieces: Piece[]
  ) => {
    updatedPieces.forEach((updatedPiece) => {
      const playerPieces = piecesByPlayer.get(updatedPiece.player) || [];
      const updatedPlayerPieces = playerPieces.map((piece) =>
        piece.id === updatedPiece.id ? updatedPiece : piece
      );
      piecesByPlayer.set(updatedPiece.player, updatedPlayerPieces);
    });
  };

  const addMoveHistory = useCallback((move: Move) => {
    setGameState((prevState) => ({
      ...prevState,
      moveHistory: [...prevState.moveHistory, move],
    }));
  }, []);

  const initializeBoard = useCallback(() => {
    const setup = setupPieces;
    const newBoard = gameState.board;
    let newPiecesByPlayer = new Map();

    [PlayerColor.WHITE, PlayerColor.BLACK].forEach((color) => {
      const rowOffset = color === PlayerColor.WHITE ? 7 : 0;
      const pawnRow = color === PlayerColor.WHITE ? 6 : 1;

      setup.forEach(({ type, positions, movementStrategy }) => {
        positions.forEach(({ row, col }) => {
          const player = color === PlayerColor.WHITE ? player1 : player2;
          const pieceRow =
            row + (type === PieceType.PAWN ? pawnRow - 1 : rowOffset);
          const square = gameState.board[pieceRow][col];
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

          newBoard[pieceRow][col].piece = piece;
          const playerPieces = newPiecesByPlayer.get(player) || [];
          newPiecesByPlayer.set(player, [...playerPieces, piece]);
        });
      });
    });

    setGameState((prevState) => ({
      ...prevState,
      board: newBoard,
      piecesByPlayer: newPiecesByPlayer,
    }));
  }, [player1, player2, gameState.board]);

  const playerCanMove = useCallback(
    (
      movingPiece: Piece,
      targetSquare: Square,
      promotionMove?: PromotionMove
    ) => {
      if (
        movingPiece.color !==
        gameState.players[gameState.currentPlayerIndex].color
      ) {
        return undefined;
      }

      let foundMove: Move | undefined;
      if (promotionMove) {
        foundMove = gameState.currentPlayerMoves.find((move) => {
          return (
            move.to.row === targetSquare.row &&
            move.to.col === targetSquare.col &&
            move.piece.id === movingPiece.id &&
            (move as PromotionMove).promotionType ===
              promotionMove.promotionType
          );
        });
      } else {
        foundMove = gameState.currentPlayerMoves.find((move) => {
          return (
            move.to.row === targetSquare.row &&
            move.to.col === targetSquare.col &&
            move.piece.id === movingPiece.id
          );
        });
      }

      return foundMove || undefined;
    },
    [
      gameState.currentPlayerMoves,
      gameState.currentPlayerIndex,
      gameState.players,
    ]
  );

  const finalizeMove = useCallback(
    (move: Move) => {
      executeMove(move, gameState.piecesByPlayer, gameState.board);
      addMoveHistory(move);
      gameState.undoneMoves = [];
      switchPlayer();
    },
    [gameState, executeMove, addMoveHistory, switchPlayer]
  );
  useEffect(() => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const rawMoves = getPlayerMoves(
      currentPlayer,
      gameState.piecesByPlayer,
      gameState.board
    );
    const currentPlayerMoves = generateLegalMoves(rawMoves);
    setGameState((prevState) => ({
      ...prevState,
      currentPlayerMoves: currentPlayerMoves,
    }));
  }, [
    generateLegalMoves,
    getPlayerMoves,
    gameState.board,
    gameState.currentPlayerIndex,
    gameState.piecesByPlayer,
    gameState.players,
  ]);

  const handleMove = useCallback(
    (
      movingPiece: Piece,
      targetSquare: Square,
      promotionMove: PromotionMove | undefined
    ) => {
      const tempMove = playerCanMove(movingPiece, targetSquare, promotionMove);
      if (tempMove && tempMove.piece.id === movingPiece.id) {
        finalizeMove(tempMove);
        setGameState((prevState) => ({
          ...prevState,
          undoneMoves: [],
        }));
      }
    },
    [playerCanMove, finalizeMove]
  );

  const undoMove = useCallback(() => {
    // give state to update as param
    if (gameState.moveHistory.length > 0) {
      setGameState((prevState) => {
        const lastMove =
          prevState.moveHistory[prevState.moveHistory.length - 1];
        const updatedBoardState = prevState.board.map((row, rowIndex) =>
          row.map((square, colIndex) => ({
            ...square,
            piece:
              lastMove.from.row === rowIndex && lastMove.from.col === colIndex
                ? lastMove.piece
                : lastMove.to.row === rowIndex &&
                  lastMove.to.col === colIndex &&
                  lastMove.type !== MoveType.EP
                ? lastMove.capturedPiece
                : square.piece,
          }))
        );
        const lastMoveEP =
          lastMove.type === MoveType.EP ? (lastMove as EnPassantMove) : null;
        if (lastMoveEP) {
          updatedBoardState[lastMoveEP.capturedPieceSquare.row][
            lastMoveEP.capturedPieceSquare.col
          ].piece = lastMoveEP.capturedPiece;
          updatedBoardState[lastMoveEP.from.row][lastMoveEP.from.col].piece =
            lastMoveEP.piece;
          updatedBoardState[lastMoveEP.to.row][lastMoveEP.to.col].piece =
            undefined;
        }
        const piecesToUpdate = [lastMove.piece];
        if (lastMove.capturedPiece) {
          lastMove.capturedPiece.isAlive = true;
          piecesToUpdate.push(lastMove.capturedPiece);
        }
        updatePlayerPieces(gameState.piecesByPlayer, piecesToUpdate);
        const updatedMoveHistory = prevState.moveHistory.slice(0, -1);
        const updatedCapturedPieces = prevState.capturedPieces.slice(0, -1);
        return {
          ...prevState,
          board: updatedBoardState,
          moveHistory: updatedMoveHistory,
          capturedPieces: updatedCapturedPieces,
          undoneMoves: [...prevState.undoneMoves, lastMove],
        };
      });
      switchPlayer();
    }
  }, [switchPlayer, gameState.moveHistory, gameState.piecesByPlayer]);

  const redoMove = useCallback(() => {
    if (gameState.undoneMoves.length > 0) {
      const lastUndoneMove = gameState.undoneMoves.pop();
      if (lastUndoneMove) {
        executeMove(lastUndoneMove, gameState.piecesByPlayer, gameState.board);
        addMoveHistory(lastUndoneMove);
      }
      switchPlayer();
    }
  }, [
    gameState.undoneMoves,
    gameState.piecesByPlayer,
    gameState.board,
    addMoveHistory,
    executeMove,
    switchPlayer,
  ]);

  const resetGame = () => {
    setGameState({
      board: defaultBoard(),
      players: [
        createPlayer(PlayerColor.WHITE, PlayerType.HUMAN),
        createPlayer(PlayerColor.BLACK, PlayerType.HUMAN),
      ],
      piecesByPlayer: new Map<Player, Piece[]>(),
      currentPlayerMoves: [],
      capturedPieces: [],
      isKingInCheck: false,
      kingSquare: undefined,
      currentPlayerIndex: 0,
      moveHistory: [],
      undoneMoves: [],
      halfMoveClock: 0,
      fullMoveNumber: 1,
    });
  };

  return {
    ...gameState,
    initializeBoard,
    playerCanMove,
    handleMove,
    finalizeMove,
    undoMove,
    redoMove,
    resetGame,
  };
};
