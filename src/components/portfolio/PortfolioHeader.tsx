import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { formatCurrency } from '../../utils/format';

export function PortfolioHeader() {
  const { totalValue, dailyChange, dailyChangePercentage } = usePortfolioStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Tu Portafolio
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalValue)}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${
            dailyChange >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {dailyChange >= 0 ? (
              <TrendingUp className="w-5 h-5 mr-1" />
            ) : (
              <TrendingDown className="w-5 h-5 mr-1" />
            )}
            <span className="font-medium">
              {dailyChange >= 0 ? '+' : ''}{formatCurrency(dailyChange)}
            </span>
          </div>
          <span className={`font-medium ${
            dailyChangePercentage >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {dailyChangePercentage >= 0 ? '+' : ''}
            {dailyChangePercentage.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}