import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { CONTRACT_ADDRESS, CONTRACT_ABI, getNetworkConfig } from '../lib/contractConfig';

interface UseSimpleBankReturn {
  deposit: (amount: string) => Promise<void>;
  withdraw: (amount: string) => Promise<void>;
  transfer: (to: string, amount: string) => Promise<void>;
  getBalance: (address: string) => Promise<string>;
  getContractBalance: (address: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function useSimpleBank(): UseSimpleBankReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Get contract instance
  const getContract = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    // Check if connected to correct network
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    if (Number(network.chainId) !== 4202) {
      await switchNetwork();
    }

    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  // Deposit ETH to contract
  const deposit = useCallback(async (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid amount');
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const amountWei = ethers.parseEther(amount);

      const tx = await contract.deposit({ value: amountWei });
      
      toast.loading('Transaction pending...', {
        id: 'deposit-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });

      const receipt = await tx.wait();

      toast.success(`Deposited ${amount} ETH successfully!`, {
        id: 'deposit-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });

      return receipt;
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Transaction failed';
      setError(errorMessage);
      
      toast.error(`Deposit failed: ${errorMessage}`, {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Withdraw ETH from contract
  const withdraw = useCallback(async (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid amount');
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const amountWei = ethers.parseEther(amount);

      const tx = await contract.withdraw(amountWei);
      
      toast.loading('Transaction pending...', {
        id: 'withdraw-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });

      const receipt = await tx.wait();

      toast.success(`Withdrew ${amount} ETH successfully!`, {
        id: 'withdraw-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });

      return receipt;
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Transaction failed';
      setError(errorMessage);
      
      toast.error(`Withdraw failed: ${errorMessage}`, {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Transfer ETH to another address
  const transfer = useCallback(async (to: string, amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid amount');
    }

    if (!to || !ethers.isAddress(to)) {
      throw new Error('Please enter a valid address');
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const amountWei = ethers.parseEther(amount);

      const tx = await contract.transfer(to, amountWei);
      
      toast.loading('Transaction pending...', {
        id: 'transfer-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });

      const receipt = await tx.wait();

      toast.success(`Transferred ${amount} ETH successfully!`, {
        id: 'transfer-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });

      return receipt;
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Transaction failed';
      setError(errorMessage);
      
      toast.error(`Transfer failed: ${errorMessage}`, {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get balance from contract (SimpleBank balance)
  const getContractBalance = useCallback(async (address: string): Promise<string> => {
    if (!address || !ethers.isAddress(address)) {
      throw new Error('Please enter a valid address');
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const balance = await contract.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      
      return parseFloat(balanceInEth).toFixed(4);
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Failed to get balance';
      throw new Error(errorMessage);
    }
  }, []);

  // Get native ETH balance
  const getBalance = useCallback(async (address: string): Promise<string> => {
    if (!address || !ethers.isAddress(address)) {
      throw new Error('Please enter a valid address');
    }

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      
      return parseFloat(balanceInEth).toFixed(4);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to get balance';
      throw new Error(errorMessage);
    }
  }, []);

  return {
    deposit,
    withdraw,
    transfer,
    getBalance,
    getContractBalance,
    isLoading,
    error,
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

