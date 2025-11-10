import { motion } from 'framer-motion';
import { Wallet, LogOut, RefreshCw, Copy, Check } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useSimpleBank } from '../hooks/useSimpleBank';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function Header() {
  const { address, isConnected, isLoading, connectWallet, disconnectWallet } = useWallet();
  const { getContractBalance } = useSimpleBank();
  const [contractBalance, setContractBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load contract balance when wallet is connected
  useEffect(() => {
    const loadBalance = async () => {
      if (isConnected && address) {
        setIsLoadingBalance(true);
        try {
          const balance = await getContractBalance(address);
          setContractBalance(balance);
        } catch (error) {
          console.error('Failed to load contract balance:', error);
          setContractBalance('0.0000');
        } finally {
          setIsLoadingBalance(false);
        }
      } else {
        setContractBalance(null);
      }
    };

    loadBalance();
  }, [isConnected, address, getContractBalance]);

  // Listen for balance refresh events from other components
  useEffect(() => {
    const handleBalanceRefresh = async () => {
      if (isConnected && address) {
        setIsLoadingBalance(true);
        try {
          const balance = await getContractBalance(address);
          setContractBalance(balance);
        } catch (error) {
          console.error('Failed to refresh contract balance:', error);
        } finally {
          setIsLoadingBalance(false);
        }
      }
    };

    window.addEventListener('balance-refresh', handleBalanceRefresh);
    return () => {
      window.removeEventListener('balance-refresh', handleBalanceRefresh);
    };
  }, [isConnected, address, getContractBalance]);

  const refreshBalance = async () => {
    if (!address) return;
    setIsLoadingBalance(true);
    try {
      const balance = await getContractBalance(address);
      setContractBalance(balance);
      toast.success('Balance updated!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      toast.error('Failed to refresh balance!', {
        style: {
          border: '3px solid black',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied!', {
      style: {
        border: '3px solid black',
        boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
      },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.header
      className="bg-[#f9dc5c] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[25px] p-6 mb-8 relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
        }} />
      </div>

      <div className="relative z-10">
        {/* Top Section - Logo and Title */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              className="bg-black rounded-[15px] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Wallet className="w-8 h-8 text-[#f9dc5c]" strokeWidth={2.5} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-black">PiggyBank</h1>
              <p className="text-sm font-bold text-black/70">Lisk Sepolia Banking Platform</p>
            </div>
          </motion.div>

          {/* Wallet Connection Section */}
          <motion.div
            className="flex items-center gap-3 flex-wrap"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isConnected ? (
              <>
                {/* Balance Display */}
                <motion.div
                  className="bg-white border-[3px] border-black rounded-[15px] px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600">Balance:</span>
                    <span className="text-sm font-black text-black">
                      {isLoadingBalance ? '...' : (contractBalance || '0.0000')} ETH
                    </span>
                    <motion.button
                      onClick={refreshBalance}
                      disabled={isLoadingBalance}
                      className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                      title="Refresh balance"
                      whileHover={{ rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Address Display */}
                <motion.div
                  className="bg-white border-[3px] border-black rounded-[15px] px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-black text-black font-mono">{formatAddress(address)}</span>
                  <motion.button
                    onClick={copyAddress}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy address"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </motion.button>
                </motion.div>

                {/* Disconnect Button */}
                <motion.button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white font-black text-sm px-5 py-2 rounded-[15px] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-black hover:bg-gray-800 text-[#f9dc5c] font-black text-sm px-6 py-3 rounded-[15px] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#f9dc5c] border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Bottom Section - Status Bar */}
        <motion.div
          className="flex items-center justify-between bg-black/10 rounded-[15px] px-4 py-2 border-2 border-black/20 flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}
              animate={isConnected ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-bold text-black/80">
              {isConnected ? 'Wallet Connected' : 'Not Connected'}
            </span>
          </div>
          <div className="text-xs font-bold text-black/60">
            Always Open • Always Fast • Always Secure
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
