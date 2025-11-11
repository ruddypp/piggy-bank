import { useEffect, useMemo, useState } from 'react';
import { Card } from './Card';
import { Vault, ArrowDownCircle, ArrowUpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useSimpleBank } from '../hooks/useSimpleBank';
import { useWallet } from '../hooks/useWallet';

export function BorrowCard() {
  const { address, isConnected } = useWallet();
  const {
    depositCollateral,
    borrow,
    repay,
    getBorrowedAmount,
    getCollateral,
    getCollateralRatio,
    isLoading,
  } = useSimpleBank();

  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [userCollateral, setUserCollateral] = useState('0.0000');
  const [userDebt, setUserDebt] = useState('0.0000');
  const [ratio, setRatio] = useState<string>('-');
  const [collateralSuccess, setCollateralSuccess] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [repaySuccess, setRepaySuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [cr, coll, debt] = await Promise.all([
          getCollateralRatio(),
          address ? getCollateral(address) : Promise.resolve('0.0000'),
          address ? getBorrowedAmount(address) : Promise.resolve('0.0000'),
        ]);
        setRatio(cr);
        setUserCollateral(coll);
        setUserDebt(debt);
      } catch (e) {}
    };
    load();
  }, [address, getBorrowedAmount, getCollateral, getCollateralRatio]);

  const maxBorrow = useMemo(() => {
    const numRatio = Number((ratio || '0').toString().replace('%', ''));
    if (!userCollateral || !numRatio) return '0.0000';
    // If ratio is e.g. 150% means need 150% collateralization => max borrow = collateral / 1.5
    const divisor = numRatio / 100;
    if (divisor <= 0) return '0.0000';
    const val = parseFloat(userCollateral) / divisor;
    return val.toFixed(4);
  }, [userCollateral, ratio]);

  const handleDepositCollateral = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first!', {
        style: { border: '3px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' },
      });
      return;
    }
    if (!collateralAmount || parseFloat(collateralAmount) <= 0) {
      toast.error('Please enter a valid amount!', {
        style: { border: '3px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' },
      });
      return;
    }
    try {
      await depositCollateral(collateralAmount);
      setCollateralSuccess(true);
      if (address) {
        const coll = await getCollateral(address);
        setUserCollateral(coll);
      }
      setTimeout(() => {
        setCollateralAmount('');
        setCollateralSuccess(false);
      }, 1500);
    } catch (e) {}
  };

  const handleBorrow = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first!', {
        style: { border: '3px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' },
      });
      return;
    }
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      toast.error('Please enter a valid amount!', {
        style: { border: '3px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' },
      });
      return;
    }
    try {
      await borrow(borrowAmount);
      setBorrowSuccess(true);
      if (address) {
        const debt = await getBorrowedAmount(address);
        setUserDebt(debt);
      }
      setTimeout(() => {
        setBorrowAmount('');
        setBorrowSuccess(false);
      }, 1500);
    } catch (e) {}
  };

  const handleRepay = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first!', {
        style: { border: '3px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' },
      });
      return;
    }
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      toast.error('Please enter a valid amount!', {
        style: { border: '3px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' },
      });
      return;
    }
    try {
      await repay(repayAmount);
      setRepaySuccess(true);
      if (address) {
        const debt = await getBorrowedAmount(address);
        setUserDebt(debt);
      }
      setTimeout(() => {
        setRepayAmount('');
        setRepaySuccess(false);
      }, 1500);
    } catch (e) {}
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Vault className="w-20 h-20" strokeWidth={2} />
        </div>
        <h2 className="text-5xl font-black mb-2">Borrow with Collateral</h2>
        <p className="text-xl font-bold text-gray-700">Supply ETH as collateral then borrow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50 border-3 border-black rounded-[20px] p-4">
          <p className="text-sm font-bold text-gray-600">Your Collateral</p>
          <p className="text-3xl font-black mt-2">{userCollateral} ETH</p>
        </div>
        <div className="bg-orange-50 border-3 border-black rounded-[20px] p-4">
          <p className="text-sm font-bold text-gray-600">Your Debt</p>
          <p className="text-3xl font-black mt-2">{userDebt} ETH</p>
        </div>
        <div className="bg-yellow-50 border-3 border-black rounded-[20px] p-4">
          <p className="text-sm font-bold text-gray-600">Collateral Ratio</p>
          <p className="text-3xl font-black mt-2">{ratio}</p>
          <p className="text-xs font-bold mt-1">Max Borrow: {maxBorrow} ETH</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border-3 border-black rounded-[20px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownCircle className="w-6 h-6" strokeWidth={3} />
            <h3 className="text-2xl font-black">Deposit Collateral</h3>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              placeholder="0.00"
              disabled={isLoading || collateralSuccess || !isConnected}
              className="w-full px-6 py-5 text-3xl font-black border-4 border-black rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black">ETH</span>
          </div>
          <button
            onClick={handleDepositCollateral}
            disabled={isLoading || collateralSuccess || !isConnected}
            className={`mt-4 w-full text-black font-black text-2xl py-5 px-8 rounded-[20px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
              collateralSuccess ? 'bg-green-400' : 'bg-[#f9dc5c] hover:bg-[#f9dc5c]/90'
            }`}
          >
            {collateralSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                Success
              </span>
            ) : (
              'Deposit'
            )}
          </button>
        </div>

        <div className="bg-white border-3 border-black rounded-[20px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpCircle className="w-6 h-6" strokeWidth={3} />
            <h3 className="text-2xl font-black">Borrow</h3>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              placeholder="0.00"
              disabled={isLoading || borrowSuccess || !isConnected}
              className="w-full px-6 py-5 text-3xl font-black border-4 border-black rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black">ETH</span>
          </div>
          <button
            onClick={handleBorrow}
            disabled={isLoading || borrowSuccess || !isConnected}
            className={`mt-4 w-full text-black font-black text-2xl py-5 px-8 rounded-[20px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
              borrowSuccess ? 'bg-green-400' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {borrowSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                Success
              </span>
            ) : (
              'Borrow Now'
            )}
          </button>
          <div className="mt-3 text-xs font-bold text-gray-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" strokeWidth={3} />
            Do not exceed your max borrow to avoid liquidation.
          </div>
        </div>

        <div className="bg-white border-3 border-black rounded-[20px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownCircle className="w-6 h-6" strokeWidth={3} />
            <h3 className="text-2xl font-black">Repay</h3>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
              placeholder="0.00"
              disabled={isLoading || repaySuccess || !isConnected}
              className="w-full px-6 py-5 text-3xl font-black border-4 border-black rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black">ETH</span>
          </div>
          <button
            onClick={handleRepay}
            disabled={isLoading || repaySuccess || !isConnected}
            className={`mt-4 w-full text-black font-black text-2xl py-5 px-8 rounded-[20px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
              repaySuccess ? 'bg-green-400' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {repaySuccess ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                Success
              </span>
            ) : (
              'Repay'
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}


