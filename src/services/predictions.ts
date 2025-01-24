import { type HistoricalData } from './api/crypto';

export interface Prediction {
  price: number;
  confidence: number;
  direction: 'up' | 'down';
  timestamp: number;
  timeframe: '1h' | '4h' | '24h';
}

export function getPrediction(cryptoId: string, currentPrice: number): Prediction {
  // Simulación básica de predicción
  const randomConfidence = 0.5 + Math.random() * 0.4; // Entre 0.5 y 0.9
  const direction = Math.random() > 0.5 ? 'up' : 'down';
  const priceChange = currentPrice * (Math.random() * 0.1); // Cambio máximo del 10%
  
  return {
    price: direction === 'up' ? currentPrice + priceChange : currentPrice - priceChange,
    confidence: randomConfidence,
    direction,
    timestamp: Date.now(),
    timeframe: '24h'
  };
}