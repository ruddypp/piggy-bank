import { useState, useEffect } from 'react';
import { Card } from './Card';
import { Wallet, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { usePiggyBank } from '../hooks/usePiggyBank';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';

export function BalanceCard() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const { getBalance } = usePiggyBank();
  const { isConnected, address: walletAddress } = useWallet();

  // Auto-fill address if wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress && !address) {
      setAddress(walletAddress);
    }
  }, [isConnected, walletAddress, address]);

  const handleCheckBalance = async () => {
    if (!address || !ethers.isAddress(address)) {
      toast.error('Please enter a valid address!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const contractBalance = await getBalance(address);
      setBalance(contractBalance);
      setShowBalance(true);
      toast.success('Balance retrieved!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to get balance!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!address || !ethers.isAddress(address)) return;
    setIsLoading(true);
    try {
      const contractBalance = await getBalance(address);
      setBalance(contractBalance);
      toast.success('Balance updated!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to refresh balance!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Wallet className="w-20 h-20 animate-pulse" strokeWidth={2} />
        </div>
        <h2 className="text-5xl font-black mb-2">Check Balance</h2>
        <p className="text-xl font-bold text-gray-700">
          View your PiggyBank account details
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-2xl font-black mb-3">Your Address</label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              disabled={isLoading}
              className="w-full px-6 py-4 text-lg font-bold border-4 border-black rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            />
          </div>
        </div>

        <button
          onClick={handleCheckBalance}
          disabled={isLoading}
          className={`w-full text-black font-black text-2xl py-6 px-8 rounded-[25px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center gap-3 ${
            'bg-white hover:bg-gray-50 hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
          } ${isLoading ? 'scale-95' : ''}`}
        >
          {isLoading && (
            <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
          )}
          <Wallet className="w-6 h-6" strokeWidth={3} />
          {isLoading ? 'Checking...' : 'Check Balance'}
        </button>

        {showBalance && balance !== null && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-[#f9dc5c] to-yellow-100 border-4 border-black rounded-[25px] p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-lg font-black text-gray-700 mb-2">Account Balance</p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <p className="text-6xl font-black">{showBalance ? balance : '••••'}</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white rounded-full border-3 border-black transition-all"
                >
                  {showBalance ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-sm font-bold text-gray-600">ETH</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border-3 border-black rounded-[20px] p-4">
                <p className="text-sm font-bold text-gray-600 mb-1">USD Value</p>
                <p className="text-2xl font-black">${(parseFloat(balance) * 2450).toFixed(2)}</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-blue-50 border-3 border-black rounded-[20px] p-4 hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={3} />
              </button>
            </div>

          </div>
        )}
      </div>
    </Card>
  );
}
