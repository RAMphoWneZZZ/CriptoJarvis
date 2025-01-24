export function calculateSMA(data: any[], period: number, key = 'price') {
  return data.map((item, index) => {
    if (index < period - 1) return null;
    const slice = data.slice(index - period + 1, index + 1);
    const sum = slice.reduce((acc, curr) => acc + curr[key], 0);
    return sum / period;
  });
}

export function calculateRSI(data: any[], period = 14) {
  const changes = data.map((item, index) => {
    if (index === 0) return 0;
    return item.price - data[index - 1].price;
  });

  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);

  const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
  const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

  let rs = avgGain / avgLoss;
  let rsi = 100 - (100 / (1 + rs));

  const rsiValues = [rsi];

  for (let i = period + 1; i < data.length; i++) {
    const gain = gains[i];
    const loss = losses[i];

    const newAvgGain = ((avgGain * (period - 1)) + gain) / period;
    const newAvgLoss = ((avgLoss * (period - 1)) + loss) / period;

    rs = newAvgGain / newAvgLoss;
    rsi = 100 - (100 / (1 + rs));

    rsiValues.push(rsi);
  }

  return Array(period).fill(null).concat(rsiValues);
}

export function calculateIndicators(data: any[]) {
  const sma20Values = calculateSMA(data, 20);
  const sma50Values = calculateSMA(data, 50);
  const rsiValues = calculateRSI(data);

  return data.map((item, index) => ({
    ...item,
    sma20: sma20Values[index],
    sma50: sma50Values[index],
    rsi: rsiValues[index]
  }));
}