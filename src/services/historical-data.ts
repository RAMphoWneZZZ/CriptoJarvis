import { supabase } from '../lib/supabase';
import type { CryptoData } from './api/types';

export async function storeHistoricalPrice(cryptoId: string, price: number) {
  try {
    return await supabase
      .from('historical_prices')
      .insert([{ crypto_id: cryptoId, price }]);
  } catch (error) {
    console.error('Error storing historical price:', error);
    return null;
  }
}

export async function storeMarketData(data: CryptoData) {
  try {
    const { id: crypto_id, market_cap, total_volume } = data;
    
    await Promise.all([
      supabase
        .from('trading_volumes')
        .insert([{ crypto_id, volume: total_volume }]),
        
      supabase
        .from('market_data')
        .insert([{ 
          crypto_id,
          market_cap,
          circulating_supply: null,
          total_supply: null,
          max_supply: null
        }])
    ]);
  } catch (error) {
    console.error('Error storing market data:', error);
  }
}

export async function getHistoricalPrices(cryptoId: string, days: number) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('historical_prices')
      .select('price, timestamp')
      .eq('crypto_id', cryptoId)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    return data || [];
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return [];
  }
}