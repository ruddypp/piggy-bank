// hooks/usePiggyBank.ts
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import {
  PIGGY_ADDRESS,
  PIGGY_ABI,
  getNetworkConfig,
  PUBLIC_PROVIDER,
  LISK_SEPOLIA,
} from '../lib/contractConfig';

interface UsePiggyBankReturn {
  deposit: (amount: string) => Promise<any>;
  withdraw: (amount: string) => Promise<any>;
  transfer: (to: string, amount: string) => Promise<any>;
  getBalance: (address: string) => Promise<string>;
  getContractBalance: () => Promise<string>;
  getMyBalance: () => Promise<string>;
  getTotalDeposits: () => Promise<string>;
  withdrawAll: () => Promise<any>;
  pause: () => Promise<any>;
  unpause: () => Promise<any>;
  getOwner: () => Promise<string>;
  getPaused: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

function safeErrorMessage(err: any) {
  // try multiple locations for revert reason
  return (
    err?.reason ||
    err?.error?.message ||
    err?.data?.message ||
    err?.message ||
    JSON.stringify(err)
  );
}

export function usePiggyBank(): UsePiggyBankReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!PIGGY_ADDRESS) {
    // Optional: you can console.warn here; we still let functions throw if called
    // console.warn('PIGGY_ADDRESS is not set - set VITE_PIGGY_ADDRESS in .env');
  }

  // get contract connected to signer (for writes & getMyBalance which relies on msg.sender)
  const getContract = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(PIGGY_ADDRESS, PIGGY_ABI, signer);
  };

  // read-only contract using public RPC
  const getReadOnlyContract = () => {
    return new ethers.Contract(PIGGY_ADDRESS, PIGGY_ABI, PUBLIC_PROVIDER);
  };

  // switch network helper (call only when about to write)
  const switchNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }
    try {
      const chainId = `0x${LISK_SEPOLIA.chainId.toString(16)}`;
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (switchError: any) {
      // if not added, try add chain
      if (switchError?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [getNetworkConfig()],
        });
      } else {
        throw switchError;
      }
    }
  };

  // ---------- WRITE FUNCTIONS (do network switch then use signer) ----------
  const deposit = useCallback(async (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid amount');
    }
    if (!PIGGY_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      // ensure wallet is on correct network (this may prompt user once)
      await switchNetwork();

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
    } catch (err: any) {
      const msg = safeErrorMessage(err);
      setError(msg);
      toast.error(`Deposit failed: ${msg}`, {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const withdraw = useCallback(async (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid amount');
    }
    if (!PIGGY_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      await switchNetwork();
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
    } catch (err: any) {
      const msg = safeErrorMessage(err);
      setError(msg);
      toast.error(`Withdraw failed: ${msg}`, {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const transfer = useCallback(async (to: string, amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid amount');
    }
    if (!to || !ethers.isAddress(to)) {
      throw new Error('Please enter a valid address');
    }
    if (!PIGGY_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      await switchNetwork();
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
    } catch (err: any) {
      const msg = safeErrorMessage(err);
      setError(msg);
      toast.error(`Transfer failed: ${msg}`, {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const withdrawAll = useCallback(async () => {
    if (!PIGGY_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    setIsLoading(true);
    setError(null);
    try {
      await switchNetwork();
      const contract = await getContract();
      const tx = await contract.withdrawAll();
      toast.loading('Transaction pending...', { 
        id: 'withdraw-all-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      const receipt = await tx.wait();
      toast.success('Withdrew all funds successfully!', { 
        id: 'withdraw-all-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return receipt;
    } catch (err: any) {
      const msg = safeErrorMessage(err);
      setError(msg);
      toast.error(`Withdraw all failed: ${msg}`, {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pause = useCallback(async () => {
    if (!PIGGY_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    setIsLoading(true);
    setError(null);
    try {
      await switchNetwork();
      const contract = await getContract();
      const tx = await contract.pause();
      toast.loading('Transaction pending...', { 
        id: 'pause-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      const receipt = await tx.wait();
      toast.success('Contract paused successfully!', { 
        id: 'pause-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return receipt;
    } catch (err: any) {
      const msg = safeErrorMessage(err);
      setError(msg);
      toast.error(`Pause failed: ${msg}`, {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unpause = useCallback(async () => {
    if (!PIGGY_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    setIsLoading(true);
    setError(null);
    try {
      await switchNetwork();
      const contract = await getContract();
      const tx = await contract.unpause();
      toast.loading('Transaction pending...', { 
        id: 'unpause-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      const receipt = await tx.wait();
      toast.success('Contract unpaused successfully!', { 
        id: 'unpause-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return receipt;
    } catch (err: any) {
      const msg = safeErrorMessage(err);
      setError(msg);
      toast.error(`Unpause failed: ${msg}`, {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---------- READ FUNCTIONS (use PUBLIC_PROVIDER when possible) ----------
  const getContractBalance = useCallback(async (): Promise<string> => {
    if (!PIGGY_ADDRESS) throw new Error('Contract address not configured');
    const contract = getReadOnlyContract();
    const balance = await contract.getContractBalance();
    return parseFloat(ethers.formatEther(balance)).toFixed(4);
  }, []);

  const getMyBalance = useCallback(async (): Promise<string> => {
    if (!PIGGY_ADDRESS) throw new Error('Contract address not configured');
    // get signer because getMyBalance reads msg.sender
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(PIGGY_ADDRESS, PIGGY_ABI, signer);
    const balance = await contract.getMyBalance();
    return parseFloat(ethers.formatEther(balance)).toFixed(4);
  }, []);

  const getTotalDeposits = useCallback(async (): Promise<string> => {
    if (!PIGGY_ADDRESS) throw new Error('Contract address not configured');
    const contract = getReadOnlyContract();
    const total = await contract.getTotalDeposits();
    return parseFloat(ethers.formatEther(total)).toFixed(4);
  }, []);

  const getBalance = useCallback(async (address: string): Promise<string> => {
    if (!address || !ethers.isAddress(address)) {
      throw new Error('Please enter a valid address');
    }
    if (!PIGGY_ADDRESS) throw new Error('Contract address not configured');

    const contract = getReadOnlyContract();
    const balance = await contract.getBalance(address);
    return parseFloat(ethers.formatEther(balance)).toFixed(4);
  }, []);

  const getOwner = useCallback(async (): Promise<string> => {
    if (!PIGGY_ADDRESS) throw new Error('Contract address not configured');
    const contract = getReadOnlyContract();
    const owner = await contract.owner();
    return owner;
  }, []);

  const getPaused = useCallback(async (): Promise<boolean> => {
    if (!PIGGY_ADDRESS) throw new Error('Contract address not configured');
    const contract = getReadOnlyContract();
    const paused = await contract.paused();
    return paused;
  }, []);

  return {
    deposit,
    withdraw,
    transfer,
    getBalance,
    getContractBalance,
    getMyBalance,
    getTotalDeposits,
    withdrawAll,
    pause,
    unpause,
    getOwner,
    getPaused,
    isLoading,
    error,
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
