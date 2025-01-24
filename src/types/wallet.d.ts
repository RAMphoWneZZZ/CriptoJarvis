interface Window {
  ethereum?: any;
  solana?: {
    connect(): Promise<{ publicKey: { toString(): string } }>;
    disconnect(): Promise<void>;
  };
  bitkeep?: {
    ethereum: {
      request(args: { method: string }): Promise<string[]>;
      selectedAddress: string;
    };
  };
}