import { Move } from "../../types";

export const calculateDepth = (skillLevel: number): number | null =>
  skillLevel < 15 ? Math.ceil((skillLevel + 1) / 5) : null;

export const calculateErrorProbability = (skillLevel: number): number =>
  Math.round(skillLevel * 6.35 + 1);

export const calculateMaxError = (skillLevel: number): number =>
  Math.round(skillLevel * -0.5 + 10);

export const formatTimeString = ({
  depth,
  duration,
  increment,
}: {
  depth: number | null;
  duration: number;
  increment: number;
}): string => {
  let output = depth ? `depth ${depth}` : "";
  if (duration) {
    output += ` wtime ${duration} winc ${increment} btime ${duration} binc ${increment}`;
  }
  return output;
};

export const formatMoveString = (history: Move[]): string =>
  history.reduce(
    (output, { from, to /* promotion */ }) => `${output} ${from}${to}`, //${promotion ?? ""}
    ""
  );
