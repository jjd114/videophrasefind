export const transactionDescription = {
  full: "Full video transcription",
  cropped: "Partial transcription (Cropped)",
};

export function calculateCredits(duration: number) {
  return Math.floor(duration * 10); // just an example. We need to think about this
}
