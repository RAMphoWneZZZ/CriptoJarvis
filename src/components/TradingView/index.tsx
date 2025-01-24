import React, { useState, useEffect } from 'react';
import { getCryptoDetail, getHistoricalData } from '../../services/api/crypto';
import type { CryptoDetail } from '../../services/api/types';
import { Chart } from './Chart';
import { TimeframeSelector } from './TimeframeSelector';
import { PriceStats } from './PriceStats';

interface TradingViewProps {
  selectedCryptoId: string;
}

export function TradingView({ selectedCryptoId }: TradingViewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [priceData, setPriceData] = useState<CryptoDetail | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [priceResponse, historicalResponse] = await Promise.all([
          getCryptoDetail(selectedCryptoId),
          getHistoricalData(selectedCryptoId, getTimeframeDays(selectedTimeframe))
        ]);

        if (!mounted) return;

        setPriceData(priceResponse);
        
        const formattedData = historicalResponse.prices.map(([timestamp, price]) => ({
          date: formatDate(timestamp, selectedTimeframe),
          price
        }));
        
        setHistoricalData(formattedData);
      } catch (error) {
        if (!mounted) return;
        setError('Error al cargar los datos');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [selectedCryptoId, selectedTimeframe]);

  const getTimeframeDays = (timeframe: string): number => {
    switch (timeframe) {
      case '1h': return 0.0417;
      case '24h': return 1;
      case '7d': return 7;
      case '30d': return 30;
      default: return 1;
    }
  };

  const formatDate = (timestamp: number, timeframe: string): string => {
    const date = new Date(timestamp);
    if (timeframe === '1h') {
      return date.toLocaleTimeString();
    }
    return date.toLocaleDateString();
  };

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const currentPrice = priceData?.[selectedCryptoId]?.usd ?? 0;
  const priceChange = priceData?.[selectedCryptoId]?.usd_24h_change ?? 0;
  const volume = priceData?.[selectedCryptoId]?.usd_24h_vol ?? 0;
  const marketCap = priceData?.[selectedCryptoId]?.usd_market_cap ?? 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedCryptoId.toUpperCase()}/USD
          </h2>
          <div className="flex items-center mt-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className={`ml-2 px-2 py-1 rounded ${
              priceChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <TimeframeSelector
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
        />
      </div>

      <Chart data={historicalData} />
      
      <PriceStats
        currentPrice={currentPrice}
        priceChange={priceChange}
        volume={volume}
        marketCap={marketCap}
      />
    </div>
  );
}