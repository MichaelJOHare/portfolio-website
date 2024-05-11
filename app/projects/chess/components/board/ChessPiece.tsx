import { useRef, useState, useEffect } from "react";
import { Piece, PieceType, PlayerColor, Square } from "../../types";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useGameContext } from "../../hooks/useGameContext";

export const ChessPiece = ({
  type,
  color,
  square,
  piece,
}: {
  type: PieceType;
  color: PlayerColor;
  square: number[];
  piece: Piece;
}) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const { players, currentPlayerIndex } = useGameContext();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({ square }),
      canDrag: () => {
        const movingPiece = piece;
        if (movingPiece) {
          return movingPiece.color === players[currentPlayerIndex].color;
        } else {
          return false;
        }
      },
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [type, square, piece, players, currentPlayerIndex]);

  return (
    <img
      ref={ref}
      className="h-3/4"
      style={{ opacity: dragging ? 0.5 : 1, cursor: "grab" }}
      src={`/assets/images/${color}-${type}.svg`}
      alt={`${type}`}
    />
  );
};
