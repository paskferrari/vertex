import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RoiSummary from '../components/RoiSummary';

const Dashboard = () => {
  // Mock data - in a real app, this would come from an API
  const [dashboardData, setDashboardData] = useState({
    roi: {
      percentage: 24.5,
      trend: 'up', // 'up', 'down', 'stable'
      comparison: '+5.2% from last month'
    },
    stats: {
      totalBets: 127,
      wins: 89,
      losses: 28,
      pending: 10,
      totalStaked: 2450,
      totalReturns: 3051
    },
    recentBets: [
      {
        id: 1,
        sport: 'Basketball',
        match: 'Lakers vs Warriors',
        prediction: 'Lakers +5.5',
        odds: 1.85,
        stake: 100,
        status: 'won', // 'won', 'lost', 'pending'
        date: '2024-01-15',
        return: 185
      },
      {
        id: 2,
        sport: 'Soccer',
        match: 'Barcelona vs Real Madrid',
        prediction: 'Over 2.5 Goals',
        odds: 1.75,
        stake: 150,
        status: 'pending',
        date: '2024-01-16',
        return: null
      },
      {
        id: 3,
        sport: 'Tennis',
        match: 'Djokovic vs Nadal',
        prediction: 'Djokovic ML',
        odds: 2.10,
        stake: 75,
        status: 'lost',
        date: '2024-01-14',
        return: 0
      },
      {
        id: 4,
        sport: 'Basketball',
        match: 'Celtics vs Heat',
        prediction: 'Under 215.5',
        odds: 1.90,
        stake: 120,
        status: 'won',
        date: '2024-01-13',
        return: 228
      }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'won':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'lost':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getSportIcon = (sport) => {
    switch (sport.toLowerCase()) {
      case 'basketball':
        return '🏀';
      case 'soccer':
        return '⚽';
      case 'tennis':
        return '🎾';
      case 'football':
        return '🏈';
      default:
        return '🎯';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Track your betting performance and ROI</p>
        </motion.div>

        {/* ROI Summary Component */}
        <motion.div variants={itemVariants} className="mb-8">
          <RoiSummary />
        </motion.div>

        {/* Summary Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-400/20">
            <p className="text-green-400 text-sm mb-1">Total Wins</p>
            <p className="text-2xl font-bold text-white">{dashboardData.stats.wins}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-red-500/20 to-red-400/10 border border-red-400/20">
            <p className="text-red-400 text-sm mb-1">Total Losses</p>
            <p className="text-2xl font-bold text-white">{dashboardData.stats.losses}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 border border-yellow-400/20">
            <p className="text-yellow-400 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-white">{dashboardData.stats.pending}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20">
            <p className="text-primary text-sm mb-1">Total Bets</p>
            <p className="text-2xl font-bold text-white">{dashboardData.stats.totalBets}</p>
          </div>
        </motion.div>

        {/* Financial Summary */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Financial Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Staked</span>
                <span className="text-white font-semibold">${dashboardData.stats.totalStaked}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Returns</span>
                <span className="text-green-400 font-semibold">${dashboardData.stats.totalReturns}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                <span className="text-gray-400">Net Profit</span>
                <span className="text-primary font-bold">
                  +${dashboardData.stats.totalReturns - dashboardData.stats.totalStaked}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Win Rate</h3>
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-primary">
                {Math.round((dashboardData.stats.wins / (dashboardData.stats.wins + dashboardData.stats.losses)) * 100)}%
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.round((dashboardData.stats.wins / (dashboardData.stats.wins + dashboardData.stats.losses)) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {dashboardData.stats.wins} wins out of {dashboardData.stats.wins + dashboardData.stats.losses} completed bets
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Bets List */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Bets</h2>
            <Link to="/wallet" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {dashboardData.recentBets.map((bet) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: bet.id * 0.1 }}
                className="bg-dark-lighter rounded-lg p-4 border border-gray-600 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getSportIcon(bet.sport)}</span>
                    <div>
                      <h4 className="text-white font-medium">{bet.match}</h4>
                      <p className="text-gray-400 text-sm">{bet.prediction}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bet.status)}`}>
                      {bet.status.toUpperCase()}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{bet.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-400">Stake: <span className="text-white">${bet.stake}</span></span>
                    <span className="text-gray-400">Odds: <span className="text-white">{bet.odds}</span></span>
                  </div>
                  
                  {bet.status !== 'pending' && (
                    <div className={`text-sm font-medium ${
                      bet.status === 'won' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {bet.status === 'won' ? `+$${bet.return - bet.stake}` : `-$${bet.stake}`}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;