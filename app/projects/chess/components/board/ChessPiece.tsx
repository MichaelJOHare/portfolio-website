import { useRef, useState, useEffect } from "react";
import { Piece, PieceType, PlayerColor } from "../../types";
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

    const isDraggable = () => {
      const movingPiece = piece;
      return (
        movingPiece && movingPiece.color === players[currentPlayerIndex].color
      );
    };

    return draggable({
      element: el,
      getInitialData: () => ({ square }),
      canDrag: isDraggable,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [type, square, piece, players, currentPlayerIndex]);

  return (
    <img
      ref={ref}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
      className="h-3/4 z-10"
      style={{
        opacity: dragging ? 0.5 : 1,
        cursor: "grab",
        WebkitTouchCallout: "none",
      }}
      src={`/assets/images/${color}-${type}.svg`}
      alt={`${type}`}
    />
  );
};
