import React from 'react';
import { formatCurrency } from '../../utils/format';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';

export function TokenList() {
  const { tokens } = usePortfolioStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tus Tokens
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {tokens.map((token) => (
          <div key={`${token.network}-${token.address}`} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {token.symbol}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {token.balance.toFixed(4)} ({formatCurrency(token.value)})
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(token.price)}
                </p>
                <div className={`flex items-center justify-end ${
                  token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {token.priceChange24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{token.priceChange24h.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}