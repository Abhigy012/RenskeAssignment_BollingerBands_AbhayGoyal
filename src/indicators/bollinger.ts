type OHLC = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  timestamp?: number;
};

function stddev_population(arr: number[], mean: number): number {
  if (arr.length === 0) return 0;
  const variance =
    arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

export default function calculate(
  kLineDataList: OHLC[],
  settings: { length: number; source: string; stdDev: number; offset: number }
) {
  const {
    length = 20,
    source = "close",
    stdDev: mult = 2,
    offset = 0,
  } = settings;
  const n = kLineDataList.length;

  const values = kLineDataList.map((d) => {
    switch (source) {
      case "open":
        return d.open;
      case "high":
        return d.high;
      case "low":
        return d.low;
      default:
        return d.close;
    }
  });

  const result: ({ basis: number; upper: number; lower: number } | null)[] =
    new Array(n).fill(null);

  if (n < length) return result;

  for (let i = length - 1; i < n; i++) {
    const window = values.slice(i - length + 1, i + 1);
    const basis = window.reduce((a, b) => a + b, 0) / length;
    const sd = stddev_population(window, basis);

    // Apply offset by shifting the index, not the values
    const targetIndex = i + offset;
    if (targetIndex >= 0 && targetIndex < n) {
      result[targetIndex] = {
        basis,
        upper: basis + mult * sd,
        lower: basis - mult * sd,
      };
    }
  }

  return result;
}
