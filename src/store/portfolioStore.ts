import { create } from 'zustand';

interface Token {
  address: string;
  network: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  balance: number;
  price: number;
  value: number;
  priceChange24h: number;
}

interface PortfolioState {
  tokens: Token[];
  totalValue: number;
  totalChange24h: number;
  isLoading: boolean;
  error: string | null;
  fetchPortfolio: (address: string) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  tokens: [],
  totalValue: 0,
  totalChange24h: 0,
  isLoading: false,
  error: null,

  fetchPortfolio: async (address: string) => {
    try {
      set({ isLoading: true, error: null });

      // Simulamos datos de ejemplo
      const mockTokens: Token[] = [
        {
          address: '0x...',
          network: 'Ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          logo: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
          balance: 1.5,
          price: 3000,
          value: 4500,
          priceChange24h: 2.5,
        },
        {
          address: '0x...',
          network: 'Solana',
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
          balance: 50,
          price: 100,
          value: 5000,
          priceChange24h: -1.2,
        },
      ];

      const totalValue = mockTokens.reduce((sum, token) => sum + token.value, 0);
      const totalChange24h = mockTokens.reduce((sum, token) => 
        sum + (token.value * token.priceChange24h / 100), 0);

      set({
        tokens: mockTokens,
        totalValue,
        totalChange24h,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: 'Error al cargar el portafolio',
        isLoading: false 
      });
    }
  },
}));