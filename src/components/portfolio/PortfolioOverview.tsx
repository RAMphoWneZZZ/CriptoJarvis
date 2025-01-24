import React from 'react';
import { formatCurrency } from '../../utils/format';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';

export function PortfolioOverview() {
  const { totalValue, totalChange24h, tokens } = usePortfolioStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Tu Portafolio
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalValue)}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${
            totalChange24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {totalChange24h >= 0 ? (
              <TrendingUp className="w-5 h-5 mr-1" />
            ) : (
              <TrendingDown className="w-5 h-5 mr-1" />
            )}
            <span className="font-medium">
              {totalChange24h >= 0 ? '+' : ''}{formatCurrency(totalChange24h)}
            </span>
          </div>
          <span className={`font-medium ${
            totalChange24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {totalChange24h >= 0 ? '+' : ''}
            {((totalChange24h / totalValue) * 100).toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tokens</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {tokens.length}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Redes</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {new Set(tokens.map(t => t.network)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}