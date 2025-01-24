export const SUPPORTED_WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Conecta con tu wallet de Ethereum'
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '👻',
    description: 'Conecta con tu wallet de Solana'
  },
  {
    id: 'bitget',
    name: 'BitGet Wallet',
    icon: '💎',
    description: 'Conecta con BitGet Wallet'
  }
] as const;

export type WalletId = typeof SUPPORTED_WALLETS[number]['id'];