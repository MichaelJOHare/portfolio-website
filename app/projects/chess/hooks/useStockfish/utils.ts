export const calculateDepth = (skillLevel: number): number | null =>
  skillLevel < 15 ? Math.ceil((skillLevel + 1) / 5) : 22;

export const calculateThreadsForNNUE = () => {
  let threads = navigator.hardwareConcurrency;
  if (threads % 2 !== 0) {
    threads -= 1;
  }
  return threads;
};
