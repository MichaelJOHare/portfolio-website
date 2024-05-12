import Board from "../board/Board";
import GameLog from "./GameLog";
import Button from "./Button";
import GameProvider from "../../providers/GameProvider";

export default function ChessGameContainer() {
  return (
    <div className="flex flex-col justify-center lg:flex-row">
      <GameProvider>
        <div className="flex justify-center items-center">
          <Board />
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center w-[90vmin] mt-4 lg:px-5 lg:w-[35vmin] lg:h-[70vmin] lg:mt-0 2xl:w-[50vmin]">
            <div className="flex justify-between h-[20vmin] w-full lg:pt-2 lg:h-[10vmin] lg:order-last">
              <Button direction={{ left: true, right: false }} />
              <Button direction={{ left: false, right: true }} />
            </div>
            <GameLog />
          </div>
        </div>
      </GameProvider>
    </div>
  );
}

/* have footer below on this page, make cgc take 100vh */
