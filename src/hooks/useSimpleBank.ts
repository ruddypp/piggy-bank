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
  // Lending
  lend: (amount: string) => Promise<void>;
  withdrawLend: (amount: string) => Promise<void>;
  getLenderDeposit: (address: string) => Promise<string>;
  getInterestRate: () => Promise<string>;
  // Borrowing
  depositCollateral: (amount: string) => Promise<void>;
  borrow: (amount: string) => Promise<void>;
  repay: (amount: string) => Promise<void>;
  getBorrowedAmount: (address: string) => Promise<string>;
  getCollateral: (address: string) => Promise<string>;
  getCollateralRatio: () => Promise<string>;
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

  const getReadOnlyContract = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
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

  // ===== Lending =====
  const lend = useCallback(async (amount: string) => {
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
      const tx = await contract.lend(amountWei);
      toast.loading('Transaction pending...', {
        id: 'lend-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      const receipt = await tx.wait();
      toast.success(`Lent ${amount} ETH successfully!`, {
        id: 'lend-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return receipt;
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Transaction failed';
      setError(errorMessage);
      toast.error(`Lend failed: ${errorMessage}`, {
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

  const withdrawLend = useCallback(async (amount: string) => {
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
      const tx = await contract.withdrawLend(amountWei);
      toast.loading('Transaction pending...', {
        id: 'withdraw-lend-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      const receipt = await tx.wait();
      toast.success(`Withdrew lending ${amount} ETH successfully!`, {
        id: 'withdraw-lend-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return receipt;
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Transaction failed';
      setError(errorMessage);
      toast.error(`Withdraw lend failed: ${errorMessage}`, {
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

  const getLenderDeposit = useCallback(async (address: string): Promise<string> => {
    if (!address || !ethers.isAddress(address)) {
      throw new Error('Please enter a valid address');
    }
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    const contract = await getReadOnlyContract();
    const val = await contract.lenderDeposits(address);
    return parseFloat(ethers.formatEther(val)).toFixed(4);
  }, []);

  const getInterestRate = useCallback(async (): Promise<string> => {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    const contract = await getReadOnlyContract();
    const rate = await contract.interestRate();
    // Assuming rate is in bps or ray is unknown; display as percent with 2 decimals assuming 1e18 scale not guaranteed.
    // If contract returns simple percent (e.g., 5), just show number.
    try {
      const asNumber = Number(rate.toString());
      return `${asNumber}%`;
    } catch {
      return rate.toString();
    }
  }, []);

  // ===== Borrowing / Collateral =====
  const depositCollateral = useCallback(async (amount: string) => {
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
      const valueWei = ethers.parseEther(amount);
      const tx = await contract.depositCollateral({ value: valueWei });
      toast.loading('Transaction pending...', {
        id: 'deposit-collateral-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      const receipt = await tx.wait();
      toast.success(`Deposited collateral ${amount} ETH!`, {
        id: 'deposit-collateral-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return receipt;
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Transaction failed';
      setError(errorMessage);
      toast.error(`Deposit collateral failed: ${errorMessage}`, {
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

  const borrow = useCallback(async (amount: string) => {
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
      const tx = await contract.borrow(amountWei);
      toast.loading('Transaction pending...', {
        id: 'borrow-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      const receipt = await tx.wait();
      toast.success(`Borrowed ${amount} ETH successfully!`, {
        id: 'borrow-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return receipt;
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Transaction failed';
      setError(errorMessage);
      toast.error(`Borrow failed: ${errorMessage}`, {
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

  const repay = useCallback(async (amount: string) => {
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
      const valueWei = ethers.parseEther(amount);
      const tx = await contract.repay({ value: valueWei });
      toast.loading('Transaction pending...', {
        id: 'repay-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      const receipt = await tx.wait();
      toast.success(`Repaid ${amount} ETH successfully!`, {
        id: 'repay-tx',
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return receipt;
    } catch (error: any) {
      const errorMessage = error.reason || error.message || 'Transaction failed';
      setError(errorMessage);
      toast.error(`Repay failed: ${errorMessage}`, {
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

  const getBorrowedAmount = useCallback(async (address: string): Promise<string> => {
    if (!address || !ethers.isAddress(address)) {
      throw new Error('Please enter a valid address');
    }
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    const contract = await getReadOnlyContract();
    const val = await contract.borrowedAmount(address);
    return parseFloat(ethers.formatEther(val)).toFixed(4);
  }, []);

  const getCollateral = useCallback(async (address: string): Promise<string> => {
    if (!address || !ethers.isAddress(address)) {
      throw new Error('Please enter a valid address');
    }
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    const contract = await getReadOnlyContract();
    const val = await contract.collateral(address);
    return parseFloat(ethers.formatEther(val)).toFixed(4);
  }, []);

  const getCollateralRatio = useCallback(async (): Promise<string> => {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    const contract = await getReadOnlyContract();
    const ratio = await contract.collateralRatio();
    try {
      const asNumber = Number(ratio.toString());
      return `${asNumber}%`;
    } catch {
      return ratio.toString();
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
    // Lending
    lend,
    withdrawLend,
    getLenderDeposit,
    getInterestRate,
    // Borrowing
    depositCollateral,
    borrow,
    repay,
    getBorrowedAmount,
    getCollateral,
    getCollateralRatio,
    isLoading,
    error,
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

