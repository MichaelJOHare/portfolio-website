"use client";

import { useCallback, useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ChessSquare } from "./ChessSquare";
import { ChessPiece } from "./ChessPiece";
import { PromotionPanel } from "../ui/PromotionPanel";
import { useGameContext } from "../../hooks/useGameContext";
import {
  isSquare,
  getPieceAt,
  createSquare,
  createPromotionMove,
  getSquaresToHideDuringPromotion,
} from "../../utils";
import {
  Move,
  MoveType,
  Piece,
  PieceType,
  Square,
  BoardState,
  BoardProps,
} from "../../types";
import Arrow from "../ui/Arrow";
import Circle from "../ui/Circle";
import { useAnalysis } from "../../hooks/useAnalysis";

export default function Board({
  isStockfishClassicalChecked,
  isStockfishNnueChecked,
  playButtonClicked,
  computerOpponentOptions,
  highlighter,
  squaresToHide,
  showPromotionPanel,
  handleSquaresToHide,
  handleShowPromotionPanel,
}: BoardProps) {
  const [boardState, setBoardState] = useState<BoardState>({
    engineInitialized: false,
    engineRunning: false,
    promotionSquare: undefined,
    promotionColor: undefined,
    promotingPawn: undefined,
  });
  const {
    board,
    currentPlayerMoves,
    players,
    currentPlayerIndex,
    handleMove,
    playerCanMove,
  } = useGameContext();

  const setEngineInitState = useCallback((isEngineInit: boolean) => {
    setBoardState((prevState) => ({
      ...prevState,
      engineInitialized: isEngineInit,
    }));
  }, []);

  const setEngineRunningState = useCallback((isEngineRunning: boolean) => {
    setBoardState((prevState) => ({
      ...prevState,
      engineRunning: isEngineRunning,
    }));
  }, []);

  const { stopAnalysis } = useAnalysis(
    isStockfishClassicalChecked,
    isStockfishNnueChecked,
    playButtonClicked,
    computerOpponentOptions,
    boardState.engineInitialized,
    boardState.engineRunning,
    setEngineInitState,
    setEngineRunningState,
    highlighter.addStockfishBestMoveArrow,
    highlighter.clearStockfishBestMoveArrow
  );

  const updateStateAfterMove = useCallback(
    (move: Move, piece: Piece, row: number, col: number) => {
      stopAnalysis();
      if (move.type === MoveType.PROMO) {
        setBoardState((prevState) => ({
          ...prevState,
          promotionSquare: move.to,
          promotionColor: move.piece.color,
          promotingPawn: move.piece,
        }));
        // check if stockfish turn? to not hide
        handleSquaresToHide(
          getSquaresToHideDuringPromotion(move, move.piece.color)
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
        highlighter.clearAllDrawnOnSquares();
      }
    },
    [
      handleMove,
      handleShowPromotionPanel,
      handleSquaresToHide,
      stopAnalysis,
      highlighter,
    ]
  );

  const handlePieceSelection = (row: number, col: number) => {
    highlighter.clearSelectedPieceHighlight();
    highlighter.clearLegalMoveHighlights();
    const piece = getPieceAt(board, row, col);
    if (piece && piece.color === players[currentPlayerIndex].color) {
      const moves = currentPlayerMoves.filter(
        (move) => move.piece.id === piece.id
      );
      if (moves.length > 0) {
        highlighter.setSelectedPieceHighlight(piece);
        moves.forEach((move) => {
          highlighter.setLegalMoveHighlights(move);
        });
      }
    } else if (highlighter.tempDrawings.selectedPiece) {
      const move = playerCanMove(
        highlighter.tempDrawings.selectedPiece,
        createSquare(row, col)
      );
      if (move) {
        updateStateAfterMove(
          move,
          highlighter.tempDrawings.selectedPiece,
          row,
          col
        );
      } else {
        highlighter.clearSelectedPieceHighlight();
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
    highlighter.clearAllDrawnOnSquares();
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
            highlighter.setLegalMoveHighlights(move);
          });
      },
      onDrop({ source, location }) {
        highlighter.clearLegalMoveHighlights();
        highlighter.clearSelectedPieceHighlight();
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
    highlighter,
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
      onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        highlighter.onMouseDown(e)
      }
      onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        highlighter.onMouseMove(e)
      }
      onMouseUp={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        highlighter.onMouseUp(e)
      }
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
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
      {<Arrow {...highlighter.tempDrawings.arrowCoordinates} />}
      {<Circle {...highlighter.tempDrawings.circleCoordinates} />}
      {highlighter.highlightedSquares.arrowsDrawnOnSquares.map(
        (arrow, index) => (
          <Arrow key={`arrow-${index}`} {...arrow} />
        )
      )}
      {highlighter.highlightedSquares.circlesDrawnOnSquares.map(
        (circle, index) => (
          <Circle key={`circle-${index}`} {...circle} />
        )
      )}
      {highlighter.highlightedSquares.stockfishBestMoveArrow.map(
        (arrow, index) => (
          <Arrow key={`stockfish-arrow-${index}`} {...arrow} />
        )
      )}
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <ChessSquare
            key={`${rowIndex}-${colIndex}`}
            square={[rowIndex, colIndex]}
            legalMoveSquares={highlighter.tempDrawings.legalMoveSquares}
            onSquareClick={handlePieceSelection}
            selectedPiece={highlighter.tempDrawings.selectedPiece}
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
