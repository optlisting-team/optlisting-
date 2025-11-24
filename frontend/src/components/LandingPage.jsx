import { motion } from 'framer-motion'
import { ArrowRight, TrendingDown, Ban, DollarSign, Check, CheckCircle, Zap, TrendingUp, Clock, Puzzle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card'
import { Button } from './ui/button'

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
    <div className="min-h-screen bg-black dark:bg-black font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-black/60 dark:bg-black/60 backdrop-blur-xl border-b border-zinc-800 dark:border-zinc-800 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg shadow-blue-500/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white dark:text-white">OptListing</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-zinc-300 dark:text-zinc-300 hover:text-white dark:hover:text-white font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-zinc-300 dark:text-zinc-300 hover:text-white dark:hover:text-white font-medium transition-colors">Pricing</a>
            <a href="/dashboard" className="px-5 py-2 bg-white dark:bg-white hover:bg-zinc-200 dark:hover:bg-zinc-200 text-black dark:text-black font-semibold rounded-lg transition-all shadow-md">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-black dark:bg-black">
        {/* Background Grid Pattern - Enhanced */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f00a_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f00a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Radial Gradient Glow - Soft Blue/Purple Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full blur-3xl pointer-events-none opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.15) 25%, rgba(37, 99, 235, 0.1) 50%, transparent 70%)'
          }}
        ></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-tight font-sans">
              <span className="text-white dark:text-white">'Zero Sale' </span>
              <span className="text-white dark:text-white">Cleaner.</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-zinc-400 dark:text-zinc-400 font-normal mb-10 max-w-3xl mx-auto leading-relaxed font-sans">
              Instantly generate a CSV of dead listings—so you can delete them fast and clean.
            </h2>
            <div className="flex flex-col items-center mt-8">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-white dark:bg-white hover:bg-zinc-200 dark:hover:bg-zinc-200 text-black dark:text-black font-semibold text-lg rounded-xl shadow-lg transition-all hover:-translate-y-1 flex items-center gap-2 font-sans"
              >
                Start Your 30-Day Free Trial
                <ArrowRight className="h-5 w-5" />
              </motion.a>
              {/* Microcopy */}
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-4 text-center font-sans">
                Credit card required. Cancel anytime.
              </p>
            </div>
          </motion.div>

          {/* Dashboard Screenshot Placeholder - 3D Effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-20"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="relative transform-gpu" 
              style={{ 
                transform: 'perspective(1000px) rotateX(12deg) scale(0.95)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-zinc-800 rounded-xl p-10 border-8 border-zinc-800 dark:border-zinc-800 shadow-2xl">
                <div className="bg-zinc-900 dark:bg-zinc-900 rounded-xl p-16 border border-zinc-800 dark:border-zinc-800 min-h-[450px] flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <div className="text-7xl mb-6">📊</div>
                    <p className="text-zinc-400 dark:text-zinc-400 text-xl font-semibold">Dashboard Screenshot</p>
                    <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-3">(Image will be added here)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Trust Bar */}
      <section className="py-12 bg-zinc-900 dark:bg-zinc-900 border-y border-zinc-800 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-zinc-400 dark:text-zinc-400 font-medium mb-6">Compatible with your favorite tools:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale">
              <div className="text-2xl font-bold text-zinc-500 dark:text-zinc-500">eBay</div>
              <div className="text-2xl font-bold text-zinc-500 dark:text-zinc-500">Shopify</div>
              <div className="text-2xl font-bold text-zinc-500 dark:text-zinc-500">Amazon</div>
              <div className="text-2xl font-bold text-zinc-500 dark:text-zinc-500">AutoDS</div>
              <div className="text-2xl font-bold text-zinc-500 dark:text-zinc-500">Yaballe</div>
              <div className="text-2xl font-bold text-zinc-500 dark:text-zinc-500">CJ Dropshipping</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The "Pain" Section */}
      <section className="py-20 px-4 bg-black dark:bg-black" id="pain">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-white mb-4">
              Why Your Inventory Needs Optimization
            </h2>
            <p className="text-xl text-zinc-400 dark:text-zinc-400 max-w-2xl mx-auto">
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
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-5xl mb-4">📉</div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-3">Marketplace Algorithms Hate Dead Stock</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg">
                Old, unsold items drag down your search ranking on every major platform. Clear your dead inventory before it hurts your visibility.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-5xl mb-4">🚫</div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-3">Make Room for Winners</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg">
                Most marketplaces limit your listing slots. Remove dead stock so you can fill those slots with items that actually sell.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-5xl mb-4">💸</div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-3">Cut 80% of Your Cleanup Time</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg">
                Stop deleting listings one by one. Automate the entire process instantly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-zinc-900 dark:bg-zinc-900" id="features">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-white mb-4 font-sans">
              How It Works
            </h2>
            <p className="text-xl text-zinc-400 dark:text-zinc-400 max-w-2xl mx-auto font-sans">
              Three simple steps to clean up your inventory
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-10"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-zinc-900 dark:bg-zinc-900 p-10 rounded-2xl border border-zinc-800 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-zinc-800 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white dark:text-white font-sans">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-4 font-sans">Connect Your Store</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed font-sans">
                Securely link your marketplace account.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-zinc-900 dark:bg-zinc-900 p-10 rounded-2xl border border-zinc-800 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-zinc-800 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white dark:text-white font-sans">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-4 font-sans">Detect Low-Interest Items</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed font-sans">
                We analyze your listings and flag dead stock, low impressions, and non-performers.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-zinc-900 dark:bg-zinc-900 p-10 rounded-2xl border border-zinc-800 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-zinc-800 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white dark:text-white font-sans">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-4 font-sans">Download & Delete via CSV</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed font-sans">
                Export a ready-to-upload CSV, then bulk-delete inside your marketplace.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-black dark:bg-black" id="features-benefits">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-white mb-4 font-sans">
              Features
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-10"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-zinc-900 dark:bg-zinc-900 p-10 rounded-2xl border border-zinc-800 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-zinc-800 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-4 font-sans">Boost Your Store Performance</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed font-sans">
                Removing dead inventory improves search visibility across all major marketplaces.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-zinc-900 dark:bg-zinc-900 p-10 rounded-2xl border border-zinc-800 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-zinc-800 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-white dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-4 font-sans">CSV-Ready Cleanup</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed font-sans">
                Stay fully in control. We generate a clean, deletion-ready CSV for safe bulk removal.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-zinc-900 dark:bg-zinc-900 p-10 rounded-2xl border border-zinc-800 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-zinc-800 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Puzzle className="h-8 w-8 text-white dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-4 font-sans">Seamless Across Markets & Suppliers</h3>
              <p className="text-zinc-400 dark:text-zinc-400 text-lg leading-relaxed font-sans">
                Built to fit any seller workflow. Supports multiple marketplaces and suppliers, with more added regularly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-zinc-900 dark:bg-zinc-900" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-white mb-4 font-sans">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-zinc-400 dark:text-zinc-400 max-w-2xl mx-auto font-sans">
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
            <motion.div variants={fadeInUp}>
              <Card className="h-full flex flex-col border-2 border-slate-200 hover:border-slate-300 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold uppercase tracking-widest text-white dark:text-white mb-2">
                    Starter
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-extrabold tracking-tight text-white dark:text-white">$19.99</span>
                    <span className="text-zinc-400 dark:text-zinc-400 text-lg ml-1">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Up to 5,000 total listings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">1 Store</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Basic detection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Daily CSV export</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <a href="/dashboard">Get Started</a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Pro (Recommended) - Premium Highlight */}
            <motion.div variants={fadeInUp} className="relative">
              {/* Recommended Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <span className="bg-white dark:bg-white text-black dark:text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  RECOMMENDED
                </span>
              </div>
              
              {/* Card with Blue Border */}
              <Card className="h-full flex flex-col border-2 border-white dark:border-white bg-zinc-800 dark:bg-zinc-800 shadow-xl relative">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold uppercase tracking-widest text-white dark:text-white mb-2">
                    Pro
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-extrabold tracking-tight text-white dark:text-white">$49.99</span>
                    <span className="text-zinc-400 dark:text-zinc-400 text-lg ml-1">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Up to 35,000 total listings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">2 Stores</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Advanced detection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Unlimited CSV export</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Fast scan speed</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-white dark:bg-white hover:bg-zinc-200 dark:hover:bg-zinc-200 text-black dark:text-black shadow-lg">
                    <a href="/dashboard">Get Started</a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Power Seller */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full flex flex-col border-2 border-zinc-800 dark:border-zinc-800 hover:border-zinc-700 dark:hover:border-zinc-700 transition-colors bg-zinc-900 dark:bg-zinc-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold uppercase tracking-widest text-white dark:text-white mb-2">
                    Power Seller
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-extrabold tracking-tight text-white dark:text-white">$99.99</span>
                    <span className="text-zinc-400 dark:text-zinc-400 text-lg ml-1">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Up to 100,000 total listings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Unlimited stores</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Priority detection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Unlimited CSV export</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Fastest scan speed</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 dark:text-zinc-300 font-medium">Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <a href="/dashboard">Get Started</a>
                  </Button>
                </CardFooter>
              </Card>
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
                <div className="p-2 bg-blue-600 rounded-lg">
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

