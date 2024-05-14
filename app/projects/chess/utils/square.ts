import { Piece, Square } from "../types";

const legendLetter: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
const legendNumber: string[] = ["8", "7", "6", "5", "4", "3", "2", "1"];

export const createSquare = (
  row: number,
  col: number,
  piece?: Piece
): Square => ({
  row,
  col,
  piece,
});

export function isSquare(token: unknown): token is number[] {
  if (!Array.isArray(token)) {
    return false;
  }

  const square = token as number[];

  return (
    square.length === 2 &&
    typeof square[0] === "number" &&
    typeof square[1] === "number"
  );
}

export function isSameSquare(sourceSquare: number[], targetSquare: number[]) {
  return (
    sourceSquare[0] === targetSquare[0] && sourceSquare[1] === targetSquare[1]
  );
}

export const getSquareFromNotation = (notationSquare: string): Square => {
  const col: number = legendLetter.indexOf(notationSquare.substring(0, 1));
  const row: number = legendNumber.indexOf(notationSquare.substring(1, 2));
  return { row, col };
};

export const squareToString = (square: Square): string => {
  return legendLetter[square.col] + legendNumber[square.row];
};
