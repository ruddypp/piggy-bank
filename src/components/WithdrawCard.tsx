import { useState, useEffect } from 'react';
import { Card } from './Card';
import { ArrowUpCircle, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { usePiggyBank } from '../hooks/usePiggyBank';
import { useWallet } from '../hooks/useWallet';

export function WithdrawCard() {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<string>('0.0000');
  const { withdraw, isLoading, getMyBalance } = usePiggyBank();
  const { isConnected } = useWallet();
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    const loadBalance = async () => {
      if (isConnected) {
        const balance = await getMyBalance();
        setBalance(balance);
      }
    };
    loadBalance();
  }, [isConnected, getMyBalance]);

  const handleWithdraw = async () => {
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

    if (parseFloat(amount) > parseFloat(balance)) {
      toast.error('Insufficient balance!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }

    try {
      await withdraw(amount);
    setWithdrawSuccess(true);
    // Trigger balance refresh event for Header
    window.dispatchEvent(new Event('balance-refresh'));
    setTimeout(() => {
      setAmount('');
      setWithdrawSuccess(false);
    }, 2000);
    } catch (error) {
      // Error is already handled in usePiggyBank hook
      console.error('Withdraw error:', error);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <ArrowUpCircle className="w-20 h-20 animate-bounce" strokeWidth={2} style={{ animationDuration: '1.5s', animationDelay: '0.2s' }} />
        </div>
        <h2 className="text-5xl font-black mb-2">Withdraw ETH</h2>
        <p className="text-xl font-bold text-gray-700">
          Take funds from your PiggyBank account
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-3 border-black rounded-[20px] p-4">
            <p className="text-sm font-bold text-gray-600">Available Balance</p>
            <p className="text-3xl font-black mt-2">{balance} ETH</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-3 border-black rounded-[20px] p-4">
            <p className="text-sm font-bold text-gray-600">Withdrawal Fee</p>
            <p className="text-2xl font-black mt-2">{amount} ETH</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-3 border-black rounded-[20px] p-4 flex gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" strokeWidth={3} />
          <p className="text-sm font-bold">Withdrawals take 15-30 minutes to process.</p>
        </div>

        <div>
          <label className="block text-2xl font-black mb-3">Withdrawal Amount</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={isLoading || withdrawSuccess}
              max={balance}
              className="w-full px-6 py-5 text-3xl font-black border-4 border-black rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black">ETH</span>
          </div>
        </div>

        {amount && (
          <div className="bg-[#f9dc5c] border-3 border-black rounded-[20px] p-5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Withdraw Amount:</span>
              <span>{amount} ETH</span>
            </div>
            <div className="border-t-2 border-black pt-3 flex justify-between items-center text-lg font-bold">
              <span>Withdrawal Fee:</span>
              <span>-{amount} ETH</span>
            </div>
            <div className="bg-black text-[#f9dc5c] px-4 py-3 rounded-[15px] flex justify-between items-center text-xl font-black">
              <span>You'll Receive:</span>
              <span>{amount} ETH</span>
            </div>
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={isLoading || withdrawSuccess}
          className={`w-full text-black font-black text-2xl py-6 px-8 rounded-[25px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center gap-3 ${
            withdrawSuccess
              ? 'bg-green-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white hover:bg-gray-50 hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
          } ${isLoading ? 'scale-95' : ''}`}
        >
          {isLoading && (
            <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
          )}
          {withdrawSuccess ? (
            <>
              <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
              Success!
            </>
          ) : (
            <>
              <TrendingUp className="w-6 h-6" strokeWidth={3} />
              Withdraw Now
            </>
          )}
        </button>
      </div>
    </Card>
  );
}
