"use client";

import { useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ChessSquare } from "./ChessSquare";
import { ChessPiece } from "./ChessPiece";
import { useGameContext } from "../../hooks/useGameContext";
import { isSquare, getPieceAt, createSquare } from "../../utils";

export default function Board() {
  const { board, handleMove, playerCanMove } = useGameContext();

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
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
  }, [board, playerCanMove, handleMove]);

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
