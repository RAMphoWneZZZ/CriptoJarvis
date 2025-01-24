import { createClient } from '@supabase/supabase-js';
import type { CryptoData } from './api/types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function storeHistoricalPrice(cryptoId: string, price: number) {
  return await supabase
    .from('historical_prices')
    .insert([{ crypto_id: cryptoId, price }]);
}

export async function storeMarketData(data: CryptoData) {
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
        circulating_supply: null, // Add if available from API
        total_supply: null,
        max_supply: null
      }])
  ]);
}

export async function getHistoricalPrices(cryptoId: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('historical_prices')
    .select('price, timestamp')
    .eq('crypto_id', cryptoId)
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: true });

  return data || [];
}