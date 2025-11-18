import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { DashboardFooter } from '../components/DashboardFooter';
import { FallingPigsBackground } from '../components/FallingPigsBackground';
import { Toaster } from 'sonner';
import { usePiggyBank } from '../hooks/usePiggyBank';
import { useWallet } from '../hooks/useWallet';
import { usePiggyEvents } from '../hooks/usePiggyEvents';
import { ContractOverviewCard } from '../components/dashboard/ContractOverviewCard';
import { AdminControlsCard } from '../components/dashboard/AdminControlsCard';
import { EventHistoryTable } from '../components/dashboard/EventHistoryTable';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { toast } from 'sonner';
import { PIGGY_ADDRESS } from '../lib/contractConfig';

const ContractDashboard = () => {
  const { address, isConnected } = useWallet();
  const {
    getContractBalance,
    getTotalDeposits,
    getOwner,
    getPaused,
    pause,
    unpause,
    withdrawAll,
    isLoading,
  } = usePiggyBank();

  const { events, isLoading: isLoadingEvents, refreshEvents } = usePiggyEvents(true);

  const [contractBalance, setContractBalance] = useState<string>('0.0000');
  const [totalDeposits, setTotalDeposits] = useState<string>('0.0000');
  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Load contract data
  const loadContractData = async () => {
    if (!PIGGY_ADDRESS) return;

    setIsLoadingData(true);
    try {
      const [balance, deposits, owner, paused] = await Promise.all([
        getContractBalance(),
        getTotalDeposits(),
        getOwner(),
        getPaused(),
      ]);

      setContractBalance(balance);
      setTotalDeposits(deposits);
      setOwnerAddress(owner);
      setIsPaused(paused);

      // Check if current user is owner
      if (isConnected && address) {
        setIsOwner(address.toLowerCase() === owner.toLowerCase());
      } else {
        setIsOwner(false);
      }
    } catch (error) {
      console.error('Failed to load contract data:', error);
      toast.error('Failed to load contract data', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadContractData();
  }, [isConnected, address, getContractBalance, getTotalDeposits, getOwner, getPaused]);

  // Refresh data when wallet connects/disconnects
  useEffect(() => {
    if (isConnected && address && ownerAddress) {
      setIsOwner(address.toLowerCase() === ownerAddress.toLowerCase());
    } else {
      setIsOwner(false);
    }
  }, [isConnected, address, ownerAddress]);

  const handlePause = async () => {
    try {
      await pause();
      setIsPaused(true);
      await loadContractData();
      await refreshEvents();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleUnpause = async () => {
    try {
      await unpause();
      setIsPaused(false);
      await loadContractData();
      await refreshEvents();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleWithdrawAll = async () => {
    try {
      await withdrawAll();
      await loadContractData();
      await refreshEvents();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleRefreshEvents = async () => {
    await refreshEvents();
  };

  return (
    <div
      className="min-h-screen bg-[#f9dc5c] relative overflow-x-hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
          
          html, body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <FallingPigsBackground />

      <div className="relative z-10">
        <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6"
          >
            <DashboardHeader />

            <div className="space-y-6">
              <ContractOverviewCard
                contractBalance={contractBalance}
                totalDeposits={totalDeposits}
                ownerAddress={ownerAddress}
                isPaused={isPaused}
                isLoading={isLoadingData}
              />

              <AdminControlsCard
                isOwner={isOwner}
                isPaused={isPaused}
                isLoading={isLoading}
                onPause={handlePause}
                onUnpause={handleUnpause}
                onWithdrawAll={handleWithdrawAll}
              />

              <EventHistoryTable
                events={events}
                isLoading={isLoadingEvents}
                onRefresh={handleRefreshEvents}
              />
            </div>
          </motion.div>
        </div>

        <DashboardFooter />
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default ContractDashboard;
