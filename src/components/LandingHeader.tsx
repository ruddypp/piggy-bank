import { motion } from 'framer-motion';
import { Wallet, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

export function LandingHeader() {
  const { isConnected, connectWallet } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="bg-[#f9dc5c] border-b-4 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,1)] sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-black rounded-[15px] p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
              <Wallet className="w-6 h-6 text-[#f9dc5c]" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-black">SimpleBank</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <motion.a
              href="#features"
              className="text-black font-black text-lg hover:underline"
              whileHover={{ scale: 1.1 }}
            >
              Features
            </motion.a>
            <motion.a
              href="#benefits"
              className="text-black font-black text-lg hover:underline"
              whileHover={{ scale: 1.1 }}
            >
              Benefits
            </motion.a>
            <motion.button
              onClick={() => {
                if (isConnected) {
                  window.location.hash = '#app';
                  window.location.reload();
                } else {
                  connectWallet();
                }
              }}
              className="bg-black text-[#f9dc5c] font-black text-lg px-6 py-3 rounded-[15px] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isConnected ? 'Dashboard' : 'Connect Wallet'}
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden bg-black text-[#f9dc5c] p-2 rounded-[10px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={3} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={3} />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 pb-4 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.a
              href="#features"
              className="block text-black font-black text-lg py-2"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </motion.a>
            <motion.a
              href="#benefits"
              className="block text-black font-black text-lg py-2"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </motion.a>
            <motion.button
              onClick={() => {
                if (isConnected) {
                  window.location.hash = '#app';
                  window.location.reload();
                } else {
                  connectWallet();
                }
                setIsMenuOpen(false);
              }}
              className="w-full bg-black text-[#f9dc5c] font-black text-lg px-6 py-3 rounded-[15px] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              whileTap={{ scale: 0.95 }}
            >
              {isConnected ? 'Dashboard' : 'Connect Wallet'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

