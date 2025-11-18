import { Card } from '../Card';
import { History, RefreshCw } from 'lucide-react';
import { TransactionEvent } from '../../hooks/usePiggyEvents';
import { EventRow } from './EventRow';

interface EventHistoryTableProps {
  events: TransactionEvent[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export function EventHistoryTable({ events, isLoading, onRefresh }: EventHistoryTableProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-black flex items-center gap-2">
          <History className="w-7 h-7" strokeWidth={3} />
          Transaction History
        </h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-blue-400 text-black font-black text-base py-2.5 px-5 rounded-[15px] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={3} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl font-bold text-gray-600">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {events.map((event, index) => (
            <EventRow key={`${event.txHash}-${index}`} event={event} />
          ))}
        </div>
      )}
    </Card>
  );
}

