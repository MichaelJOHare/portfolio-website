import { Move, MovementStrategy, Piece, Square, PlayerColor } from "../types";
import {
  createSquare,
  createStandardMove,
  getPieceAt,
  isEmpty,
} from "../utils";

export const pawnMovementStrategy: MovementStrategy = (board, piece) => {
  const legalMoves: Move[] = [];
  const { row, col } = piece.currentSquare;
  const direction = piece.color === PlayerColor.WHITE ? -1 : 1;
  const backRank = piece.color === PlayerColor.WHITE ? 0 : 7;
  const startingRow = piece.color === PlayerColor.WHITE ? 6 : 1;

  const addNormalMoves = (
    row: number,
    col: number,
    direction: number,
    backRank: number,
    piece: Piece,
    board: Square[][],
    legalMoves: Move[]
  ) => {
    const newRow = row + direction;
    if (
      newRow > backRank &&
      newRow < backRank + direction &&
      isEmpty(board, newRow, col)
    ) {
      legalMoves.push(
        createStandardMove(
          piece,
          createSquare(row, col),
          createSquare(newRow, col)
        )
      );
    }
  };

  const addDoubleMove = (
    row: number,
    col: number,
    direction: number,
    startingRow: number,
    piece: Piece,
    board: Square[][],
    legalMoves: Move[]
  ) => {
    const newRow = row + 2 * direction;
    if (
      row === startingRow &&
      isEmpty(board, row + direction, col) &&
      isEmpty(board, newRow, col)
    ) {
      legalMoves.push(
        createStandardMove(
          piece,
          createSquare(row, col),
          createSquare(newRow, col)
        )
      );
    }
  };

  const addCaptureMoves = (
    row: number,
    col: number,
    direction: number,
    piece: Piece,
    board: Square[][],
    legalMoves: Move[]
  ) => {
    [-1, 1].forEach((colOffset) => {
      const newRow = row + direction;
      const newCol = col + colOffset;
      if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        const targetSquare = createSquare(newRow, newCol);
        const targetPiece = getPieceAt(board, newRow, newCol);
        const capturedPiece =
          targetPiece && targetPiece.color !== piece.color
            ? targetPiece
            : undefined;
        legalMoves.push(
          createStandardMove(
            piece,
            createSquare(row, col),
            targetSquare,
            capturedPiece
          )
        );
      }
    });
  };

  addNormalMoves(row, col, direction, backRank, piece, board, legalMoves);
  addDoubleMove(row, col, direction, startingRow, piece, board, legalMoves);
  addCaptureMoves(row, col, direction, piece, board, legalMoves);

  return legalMoves;
};
/*  vvv NEED TO REWRITE STILL vvv

  addEnPassantMoves(row, col, piece, board, moveHistory, legalMoves) {
    const enPassantStartingRow = piece.getPlayer().isWhite() ? 1 : 6;
    const enPassantEndRow = piece.getPlayer().isWhite() ? 3 : 4;
    const direction = piece.getPlayer().isWhite() ? -1 : 1;
    const lastMove = moveHistory.getLastMove();

    if (
      lastMove !== null &&
      lastMove.getPiece().getType() === PieceType.PAWN &&
      lastMove.getStartSquare().getRow() === enPassantStartingRow &&
      lastMove.getEndSquare().getRow() === enPassantEndRow &&
      row === enPassantEndRow &&
      Math.abs(col - lastMove.getEndSquare().getCol()) === 1
    ) {
      const currentSquare = new Square(row, col);
      const targetSquare = new Square(
        row + direction,
        lastMove.getEndSquare().getCol()
      );
      const capturedPiece = lastMove.getPiece();
      const originalSquareBeforeCapture = lastMove
        .getPiece()
        .getCurrentSquare();
      const tempMove = new EnPassantMove(
        piece,
        currentSquare,
        targetSquare,
        originalSquareBeforeCapture,
        capturedPiece,
        board
      );
      legalMoves.push(tempMove);
    }
  }

  addPromotionMoves(row, col, piece, board, legalMoves) {
    const direction = piece.getPlayer().isWhite() ? -1 : 1;
    const rowBeforePromotionRow = piece.getPlayer().isWhite() ? 1 : 6;

    // Captures with promotion
    this.handlePromotionCapture(
      row,
      col,
      direction,
      1,
      piece,
      board,
      legalMoves
    );
    this.handlePromotionCapture(
      row,
      col,
      direction,
      -1,
      piece,
      board,
      legalMoves
    );

    // Normal move with promotion
    if (row === rowBeforePromotionRow && board.isEmpty(row + direction, col)) {
      ["QUEEN", "ROOK", "BISHOP", "KNIGHT"].forEach((promotionType) => {
        const promotionMove = new PromotionMove(
          piece,
          new Square(row, col),
          new Square(row + direction, col),
          null,
          PieceType[promotionType],
          board
        );
        promotionMove.setPromotion(true);
        legalMoves.push(promotionMove);
      });
    }
  }

  handlePromotionCapture(
    row,
    col,
    direction,
    colOffset,
    piece,
    board,
    legalMoves
  ) {
    const newRow = row + direction;
    const newCol = col + colOffset;
    const rowBeforePromotionRow = piece.getPlayer().isWhite() ? 1 : 6;

    if (
      row === rowBeforePromotionRow &&
      newCol >= 0 &&
      newCol < 8 &&
      board.isOccupiedByOpponent(newRow, newCol, piece.getPlayer())
    ) {
      ["QUEEN", "ROOK", "BISHOP", "KNIGHT"].forEach((promotionType) => {
        const promotionMove = new PromotionMove(
          piece,
          new Square(row, col),
          new Square(newRow, newCol),
          board.getPieceAt(newRow, newCol),
          PieceType[promotionType],
          board
        );
        promotionMove.setPromotion(true);
        legalMoves.push(promotionMove);
      });
    }
  }*/
