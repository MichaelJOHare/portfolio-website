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
      boardState: Square[][]
    ) => {
      switch (move.type) {
        case MoveType.STNDRD:
          const updatedPiece = {
            ...move.piece,
            currentSquare: move.to,
            hasMoved: true,
          };
          boardState[move.from.row][move.from.col].piece = undefined;

          const capturedPiece = boardState[move.to.row][move.to.col].piece;
          if (capturedPiece) {
            // might mess with genLegalMoves
            setGameState((prevState) => ({
              ...prevState,
              capturedPieces: [...prevState.capturedPieces, capturedPiece],
            }));
            capturedPiece.isAlive = false;
            boardState[move.to.row][move.to.col].piece = undefined;
          }

          boardState[move.to.row][move.to.col].piece = updatedPiece;
          updatePlayerPieces(piecesByPlayerState, move, [updatedPiece]);
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
          updatePlayerPieces(piecesByPlayerState, move, [
            updatedKing,
            updatedRook,
          ]);
          break;
        case MoveType.EP:
          const enPassantMove = move as EnPassantMove;
          const updatedPawn = {
            ...enPassantMove.piece,
            currentSquare: enPassantMove.to,
          };
          const epCapturedPiece =
            enPassantMove.capturedPiece &&
            boardState[enPassantMove.capturedPieceSquare.row][
              enPassantMove.capturedPieceSquare.col
            ].piece;

          epCapturedPiece && (epCapturedPiece.isAlive = false);
          boardState[enPassantMove.capturedPieceSquare.row][
            enPassantMove.capturedPieceSquare.col
          ].piece = undefined;

          boardState[enPassantMove.from.row][enPassantMove.from.col].piece =
            undefined;
          boardState[enPassantMove.to.row][enPassantMove.to.col].piece =
            updatedPawn;
          // add captured piece to updatePlayerPieces
          updatePlayerPieces(piecesByPlayerState, move, [updatedPawn]);
          break;
        case MoveType.PROMO:
          const promotionMove = move as PromotionMove;
          const promotedPawn = {
            ...promotionMove.piece,
            currentSquare: promotionMove.to,
            type: promotionMove.promotionType,
          };
          boardState[promotionMove.from.row][promotionMove.from.col].piece =
            undefined;
          boardState[promotionMove.to.row][promotionMove.to.col].piece =
            promotedPawn;
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
          // add captured piece to updatePlayerPieces
          updatePlayerPieces(piecesByPlayerState, move, [promotedPawn]);
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
      let playersKing: Piece | undefined;
      const legalMoves: Move[] = [];

      moves.forEach((move) => {
        // can move this outside once i make undoMove
        const { copiedBoard, copiedPiecesByPlayer } = copyBoard(
          gameState.board
        );
        const playersPieces = copiedPiecesByPlayer.get(
          gameState.players[gameState.currentPlayerIndex]
        );
        if (playersPieces) {
          playersKing = playersPieces.find((piece) => {
            return piece.type === PieceType.KING;
          });
        }

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
          executeMove(move, copiedPiecesByPlayer, copiedBoard);
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
    ]
  );

  const switchPlayer = useCallback(() => {
    setGameState((prevState) => {
      const newCurrentPlayerIndex = 1 - prevState.currentPlayerIndex;

      return {
        ...prevState,
        currentPlayerIndex: newCurrentPlayerIndex,
      };
    });
  }, []);

  const updatePlayerPieces = (
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
  useEffect(() => {
    const currentPlayerMoves = generateLegalMoves(
      getPlayerMoves(player1, gameState.piecesByPlayer, gameState.board)
    );
    setGameState((prevState) => ({
      ...prevState,
      currentPlayerMoves: currentPlayerMoves,
    }));
  }, [
    gameState.board,
    gameState.piecesByPlayer,
    generateLegalMoves,
    getPlayerMoves,
    player1,
  ]);

  const playerCanMove = useCallback(
    (movingPiece: Piece, targetSquare: Square) => {
      if (
        movingPiece.color !==
        gameState.players[gameState.currentPlayerIndex].color
      ) {
        return null;
      }

      const foundMove = gameState.currentPlayerMoves.find((move) => {
        return (
          move.to.row === targetSquare.row &&
          move.to.col === targetSquare.col &&
          move.piece.id === movingPiece.id
        );
      });

      return foundMove || null;
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

  useEffect(() => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentPlayerMoves = generateLegalMoves(
      getPlayerMoves(currentPlayer, gameState.piecesByPlayer, gameState.board)
    );

    setGameState((prevState) => ({
      ...prevState,
      currentPlayerMoves: currentPlayerMoves,
    }));
  }, [
    gameState.currentPlayerIndex,
    gameState.board,
    gameState.piecesByPlayer,
    gameState.players,
    generateLegalMoves,
    getPlayerMoves,
  ]);

  const handleMove = useCallback(
    (movingPiece: Piece, targetSquare: Square) => {
      const tempMove = playerCanMove(movingPiece, targetSquare);
      if (tempMove && tempMove.piece.id === movingPiece.id) {
        finalizeMove(tempMove);
        return tempMove;
      }
    },
    [playerCanMove, finalizeMove]
  );

  /*   const getEnPassantTarget = useCallback(() => {
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
  }, [gameState.moveHistory]); */

  /*     const clearBoard = useCallback(() => {
      setGameState((prevState) => ({
        ...prevState,
        board: defaultBoard(),
      }));
    }, []); */

  /*   const undoLastMove = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      moveHistory: prevState.moveHistory.slice(0, -1),
    }));
    setGameState((prevState) => ({
      ...prevState,
      capturedPieces: prevState.capturedPieces.slice(0, -1),
    }));
    switchPlayer();
  }, [switchPlayer]); */

  return {
    ...gameState,
    initializeBoard,
    playerCanMove,
    handleMove,
  };
};
