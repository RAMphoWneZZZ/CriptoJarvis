import React from 'react';
import { useWalletStore } from '../store/walletStore';
import { PortfolioHeader } from '../components/portfolio/PortfolioHeader';
import { AssetsList } from '../components/portfolio/AssetsList';
import { PortfolioChart } from '../components/portfolio/PortfolioChart';
import { WalletConnect } from '../components/WalletConnect';

export function Portfolio() {
  const { connectedWallet } = useWalletStore();

  if (!connectedWallet) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <WalletConnect />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PortfolioHeader />
          <PortfolioChart />
          <AssetsList />
        </div>
        <div className="space-y-6">
          <WalletConnect />
        </div>
      </div>
    </div>
  );
}