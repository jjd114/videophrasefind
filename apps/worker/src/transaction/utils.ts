export const transactionDescription = {
  full: "Full video transcription",
  cropped: "Partial transcription (Cropped)",
};

export function calculateCredits(duration: number) {
  return -1 * Math.floor(duration); // just an example. We need to think about this
}
