import React, { useRef, useEffect, ReactNode } from "react";

interface StockfishOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ReactNode;
}

export const StockfishOptionsModal = ({
  isOpen,
  onClose,
  items,
}: StockfishOptionsModalProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full mt-2 pb-2 flex items-center justify-center bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full h-full relative">
        <div className="absolute right-3 top-2">
          <button className="rounded-3xl hover:bg-slate-300" onClick={onClose}>
            <svg
              fill="currentColor"
              className="w-10 h-10"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 455 455"
            >
              <g>
                <g>
                  <g>
                    <path
                      d="M227.5,0C101.761,0,0,101.75,0,227.5C0,353.239,101.75,455,227.5,455C353.239,455,455,353.25,455,227.5
				C455.001,101.761,353.251,0,227.5,0z M227.5,425.001c-108.902,0-197.5-88.599-197.5-197.5S118.599,30,227.5,30
				S425,118.599,425,227.5S336.402,425.001,227.5,425.001z"
                    />
                    <path
                      d="M321.366,133.635c-17.587-17.588-46.051-17.589-63.64,0L227.5,163.86l-30.226-30.225
				c-17.588-17.588-46.051-17.589-63.64,0c-17.544,17.545-17.544,46.094,0,63.64L163.86,227.5l-30.226,30.226
				c-17.544,17.545-17.544,46.094,0,63.64c17.585,17.586,46.052,17.589,63.64,0l30.226-30.225l30.226,30.225
				c17.585,17.586,46.052,17.589,63.64,0c17.544-17.545,17.544-46.094,0-63.64L291.141,227.5l30.226-30.226
				C338.911,179.729,338.911,151.181,321.366,133.635z M300.153,176.062l-40.832,40.832c-2.813,2.813-4.394,6.628-4.394,10.606
				c0,3.979,1.581,7.793,4.394,10.606l40.832,40.832c5.849,5.849,5.849,15.365,0,21.214c-5.862,5.862-15.351,5.863-21.214,0
				l-40.832-40.832c-2.929-2.929-6.768-4.394-10.606-4.394s-7.678,1.464-10.606,4.394l-40.832,40.832
				c-5.861,5.861-15.351,5.863-21.213,0c-5.849-5.849-5.849-15.365,0-21.214l40.832-40.832c2.813-2.813,4.394-6.628,4.394-10.606
				c0-3.978-1.581-7.793-4.394-10.606l-40.832-40.832c-5.849-5.849-5.849-15.365,0-21.214c5.864-5.863,15.35-5.863,21.214,0
				l40.832,40.832c5.857,5.858,15.355,5.858,21.213,0l40.832-40.832c5.863-5.862,15.35-5.863,21.213,0
				C306.001,160.697,306.001,170.213,300.153,176.062z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </div>
        <div
          ref={menuRef}
          className="flex flex-col bg-white rounded-lg p-4 w-full h-full dark:bg-gray-700"
        >
          <h1 className="flex self-center text-3xl pb-4 pr-4">
            Stockfish Options
          </h1>
          <ul>{items}</ul>
        </div>
      </div>
    </div>
  );
};
