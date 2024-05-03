/* const wouldResultInCheck = (
  boardContext: BoardStateContext,
  piece: Piece,
  move: Move
): boolean => {
  const copiedBoardContext = boardContext.copy();
  const copiedPiece = copyPiece(piece);
  const copiedCapturedPiece = !!move.capturedPiece
    ? copyPiece(move.capturedPiece)
    : undefined;
  const copiedPlayer = copiedPiece.player;

  const copiedMove = createMove(
    copiedPiece,
    move.from,
    move.to,
    copiedCapturedPiece
  );

  useGameStateManagement.executeMove(copiedMove);

  return copiedBoardContext.isKingInCheck(copiedPlayer);
};

probably belongs in useGame(or Board)StateManagement
*/
