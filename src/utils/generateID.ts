let sequenceCounter = 0;

export const generateNewID = async (tag: string): Promise<string> => {
  const timestamp = Date.now();

  // Increment and roll over every 10,000 to keep the suffix short (4 digits)
  sequenceCounter = (sequenceCounter + 1) % 10000;

  const randomPad = sequenceCounter.toString().padStart(4, "0");

  // Total length will be around ~21 characters (well within standard VARCHAR limits)
  return `${tag}_${timestamp}_${randomPad}`;
};
