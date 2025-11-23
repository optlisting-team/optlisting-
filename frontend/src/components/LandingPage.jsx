import { motion } from 'framer-motion'
import { ArrowRight, TrendingDown, Ban, DollarSign, Check, Zap } from 'lucide-react'

function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/60 backdrop-blur-xl border-b border-gray-200/50 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">OptListing</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">Pricing</a>
            <a href="/dashboard" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-purple-500/20">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-white">
        {/* Background Grid Pattern - Subtle Light Gray */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb0a_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Radial Gradient Glow - Blue/Purple Central Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl pointer-events-none opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(147, 51, 234, 0.2) 25%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)'
          }}
        ></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
              The Ultimate 'Zero Sale' Cleaner.
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-500 mb-6 max-w-3xl mx-auto">
              Save hours of manual work. Focus 100% on finding your next winner.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Automated cleanup for your eBay inventory. We remove the non-performers so you can focus 100% of your energy on sourcing the next big winner.
            </p>
            <div className="flex flex-col items-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all flex items-center gap-2 transform hover:-translate-y-1"
                >
                  Start Cleaning for Free
                  <ArrowRight className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#demo"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-lg rounded-lg hover:border-gray-400 transition-all"
                >
                  View Demo
                </motion.a>
              </div>
              {/* Microcopy */}
              <p className="text-sm text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                <span>30-day free trial. Cancel anytime.</span>
              </p>
            </div>
          </motion.div>

          {/* Dashboard Screenshot Placeholder - 3D Effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-20"
          >
            <div 
              className="relative transform-gpu" 
              style={{ 
                transform: 'perspective(1200px) rotateX(6deg)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-10 border-[12px] border-white/60 shadow-[0_40px_80px_-20px_rgba(99,102,241,0.3),0_0_0_1px_rgba(255,255,255,0.1)]">
                <div className="bg-white rounded-xl p-16 border border-slate-200/50 min-h-[450px] flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <div className="text-7xl mb-6">📊</div>
                    <p className="text-slate-600 text-xl font-semibold">Dashboard Screenshot</p>
                    <p className="text-slate-400 text-sm mt-3">(Image will be added here)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Trust Bar */}
      <section className="py-12 bg-slate-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600 font-medium mb-6">Compatible with your favorite tools:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale">
              <div className="text-2xl font-bold text-gray-400">eBay</div>
              <div className="text-2xl font-bold text-gray-400">Shopify</div>
              <div className="text-2xl font-bold text-gray-400">Amazon</div>
              <div className="text-2xl font-bold text-gray-400">AutoDS</div>
              <div className="text-2xl font-bold text-gray-400">Yaballe</div>
              <div className="text-2xl font-bold text-gray-400">CJ Dropshipping</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The "Pain" Section */}
      <section className="py-20 px-4 bg-white" id="pain">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Your Inventory Needs Optimization
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dead stock isn't just taking up space—it's actively hurting your business.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-rose-300 hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">📉</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Low Sell-Through Rate</h3>
              <p className="text-gray-600 text-lg">
                Unsold items hurt your SEO ranking. We fix that by identifying and removing dead inventory.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-rose-300 hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">🚫</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Selling Limits</h3>
              <p className="text-gray-600 text-lg">
                Maxed out your limit? Delete dead stock to make room for winners that actually sell.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-rose-300 hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">💸</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Wasted Fees</h3>
              <p className="text-gray-600 text-lg">
                Stop paying listing fees for items that never sell. Optimize your inventory costs.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 bg-slate-50" id="features">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to optimize your inventory
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Multi-Platform Sync</h3>
              <p className="text-gray-600 text-lg">
                Connect eBay, Shopify, and Amazon in one click. We sync your listings automatically.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Detection</h3>
              <p className="text-gray-600 text-lg">
                Our AI identifies 'Low Interest' items based on views, sales, and age. No manual work needed.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Bulk Export</h3>
              <p className="text-gray-600 text-lg">
                Download ready-to-upload CSVs for AutoDS, Yaballe, or File Exchange. One click, done.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business size
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {/* Starter */}
            <motion.div
              variants={fadeInUp}
              className="bg-white border-2 border-gray-200 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-slate-900">$29</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">Up to 3k listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">Basic detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">CSV export</span>
                </li>
              </ul>
              <a
                href="/dashboard"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Get Started
              </a>
            </motion.div>

            {/* Pro (Recommended) */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white transform scale-105 shadow-2xl"
            >
              <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                RECOMMENDED
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">$49</span>
                <span className="text-blue-200">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Up to 10k listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Smart detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Smart Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <a
                href="/dashboard"
                className="block w-full text-center px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get Started
              </a>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              variants={fadeInUp}
              className="bg-white border-2 border-gray-200 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-slate-900">$99</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">Unlimited listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">Dedicated support</span>
                </li>
              </ul>
              <a
                href="/dashboard"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Get Started
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">OptListing</span>
              </div>
              <p className="text-gray-400 text-sm">© 2026 OptListing. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

