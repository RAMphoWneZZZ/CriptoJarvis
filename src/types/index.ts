export interface Prediction {
  price: number;
  confidence: number;
  direction: 'up' | 'down';
  timestamp: number;
  timeframe: '1h' | '4h' | '24h';
}

export interface PredictionSettings {
  timeframe: '1h' | '4h' | '24h';
  confidence: number;
  lookbackPeriod: number;
}