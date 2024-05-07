import { useRef, useState, useEffect } from "react";
import { PieceType, PlayerColor, Square } from "../../types";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useGameContext } from "../../hooks/useGameContext";

export const ChessPiece = ({
  type,
  color,
  square,
}: {
  type: PieceType;
  color: PlayerColor;
  square: Square;
}) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const { currentPlayer } = useGameContext();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({ square }),
      canDrag: () => {
        if (square.piece) {
          return square.piece.color === currentPlayer.color;
        } else {
          return false;
        }
      },
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [square, type, currentPlayer.color]);

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
