import React from 'react';
import { formatCurrency } from '../../utils/format';

interface PriceStatsProps {
  currentPrice: number;
  priceChange: number;
  volume: number;
  marketCap: number;
}

export function PriceStats({ currentPrice, priceChange, volume, marketCap }: PriceStatsProps) {
  return (
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
          {formatCurrency(volume)}
        </p>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Cap. de Mercado</h3>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatCurrency(marketCap)}
        </p>
      </div>
    </div>
  );
}