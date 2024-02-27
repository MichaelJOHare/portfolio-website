import Board from "./components/board/Board";
import GameProvider from "./providers/GameProvider";

export default function Page() {
  return (
    <GameProvider>
      <div className="flex justify-center w-100% h-100% lg:justify-normal">
        <Board />
      </div>
    </GameProvider>
  );
}
