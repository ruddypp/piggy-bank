import { useEffect, useState } from 'react';
import { Card } from './Card';
import { PiggyBank, Coins, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { useSimpleBank } from '../hooks/useSimpleBank';
import { useWallet } from '../hooks/useWallet';
import { toast } from 'sonner';

export function LendCard() {
  const { address, isConnected } = useWallet();
  const {
    lend,
    withdrawLend,
    getLenderDeposit,
    getInterestRate,
    isLoading,
  } = useSimpleBank();

  const [lendAmount, setLendAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [lenderDeposit, setLenderDeposit] = useState('0.0000');
  const [interestRate, setInterestRate] = useState<string>('-');
  const [lendSuccess, setLendSuccess] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [rate, deposit] = await Promise.all([
          getInterestRate(),
          address ? getLenderDeposit(address) : Promise.resolve('0.0000'),
        ]);
        setInterestRate(rate);
        setLenderDeposit(deposit);
      } catch (e) {
        // ignore UI load errors
      }
    };
    load();
  }, [address, getInterestRate, getLenderDeposit]);

  const handleLend = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }
    if (!lendAmount || parseFloat(lendAmount) <= 0) {
      toast.error('Please enter a valid amount!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }
    try {
      await lend(lendAmount);
      setLendSuccess(true);
      if (address) {
        const deposit = await getLenderDeposit(address);
        setLenderDeposit(deposit);
      }
      setTimeout(() => {
        setLendAmount('');
        setLendSuccess(false);
      }, 1500);
    } catch (e) {}
  };

  const handleWithdrawLend = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
      return;
    }
    try {
      await withdrawLend(withdrawAmount);
      setWithdrawSuccess(true);
      if (address) {
        const deposit = await getLenderDeposit(address);
        setLenderDeposit(deposit);
      }
      setTimeout(() => {
        setWithdrawAmount('');
        setWithdrawSuccess(false);
      }, 1500);
    } catch (e) {}
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <PiggyBank className="w-20 h-20" strokeWidth={2} />
        </div>
        <h2 className="text-5xl font-black mb-2">Lend Liquidity</h2>
        <p className="text-xl font-bold text-gray-700">Provide funds and earn interest</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border-3 border-black rounded-[20px] p-4">
          <p className="text-sm font-bold text-gray-600">Your Lend Deposit</p>
          <p className="text-3xl font-black mt-2">{lenderDeposit} ETH</p>
        </div>
        <div className="bg-green-50 border-3 border-black rounded-[20px] p-4">
          <p className="text-sm font-bold text-gray-600">Interest Rate</p>
          <p className="text-3xl font-black mt-2">{interestRate}</p>
        </div>
        <div className="bg-yellow-50 border-3 border-black rounded-[20px] p-4 flex items-center gap-3">
          <RefreshCcw className="w-6 h-6" strokeWidth={3} />
          <p className="text-sm font-bold">Rates and balances update on transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-3 border-black rounded-[20px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-6 h-6" strokeWidth={3} />
            <h3 className="text-2xl font-black">Lend Amount</h3>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={lendAmount}
              onChange={(e) => setLendAmount(e.target.value)}
              placeholder="0.00"
              disabled={isLoading || lendSuccess || !isConnected}
              className="w-full px-6 py-5 text-3xl font-black border-4 border-black rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black">ETH</span>
          </div>
          <button
            onClick={handleLend}
            disabled={isLoading || lendSuccess || !isConnected}
            className={`mt-4 w-full text-black font-black text-2xl py-5 px-8 rounded-[20px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
              lendSuccess ? 'bg-green-400' : 'bg-[#f9dc5c] hover:bg-[#f9dc5c]/90'
            }`}
          >
            {lendSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                Success
              </span>
            ) : (
              'Lend Now'
            )}
          </button>
        </div>

        <div className="bg-white border-3 border-black rounded-[20px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-6 h-6" strokeWidth={3} />
            <h3 className="text-2xl font-black">Withdraw Lend</h3>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.00"
              disabled={isLoading || withdrawSuccess || !isConnected}
              className="w-full px-6 py-5 text-3xl font-black border-4 border-black rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black">ETH</span>
          </div>
          <button
            onClick={handleWithdrawLend}
            disabled={isLoading || withdrawSuccess || !isConnected}
            className={`mt-4 w-full text-black font-black text-2xl py-5 px-8 rounded-[20px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
              withdrawSuccess ? 'bg-green-400' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {withdrawSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                Success
              </span>
            ) : (
              'Withdraw'
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}


