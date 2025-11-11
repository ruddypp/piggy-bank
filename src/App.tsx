import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { TabMenu } from './components/TabMenu';
import { LandingPage } from './components/LandingPage';
import { DashboardFooter } from './components/DashboardFooter';
import { DepositCard } from './components/DepositCard';
import { WithdrawCard } from './components/WithdrawCard';
import { TransferCard } from './components/TransferCard';
import { BalanceCard } from './components/BalanceCard';
import { LendCard } from './components/LendCard';
import { BorrowCard } from './components/BorrowCard';
import { SidebarMenu } from './components/SidebarMenu';
import { FallingPigsBackground } from './components/FallingPigsBackground';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    // Check if user wants to go to app (from hash or localStorage)
    const hash = window.location.hash;
    const savedView = localStorage.getItem('simpleBankView');
    
    if (hash === '#app' || savedView === 'app') {
      setShowLanding(false);
      window.location.hash = '#app';
    } else {
      setShowLanding(true);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === '#app') {
        setShowLanding(false);
        localStorage.setItem('simpleBankView', 'app');
      } else {
        setShowLanding(true);
        localStorage.setItem('simpleBankView', 'landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
      case 'lend':
        return <LendCard />;
      case 'borrow':
        return <BorrowCard />;
      default:
        return <DepositCard />;
    }
  };

  if (showLanding) {
    return (
      <>
        <LandingPage />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9dc5c] relative overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Hide scrollbar inline style */}
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari and Opera */
          ::-webkit-scrollbar {
            display: none;
          }
          
          /* Hide scrollbar for IE, Edge and Firefox */
          html, body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* Subtle Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Animated Falling Pigs Background */}
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
            {/* Sidebar for desktop */}
            <SidebarMenu activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content area */}
            <div>
              {/* Mobile Tabs */}
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

        {/* Footer */}
        <DashboardFooter />
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
}

export default App;