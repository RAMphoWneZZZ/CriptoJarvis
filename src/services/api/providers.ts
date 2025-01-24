import axios from 'axios';
import { supabase } from '../../lib/supabase';
import type { CryptoData } from './types';

// Interfaz para proveedores de datos
interface DataProvider {
  getName(): string;
  getCryptoList(limit?: number): Promise<CryptoData[]>;
  getHistoricalData(id: string, days: number): Promise<any>;
}

// Proveedor CoinGecko
class CoinGeckoProvider implements DataProvider {
  private api = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3'
  });

  getName() {
    return 'coingecko';
  }

  async getCryptoList(limit = 100) {
    try {
      const { data } = await this.api.get(
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&sparkline=false`
      );
      await this.logApiCall('/coins/markets', 200);
      return data;
    } catch (error) {
      await this.logApiCall('/coins/markets', error.response?.status || 500, error.message);
      return [];
    }
  }

  async getHistoricalData(id: string, days: number) {
    try {
      const { data } = await this.api.get(
        `/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      );
      await this.logApiCall('/coins/market_chart', 200);
      return data;
    } catch (error) {
      await this.logApiCall('/coins/market_chart', error.response?.status || 500, error.message);
      throw error;
    }
  }

  private async logApiCall(endpoint: string, status: number, error?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('api_logs').insert({
      provider: this.getName(),
      endpoint,
      status,
      error,
      user_id: user?.id
    });
  }
}

// Proveedor CryptoCompare (websockets para datos en tiempo real)
class CryptoCompareProvider implements DataProvider {
  private ws: WebSocket | null = null;
  private subscriptions = new Map();

  getName() {
    return 'cryptocompare';
  }

  async getCryptoList(limit = 100) {
    try {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=${limit}&tsym=USD`
      );
      await this.logApiCall('/top/mktcapfull', 200);
      
      return response.data.Data.map(item => ({
        id: item.CoinInfo.Name.toLowerCase(),
        symbol: item.CoinInfo.Name,
        name: item.CoinInfo.FullName,
        current_price: item.RAW?.USD?.PRICE || 0,
        price_change_percentage_24h: item.RAW?.USD?.CHANGEPCT24HOUR || 0,
        market_cap: item.RAW?.USD?.MKTCAP || 0,
        total_volume: item.RAW?.USD?.TOTALVOLUME24H || 0,
        image: `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}`
      }));
    } catch (error) {
      await this.logApiCall('/top/mktcapfull', error.response?.status || 500, error.message);
      return [];
    }
  }

  async getHistoricalData(id: string, days: number) {
    try {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${id.toUpperCase()}&tsym=USD&limit=${days}`
      );
      await this.logApiCall('/histoday', 200);
      
      return {
        prices: response.data.Data.Data.map(item => [
          item.time * 1000,
          item.close
        ])
      };
    } catch (error) {
      await this.logApiCall('/histoday', error.response?.status || 500, error.message);
      throw error;
    }
  }

  private async logApiCall(endpoint: string, status: number, error?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('api_logs').insert({
      provider: this.getName(),
      endpoint,
      status,
      error,
      user_id: user?.id
    });
  }
}

// Gestor de proveedores
class DataProviderManager {
  private providers: DataProvider[] = [];
  private currentProviderIndex = 0;

  constructor() {
    this.providers = [
      new CoinGeckoProvider(),
      new CryptoCompareProvider()
    ];
  }

  async getCryptoList(limit?: number) {
    for (let i = 0; i < this.providers.length; i++) {
      try {
        const provider = this.providers[this.currentProviderIndex];
        const data = await provider.getCryptoList(limit);
        if (data.length > 0) return data;
      } catch (error) {
        console.error(`Error with provider ${this.providers[this.currentProviderIndex].getName()}:`, error);
      }
      this.rotateProvider();
    }
    return [];
  }

  async getHistoricalData(id: string, days: number) {
    for (let i = 0; i < this.providers.length; i++) {
      try {
        const provider = this.providers[this.currentProviderIndex];
        const data = await provider.getHistoricalData(id, days);
        if (data) return data;
      } catch (error) {
        console.error(`Error with provider ${this.providers[this.currentProviderIndex].getName()}:`, error);
      }
      this.rotateProvider();
    }
    throw new Error('No data available from any provider');
  }

  private rotateProvider() {
    this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
  }
}

export const dataProvider = new DataProviderManager();