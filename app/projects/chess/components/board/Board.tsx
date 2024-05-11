"use client";

import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ChessSquare } from "./ChessSquare";
import { ChessPiece } from "./ChessPiece";
import { useGameContext } from "../../hooks/useGameContext";
import { isSquare, getPieceAt, createSquare } from "../../utils";
import { Move } from "../../types";

export default function Board() {
  const { board, currentPlayerMoves, handleMove } = useGameContext();
  const [legalMoveSquares, setLegalMoveSquares] = useState<Move[]>([]);

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
          handleMove(
            piece,
            createSquare(destinationLocation[0], destinationLocation[1])
          );
        }
      },
    });
  }, [board, handleMove]);

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-8 w-[90vmin] h-[90vmin] lg:w-[70vmin] lg:h-[70vmin]">
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
