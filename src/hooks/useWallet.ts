import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { getNetworkConfig } from '../lib/contractConfig';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  nativeBalance: string | null;
  isLoading: boolean;
  chainId: number | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    nativeBalance: null,
    isLoading: false,
    chainId: null,
  });

  // Switch to Lisk Sepolia network
  const switchNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      const chainId = `0x${(4202).toString(16)}`;
      
      // Try to switch network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
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
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }

    try {
      setWallet((prev) => ({ ...prev, isLoading: true }));
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      // Check network and switch if needed
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 4202) {
        await switchNetwork();
        // Reload provider after network switch
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await newProvider.getSigner();
        const address = await signer.getAddress();
        const balance = await newProvider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);
        const newNetwork = await newProvider.getNetwork();

        setWallet({
          address,
          isConnected: true,
          nativeBalance: parseFloat(balanceInEth).toFixed(4),
          isLoading: false,
          chainId: Number(newNetwork.chainId),
        });
      } else {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);

        setWallet({
          address,
          isConnected: true,
          nativeBalance: parseFloat(balanceInEth).toFixed(4),
          isLoading: false,
          chainId: Number(network.chainId),
        });
      }

      toast.success('Wallet connected!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
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

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      nativeBalance: null,
      isLoading: false,
      chainId: null,
    });
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
    if (!wallet.address || typeof window.ethereum === 'undefined') return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(wallet.address);
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
      if (typeof window.ethereum === 'undefined') return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          const balanceInEth = ethers.formatEther(balance);

          setWallet({
            address,
            isConnected: true,
            nativeBalance: parseFloat(balanceInEth).toFixed(4),
            isLoading: false,
            chainId: Number(network.chainId),
          });

          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', () => window.location.reload());
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

