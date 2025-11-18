import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { getNetworkConfig } from '../lib/contractConfig';
import EthereumProvider from '@walletconnect/ethereum-provider';

type ReownProvider = Awaited<ReturnType<typeof EthereumProvider.init>>;

interface WalletState {
  address: string | null;
  isConnected: boolean;
  nativeBalance: string | null;
  isLoading: boolean;
  chainId: number | null;
}

const REOWN_PROJECT_ID =
  import.meta.env.VITE_REOWN_PROJECT_ID ||
  import.meta.env.VITE_PROJECT_ID ||
  import.meta.env.PROJECT_ID ||
  '';

let reownProviderInstance: ReownProvider | null = null;
const setWindowEthereum = (provider: any) => {
  if (typeof window === 'undefined') return;
  try {
    Object.defineProperty(window, 'ethereum', {
      configurable: true,
      get: () => provider,
    });
  } catch {
    // ignore if not allowed
  }
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    nativeBalance: null,
    isLoading: false,
    chainId: null,
  });
  const providerRef = useRef<any>(typeof window !== 'undefined' ? window.ethereum : null);
  const usingReownRef = useRef<boolean>(false);

  const getReownProvider = async () => {
    if (!REOWN_PROJECT_ID) return null;
    if (!reownProviderInstance) {
      reownProviderInstance = await EthereumProvider.init({
        projectId: REOWN_PROJECT_ID,
        chains: [4202],
        optionalChains: [4202],
        methods: [
          'eth_sendTransaction',
          'eth_signTypedData',
          'eth_signTypedData_v4',
          'eth_sign',
          'personal_sign',
          'wallet_switchEthereumChain',
          'wallet_addEthereumChain',
        ],
        optionalMethods: ['eth_requestAccounts'],
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'light',
        },
      });
    }
    usingReownRef.current = true;
    return reownProviderInstance;
  };

  const getActiveProvider = async () => {
    if (REOWN_PROJECT_ID) {
      const provider = await getReownProvider();
      if (provider) {
        providerRef.current = provider;
        return provider;
      }
    }

    if (typeof window !== 'undefined' && window.ethereum) {
      usingReownRef.current = false;
      providerRef.current = window.ethereum;
      return window.ethereum;
    }

    return null;
  };

  const hydrateWalletFromProvider = async (provider: any) => {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const balance = await ethersProvider.getBalance(address);
    const network = await ethersProvider.getNetwork();

    setWallet({
      address,
      isConnected: true,
      nativeBalance: parseFloat(ethers.formatEther(balance)).toFixed(4),
      isLoading: false,
      chainId: Number(network.chainId),
    });
  };

  const attachProviderListeners = (provider: any) => {
    if (!provider?.on) return;
    provider.removeListener?.('accountsChanged', handleAccountsChanged);
    provider.removeListener?.('chainChanged', handleChainChanged);
    provider.removeListener?.('disconnect', disconnectWallet);

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', disconnectWallet);
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  // Switch to Lisk Sepolia network
  const switchNetwork = async () => {
    const provider = providerRef.current || (typeof window !== 'undefined' ? window.ethereum : null);
    if (!provider) {
      throw new Error('Wallet provider not available');
    }

    try {
      const chainId = `0x${(4202).toString(16)}`;
      
      // Try to switch network
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [getNetworkConfig()],
          });
        } else {
          throw switchError;
        }
      }
    } catch (error: any) {
      throw new Error(`Failed to switch network: ${error.message}`);
    }
  };

  const connectWallet = async () => {
    try {
      setWallet((prev) => ({ ...prev, isLoading: true }));

      const provider = await getActiveProvider();
      if (!provider) {
        toast.error('Wallet provider not found. Please install MetaMask or try again.', {
          style: {
            border: '3px solid black',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          },
        });
        setWallet((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      if (usingReownRef.current && provider.connect) {
        await provider.connect();
      } else if (provider.request) {
        await provider.request({ method: 'eth_requestAccounts' });
      }

      setWindowEthereum(provider);

      const ethersProvider = new ethers.BrowserProvider(provider);
      const network = await ethersProvider.getNetwork();
      if (Number(network.chainId) !== 4202) {
        await switchNetwork();
      }
      await hydrateWalletFromProvider(provider);

      toast.success('Wallet connected!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });

      attachProviderListeners(provider);
    } catch (error: any) {
      setWallet((prev) => ({ ...prev, isLoading: false }));
      toast.error(error.message || 'Failed to connect wallet!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
    }
  };

  const disconnectWallet = async () => {
    if (usingReownRef.current && providerRef.current?.disconnect) {
      try {
        await providerRef.current.disconnect();
      } catch (error) {
        console.error('Failed to disconnect provider', error);
      }
    }

    setWallet({
      address: null,
      isConnected: false,
      nativeBalance: null,
      isLoading: false,
      chainId: null,
    });

    providerRef.current?.removeListener?.('accountsChanged', handleAccountsChanged);
    providerRef.current?.removeListener?.('chainChanged', handleChainChanged);
    providerRef.current?.removeListener?.('disconnect', disconnectWallet);

    toast.success('Wallet disconnected!', {
      style: {
        border: '3px solid black',
        boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
      },
    });
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const refreshNativeBalance = async () => {
    if (!wallet.address) return;

    try {
      const provider = providerRef.current;
      if (!provider) return;
      const ethersProvider = new ethers.BrowserProvider(provider);
      const balance = await ethersProvider.getBalance(wallet.address);
      const balanceInEth = ethers.formatEther(balance);

      setWallet((prev) => ({
        ...prev,
        nativeBalance: parseFloat(balanceInEth).toFixed(4),
      }));
    } catch (error) {
      console.error('Failed to refresh native balance:', error);
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        if (REOWN_PROJECT_ID) {
          const provider = await getReownProvider();
          if (provider?.session?.topic) {
            providerRef.current = provider;
            setWindowEthereum(provider);
            await hydrateWalletFromProvider(provider);
            attachProviderListeners(provider);
          }
          return;
        }

        if (typeof window.ethereum === 'undefined') return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          providerRef.current = window.ethereum;
          await hydrateWalletFromProvider(window.ethereum);
          attachProviderListeners(window.ethereum);
        }
      } catch (error) {
        console.error('Failed to check connection:', error);
      }
    };

    checkConnection();
  }, []);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
    refreshNativeBalance,
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

