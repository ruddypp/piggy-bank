import { motion } from 'framer-motion';
import { ArrowDownCircle, ArrowUpCircle, Send, Wallet } from 'lucide-react';

interface SidebarMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'deposit', label: 'Deposit', icon: ArrowDownCircle },
  { id: 'withdraw', label: 'Withdraw', icon: ArrowUpCircle },
  { id: 'transfer', label: 'Transfer', icon: Send },
  { id: 'balance', label: 'Balance', icon: Wallet },
];

export function SidebarMenu({ activeTab, onTabChange }: SidebarMenuProps) {
  return (
    <div className="hidden lg:block sticky top-6 self-start">
      <div className="bg-white rounded-[25px] p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-64">
        <div className="flex flex-col gap-3">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left font-black rounded-[16px] border-4 border-black transition-all ${
                  isActive
                    ? 'bg-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-gray-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Icon className="w-5 h-5" strokeWidth={3} />
                <span className="text-lg">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


