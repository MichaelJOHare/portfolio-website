import React from "react";
import { PlayerColor, Square } from "../../types";

export type PromotionPanelProps = {
  square: Square | undefined;
  color: PlayerColor | undefined;
  onPromotionSelect: (square: Square | undefined, type: string) => void;
};

export type Positions = {
  top: string;
  left: string;
  topLg: string;
  leftLg: string;
};

export const PromotionPanel = ({
  square,
  color,
  onPromotionSelect,
}: PromotionPanelProps) => {
  const promotionPieces = ["queen", "rook", "bishop", "knight"];

  const handleClick = (type: string) => {
    onPromotionSelect(square, type);
  };

  const calculatePromotionPanelPosition = (
    square: Square,
    color: PlayerColor
  ): { top: string; left: string; topLg: string; leftLg: string } => {
    const top = color === PlayerColor.WHITE ? "top-[0vmin]" : "top-[90vmin]";
    const left = `lg:left-[${(90 / 8) * square.col}vmin]`;
    const topLg =
      color === PlayerColor.WHITE ? "lg:top-[0vmin]" : "lg:top-[70vmin]";
    const leftLg = `lg:left-[${(70 / 8) * square.col}vmin]`;
    return { top, left, topLg, leftLg };
  };

  const positions =
    square && color && calculatePromotionPanelPosition(square, color);

  return (
    <div
      className={`absolute w-full h-full flex flex-col backdrop-filter backdrop-blur-sm`}
    >
      {promotionPieces.map((type, index) => (
        <div
          key={index}
          className={`absolute w-[11.25vmin] h-[11.25vmin] ${
            positions && positions.top
          } ${
            positions && positions.left
          } cursor-pointer lg:w-[8.75vmin] lg:h-[8.75vmin] ${
            positions && positions.topLg
          } ${positions && positions.leftLg}`}
          style={{ top: `${index * 8.6}vmin` }}
          onClick={() => handleClick(type)}
        >
          <img
            src={`/assets/images/${color}-${type}.svg`}
            alt={`${color}-${type}`}
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};
