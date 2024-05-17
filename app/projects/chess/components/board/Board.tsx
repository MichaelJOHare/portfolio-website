"use client";

import { useCallback, useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ChessSquare } from "./ChessSquare";
import { ChessPiece } from "./ChessPiece";
import { PromotionPanel } from "../ui/PromotionPanel";
import { useGameContext } from "../../hooks/useGameContext";
import { AnalysisType, useStockfish } from "../../hooks/useStockfish";
import {
  isSquare,
  getPieceAt,
  createSquare,
  createPromotionMove,
  getSquaresToHideDuringPromotion,
  INITIAL_FEN,
  toFEN,
  getSquareFromNotation,
} from "../../utils";
import {
  Move,
  MoveType,
  Piece,
  PieceType,
  Square,
  BoardState,
} from "../../types";
import Arrow from "../ui/Arrow";

export type BoardProps = {
  isStockfishClassicalChecked: boolean;
  isStockfishNnueChecked: boolean;
  squaresToHide: Square[];
  showPromotionPanel: boolean;
  handleSquaresToHide: (squares: Square[]) => void;
  handleShowPromotionPanel: (isShown: boolean) => void;
};

export default function Board({
  isStockfishClassicalChecked,
  isStockfishNnueChecked,
  squaresToHide,
  showPromotionPanel,
  handleSquaresToHide,
  handleShowPromotionPanel,
}: BoardProps) {
  const {
    board,
    currentPlayerMoves,
    players,
    currentPlayerIndex,
    moveHistory,
    halfMoveClock,
    fullMoveNumber,
    handleMove,
    playerCanMove,
  } = useGameContext();

  const [boardState, setBoardState] = useState<BoardState>({
    legalMoveSquares: [],
    engineInitialized: false,
    engineRunning: false,
    promotionSquare: undefined,
    promotionColor: undefined,
    promotingPawn: undefined,
    selectedPiece: undefined,
  });
  const [arrowCoordinates, setArrowCoordinates] = useState({
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  });

  const analysisType = isStockfishClassicalChecked
    ? AnalysisType.CLASSICAL
    : isStockfishNnueChecked
    ? AnalysisType.NNUE
    : null;
  const {
    move: engineMove,
    findMove,
    initializeEngine,
    cleanUpEngine,
  } = useStockfish({
    analysisType,
    skillLevel: 20, // get from modal
    filepath: "/stockfish/stockfish-nnue-16.js",
  });

  const generateCurrentFen = useCallback(() => {
    console.log(
      "generateCurrentFen",
      currentPlayerIndex,
      players[currentPlayerIndex]
    );
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

  function getArrowFromBestMove() {
    if (engineMove) {
      const from = getSquareFromNotation(engineMove.from);
      const to = getSquareFromNotation(engineMove.to);
      setArrowCoordinates({
        x1: from.col * 12.5 + 6.25,
        y1: from.row * 12.5 + 6.25,
        x2: to.col * 12.5 + 6.25,
        y2: to.row * 12.5 + 6.25,
      });
    }
  }

  useEffect(() => {
    if (analysisType && !boardState.engineInitialized) {
      initializeEngine();
      setBoardState((prevState) => ({
        ...prevState,
        engineInitialized: true,
      }));
    } else if (!analysisType && boardState.engineInitialized) {
      cleanUpEngine();
      setBoardState((prevState) => ({
        ...prevState,
        engineInitialized: false,
      }));
    }
  }, [
    analysisType,
    boardState.engineInitialized,
    initializeEngine,
    cleanUpEngine,
  ]);
  useEffect(() => {
    setBoardState((prevState) => {
      if (!prevState.engineRunning && prevState.engineInitialized) {
        findMove(generateCurrentFen());
        return {
          ...prevState,
          engineRunning: true,
        };
      }
      return prevState;
    });
  }, [generateCurrentFen, boardState.engineInitialized, findMove]);
  useEffect(() => {
    if (boardState.engineRunning && engineMove) {
      setBoardState((prevState) => ({
        ...prevState,
        engineRunning: false,
      }));
      getArrowFromBestMove();
    }
  }, [engineMove, boardState.engineRunning]);

  const updateStateAfterMove = useCallback(
    (move: Move, piece: Piece, row: number, col: number) => {
      if (move.type === MoveType.PROMO) {
        setBoardState((prevState) => ({
          ...prevState,
          promotionSquare: move.to,
          promotionColor: move.piece.color,
          promotingPawn: move.piece,
        }));
        handleSquaresToHide(
          getSquaresToHideDuringPromotion(move.to, move.piece.color)
        );
        handleShowPromotionPanel(true);
      } else {
        handleMove(piece, createSquare(row, col));
        setBoardState((prevState) => ({
          ...prevState,
          promotionColor: undefined,
          promotionSquare: undefined,
          promotingPawn: undefined,
          selectedPiece: undefined,
        }));
        setArrowCoordinates({ x1: 0, y1: 0, x2: 0, y2: 0 });
      }
    },
    [
      handleMove,
      handleShowPromotionPanel,
      handleSquaresToHide,
      generateCurrentFen,
    ]
  );

  const handlePieceSelection = (row: number, col: number) => {
    // clear highlights
    setBoardState((prevState) => ({
      ...prevState,
      legalMoveSquares: [],
      selectedPiece: undefined,
    }));
    const piece = getPieceAt(board, row, col);
    if (piece && piece.color === players[currentPlayerIndex].color) {
      setBoardState((prevState) => ({ ...prevState, selectedPiece: piece }));
      const moves = currentPlayerMoves.filter(
        (move) => move.piece.id === piece.id
      );
      moves &&
        moves.forEach((move) => {
          setBoardState((prevState) => ({
            ...prevState,
            legalMoveSquares: [...prevState.legalMoveSquares, move],
          }));
        });
    } else if (boardState.selectedPiece) {
      const move = playerCanMove(
        boardState.selectedPiece,
        createSquare(row, col)
      );
      if (move) {
        updateStateAfterMove(move, boardState.selectedPiece, row, col);
      } else {
        setBoardState((prevState) => ({
          ...prevState,
          selectedPiece: undefined,
        }));
      }
    }
  };

  const handlePromotionSelect = (
    square: Square | undefined,
    type: PieceType,
    promotingPawn: Piece | undefined
  ) => {
    if (!promotingPawn || !square) return;
    const capturedPiece = getPieceAt(board, square.row, square.col);
    const promotionMove = createPromotionMove(
      promotingPawn,
      promotingPawn.currentSquare,
      square,
      type,
      capturedPiece
    );

    if (promotionMove) {
      handleMove(promotionMove.piece, promotionMove.to, promotionMove);
    }

    setBoardState((prevState) => ({
      ...prevState,
      promotionSquare: undefined,
    }));
    handleSquaresToHide([]);
    handleShowPromotionPanel(false);
    setArrowCoordinates({ x1: 0, y1: 0, x2: 0, y2: 0 });
  };

  const isSquareToHide = (square: Square) => {
    return squaresToHide.find(
      (s) => s.row === square.row && s.col === square.col
    );
  };

  useEffect(() => {
    return monitorForElements({
      onDragStart: ({ source }) => {
        const pieceSourceSquare = source.data.square;
        if (!isSquare(pieceSourceSquare)) {
          return;
        }
        const piece = getPieceAt(
          board,
          pieceSourceSquare[0],
          pieceSourceSquare[1]
        );
        const moves =
          piece &&
          currentPlayerMoves.filter((move) => move.piece.id === piece.id);
        moves &&
          moves.forEach((move) => {
            setBoardState((prevState) => ({
              ...prevState,
              legalMoveSquares: [...prevState.legalMoveSquares, move],
            }));
          });
      },
      onDrop({ source, location }) {
        setBoardState((prevState) => ({
          ...prevState,
          legalMoveSquares: [],
        }));
        if (showPromotionPanel) handleShowPromotionPanel(false);
        const destination = location.current.dropTargets[0];
        if (!destination) {
          return;
        }

        const destinationLocation = destination.data.square;
        const sourceLocation = source.data.square;

        if (!isSquare(destinationLocation) || !isSquare(sourceLocation)) {
          return;
        }
        const piece = getPieceAt(board, sourceLocation[0], sourceLocation[1]);
        if (piece) {
          const move = playerCanMove(
            piece,
            createSquare(destinationLocation[0], destinationLocation[1])
          );
          if (move) {
            updateStateAfterMove(
              move,
              piece,
              destinationLocation[0],
              destinationLocation[1]
            );
          }
        }
      },
    });
  }, [
    board,
    handleMove,
    updateStateAfterMove,
    playerCanMove,
    currentPlayerMoves,
    boardState.promotionColor,
    boardState.promotionSquare,
    handleShowPromotionPanel,
    showPromotionPanel,
  ]);

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div
      id="chessboard"
      className="relative grid grid-cols-8 w-[90vmin] h-[90vmin] lg:w-[70vmin] lg:h-[70vmin] touch-none"
    >
      {showPromotionPanel && (
        <div className="absolute top-0 left-0 w-[90vmin] h-[90vmin] bg-black bg-opacity-20 z-20 lg:w-[70vmin] lg:h-[70vmin]">
          <PromotionPanel
            square={boardState.promotionSquare}
            promotingPawn={boardState.promotingPawn}
            color={boardState.promotionColor}
            onPromotionSelect={handlePromotionSelect}
          />
        </div>
      )}
      {arrowCoordinates && <Arrow arrowCoordinates={arrowCoordinates} />}
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <ChessSquare
            key={`${rowIndex}-${colIndex}`}
            square={[rowIndex, colIndex]}
            legalMoveSquares={boardState.legalMoveSquares}
            onSquareClick={handlePieceSelection}
          >
            {square.piece &&
              square.piece.isAlive &&
              !isSquareToHide(square) && (
                <ChessPiece
                  type={square.piece.type}
                  color={square.piece.color}
                  piece={square.piece}
                  square={[rowIndex, colIndex]}
                />
              )}
          </ChessSquare>
        ))
      )}
    </div>
  );
}
