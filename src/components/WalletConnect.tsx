import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import { WalletModal } from './WalletModal';
import { SUPPORTED_WALLETS } from '../config/wallets';

export function WalletConnect() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connectedWallet, disconnectWallet } = useWalletStore();

  if (connectedWallet) {
    const wallet = SUPPORTED_WALLETS.find(w => w.id === connectedWallet);
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{wallet?.icon}</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {wallet?.name}
            </span>
          </div>
          <button
            onClick={() => disconnectWallet()}
            className="text-sm text-red-600 hover:text-red-500 dark:text-red-400"
          >
            Desconectar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center space-x-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
      >
        <Wallet className="w-5 h-5" />
        <span>Conectar Wallet</span>
      </button>
      <WalletModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}