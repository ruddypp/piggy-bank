import { motion } from 'framer-motion';

interface TabMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'deposit', label: 'Deposit' },
  { id: 'withdraw', label: 'Withdraw' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'balance', label: 'Balance' },
];

export function TabMenu({ activeTab, onTabChange }: TabMenuProps) {
  return (
    <div className="flex gap-4 mb-8 flex-wrap justify-center relative">
      {tabs.map((tab, index) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative px-8 py-4 text-xl font-black rounded-[25px] border-4 border-black
            transition-all duration-200 z-10
            ${
              activeTab === tab.id
                ? 'bg-[#f9dc5c] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-y-0'
                : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
            }
          `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}
