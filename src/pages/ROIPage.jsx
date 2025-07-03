import { useState } from 'react';
import { motion } from 'framer-motion';

const ROIPage = () => {
  // Placeholder data - in a real app, this would come from an API
  const [roiData] = useState({
    totalInvested: 5000,
    totalReturns: 6250,
    roi: 25.0,
    monthlyROI: [
      { month: 'Jan', roi: 5.2 },
      { month: 'Feb', roi: 8.1 },
      { month: 'Mar', roi: 12.3 },
      { month: 'Apr', roi: 18.7 },
      { month: 'May', roi: 22.1 },
      { month: 'Jun', roi: 25.0 },
    ],
    topPerformers: [
      { sport: 'Basketball', roi: 35.2, bets: 12 },
      { sport: 'Soccer', roi: 28.7, bets: 18 },
      { sport: 'Tennis', roi: 22.1, bets: 8 },
      { sport: 'Football', roi: 15.3, bets: 7 },
    ]
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-dark p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">ROI Tracker</h1>
          <p className="text-gray-400">Monitor your return on investment performance</p>
        </motion.div>

        {/* ROI Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
            <p className="text-gray-400 text-sm mb-2">Total Invested</p>
            <p className="text-2xl font-bold text-white">${roiData.totalInvested.toLocaleString()}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20">
            <p className="text-gray-400 text-sm mb-2">Total Returns</p>
            <p className="text-2xl font-bold text-white">${roiData.totalReturns.toLocaleString()}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-400/20">
            <p className="text-gray-400 text-sm mb-2">Overall ROI</p>
            <p className="text-2xl font-bold text-green-400">{roiData.roi}%</p>
          </div>
        </motion.div>

        {/* Monthly ROI Chart */}
        <motion.div variants={itemVariants} className="card mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Monthly ROI Progress</h2>
          <div className="space-y-4">
            {roiData.monthlyROI.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-gray-300 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-dark-lighter rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(month.roi / 30) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
                <span className="text-white font-medium w-12 text-right">{month.roi}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performing Sports */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold text-white mb-6">Top Performing Sports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roiData.topPerformers.map((sport, index) => (
              <motion.div 
                key={sport.sport}
                className="card"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-white">{sport.sport}</h3>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    sport.roi > 30 ? 'bg-green-500/20 text-green-400' :
                    sport.roi > 20 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {sport.roi}% ROI
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{sport.bets} bets placed</p>
                <div className="mt-3">
                  <div className="bg-dark-lighter rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        sport.roi > 30 ? 'bg-green-400' :
                        sport.roi > 20 ? 'bg-yellow-400' :
                        'bg-gray-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(sport.roi / 40) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ROIPage;