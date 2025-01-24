import React, { useState } from 'react';
import { Header } from './Header';
import { AssetList } from './AssetList';
import { TradingView } from './TradingView';

export function Dashboard() {
  const [selectedCryptoId, setSelectedCryptoId] = useState('bitcoin');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TradingView selectedCryptoId={selectedCryptoId} />
          </div>
          <div>
            <AssetList onSelectAsset={setSelectedCryptoId} selectedAssetId={selectedCryptoId} />
          </div>
        </div>
      </main>
    </div>
  );
}