import { PIGGY_BANK } from './piggybank';
import{ethers} from 'ethers';


const CONTRACT_ADDRESS_ENV_KEYS = [
  'VITE_CONTRACT_ADDRESS',
  'VITE_PIGGY_ADDRESS',
  'VITE_PIGGYBANK_ADDRESS',
  'VITE_PIGGY_BANK_ADDRESS',
] as const;

const resolveContractAddress = () => {
  const env = import.meta.env as Record<string, string | undefined>;
  for (const key of CONTRACT_ADDRESS_ENV_KEYS) {
    const value = env?.[key];
    if (value && typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return '';
};

// Contract address from environment variable(s)
export const PIGGY_ADDRESS = resolveContractAddress();

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

export const PIGGY_ABI = PIGGY_BANK[0];

// Public provider untuk operasi read-only (pakai RPC langsung)
export const PUBLIC_PROVIDER = new ethers.JsonRpcProvider(
  import.meta.env.VITE_RPC_URL || 'https://rpc.sepolia-api.lisk.com'
);

// Network configuration for MetaMask
export const getNetworkConfig = () => ({
  chainId: `0x${LISK_SEPOLIA.chainId.toString(16)}`,
  chainName: LISK_SEPOLIA.chainName,
  nativeCurrency: LISK_SEPOLIA.nativeCurrency,
  rpcUrls: LISK_SEPOLIA.rpcUrls,
  blockExplorerUrls: LISK_SEPOLIA.blockExplorerUrls,
});

