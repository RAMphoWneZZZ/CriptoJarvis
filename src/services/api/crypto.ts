import axios from 'axios';
import { getHistoricalPrices } from '../historical-data';
import type { CryptoData, HistoricalData, CryptoDetail } from './types';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3'
});

export async function getCryptoList(limit = 100): Promise<CryptoData[]> {
  try {
    const { data } = await api.get(
      `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&sparkline=false`
    );
    return data;
  } catch (error) {
    return [];
  }
}

export async function getCryptoDetail(id: string): Promise<CryptoDetail | null> {
  try {
    const { data } = await api.get(
      `/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
    );
    return data;
  } catch (error) {
    return null;
  }
}

export async function getHistoricalData(id: string, days: number): Promise<HistoricalData> {
  try {
    // First try to get data from our database
    const historicalPrices = await getHistoricalPrices(id, days);
    
    if (historicalPrices.length > 0) {
      return {
        prices: historicalPrices.map(p => [new Date(p.timestamp).getTime(), p.price]),
        market_caps: [],
        total_volumes: []
      };
    }

    // If no local data, fetch from API
    const { data } = await api.get(
      `/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    return data;
  } catch (error) {
    return {
      prices: [],
      market_caps: [],
      total_volumes: []
    };
  }
}