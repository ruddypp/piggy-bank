import { useState } from 'react';
import { Card } from './Card';
import { Send, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSimpleBank } from '../hooks/useSimpleBank';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';

export function TransferCard() {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const { transfer, isLoading } = useSimpleBank();
  const { isConnected } = useWallet();
  const [transferSuccess, setTransferSuccess] = useState(false);

  const fee = amount ? (parseFloat(amount) * 0.002).toFixed(4) : '0.0000';
  const total = amount ? (parseFloat(amount) + parseFloat(fee)).toFixed(4) : '0.0000';

  const handleTransfer = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }
    
    if (!address || !ethers.isAddress(address)) {
      toast.error('Please enter a valid address!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }

    try {
      await transfer(address, amount);
    setTransferSuccess(true);
      // Trigger balance refresh event for Header
      window.dispatchEvent(new Event('balance-refresh'));
    setTimeout(() => {
      setAmount('');
      setAddress('');
      setTransferSuccess(false);
    }, 2000);
    } catch (error) {
      // Error is already handled in useSimpleBank hook
      console.error('Transfer error:', error);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Send className="w-20 h-20 animate-pulse" strokeWidth={2} />
        </div>
        <h2 className="text-5xl font-black mb-2">Transfer ETH</h2>
        <p className="text-xl font-bold text-gray-700">
          Send funds to another address
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-purple-50 border-3 border-black rounded-[15px] p-3 flex flex-col items-center justify-center">
            <Shield className="w-6 h-6 mb-1" strokeWidth={3} />
            <p className="text-xs font-black text-center">Secure</p>
          </div>
          <div className="bg-blue-50 border-3 border-black rounded-[15px] p-3 flex flex-col items-center justify-center">
            <Clock className="w-6 h-6 mb-1" strokeWidth={3} />
            <p className="text-xs font-black text-center">Instant</p>
          </div>
          <div className="bg-green-50 border-3 border-black rounded-[15px] p-3 flex flex-col items-center justify-center">
            <Send className="w-6 h-6 mb-1" strokeWidth={3} />
            <p className="text-xs font-black text-center">Direct</p>
          </div>
        </div>

        <div>
          <label className="block text-2xl font-black mb-3">Recipient Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            disabled={isLoading || transferSuccess || !isConnected}
            className="w-full px-6 py-4 text-lg font-bold border-4 border-black rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          />
          {address && ethers.isAddress(address) && (
            <p className="text-sm font-bold mt-2 text-green-600">Valid address ✓</p>
          )}
          {address && typeof address === 'string' && address.trim().length > 0 && !ethers.isAddress(address) && (
            <p className="text-sm font-bold mt-2 text-red-600">Invalid address ✗</p>
          )}
        </div>

        <div>
          <label className="block text-2xl font-black mb-3">Amount to Transfer</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={isLoading || transferSuccess || !isConnected}
              className="w-full px-6 py-5 text-3xl font-black border-4 border-black rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black">ETH</span>
          </div>
        </div>

        {amount && address && (
          <div className="bg-[#f9dc5c] border-3 border-black rounded-[20px] p-5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Transfer Amount:</span>
              <span>{amount} ETH</span>
            </div>
            <div className="border-t-2 border-black pt-3 flex justify-between items-center text-lg font-bold">
              <span>Network Fee:</span>
              <span>{fee} ETH</span>
            </div>
            <div className="bg-black text-[#f9dc5c] px-4 py-3 rounded-[15px] flex justify-between items-center text-xl font-black">
              <span>Total:</span>
              <span>{total} ETH</span>
            </div>
          </div>
        )}

        <button
          onClick={handleTransfer}
          disabled={isLoading || transferSuccess || !isConnected}
          className={`w-full text-black font-black text-2xl py-6 px-8 rounded-[25px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center gap-3 ${
            transferSuccess
              ? 'bg-green-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-[#f9dc5c] hover:bg-[#f9dc5c]/90 hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
          } ${isLoading ? 'scale-95' : ''}`}
        >
          {isLoading && (
            <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
          )}
          {transferSuccess ? (
            <>
              <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
              Success!
            </>
          ) : (
            <>
              <Send className="w-6 h-6" strokeWidth={3} />
              Send Transfer
            </>
          )}
        </button>
      </div>
    </Card>
  );
}
