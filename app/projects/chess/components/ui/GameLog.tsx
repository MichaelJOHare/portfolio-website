"use client";

import { useGameContext } from "../../hooks/useGameContext";
import { onMoveClick } from "../../utils/moveHistory";

export default function GameLog() {
  const boardManagement = useGameContext();
  const moves = boardManagement.moveHistory;
  return (
    <form className="h-full pb-2">
      <div className="h-full w-full flex flex-col border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-center justify-center px-3 py-2 border-b dark:border-gray-600">
          <div className="w-full max-w-screen-lg flex justify-between items-center">
            <div className="group relative">
              <button
                type="button"
                className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
                  className="pointer-events-none absolute px-2 py-2 -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm font-medium text-white duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-800"
                >
                  Import FEN
                </span>
              </button>
            </div>
            <div className="flex-grow self-center">
              <h1 className="text-center text-3xl font-medium">Game Log</h1>
            </div>
            <div className="flex flex-col">
              <label className="inline-flex pb-1 items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                  Stockfish Classical
                </span>
              </label>
              <label className="inline-flex pt-1 items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                  Stockfish NNUE
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col px-4 py-2 min-h-64 bg-white rounded-b-lg dark:bg-gray-800">
          <div className="h-full">
            {/* need to make flex, use piece unicodes, disambiguate, etc. */}
            <ul className="cursor-pointer flex flex-wrap">
              {moves.map((move, index) => {
                const { from, to } = move;
                const isEvenIndex = index % 2 === 0;
                return (
                  <li
                    className={`inline-block ${isEvenIndex ? "ml-2 mr-1" : ""}`}
                    key={index}
                    onClick={() => onMoveClick(index)}
                  >
                    {isEvenIndex && `${index + 1}. `}
                    {String.fromCharCode(97 + to.col)}
                    {8 - to.row}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
