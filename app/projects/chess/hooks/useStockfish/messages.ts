export const ENGINE_IS_LOADED = /^uciok$/;

export const ENGINE_IS_READY = /^readyok$/;

export const OPTION_IS_SET = /^option name/;

export const IS_SYSTEM_MESSAGE = /^(?:(?:uci|ready)ok$|option name)/;

export const FOUND_BEST_MOVE = /^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/;

export const INFORMS_DEPTH = /^info .*\bdepth (\d+) .*\bnps (\d+)/;

export const INFORMS_SCORE = /^info .*\bscore (\w+) (-?\d+)/;

export const INFORMS_BOUND_SCORE = /\b(upper|lower)bound\b/;
