import { getCryptoList } from './api/crypto';
import { storeHistoricalPrice, storeMarketData } from './historical-data';

export async function collectMarketData() {
  try {
    const cryptos = await getCryptoList();
    
    await Promise.all(
      cryptos.map(async (crypto) => {
        await Promise.all([
          storeHistoricalPrice(crypto.id, crypto.current_price),
          storeMarketData(crypto)
        ]);
      })
    );
  } catch (error) {
    console.error('Error collecting market data:', error);
  }
}

// Start collecting data every 5 minutes
export function startDataCollection() {
  // Collect initial data
  collectMarketData();
  
  // Set up periodic collection
  setInterval(collectMarketData, 5 * 60 * 1000);
}