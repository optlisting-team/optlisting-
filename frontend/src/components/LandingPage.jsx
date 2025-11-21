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
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">OptListing</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            <a href="/dashboard" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Don't Let 'Stale Listings'<br />
              <span className="text-rose-600">Kill Your eBay Account</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Automatically detect and purge low-interest inventory. Boost your sell-through rate and free up selling limits in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 animate-pulse"
              >
                Start Optimizing for Free
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
          </motion.div>

          {/* Dashboard Screenshot Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 shadow-2xl transform rotate-x-3">
              <div className="bg-white rounded-lg p-12 border border-gray-200 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-500 text-lg">Dashboard Screenshot</p>
                  <p className="text-gray-400 text-sm mt-2">(Image will be added here)</p>
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

