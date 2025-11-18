import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { PIGGY_ADDRESS, PIGGY_ABI, PUBLIC_PROVIDER } from '../lib/contractConfig';

export interface TransactionEvent {
  type: 'Deposited' | 'Withdrawn' | 'Transferred' | 'ContractPaused' | 'ContractUnpaused';
  user?: string;
  from?: string;
  to?: string;
  amount?: string;
  newBalance?: string;
  blockNumber: number;
  timestamp: number;
  txHash: string;
}

interface UsePiggyEventsReturn {
  events: TransactionEvent[];
  isLoading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
}

export function usePiggyEvents(autoFetch: boolean = true): UsePiggyEventsReturn {
  const [events, setEvents] = useState<TransactionEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!PIGGY_ADDRESS) {
      setError('Contract address not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contractInterface = new ethers.Interface(PIGGY_ABI);
      
      // Get current block number
      const currentBlock = await PUBLIC_PROVIDER.getBlockNumber();
      // Fetch from last 10000 blocks (or from deployment if less)
      const fromBlock = Math.max(0, currentBlock - 10000);

      // Event signatures
      const depositedTopic = contractInterface.getEvent('Deposited')?.topicHash;
      const withdrawnTopic = contractInterface.getEvent('Withdrawn')?.topicHash;
      const transferredTopic = contractInterface.getEvent('Transferred')?.topicHash;
      const pausedTopic = contractInterface.getEvent('ContractPaused')?.topicHash;
      const unpausedTopic = contractInterface.getEvent('ContractUnpaused')?.topicHash;

      if (!depositedTopic || !withdrawnTopic || !transferredTopic || !pausedTopic || !unpausedTopic) {
        throw new Error('Failed to get event topic hashes');
      }

      // Fetch all event logs
      const allLogs = await PUBLIC_PROVIDER.getLogs({
        address: PIGGY_ADDRESS,
        fromBlock,
        toBlock: 'latest',
      });

      const parsedEvents: TransactionEvent[] = [];

      // Process logs in batches to get block timestamps efficiently
      const blockNumbers = new Set<number>();
      for (const log of allLogs) {
        blockNumbers.add(log.blockNumber);
      }

      // Fetch all unique blocks
      const blockPromises = Array.from(blockNumbers).map(blockNum => 
        PUBLIC_PROVIDER.getBlock(blockNum).catch(() => null)
      );
      const blocks = await Promise.all(blockPromises);
      const blockMap = new Map<number, number>();
      blocks.forEach((block, index) => {
        if (block) {
          blockMap.set(Array.from(blockNumbers)[index], block.timestamp);
        }
      });

      // Parse each log
      for (const log of allLogs) {
        try {
          let decoded: TransactionEvent | null = null;

          if (log.topics[0] === depositedTopic) {
            const parsed = contractInterface.parseLog({
              topics: log.topics,
              data: log.data,
            });
            if (parsed) {
              decoded = {
                type: 'Deposited',
                user: parsed.args.user,
                amount: ethers.formatEther(parsed.args.amount),
                newBalance: ethers.formatEther(parsed.args.newBalance),
                blockNumber: log.blockNumber,
                timestamp: blockMap.get(log.blockNumber) || 0,
                txHash: log.transactionHash,
              };
            }
          } else if (log.topics[0] === withdrawnTopic) {
            const parsed = contractInterface.parseLog({
              topics: log.topics,
              data: log.data,
            });
            if (parsed) {
              decoded = {
                type: 'Withdrawn',
                user: parsed.args.user,
                amount: ethers.formatEther(parsed.args.amount),
                newBalance: ethers.formatEther(parsed.args.newBalance),
                blockNumber: log.blockNumber,
                timestamp: blockMap.get(log.blockNumber) || 0,
                txHash: log.transactionHash,
              };
            }
          } else if (log.topics[0] === transferredTopic) {
            const parsed = contractInterface.parseLog({
              topics: log.topics,
              data: log.data,
            });
            if (parsed) {
              decoded = {
                type: 'Transferred',
                from: parsed.args.from,
                to: parsed.args.to,
                amount: ethers.formatEther(parsed.args.amount),
                blockNumber: log.blockNumber,
                timestamp: blockMap.get(log.blockNumber) || 0,
                txHash: log.transactionHash,
              };
            }
          } else if (log.topics[0] === pausedTopic) {
            const parsed = contractInterface.parseLog({
              topics: log.topics,
              data: log.data,
            });
            if (parsed) {
              decoded = {
                type: 'ContractPaused',
                user: parsed.args.by,
                blockNumber: log.blockNumber,
                timestamp: blockMap.get(log.blockNumber) || 0,
                txHash: log.transactionHash,
              };
            }
          } else if (log.topics[0] === unpausedTopic) {
            const parsed = contractInterface.parseLog({
              topics: log.topics,
              data: log.data,
            });
            if (parsed) {
              decoded = {
                type: 'ContractUnpaused',
                user: parsed.args.by,
                blockNumber: log.blockNumber,
                timestamp: blockMap.get(log.blockNumber) || 0,
                txHash: log.transactionHash,
              };
            }
          }

          if (decoded) {
            parsedEvents.push(decoded);
          }
        } catch (parseError) {
          console.error('Failed to parse log:', parseError);
        }
      }

      // Sort by block number (newest first)
      parsedEvents.sort((a, b) => b.blockNumber - a.blockNumber);
      setEvents(parsedEvents);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch events';
      setError(errorMessage);
      console.error('Failed to fetch transaction history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return {
    events,
    isLoading,
    error,
    refreshEvents: fetchEvents,
  };
}

