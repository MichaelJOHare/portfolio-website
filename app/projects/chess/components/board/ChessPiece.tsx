import { useRef, useState, useEffect } from "react";
import { PieceType, PlayerColor, Square } from "../../types";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({ square, type }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [square, type]);

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
