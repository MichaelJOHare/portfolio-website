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
} from "../../utils";
import {
  Move,
  MoveType,
  Piece,
  PieceType,
  PlayerColor,
  Square,
  BoardState,
} from "../../types";

export default function Board() {
  const {
    board,
    currentPlayerMoves,
    players,
    currentPlayerIndex,
    handleMove,
    playerCanMove,
  } = useGameContext();
  const [boardState, setBoardState] = useState<BoardState>({
    legalMoveSquares: [],
    showPromotionPanel: false,
    promotionSquare: undefined,
    promotionColor: undefined,
    squaresToHide: [],
    promotingPawn: undefined,
    selectedPiece: undefined,
  });

  const updateStateAfterMove = useCallback(
    (move: Move, piece: Piece, row: number, col: number) => {
      if (move.type === MoveType.PROMO) {
        setBoardState((prevState) => ({
          ...prevState,
          showPromotionPanel: true,
          promotionSquare: move.to,
          promotionColor: move.piece.color,
          promotingPawn: move.piece,
          squaresToHide: getSquaresToHideDuringPromotion(
            move.to,
            move.piece.color
          ),
        }));
      } else {
        handleMove(piece, createSquare(row, col));
        setBoardState((prevState) => ({
          ...prevState,
          promotionColor: undefined,
          promotionSquare: undefined,
          promotingPawn: undefined,
          selectedPiece: undefined,
        }));
      }
    },
    [handleMove]
  );

  const handlePieceSelection = (row: number, col: number) => {
    // clear highlights
    setBoardState({
      ...boardState,
      legalMoveSquares: [],
      selectedPiece: undefined,
    });
    const piece = getPieceAt(board, row, col);
    if (piece && piece.color === players[currentPlayerIndex].color) {
      setBoardState({ ...boardState, selectedPiece: piece });
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
        setBoardState({
          ...boardState,
          selectedPiece: undefined,
        });
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

    setBoardState({
      ...boardState,
      showPromotionPanel: false,
      promotionSquare: undefined,
      squaresToHide: [],
    });
  };

  const isSquareToHide = (square: Square) => {
    return boardState.squaresToHide.find(
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
        setBoardState({
          ...boardState,
          legalMoveSquares: [],
        });
        if (boardState.showPromotionPanel)
          setBoardState({
            ...boardState,
            showPromotionPanel: false,
          });
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
    boardState,
    handleMove,
    updateStateAfterMove,
    playerCanMove,
    currentPlayerMoves,
    boardState.promotionColor,
    boardState.promotionSquare,
    boardState.showPromotionPanel,
  ]);

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div
      id="chessboard"
      className="relative grid grid-cols-8 w-[90vmin] h-[90vmin] lg:w-[70vmin] lg:h-[70vmin] touch-none"
    >
      {boardState.showPromotionPanel && (
        <div className="absolute top-0 left-0 w-[90vmin] h-[90vmin] bg-black bg-opacity-20 z-20 lg:w-[70vmin] lg:h-[70vmin]">
          <PromotionPanel
            square={boardState.promotionSquare}
            promotingPawn={boardState.promotingPawn}
            color={boardState.promotionColor}
            onPromotionSelect={handlePromotionSelect}
          />
        </div>
      )}
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

function getSquaresToHideDuringPromotion(square: Square, color: PlayerColor) {
  const squaresToHide = [];
  const increment = color === PlayerColor.WHITE ? 1 : -1;
  for (let i = 1; i < 3; i++) {
    squaresToHide.push({ row: square.row + i * increment, col: square.col });
  }
  return squaresToHide;
}
