import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { TabMenu } from '../components/TabMenu';
import { DashboardFooter } from '../components/DashboardFooter';
import { DepositCard } from '../components/DepositCard';
import { WithdrawCard } from '../components/WithdrawCard';
import { TransferCard } from '../components/TransferCard';
import { BalanceCard } from '../components/BalanceCard';
import { SidebarMenu } from '../components/SidebarMenu';
import { FallingPigsBackground } from '../components/FallingPigsBackground';
import { Toaster } from 'sonner';

const BankDashboard = () => {
  const [activeTab, setActiveTab] = useState('deposit');

  const renderCard = () => {
    switch (activeTab) {
      case 'deposit':
        return <DepositCard />;
      case 'withdraw':
        return <WithdrawCard />;
      case 'transfer':
        return <TransferCard />;
      case 'balance':
        return <BalanceCard />;
      default:
        return <DepositCard />;
    }
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
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header />
          </motion.div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-6">
            <SidebarMenu activeTab={activeTab} onTabChange={setActiveTab} />

            <div>
              <motion.div
                className="lg:hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.main
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCard()}
                </motion.main>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <DashboardFooter />
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default BankDashboard;

