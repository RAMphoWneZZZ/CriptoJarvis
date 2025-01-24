import { CryptoData, HistoricalData } from './api';

const STORAGE_KEYS = {
  HISTORICAL_DATA: 'crypto_historical_data',
  LAST_UPDATE: 'crypto_last_update',
};

interface StoredData {
  [cryptoId: string]: {
    historicalData: HistoricalData;
    lastUpdate: number;
  };
}

export function storeHistoricalData(cryptoId: string, data: HistoricalData): void {
  try {
    const storedData: StoredData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.HISTORICAL_DATA) || '{}'
    );

    storedData[cryptoId] = {
      historicalData: data,
      lastUpdate: Date.now(),
    };

    localStorage.setItem(STORAGE_KEYS.HISTORICAL_DATA, JSON.stringify(storedData));
  } catch (error) {
    console.error('Error storing historical data:', error);
  }
}

export function getStoredHistoricalData(cryptoId: string): HistoricalData | null {
  try {
    const storedData: StoredData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.HISTORICAL_DATA) || '{}'
    );

    const data = storedData[cryptoId];
    if (!data) return null;

    // Datos válidos por 5 minutos
    if (Date.now() - data.lastUpdate > 5 * 60 * 1000) return null;

    return data.historicalData;
  } catch (error) {
    console.error('Error retrieving historical data:', error);
    return null;
  }
}