"use client";

import { useState } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { MoveType, PieceType, PlayerColor } from "../../types";
import { squareToString, getPieceUnicode } from "../../utils";
import { toFEN } from "../../utils/FEN";
import { StockfishOptionsModal } from "./StockfishOptionsModal";
import { StockfishAnalysisToggles } from "./StockfishAnalysisToggles";

export type GameLogProps = {
  stockfishClassicalChecked: boolean;
  stockfishNnueChecked: boolean;
  onStockfishClassicalChange: (isChecked: boolean) => void;
  onStockfishNnueChange: (isChecked: boolean) => void;
  onPlayButtonClick: (strengthLevel: number, playerColor: number) => void;
  resetBoard: () => void;
};

export default function GameLog({
  stockfishClassicalChecked,
  stockfishNnueChecked,
  onStockfishClassicalChange,
  onStockfishNnueChange,
  onPlayButtonClick,
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
  const [showStockfishOptions, setShowStockfishOptions] = useState(false);

  const toggleFenTextArea = () => {
    setShowFenTextArea(!showFenTextArea);
  };

  const toggleStockfishOptions = () => {
    setShowStockfishOptions(!showStockfishOptions);
  };

  const updateStateOnFenChange = () => {};

  const resetState = () => {
    resetGame();
    resetBoard();
    initializeBoard();
    // fix this in future
  };

  const handleResetGame = () => {
    // resetState();
    location.reload();
  };

  const onMoveClick = (index: number) => {
    const movesToUndo = moveHistory.length - index;
    for (let i = 1; i < movesToUndo; i++) {
      undoMove();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form className="h-full w-full max-h-fit pt-2 lg:max-h-[60vmin] relative">
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
              <div className="group relative">
                <button
                  type="button"
                  className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  onClick={toggleStockfishOptions}
                >
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <g>
                      <g>
                        <path
                          d="M434.863,126.093V77.137h-48.956V0h-33.391v77.137h-42.083V0h-33.391v77.137h-42.083V0h-33.391v77.137h-42.083V0h-33.391
			v77.137H77.137v48.956H0v33.391h77.137v42.083H0v33.391h77.137v42.083H0v33.391h77.137v42.083H0v33.391h77.137v48.956h48.956V512
			h33.391v-77.137h42.083V512h33.391v-77.137h42.083V512h33.391v-77.137h42.083V512h33.391v-77.137h48.956v-48.956H512v-33.391
			h-77.137v-42.083H512v-33.391h-77.137v-42.083H512v-33.391h-77.137v-42.083H512v-33.39H434.863z M401.473,401.471h-0.001H110.529
			V110.529h290.944V401.471z"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path
                          d="M375.773,229.532c0-22.913-14.194-42.903-34.426-51.239c-1.374-26.935-23.718-48.426-50.987-48.426
			c-13.221,0-25.283,5.052-34.36,13.325c-9.077-8.273-21.139-13.325-34.36-13.325c-27.27,0-49.615,21.491-50.987,48.426
			c-20.234,8.336-34.426,28.326-34.426,51.239c0,9.577,2.445,18.593,6.742,26.459c-4.391,8.051-6.742,17.113-6.742,26.478
			c-0.001,23.125,14.25,42.974,34.428,51.253c1.381,26.928,23.722,48.411,50.986,48.411c13.221,0,25.283-5.052,34.36-13.325
			c9.077,8.273,21.139,13.325,34.36,13.325c27.265,0,49.606-21.483,50.986-48.411c20.176-8.28,34.428-28.129,34.428-51.253
			c0-9.366-2.351-18.428-6.742-26.478C373.328,248.124,375.773,239.108,375.773,229.532z M239.304,331.078
			c0,9.74-7.924,17.664-17.664,17.664c-7.943,0-14.674-5.271-16.889-12.497c10.656-2.612,20.43-8.341,27.914-16.604l-24.749-22.417
			c-4.226,4.667-10.018,7.237-16.308,7.237c-12.127,0-21.992-9.866-21.992-21.992c0-0.697,0.033-1.389,0.098-2.076
			c6.719,2.904,14.12,4.521,21.895,4.521v-33.391c-12.127,0-21.992-9.866-21.992-21.993c-0.001-7.907,4.25-14.938,10.63-18.817
			c5.774,8.031,13.85,14.415,23.463,18.021l11.727-31.264c-6.855-2.571-11.461-9.222-11.461-16.549
			c0-9.74,7.924-17.664,17.664-17.664c9.74,0,17.664,7.924,17.664,17.664V331.078z M342.285,280.393
			c0.065,0.687,0.098,1.379,0.098,2.076c0,12.127-9.866,21.992-21.993,21.992c-6.289,0-12.081-2.57-16.307-7.237l-24.748,22.417
			c7.485,8.263,17.258,13.993,27.914,16.604c-2.215,7.227-8.947,12.497-16.889,12.497c-9.74,0-17.664-7.924-17.664-17.664V180.922
			c0-9.74,7.924-17.664,17.664-17.664c9.739,0,17.664,7.924,17.664,17.664c0,7.327-4.606,13.978-11.461,16.549l11.727,31.264
			c9.613-3.606,17.688-9.991,23.463-18.021c6.38,3.879,10.631,10.911,10.631,18.817c0,12.127-9.866,21.993-21.993,21.993v33.391
			C328.164,284.915,335.566,283.297,342.285,280.393z"
                        />
                      </g>
                    </g>
                  </svg>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute px-2 py-2 -top-10 -left-6 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm font-medium text-white duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-800"
                  >
                    Stockfish Options
                  </span>
                </button>
              </div>
              <StockfishOptionsModal
                isOpen={showStockfishOptions}
                onClose={() => setShowStockfishOptions(false)}
                onPlay={onPlayButtonClick}
                analysisToggles={StockfishAnalysisToggles({
                  stockfishClassicalChecked,
                  stockfishNnueChecked,
                  onStockfishClassicalChange,
                  onStockfishNnueChange,
                })}
              />
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
    </div>
  );
}
