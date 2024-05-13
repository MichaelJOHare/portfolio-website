"use client";

import { useEffect, useState } from "react";
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
} from "../../types";

export default function Board() {
  const { board, currentPlayerMoves, handleMove, playerCanMove } =
    useGameContext();
  const [legalMoveSquares, setLegalMoveSquares] = useState<Move[]>([]);
  const [showPromotionPanel, setShowPromotionPanel] = useState(false);
  const [promotionSquare, setPromotionSquare] = useState<Square | undefined>();
  const [promotionColor, setPromotionColor] = useState<PlayerColor>();
  const [squaresToHide, setSquaresToHide] = useState<Square[]>([]);
  const [promotingPawn, setPromotingPawn] = useState<Piece>();

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

    setShowPromotionPanel(false);
    setPromotionSquare(undefined);
    setSquaresToHide([]);
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
            setLegalMoveSquares((prevState) => [...prevState, move]);
          });
      },
      onDrop({ source, location }) {
        setLegalMoveSquares([]);
        if (showPromotionPanel) setShowPromotionPanel(false);
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
          if (move && move.type === MoveType.PROMO) {
            setShowPromotionPanel(true);
            setPromotionSquare(move.to);
            setPromotionColor(move.piece.color);
            setPromotingPawn(move.piece);
            setSquaresToHide(
              getSquaresToHideDuringPromotion(move.to, move.piece.color)
            );
          } else if (move && move.type !== MoveType.PROMO) {
            handleMove(
              piece,
              createSquare(destinationLocation[0], destinationLocation[1])
            );
            setPromotionColor(undefined);
            setPromotionSquare(undefined);
            setPromotingPawn(undefined);
          }
        }
      },
    });
  }, [
    board,
    handleMove,
    playerCanMove,
    currentPlayerMoves,
    promotionColor,
    promotionSquare,
    showPromotionPanel,
  ]);

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative grid grid-cols-8 w-[90vmin] h-[90vmin] lg:w-[70vmin] lg:h-[70vmin] touch-none">
      {showPromotionPanel && (
        <div className="absolute top-0 left-0 w-[90vmin] h-[90vmin] bg-black bg-opacity-20 z-10 lg:w-[70vmin] lg:h-[70vmin]">
          <PromotionPanel
            square={promotionSquare}
            promotingPawn={promotingPawn}
            color={promotionColor}
            onPromotionSelect={handlePromotionSelect}
          />
        </div>
      )}
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <ChessSquare
            key={`${rowIndex}-${colIndex}`}
            square={[rowIndex, colIndex]}
            legalMoveSquares={legalMoveSquares}
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
