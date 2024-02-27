import { Square } from "../types";

const legendLetter: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
const legendNumber: string[] = ["8", "7", "6", "5", "4", "3", "2", "1"];

export const createSquare = (row: number, col: number): Square => ({
  row,
  col,
});

export const getSquareFromNotation = (notationSquare: string): Square => {
  const col: number = legendLetter.indexOf(notationSquare.substring(0, 1));
  const row: number = legendNumber.indexOf(notationSquare.substring(1, 2));
  return { row, col };
};

export const squaresEqual = (square1: Square, square2: Square): boolean => {
  return square1.row === square2.row && square1.col === square2.col;
};

export const squareToString = (square: Square): string => {
  return legendLetter[square.col] + legendNumber[square.row];
};
