import React from "react";
import { useState, useEffect } from "react";
import { Piece, PieceType, PlayerColor, Square } from "../../types";

export type PromotionPanelProps = {
  square: Square | undefined;
  promotingPawn: Piece | undefined;
  color: PlayerColor | undefined;
  onPromotionSelect: (
    square: Square | undefined,
    type: PieceType,
    promotingPawn: Piece | undefined
  ) => void;
};

export type Positions = {
  top: string;
  left: string;
  topLg: string;
  leftLg: string;
};

export const PromotionPanel = ({
  square,
  promotingPawn,
  color,
  onPromotionSelect,
}: PromotionPanelProps) => {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const promotionPieces: PieceType[] =
    color === PlayerColor.WHITE
      ? [PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP, PieceType.KNIGHT]
      : [PieceType.KNIGHT, PieceType.BISHOP, PieceType.ROOK, PieceType.QUEEN];

  const handleClick = (type: PieceType) => {
    onPromotionSelect(square, type, promotingPawn);
  };

  const calculatePromotionPanelPosition = (
    square: Square,
    color: PlayerColor
  ): { top: string; left: string; topLg: string; leftLg: string } => {
    // top-[0vmin] left-[52.5vmin] left-[67.5]
    const top = color === PlayerColor.WHITE ? "0vmin" : "90vmin";
    const left = `${(90 / 8) * square.col}vmin`;
    const topLg = color === PlayerColor.WHITE ? "0vmin" : "70vmin";
    const leftLg = `${(70 / 8) * square.col}vmin`;
    return { top, left, topLg, leftLg };
  };

  const positions =
    square && color && calculatePromotionPanelPosition(square, color);

  return (
    <div className="absolute w-full h-full flex flex-col backdrop-filter backdrop-blur-sm z-20">
      {promotionPieces.map((type, index) => (
        <div
          key={index}
          className="absolute w-[11.25vmin] h-[11.25vmin] cursor-pointer lg:w-[8.75vmin] lg:h-[8.75vmin]"
          style={{
            top: `${
              color === PlayerColor.WHITE ? index * 8.75 : 35 + index * 8.75
            }vmin`,
            left: `${
              positions && (matches ? positions.leftLg : positions.left)
            }`,
          }}
          onClick={() => handleClick(type)}
        >
          <img
            src={`/assets/images/${color}-${type}.svg`}
            alt={`${color}-${type}`}
            className="w-full h-full hover:border-4 hover:border-green-700 select-none"
          />
        </div>
      ))}
    </div>
  );
};
