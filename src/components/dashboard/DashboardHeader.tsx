import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-6"
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        <LayoutDashboard className="w-10 h-10" strokeWidth={3} />
        <h1 className="text-5xl font-black">Contract Dashboard</h1>
      </div>
      <p className="text-xl font-bold text-gray-700">
        Monitor and manage your PiggyBank smart contract
      </p>
    </motion.div>
  );
}

