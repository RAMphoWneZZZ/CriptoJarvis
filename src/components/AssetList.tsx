import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { getTopCryptos, type CryptoData } from '../services/api';

interface AssetListProps {
  onSelectAsset: (id: string) => void;
  selectedAssetId: string;
}

export function AssetList({ onSelectAsset, selectedAssetId }: AssetListProps) {
  const [assets, setAssets] = useState<CryptoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await getTopCryptos(20);
        setAssets(data);
      } catch (error) {
        console.error('Error fetching crypto assets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
    const interval = setInterval(fetchAssets, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Cryptocurrencies</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[calc(100vh-300px)] overflow-y-auto">
        {filteredAssets.map((asset) => (
          <div 
            key={asset.id}
            onClick={() => onSelectAsset(asset.id)}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
              selectedAssetId === asset.id ? 'bg-gray-50 dark:bg-gray-700' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={asset.image} 
                  alt={asset.name} 
                  className="w-8 h-8 mr-3"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {asset.symbol.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{asset.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${asset.current_price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
                <div className={`flex items-center justify-end ${
                  asset.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {asset.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(asset.price_change_percentage_24h).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}