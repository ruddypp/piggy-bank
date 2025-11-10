import { motion } from 'framer-motion';
import { Wallet, Github, Twitter, Mail, ArrowRight, Home } from 'lucide-react';

export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Deposit', href: '#deposit' },
      { name: 'Withdraw', href: '#withdraw' },
      { name: 'Transfer', href: '#transfer' },
      { name: 'Balance', href: '#balance' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Support', href: '#' },
      { name: 'FAQ', href: '#' },
    ],
    social: [
      { icon: Twitter, href: '#', name: 'Twitter' },
      { icon: Github, href: '#', name: 'GitHub' },
      { icon: Mail, href: '#', name: 'Email' },
    ],
  };

  return (
    <footer className="bg-black text-[#f9dc5c] border-t-4 border-[#f9dc5c] mt-12">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#f9dc5c] rounded-[15px] p-2 border-2 border-[#f9dc5c]">
                <Wallet className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-[#f9dc5c]">SimpleBank</h3>
            </div>
            <p className="text-[#f9dc5c]/80 font-bold mb-4">
              Your Retro ETH Banking Platform on Lisk Sepolia Testnet
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="bg-[#f9dc5c] text-black p-2 rounded-[10px] border-2 border-[#f9dc5c] shadow-[3px_3px_0px_0px_rgba(249,220,92,0.3)]"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-xl font-black mb-4 text-[#f9dc5c]">Features</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-[#f9dc5c]/80 font-bold hover:text-[#f9dc5c] hover:underline flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-black mb-4 text-[#f9dc5c]">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-[#f9dc5c]/80 font-bold hover:text-[#f9dc5c] hover:underline flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Back to Landing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-xl font-black mb-4 text-[#f9dc5c]">Navigation</h4>
            <motion.button
              onClick={() => {
                window.location.hash = '';
                window.location.reload();
              }}
              className="bg-[#f9dc5c] text-black font-black px-6 py-3 rounded-[15px] border-3 border-[#f9dc5c] shadow-[4px_4px_0px_0px_rgba(249,220,92,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(249,220,92,0.3)] transition-all duration-200 flex items-center gap-2 group mb-4"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              Back to Home
            </motion.button>
            <p className="text-[#f9dc5c]/60 font-bold text-sm">
              Return to landing page
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t-2 border-[#f9dc5c]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-[#f9dc5c]/60 font-bold text-sm">
            © {currentYear} SimpleBank. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <motion.a
              href="#"
              className="text-[#f9dc5c]/60 font-bold hover:text-[#f9dc5c] hover:underline"
              whileHover={{ scale: 1.1 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="text-[#f9dc5c]/60 font-bold hover:text-[#f9dc5c] hover:underline"
              whileHover={{ scale: 1.1 }}
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

