interface StockfishAnalysisTogglesProps {
  stockfishClassicalChecked: boolean;
  stockfishNnueChecked: boolean;
  onStockfishClassicalChange: (checked: boolean) => void;
  onStockfishNnueChange: (checked: boolean) => void;
}

export const StockfishAnalysisToggles = ({
  stockfishClassicalChecked,
  stockfishNnueChecked,
  onStockfishClassicalChange,
  onStockfishNnueChange,
}: StockfishAnalysisTogglesProps) => {
  return (
    <div className="flex flex-col">
      <div className="group relative">
        <label className="inline-flex pb-1 items-center cursor-pointer">
          <input
            id="sf-classical"
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={stockfishClassicalChecked}
            onChange={(e) => onStockfishClassicalChange(e.target.checked)}
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
  );
};
