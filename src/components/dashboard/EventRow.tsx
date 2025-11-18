import { TransactionEvent } from '../../hooks/usePiggyEvents';
import { ArrowDownCircle, ArrowUpCircle, Send, Pause, Play } from 'lucide-react';

interface EventRowProps {
  event: TransactionEvent;
}

export function EventRow({ event }: EventRowProps) {
  const formatAddress = (addr: string) => {
    if (!addr) return 'N/A';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getEventColor = (type: TransactionEvent['type']) => {
    switch (type) {
      case 'Deposited':
        return 'bg-green-50 border-green-300';
      case 'Withdrawn':
        return 'bg-yellow-50 border-yellow-300';
      case 'Transferred':
        return 'bg-blue-50 border-blue-300';
      case 'ContractPaused':
        return 'bg-red-50 border-red-300';
      case 'ContractUnpaused':
        return 'bg-orange-50 border-orange-300';
      default:
        return 'bg-white';
    }
  };

  const getEventIcon = (type: TransactionEvent['type']) => {
    switch (type) {
      case 'Deposited':
        return <ArrowDownCircle className="w-5 h-5" strokeWidth={3} />;
      case 'Withdrawn':
        return <ArrowUpCircle className="w-5 h-5" strokeWidth={3} />;
      case 'Transferred':
        return <Send className="w-5 h-5" strokeWidth={3} />;
      case 'ContractPaused':
        return <Pause className="w-5 h-5" strokeWidth={3} />;
      case 'ContractUnpaused':
        return <Play className="w-5 h-5" strokeWidth={3} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`border-3 border-black rounded-[15px] p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${getEventColor(
        event.type
      )}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">{getEventIcon(event.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl font-black">{event.type}</span>
            </div>

            <div className="space-y-1 text-sm">
              {event.user && (
                <p className="font-bold">
                  User: <span className="font-black">{formatAddress(event.user)}</span>
                </p>
              )}

              {event.from && (
                <p className="font-bold">
                  From: <span className="font-black">{formatAddress(event.from)}</span>
                </p>
              )}

              {event.to && (
                <p className="font-bold">
                  To: <span className="font-black">{formatAddress(event.to)}</span>
                </p>
              )}

              {event.amount && (
                <p className="font-bold">
                  Amount: <span className="font-black">{event.amount} ETH</span>
                </p>
              )}

              {event.newBalance && (
                <p className="font-bold">
                  New Balance: <span className="font-black">{event.newBalance} ETH</span>
                </p>
              )}

              <p className="text-xs font-bold text-gray-600">
                Block: {event.blockNumber} • {formatDate(event.timestamp)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

