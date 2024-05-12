"use client";

import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ChessSquare } from "./ChessSquare";
import { ChessPiece } from "./ChessPiece";
import { PromotionPanel } from "../ui/PromotionPanel";
import { useGameContext } from "../../hooks/useGameContext";
import { isSquare, getPieceAt, createSquare } from "../../utils";
import {
  Move,
  MoveType,
  Piece,
  PlayerColor,
  Square,
  PromotionMove,
  PieceType,
} from "../../types";

export default function Board() {
  const { board, currentPlayerMoves, handleMove } = useGameContext();
  const [legalMoveSquares, setLegalMoveSquares] = useState<Move[]>([]);
  const [showPromotionPanel, setShowPromotionPanel] = useState(false);
  const [promotionSquare, setPromotionSquare] = useState<Square | undefined>();
  const [promotionColor, setPromotionColor] = useState<PlayerColor>();
  const [selectedPiece, setSelectedPiece] = useState<Piece>();

  const handlePromotionSelect = (square: Square | undefined, type: string) => {
    const selectedPiece = square && getPieceAt(board, square.row, square.col);
    selectedPiece && setSelectedPiece(selectedPiece);
    const promotionMove: PromotionMove | undefined = selectedPiece && {
      type: MoveType.PROMO,
      piece: selectedPiece,
      promotionType: type as PieceType,
      from: selectedPiece.currentSquare,
      to: square!,
    };

    if (promotionMove) {
      handleMove(promotionMove.piece, promotionMove.to);
    }

    setShowPromotionPanel(false);
    setPromotionSquare(undefined);
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
          const move = handleMove(
            piece,
            createSquare(destinationLocation[0], destinationLocation[1])
          );
          if (move && move.type === MoveType.PROMO) {
            setShowPromotionPanel(true);
            setPromotionSquare(move.to);
            setPromotionColor(move.piece.color);
            //move.piece.isAlive = false; -> hide it for promotion selector (need to find other pieces in its path to hide temporarily)
            console.log(move);
          } else if (promotionColor || promotionSquare) {
            setPromotionColor(undefined);
            setPromotionSquare(undefined);
          }
        }
      },
    });
  }, [
    board,
    handleMove,
    currentPlayerMoves,
    promotionColor,
    promotionSquare,
    showPromotionPanel,
  ]);

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative grid grid-cols-8 w-[90vmin] h-[90vmin] lg:w-[70vmin] lg:h-[70vmin]">
      {showPromotionPanel && (
        <div className="absolute top-0 left-0 w-[90vmin] h-[90vmin] bg-black bg-opacity-20 z-10 lg:w-[70vmin] lg:h-[70vmin]">
          <PromotionPanel
            square={promotionSquare}
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
            {square.piece && square.piece.isAlive && (
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
