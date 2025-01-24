import React from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { formatCurrency } from '../../utils/format';
import { Loader2 } from 'lucide-react';

export function AssetsList() {
  const { assets, loading, error } = usePortfolioStore();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tus Activos
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {assets.map((asset) => (
          <div key={asset.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={asset.icon}
                  alt={asset.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {asset.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {asset.amount} {asset.symbol}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(asset.value)}
                </p>
                <p className={`text-sm ${
                  asset.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {asset.priceChange >= 0 ? '+' : ''}
                  {asset.priceChange.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}