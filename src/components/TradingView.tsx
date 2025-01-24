import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCryptoDetail, getHistoricalData } from '../services/api/crypto';
import { getPrediction, type Prediction } from '../services/predictions';
import { PriceAlerts } from './PriceAlerts';

const timeframes = [
  { label: '1H', value: '1h', days: 0.0417 },
  { label: '4H', value: '4h', days: 0.1667 },
  { label: '1D', value: '1d', days: 1 },
] as const;

type Timeframe = typeof timeframes[number]['value'];

interface CryptoPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
  };
}

interface TradingViewProps {
  selectedCryptoId: string;
}

export function TradingView({ selectedCryptoId }: TradingViewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1d');
  const [priceData, setPriceData] = useState<CryptoPrice | null>(null);
  const [historicalData, setHistoricalData] = useState<{ date: string; price: number }[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [priceResponse, historicalResponse] = await Promise.all([
          getCryptoDetail(selectedCryptoId),
          getHistoricalData(
            selectedCryptoId,
            timeframes.find(t => t.value === selectedTimeframe)?.days || 1
          )
        ]);

        setPriceData(priceResponse);
        
        const formattedData = historicalResponse.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleTimeString(),
          price: price
        }));
        
        setHistoricalData(formattedData);

        if (priceResponse?.[selectedCryptoId]?.usd) {
          setPrediction(getPrediction(selectedCryptoId, priceResponse[selectedCryptoId].usd));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [selectedCryptoId, selectedTimeframe]);

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
    <div className="space-y-6">
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
          
          <div className="flex space-x-2">
            {timeframes.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSelectedTimeframe(value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedTimeframe === value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {prediction && (
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">
                Predicción IA ({prediction.timeframe})
              </h3>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-6">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 dark:text-gray-400">Precio Predicho</p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  ${prediction.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                <p className={`text-xl font-bold ${
                  prediction.direction === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {prediction.direction === 'up' ? '↑ Subida' : '↓ Bajada'}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 dark:text-gray-400">Confianza</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {(prediction.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Precio']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Cambio 24h</h3>
            <p className={`text-lg font-semibold ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Volumen 24h</h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${(volume / 1e9).toFixed(2)}B
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Cap. de Mercado</h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${(marketCap / 1e9).toFixed(2)}B
            </p>
          </div>
        </div>
      </div>

      <PriceAlerts cryptoId={selectedCryptoId} currentPrice={currentPrice} />
    </div>
  );
}