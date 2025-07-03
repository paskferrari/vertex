import { useState } from 'react';
import { motion } from 'framer-motion';

const RoiTracker = () => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'today', 'week', 'month', 'all'
  
  // Mock ROI data - in a real app, this would come from an API
  const [roiData] = useState({
    current: {
      percentage: 24.5,
      trend: 'up', // 'up', 'down', 'stable'
      comparison: '+5.2% from last month',
      totalInvested: 5000,
      totalReturns: 6225,
      netProfit: 1225
    },
    stats: {
      today: {
        bets: 3,
        wins: 2,
        losses: 1,
        pending: 0,
        roi: 12.5,
        profit: 125
      },
      week: {
        bets: 15,
        wins: 10,
        losses: 4,
        pending: 1,
        roi: 18.3,
        profit: 275
      },
      month: {
        bets: 67,
        wins: 45,
        losses: 18,
        pending: 4,
        roi: 22.1,
        profit: 885
      },
      all: {
        bets: 127,
        wins: 89,
        losses: 28,
        pending: 10,
        roi: 24.5,
        profit: 1225
      }
    },
    chartData: {
      // Placeholder data for future chart implementation
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [5.2, 8.7, 12.1, 15.8, 19.3, 24.5]
    }
  });

  const currentStats = roiData.stats[activeFilter];
  
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

  const getFilterLabel = (filter) => {
    switch (filter) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'all':
        return 'All Time';
      default:
        return 'All Time';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      case 'stable':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">ROI Tracker</h2>
          <p className="text-gray-400">Monitor your return on investment and betting performance</p>
        </motion.div>

        {/* Current ROI Display */}
        <motion.div variants={itemVariants} className="card bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Current ROI</h3>
              <div className="flex items-center space-x-4">
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  {roiData.current.percentage > 0 ? '+' : ''}{roiData.current.percentage}%
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-2xl ${getTrendColor(roiData.current.trend)}`}>
                    {getTrendIcon(roiData.current.trend)}
                  </span>
                  <span className="text-gray-300 text-sm">{roiData.current.comparison}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <div className="space-y-1">
                <div className="text-sm text-gray-400">
                  Total Invested: <span className="text-white font-medium">${roiData.current.totalInvested}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Total Returns: <span className="text-green-400 font-medium">${roiData.current.totalReturns}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Net Profit: <span className="text-primary font-bold">${roiData.current.netProfit}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['today', 'week', 'month', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
              >
                {getFilterLabel(filter)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Chart Placeholder */}
        <motion.div variants={itemVariants} className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">ROI Trend - {getFilterLabel(activeFilter)}</h3>
            <div className="text-sm text-gray-400">Chart powered by Recharts (coming soon)</div>
          </div>
          
          {/* Placeholder Chart Area */}
          <div className="h-64 bg-dark-lighter rounded-lg border border-gray-600 flex items-center justify-center relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 h-full">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-r border-gray-500 last:border-r-0"></div>
                ))}
              </div>
              <div className="absolute inset-0 grid grid-rows-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-500 last:border-b-0"></div>
                ))}
              </div>
            </div>
            
            {/* Mock chart line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M 10,80 Q 25,60 40,50 T 70,30 T 90,20"
                stroke="url(#chartGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="text-center z-10">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-white font-semibold mb-1">Interactive Chart Coming Soon</div>
              <div className="text-gray-400 text-sm">Will be powered by Recharts library</div>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary text-sm font-medium">Total Bets</span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-2xl font-bold text-white">{currentStats.bets}</div>
            <div className="text-xs text-gray-400 mt-1">{getFilterLabel(activeFilter)}</div>
          </div>
          
          <div className="card bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-400/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm font-medium">Wins</span>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-2xl font-bold text-white">{currentStats.wins}</div>
            <div className="text-xs text-green-400 mt-1">
              {currentStats.bets > 0 ? Math.round((currentStats.wins / currentStats.bets) * 100) : 0}% win rate
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-red-500/20 to-red-400/10 border border-red-400/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 text-sm font-medium">Losses</span>
              <span className="text-2xl">❌</span>
            </div>
            <div className="text-2xl font-bold text-white">{currentStats.losses}</div>
            <div className="text-xs text-red-400 mt-1">
              {currentStats.bets > 0 ? Math.round((currentStats.losses / currentStats.bets) * 100) : 0}% loss rate
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 border border-yellow-400/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400 text-sm font-medium">Pending</span>
              <span className="text-2xl">⏳</span>
            </div>
            <div className="text-2xl font-bold text-white">{currentStats.pending}</div>
            <div className="text-xs text-yellow-400 mt-1">Awaiting results</div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="card">
            <h4 className="text-lg font-semibold text-white mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">ROI ({getFilterLabel(activeFilter)})</span>
                <span className={`font-bold ${
                  currentStats.roi >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {currentStats.roi >= 0 ? '+' : ''}{currentStats.roi}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Profit/Loss</span>
                <span className={`font-bold ${
                  currentStats.profit >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {currentStats.profit >= 0 ? '+' : ''}${currentStats.profit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-white font-bold">
                  {currentStats.bets > 0 ? Math.round((currentStats.wins / currentStats.bets) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg. Bet Size</span>
                <span className="text-white font-bold">
                  ${currentStats.bets > 0 ? Math.round(roiData.current.totalInvested / currentStats.bets) : 0}
                </span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Insights</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-green-400 mt-1">💡</span>
                <div>
                  <p className="text-white text-sm font-medium">Strong Performance</p>
                  <p className="text-gray-400 text-xs">Your ROI is above average for this period</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">📊</span>
                <div>
                  <p className="text-white text-sm font-medium">Consistent Growth</p>
                  <p className="text-gray-400 text-xs">ROI has been trending upward</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">⚡</span>
                <div>
                  <p className="text-white text-sm font-medium">Active Period</p>
                  <p className="text-gray-400 text-xs">High betting activity this {getFilterLabel(activeFilter).toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoiTracker;