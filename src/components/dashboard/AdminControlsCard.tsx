import { Card } from '../Card';
import { Coins, Pause, Play, DollarSign } from 'lucide-react';

interface AdminControlsCardProps {
  isOwner: boolean;
  isPaused: boolean;
  isLoading: boolean;
  onPause: () => Promise<void>;
  onUnpause: () => Promise<void>;
  onWithdrawAll: () => Promise<void>;
}

export function AdminControlsCard({
  isOwner,
  isPaused,
  isLoading,
  onPause,
  onUnpause,
  onWithdrawAll,
}: AdminControlsCardProps) {
  if (!isOwner) {
    return null;
  }

  return (
    <Card className="mb-6">
      <h2 className="text-3xl font-black mb-5 flex items-center gap-2">
        <Coins className="w-7 h-7" strokeWidth={3} />
        Admin Controls
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={onPause}
          disabled={isLoading || isPaused}
          className={`bg-red-400 text-black font-black text-lg py-4 px-6 rounded-[20px] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center gap-2 ${
            isLoading || isPaused
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Pause className="w-5 h-5" strokeWidth={3} />
              Pause Contract
            </>
          )}
        </button>

        <button
          onClick={onUnpause}
          disabled={isLoading || !isPaused}
          className={`bg-orange-400 text-black font-black text-lg py-4 px-6 rounded-[20px] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center gap-2 ${
            isLoading || !isPaused
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Play className="w-5 h-5" strokeWidth={3} />
              Unpause Contract
            </>
          )}
        </button>

        <button
          onClick={onWithdrawAll}
          disabled={isLoading}
          className={`bg-yellow-400 text-black font-black text-lg py-4 px-6 rounded-[20px] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center gap-2 ${
            isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <DollarSign className="w-5 h-5" strokeWidth={3} />
              Withdraw All
            </>
          )}
        </button>
      </div>
    </Card>
  );
}

