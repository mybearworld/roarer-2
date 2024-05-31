/**
 * Thank you, StackOverflow :)
 * https://stackoverflow.com/a/42408230
 */
export const byteToHuman = (n: number) => {
  const k = n > 0 ? Math.floor(Math.log2(n) / 10) : 0;
  const rank = (k > 0 ? ["Ki", "Mi", "Gi", "Ti"][k - 1] : "") + "B";
  const count = Math.floor(n / Math.pow(1024, k));
  return count + rank;
};
