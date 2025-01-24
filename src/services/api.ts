import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3'
});

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  image: string;
}

export interface HistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export async function getCryptoList(limit = 100) {
  try {
    const { data } = await api.get(
      `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&sparkline=false`
    );
    return data;
  } catch (error) {
    console.error('Error fetching crypto list:', error);
    return [];
  }
}

export async function getCryptoPrice(id: string) {
  try {
    const { data } = await api.get(`/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`);
    return data[id];
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return null;
  }
}

export async function getHistoricalData(id: string, days: number): Promise<HistoricalData> {
  try {
    const { data } = await api.get(
      `/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'minute' : 'hourly'}`
    );
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return {
      prices: [],
      market_caps: [],
      total_volumes: []
    };
  }
}