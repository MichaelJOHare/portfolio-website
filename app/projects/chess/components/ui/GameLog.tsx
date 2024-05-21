"use client";

import { useState } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { MoveType, PieceType, PlayerColor } from "../../types";
import { squareToString, getPieceUnicode } from "../../utils";
import { toFEN } from "../../utils/FEN";

export type GameLogProps = {
  stockfishClassicalChecked: boolean;
  stockfishNnueChecked: boolean;
  onStockfishClassicalChange: (isChecked: boolean) => void;
  onStockfishNnueChange: (isChecked: boolean) => void;
  resetBoard: () => void;
};

export default function GameLog({
  stockfishClassicalChecked,
  stockfishNnueChecked,
  onStockfishClassicalChange,
  onStockfishNnueChange,
  resetBoard,
}: GameLogProps) {
  const {
    board,
    players,
    currentPlayerIndex,
    halfMoveClock,
    fullMoveNumber,
    moveHistory,
    undoMove,
    resetGame,
    initializeBoard,
  } = useGameContext();
  const [showFenTextArea, setShowFenTextArea] = useState(false);

  const toggleFenTextArea = () => {
    setShowFenTextArea(!showFenTextArea);
  };

  const updateStateOnFenChange = () => {};

  const handleResetGame = () => {
    resetGame();
    resetBoard();
    initializeBoard();
  };

  const onMoveClick = (index: number) => {
    const movesToUndo = moveHistory.length - index;
    for (let i = 1; i < movesToUndo; i++) {
      undoMove();
    }
  };

  return (
    <form className="h-full max-h-fit pb-2 lg:max-h-[60vmin]">
      <div className="h-full w-full flex flex-col border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-center justify-center px-3 py-2 border-b dark:border-gray-600">
          <div className="w-full max-w-screen-lg flex justify-between items-center">
            <div className="group relative">
              <button
                type="button"
                className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                onClick={toggleFenTextArea}
              >
                <svg
                  className="w-10 h-10"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                  <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 0 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z" />
                </svg>
                <span className="sr-only">Import FEN</span>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute px-2 py-2 -top-10 -left-6 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm font-medium text-white duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-800"
                >
                  Import FEN
                </span>
              </button>
            </div>
            <div className="group relative">
              <button
                type="button"
                className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                onClick={handleResetGame}
              >
                <svg
                  className="w-10 h-10"
                  viewBox="0 0 21 21"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <g strokeWidth="0"></g>
                  <g strokeLinecap="round" strokeLinejoin="round"></g>
                  <g>
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      transform="matrix(0 1 1 0 2.5 2.5)"
                    >
                      <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"></path>{" "}
                      <path
                        d="m4 1v4h-4"
                        transform="matrix(1 0 0 -1 0 6)"
                      ></path>
                    </g>
                  </g>
                </svg>
                <span className="sr-only">Reset Game</span>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute px-2 py-2 -top-10 -left-6 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm font-medium text-white duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-800"
                >
                  Reset Game
                </span>
              </button>
            </div>
            <div className="flex flex-col">
              <div className="group relative">
                <label className="inline-flex pb-1 items-center cursor-pointer">
                  <input
                    id="sf-classical"
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={stockfishClassicalChecked}
                    onChange={(e) =>
                      onStockfishClassicalChange(e.target.checked)
                    }
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                    Stockfish Classical
                  </span>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute px-2 py-2 -top-14 -left-10 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm font-medium text-white duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-800"
                  >
                    Recommended for slower <br></br>
                    computers/internet
                  </span>
                </label>
              </div>
              <div className="group relative">
                <label className="inline-flex pt-1 items-center cursor-pointer">
                  <input
                    id="sf-NNUE"
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={stockfishNnueChecked}
                    onChange={(e) => onStockfishNnueChange(e.target.checked)}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                    Stockfish NNUE
                  </span>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute px-2 py-2 -top-14 -left-10 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm font-medium text-white duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-800"
                  >
                    Recommended for faster <br></br> computers/internet
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col px-4 py-2 min-h-64 bg-white rounded-b-lg dark:bg-gray-800">
          <div className="h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* need to add capture/promo, disambiguate, etc. */}
            <ul className="flex flex-wrap items-center">
              {moveHistory.map((move, index) => {
                const { from, to } = move;
                const isEvenIndex = index % 2 === 0;
                return (
                  <li
                    className={`inline-block cursor-pointer hover:bg-slate-400 dark:hover:bg-slate-600 ${
                      isEvenIndex ? "ml-3 mr-1" : ""
                    } ${
                      index === moveHistory.length - 1
                        ? "border-2 border-spacing-0 border-blue-600 bg-zinc-400"
                        : ""
                    }`}
                    key={index}
                    onClick={() => onMoveClick(index)}
                  >
                    <span className="flex items-center">
                      {isEvenIndex && (
                        <span className="font-bold text-lg">
                          {(index + 2) / 2}.{" "}
                        </span>
                      )}
                      {move.type === MoveType.CASTLE &&
                        (from.col - to.col > 0 ? "O-O-O" : "O-O")}
                      {move.type === MoveType.STNDRD && (
                        <>
                          <span
                            className={`relative text-3xl ${
                              move.piece.color === PlayerColor.BLACK
                                ? "text-zinc-600"
                                : ""
                            }`}
                          >
                            {move.piece.type !== PieceType.PAWN &&
                              getPieceUnicode(move.piece.type)}
                          </span>
                          {squareToString(to)}
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {showFenTextArea && (
          <textarea
            className="mt-2 p-2 border border-gray-300 rounded"
            rows={5}
            defaultValue={toFEN(
              board,
              players,
              currentPlayerIndex,
              moveHistory,
              halfMoveClock,
              fullMoveNumber
            )}
            onChange={updateStateOnFenChange}
            /* add on move -> update fen, on user change -> update board/state */
          />
        )}
      </div>
    </form>
  );
}
