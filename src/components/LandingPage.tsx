import { motion } from 'framer-motion';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Send, 
  TrendingUp, 
  Shield, 
  Zap, 
  Coins,
  Sparkles,
  Rocket,
  ArrowRight,
  PiggyBank,
  Banknote
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { LandingHeader } from './LandingHeader';
import { LandingFooter } from './LandingFooter';

export function LandingPage() {
  const { isConnected, connectWallet } = useWallet();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleGetStarted = async () => {
    if (!isConnected) {
      await connectWallet();
    }
    // Navigate to app after connecting
    setTimeout(() => {
      window.location.hash = '#app';
      window.location.reload();
    }, 1000);
  };

  const features = [
    {
      icon: ArrowDownCircle,
      title: 'Deposit',
      description: 'Deposit ETH to your PiggyBank account instantly and securely',
      color: 'from-blue-400 to-blue-600',
      delay: 0.1,
    },
    {
      icon: ArrowUpCircle,
      title: 'Withdraw',
      description: 'Withdraw your funds anytime, anywhere with just a few clicks',
      color: 'from-green-400 to-green-600',
      delay: 0.2,
    },
    {
      icon: Send,
      title: 'Transfer',
      description: 'Send funds to anyone on the Lisk Sepolia network instantly',
      color: 'from-purple-400 to-purple-600',
      delay: 0.3,
    },
    {
      icon: TrendingUp,
      title: 'Check Balance',
      description: 'View your account balance and transaction history in real-time',
      color: 'from-yellow-400 to-yellow-600',
      delay: 0.4,
    },
  ];

  const benefits = [
    { icon: Shield, text: '100% Secure & Decentralized' },
    { icon: Zap, text: 'Lightning Fast Transactions' },
    { icon: Coins, text: 'Low Gas Fees' },
    { icon: Rocket, text: 'Always Available 24/7' },
  ];

  return (
    <div className="min-h-screen bg-[#f9dc5c] relative overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari and Opera */
          ::-webkit-scrollbar {
            display: none;
          }
          
          /* Hide scrollbar for IE, Edge and Firefox */
          body {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
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
      
      {/* Subtle Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-yellow-300 rounded-full opacity-5 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-400 rounded-full opacity-5 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <LandingHeader />

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          className="container mx-auto px-4 md:px-6 py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Side - Information */}
            <motion.div
              variants={itemVariants}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-black leading-tight">
                  <motion.span
                    className="inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    Piggy
                  </motion.span>
                  <br />
                  <motion.span
                    className="inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    Bank
                  </motion.span>
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-2xl md:text-3xl font-bold text-black/80"
              >
                Your Retro ETH Banking Platform
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-black/70 leading-relaxed"
              >
                Deposit, withdraw, and transfer ETH on Lisk Sepolia Testnet with style.
                Fast, secure, and always fun!
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  onClick={handleGetStarted}
                  className="bg-black text-[#f9dc5c] font-black text-xl px-10 py-5 rounded-[25px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center gap-3 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isConnected ? 'Go to Dashboard' : 'Connect Wallet'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </motion.button>

                <motion.button
                  onClick={() => {
                    window.location.hash = '#app';
                    window.location.reload();
                  }}
                  className="bg-white text-black font-black text-xl px-10 py-5 rounded-[25px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Features
                </motion.button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                variants={itemVariants}
                className="flex gap-6 pt-4"
              >
                {[
                  { icon: Shield, text: 'Secure' },
                  { icon: Zap, text: 'Fast' },
                  { icon: Coins, text: 'Low Fees' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.text}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className="bg-[#f9dc5c] rounded-full p-2 border-2 border-black">
                        <Icon className="w-4 h-4 text-black" strokeWidth={3} />
                      </div>
                      <span className="font-black text-black">{item.text}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right Side - Cute Icons */}
            <motion.div
              variants={itemVariants}
              className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Main Piggy Bank */}
              <motion.div
                className="relative z-10"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="bg-gradient-to-br from-[#f9dc5c] to-yellow-300 rounded-[40px] p-12 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  <PiggyBank className="w-32 h-32 text-black" strokeWidth={2} fill="currentColor" />
                </div>
              </motion.div>

              {/* Floating Coins */}
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    top: `${20 + index * 30}%`,
                    left: index % 2 === 0 ? '10%' : '80%',
                  }}
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3,
                  }}
                  whileHover={{ scale: 1.3, rotate: 180 }}
                >
                  <div className="bg-white rounded-full p-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <Banknote className="w-8 h-8 text-[#f9dc5c]" strokeWidth={2.5} fill="currentColor" />
                  </div>
                </motion.div>
              ))}

              {/* Sparkles */}
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={`sparkle-${index}`}
                  className="absolute"
                  style={{
                    top: `${15 + index * 20}%`,
                    left: `${20 + index * 15}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.4,
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" strokeWidth={2.5} />
                </motion.div>
              ))}

              {/* Rocket */}
              <motion.div
                className="absolute bottom-10 right-10"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <div className="bg-black rounded-[20px] p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <Rocket className="w-10 h-10 text-[#f9dc5c]" strokeWidth={2.5} fill="currentColor" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="container mx-auto px-4 md:px-6 py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-black text-center mb-4 text-black"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            What You Can Do
          </motion.h2>
          <motion.p
            className="text-xl text-center mb-16 text-black/70"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Everything you need for your crypto banking needs
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-[25px] p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`bg-gradient-to-br ${feature.color} rounded-[20px] p-4 w-16 h-16 mb-4 flex items-center justify-center`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-2xl font-black mb-3 text-black">{feature.title}</h3>
                  <p className="text-black/70 font-bold">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          id="benefits"
          className="py-20 px-4 md:px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto bg-black/5 rounded-[40px] p-8 md:p-12">
            <motion.h2
              className="text-5xl md:text-6xl font-black text-center mb-16 text-black"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Why Choose PiggyBank?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.text}
                    className="bg-white rounded-[20px] p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                  >
                    <motion.div
                      className="inline-block mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <Icon className="w-12 h-12 text-[#f9dc5c] bg-black rounded-full p-2" strokeWidth={2.5} />
                    </motion.div>
                    <p className="text-lg font-black text-black">{benefit.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="container mx-auto px-4 md:px-6 py-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="bg-gradient-to-r from-[#f9dc5c] to-yellow-300 rounded-[40px] p-12 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-black mb-6 text-black"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl font-bold mb-8 text-black/80"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Connect your wallet and start banking with style!
            </motion.p>
            <motion.button
              onClick={handleGetStarted}
              className="bg-black text-[#f9dc5c] font-black text-2xl px-12 py-6 rounded-[25px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-3 mx-auto group"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {isConnected ? 'Go to Dashboard' : 'Connect Wallet Now'}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.section>
      </div>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}