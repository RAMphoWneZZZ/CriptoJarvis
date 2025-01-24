import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { WalletConnect } from '../components/WalletConnect';
import { CryptoList } from '../components/CryptoList';
import { TradingView } from '../components/TradingView';
import { PortfolioOverview } from '../components/portfolio/PortfolioOverview';
import { TokenList } from '../components/portfolio/TokenList';
import { PortfolioChart } from '../components/portfolio/PortfolioChart';
import { useWalletStore } from '../store/walletStore';

export function Dashboard() {
  const [selectedCryptoId, setSelectedCryptoId] = useState('bitcoin');
  const [activeSection, setActiveSection] = useState('dashboard');
  const { connectedWallet } = useWalletStore();

  const renderContent = () => {
    switch (activeSection) {
      case 'portfolio':
        return (
          <div className="space-y-6">
            <PortfolioOverview />
            <PortfolioChart />
            <TokenList />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TradingView selectedCryptoId={selectedCryptoId} />
            </div>
            <div className="space-y-6">
              <WalletConnect />
              {connectedWallet && <PortfolioOverview />}
              <CryptoList 
                onSelectCrypto={setSelectedCryptoId} 
                selectedCryptoId={selectedCryptoId} 
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="ml-16 lg:ml-64">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}