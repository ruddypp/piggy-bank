import { SIMPLE_BANK } from './simpleBank';

// Contract address from environment variable
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

// Lisk Sepolia Testnet configuration
export const LISK_SEPOLIA = {
  chainId: 4202,
  chainName: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [import.meta.env.VITE_RPC_URL || 'https://rpc.sepolia-api.lisk.com'],
  blockExplorerUrls: [import.meta.env.VITE_BLOCK_EXPLORER_URL || 'https://sepolia-blockscout.lisk.com'],
};

export const CONTRACT_ABI = SIMPLE_BANK;

// Network configuration for MetaMask
export const getNetworkConfig = () => ({
  chainId: `0x${LISK_SEPOLIA.chainId.toString(16)}`,
  chainName: LISK_SEPOLIA.chainName,
  nativeCurrency: LISK_SEPOLIA.nativeCurrency,
  rpcUrls: LISK_SEPOLIA.rpcUrls,
  blockExplorerUrls: LISK_SEPOLIA.blockExplorerUrls,
});

