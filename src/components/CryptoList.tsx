import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { getCryptoList } from '../services/api';
import type { CryptoData } from '../services/api/crypto';

interface CryptoListProps {
  onSelectCrypto: (id: string) => void;
  selectedCryptoId: string;
}

export function CryptoList({ onSelectCrypto, selectedCryptoId }: CryptoListProps) {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const data = await getCryptoList();
        setCryptos(data);
      } catch (error) {
        console.error('Error fetching cryptos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
    const interval = setInterval(fetchCryptos, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredCryptos = cryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar criptomonedas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
        {filteredCryptos.map((crypto) => (
          <button
            key={crypto.id}
            onClick={() => onSelectCrypto(crypto.id)}
            className={`w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedCryptoId === crypto.id ? 'bg-gray-50 dark:bg-gray-700' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={crypto.image} 
                  alt={crypto.name} 
                  className="w-8 h-8 mr-3"
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {crypto.symbol.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {crypto.name}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  ${crypto.current_price.toLocaleString()}
                </p>
                <div className={`flex items-center justify-end ${
                  crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}