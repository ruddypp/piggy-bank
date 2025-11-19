import { motion } from 'framer-motion';
import { PiggyBank, Github, Twitter, Mail, ArrowRight, Home, Building2, LayoutDashboard } from 'lucide-react';

interface FooterProps {
  variant?: 'landing' | 'dashboard';
}

export function Footer({ variant = 'landing' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const isLanding = variant === 'landing';

  const links = isLanding
    ? [
        { name: 'Features', href: '#features' },
        { name: 'Benefits', href: '#benefits' },
        { name: 'Bank', href: '/bank' },
        { name: 'Dashboard', href: '/dashboard' },
      ]
    : [
        { name: 'Deposit', href: '/bank#deposit' },
        { name: 'Withdraw', href: '/bank#withdraw' },
        { name: 'Transfer', href: '/bank#transfer' },
        { name: 'Balance', href: '/bank#balance' },
      ];

  return (
    <footer className="bg-black text-[#f9dc5c] border-t-4 border-[#f9dc5c] py-4">
      <div className="max-w-6xl mx-auto px-4">

        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-[#f9dc5c] rounded-[8px] p-1.5 border-2 border-[#f9dc5c]">
                <PiggyBank className="w-4 h-4 text-black" strokeWidth={2.3} />
              </div>
              <h3 className="text-lg font-medium">PiggyBank</h3>
            </div>

            <p className="text-[#f9dc5c]/70 text-sm leading-tight mb-2 font-normal">
              Retro ETH Banking on Lisk Sepolia Testnet.
            </p>

            <div className="flex gap-2">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="bg-[#f9dc5c] text-black p-1.5 rounded-[6px] border-2 border-[#f9dc5c]"
                  whileHover={{ scale: 1.1, y: -1 }}
                >
                  <Icon className="w-3 h-3" strokeWidth={2} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-base font-medium mb-2">
              {isLanding ? 'Product' : 'Features'}
            </h4>

            <ul className="space-y-1">
              {links.slice(0, 2).map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-[#f9dc5c]/80 hover:text-[#f9dc5c] text-sm flex items-center gap-1 font-normal"
                  >
                    {item.name}
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation 2 */}
          <div>
            <h4 className="text-base font-medium mb-2 opacity-0">.</h4>
            <ul className="space-y-1">
              {links.slice(2, 4).map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-[#f9dc5c]/80 hover:text-[#f9dc5c] text-sm flex items-center gap-1 font-normal"
                  >
                    {item.name}
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Extra Navigation */}
          {!isLanding && (
            <div>
              <h4 className="text-base font-medium mb-2">Navigate</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="/" className="flex items-center gap-1 text-[#f9dc5c]/80 hover:text-[#f9dc5c] font-normal">
                    <Home className="w-3 h-3" /> Home
                  </a>
                </li>
                <li>
                  <a href="/bank" className="flex items-center gap-1 text-[#f9dc5c]/80 hover:text-[#f9dc5c] font-normal">
                    <Building2 className="w-3 h-3" /> Bank
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="flex items-center gap-1 text-[#f9dc5c]/80 hover:text-[#f9dc5c] font-normal">
                    <LayoutDashboard className="w-3 h-3" /> Dashboard
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#f9dc5c]/20 mt-3 pt-2 text-center">
          <p className="text-[#f9dc5c]/60 text-xs font-normal">
            © {currentYear} PiggyBank — All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}