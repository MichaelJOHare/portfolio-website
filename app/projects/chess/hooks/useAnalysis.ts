import { useCallback, useEffect, useState } from "react";
import { useGameContext } from "./useGameContext";
import { useStockfish, AnalysisType, ChessEngineMove } from "./useStockfish";
import {
  toFEN,
  getSquareFromNotation,
  isEmpty,
  createPromotionMove,
  createEnPassantMove,
  createCastlingMove,
  createStandardMove,
} from "../utils";
import {
  ArrowProps,
  Piece,
  PieceType,
  PlayerColor,
  PlayerType,
  Square,
} from "../types";

export const useAnalysis = (
  isStockfishClassicalChecked: boolean,
  isStockfishNnueChecked: boolean,
  playButtonClicked: boolean,
  computerOpponentOptions: number[],
  engineInitialized: boolean,
  engineRunning: boolean,
  setEngineInitState: (isInitialized: boolean) => void,
  setEngineRunningState: (isRunning: boolean) => void,
  addStockfishBestMoveArrow: (arrowCoordinates: ArrowProps) => void,
  clearStockfishBestMoveArrow: () => void
) => {
  const [evalGauge, setEvalGauge] = useState<HTMLElement | null>(null);
  const [storedFen, setStoredFen] = useState("");
  const {
    board,
    players,
    currentPlayerIndex,
    moveHistory,
    halfMoveClock,
    fullMoveNumber,
    finalizeMove,
  } = useGameContext();
  const analysisType = isStockfishClassicalChecked
    ? AnalysisType.CLASSICAL
    : isStockfishNnueChecked
    ? AnalysisType.NNUE
    : null;

  const convertNotationToSquare = useCallback(
    (notation: string | undefined) => {
      if (notation) {
        const col = notation.charCodeAt(0) - "a".charCodeAt(0);
        const row = 8 - parseInt(notation[1]);

        return board[row][col];
      }
    },
    [board]
  );

  const isEnPassantMove = useCallback(
    (movingPiece: Piece, fromRowCol: Square, toRowCol: Square) => {
      return (
        movingPiece.type === PieceType.PAWN &&
        Math.abs(toRowCol.col - fromRowCol.col) === 1 &&
        isEmpty(board, fromRowCol.row, fromRowCol.col)
      );
    },
    [board]
  );

  const executeMove = useCallback(
    (foundBestMove: ChessEngineMove) => {
      const fromSquare = convertNotationToSquare(foundBestMove?.from);
      const toSquare = convertNotationToSquare(foundBestMove?.to);
      if (fromSquare && toSquare) {
        const movingPiece = board[fromSquare.row][fromSquare.col].piece;
        const capturedPiece = board[toSquare.row][toSquare.col].piece;
        const isEnPassant =
          movingPiece &&
          isEnPassantMove(movingPiece, fromSquare, toSquare) &&
          capturedPiece;
        const isCastling =
          movingPiece && isCastlingMove(movingPiece, fromSquare, toSquare);

        if (movingPiece) {
          if (foundBestMove?.promotion) {
            const promoType = determinePromotionType(foundBestMove.promotion);
            const promoMove = createPromotionMove(
              movingPiece,
              fromSquare,
              toSquare,
              promoType,
              capturedPiece
            );
            finalizeMove(promoMove);
          } else if (isEnPassant) {
            finalizeMove(
              createEnPassantMove(
                movingPiece,
                fromSquare,
                toSquare,
                capturedPiece.currentSquare,
                capturedPiece
              )
            );
          } else if (isCastling) {
            const king = movingPiece;
            const isQueenside = fromSquare.col > toSquare.col;
            const rookStartCol = isQueenside ? 0 : 7;
            const rookEndCol = isQueenside ? 3 : 5;
            const rook = board[fromSquare.row][rookStartCol].piece;
            const rookFromSquare = board[fromSquare.row][rookStartCol];
            const rookToSquare = board[fromSquare.row][rookEndCol];
            const castleMove =
              rook &&
              createCastlingMove(
                king,
                rook,
                fromSquare,
                toSquare,
                rookFromSquare,
                rookToSquare
              );
            castleMove && finalizeMove(castleMove);
          } else {
            finalizeMove(
              createStandardMove(
                movingPiece,
                fromSquare,
                toSquare,
                capturedPiece
              )
            );
          }
        }
      }
    },
    [board, convertNotationToSquare, finalizeMove, isEnPassantMove]
  );

  const {
    currentMove: currentEngineMove,
    bestMove: bestEngineMove,
    evalCentipawn,
    findMove,
    stopAnalysis,
    initializeEngine,
    cleanUpEngine,
  } = useStockfish({
    analysisType,
    skillLevel: computerOpponentOptions[0] || 10,
    filepath: "/stockfish/stockfish-nnue-16.js",
  });

  const generateCurrentFen = useCallback(() => {
    return toFEN(
      board,
      players,
      currentPlayerIndex,
      moveHistory,
      halfMoveClock,
      fullMoveNumber
    );
  }, [
    board,
    currentPlayerIndex,
    fullMoveNumber,
    halfMoveClock,
    moveHistory,
    players,
  ]);

  const isCastlingMove = (
    movingPiece: Piece,
    fromRowCol: Square,
    toRowCol: Square
  ) => {
    return (
      movingPiece.type === PieceType.KING &&
      Math.abs(toRowCol.col - fromRowCol.col) > 1
    );
  };

  const determinePromotionType = (char: string) => {
    switch (char) {
      case "q":
        return PieceType.QUEEN;
      case "r":
        return PieceType.ROOK;
      case "b":
        return PieceType.BISHOP;
      case "n":
        return PieceType.KNIGHT;
      default:
        return PieceType.QUEEN;
    }
  };

  const getArrowFromMove = useCallback(
    (move: ChessEngineMove) => {
      if (move) {
        const from = getSquareFromNotation(move.from);
        const to = getSquareFromNotation(move.to);
        addStockfishBestMoveArrow({
          x1: from.col * 12.5 + 6.25,
          y1: from.row * 12.5 + 6.25,
          x2: to.col * 12.5 + 6.25,
          y2: to.row * 12.5 + 6.25,
          isStockfish: true,
        });
      }
    },
    [addStockfishBestMoveArrow]
  );

  useEffect(() => {
    if (analysisType && !engineInitialized) {
      initializeEngine();
      setEvalGauge(document.getElementById("eval-gauge"));
      setEngineInitState(true);
    } else if (playButtonClicked && !engineInitialized) {
      initializeEngine();
      console.log(computerOpponentOptions, players);
      computerOpponentOptions[1] === 0
        ? (players[1].type = PlayerType.COMPUTER)
        : (players[0].type = PlayerType.COMPUTER);
      setEngineInitState(true);
    } else if (!analysisType && !playButtonClicked && engineInitialized) {
      cleanUpEngine();
      setEngineInitState(false);
    }
  }, [
    analysisType,
    players,
    computerOpponentOptions,
    playButtonClicked,
    engineInitialized,
    setEngineInitState,
    initializeEngine,
    cleanUpEngine,
  ]);
  useEffect(() => {
    const currentFen = generateCurrentFen();
    if (!engineRunning && engineInitialized && currentFen !== storedFen) {
      clearStockfishBestMoveArrow();
      findMove(currentFen);
      setStoredFen(currentFen);
      setEngineRunningState(true);
    } else if (engineRunning && currentEngineMove && !playButtonClicked) {
      // find out why engineRunning stays true when analysis is turned off before max depth is reached
      clearStockfishBestMoveArrow();
      getArrowFromMove(currentEngineMove);
    } else if (engineRunning && bestEngineMove) {
      if (!playButtonClicked) {
        clearStockfishBestMoveArrow();
        getArrowFromMove(bestEngineMove);
      } else if (
        playButtonClicked &&
        currentPlayerIndex !== computerOpponentOptions[1]
      ) {
        // intentional delay to make computer move feel more natural
        const delay = Math.random() * (1200 - 400) + 400;
        setTimeout(() => {
          executeMove(bestEngineMove);
        }, delay);
      }
      setEngineRunningState(false);
    }
    /* else if (engineRunning && !engineMove && something to check undone after mate ) {
      // handle case where checkmate happens then user clicks undo move causing engine status to stay Running while engineMove === null
      clearStockfishBestMoveArrow();
      findMove(currentFen);
      setStoredFen(currentFen);
    } */
  }, [
    currentEngineMove,
    bestEngineMove,
    generateCurrentFen,
    engineInitialized,
    engineRunning,
    computerOpponentOptions,
    playButtonClicked,
    currentPlayerIndex,
    storedFen,
    executeMove,
    setEngineRunningState,
    findMove,
    clearStockfishBestMoveArrow,
    getArrowFromMove,
  ]);
  useEffect(() => {
    if (evalGauge) {
      if (
        players[currentPlayerIndex].color === PlayerColor.BLACK &&
        evalCentipawn < 50
      ) {
        evalGauge.setAttribute("value", (100 - evalCentipawn).toString());
      } else if (
        players[currentPlayerIndex].color === PlayerColor.BLACK &&
        evalCentipawn > 50
      ) {
        evalGauge.setAttribute("value", (evalCentipawn * -1).toString());
      } else {
        evalGauge.setAttribute("value", evalCentipawn.toString());
      }
    }
  }, [evalCentipawn, evalGauge, currentPlayerIndex, players]);

  return { stopAnalysis };
};
