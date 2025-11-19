import { useState, useMemo, useEffect } from 'react';
import { Card } from '../Card';
import { History, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionEvent } from '../../hooks/usePiggyEvents';
import { EventRow } from './EventRow';

interface EventHistoryTableProps {
  events: TransactionEvent[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

const ITEMS_PER_PAGE = 20;

export function EventHistoryTable({ events, isLoading, onRefresh }: EventHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = useMemo(
    () => events.slice(startIndex, endIndex),
    [events, startIndex, endIndex]
  );

  // Reset to page 1 when events change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [events.length, currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

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
        <>
          {/* Transaction Count Info */}
          <div className="mb-4 bg-yellow-50 border-3 border-black rounded-[15px] p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm font-black text-gray-700">
              Showing {startIndex + 1}-{Math.min(endIndex, events.length)} of {events.length} transactions
            </p>
          </div>

          {/* Events List */}
          <div className="space-y-3 mb-6 min-h-[600px]">
            {currentEvents.map((event, index) => (
              <EventRow key={`${event.txHash}-${index}`} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t-3 border-black pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm font-black text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`bg-white text-black font-black text-base py-2 px-4 rounded-[12px] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-1 ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={3} />
                    Prev
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {getPageNumbers().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="text-black font-black text-base px-2"
                          >
                            ...
                          </span>
                        );
                      }

                      const pageNum = page as number;
                      const isActive = pageNum === currentPage;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`font-black text-base py-2 px-4 rounded-[12px] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
                            isActive
                              ? 'bg-[#f9dc5c] text-black hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                              : 'bg-white text-black hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`bg-white text-black font-black text-base py-2 px-4 rounded-[12px] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-1 ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

