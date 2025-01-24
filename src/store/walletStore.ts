import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ethers } from 'ethers';
import { WalletId } from '../config/wallets';

interface WalletState {
  connectedWallet: WalletId | null;
  address: string | null;
  connectWallet: (walletId: WalletId) => Promise<void>;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      connectedWallet: null,
      address: null,

      connectWallet: async (walletId: WalletId) => {
        try {
          let address = null;

          switch (walletId) {
            case 'metamask':
              if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                address = accounts[0];
              } else {
                throw new Error('MetaMask no está instalado');
              }
              break;

            case 'phantom':
              if (typeof window.solana !== 'undefined') {
                const resp = await window.solana.connect();
                address = resp.publicKey.toString();
              } else {
                throw new Error('Phantom no está instalado');
              }
              break;

            case 'bitget':
              if (typeof window.bitkeep !== 'undefined') {
                await window.bitkeep.ethereum.request({ method: 'eth_requestAccounts' });
                address = window.bitkeep.ethereum.selectedAddress;
              } else {
                throw new Error('BitGet Wallet no está instalado');
              }
              break;

            default:
              throw new Error('Wallet no soportada');
          }

          set({ connectedWallet: walletId, address });
        } catch (error) {
          console.error('Error connecting wallet:', error);
          throw error;
        }
      },

      disconnectWallet: () => {
        set({ connectedWallet: null, address: null });
      },
    }),
    {
      name: 'wallet-storage'
    }
  )
);