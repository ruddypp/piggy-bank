import { Card } from '../Card';
import { DollarSign, TrendingUp, User, Power, PowerOff } from 'lucide-react';

interface ContractOverviewCardProps {
  contractBalance: string;
  totalDeposits: string;
  ownerAddress: string;
  isPaused: boolean;
  isLoading: boolean;
}

export function ContractOverviewCard({
  contractBalance,
  totalDeposits,
  ownerAddress,
  isPaused,
  isLoading,
}: ContractOverviewCardProps) {
  const formatAddress = (addr: string) => {
    if (!addr) return 'N/A';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className="mb-6">
      <h2 className="text-3xl font-black mb-5 flex items-center gap-2">
        <DollarSign className="w-7 h-7" strokeWidth={3} />
        Contract Overview
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-yellow-50 border-3 border-black rounded-[15px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-6 h-6" strokeWidth={3} />
              <p className="text-sm font-bold text-gray-600">Contract Balance</p>
            </div>
            <p className="text-2xl font-black">{contractBalance} ETH</p>
          </div>

          <div className="bg-blue-50 border-3 border-black rounded-[15px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6" strokeWidth={3} />
              <p className="text-sm font-bold text-gray-600">Total Deposits</p>
            </div>
            <p className="text-2xl font-black">{totalDeposits} ETH</p>
          </div>

          <div className="bg-white border-3 border-black rounded-[15px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-6 h-6" strokeWidth={3} />
              <p className="text-sm font-bold text-gray-600">Owner</p>
            </div>
            <p className="text-lg font-black break-all">{formatAddress(ownerAddress)}</p>
          </div>

          <div
            className={`border-3 border-black rounded-[15px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              isPaused ? 'bg-red-50' : 'bg-green-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isPaused ? (
                <PowerOff className="w-6 h-6" strokeWidth={3} />
              ) : (
                <Power className="w-6 h-6" strokeWidth={3} />
              )}
              <p className="text-sm font-bold text-gray-600">Status</p>
            </div>
            <p className="text-2xl font-black">{isPaused ? 'PAUSED' : 'ACTIVE'}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

