import { useState } from 'react';
import { motion } from 'framer-motion';

const Wallet = () => {
  // Filter state
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'won', 'lost', 'pending'
  
  // Mock wallet data - in a real app, this would come from an API
  const [walletTips] = useState([
    {
      id: 1,
      sport: 'Basketball',
      league: 'NBA',
      match: 'Lakers vs Warriors',
      prediction: 'Lakers +5.5',
      odds: 1.85,
      confidence: 85,
      author: 'ProTipper',
      authorTier: 'premium',
      stake: 100,
      status: 'won',
      addedDate: '2024-01-15',
      gameDate: '2024-01-15',
      result: 'Lakers won by 8 points',
      profit: 85
    },
    {
      id: 2,
      sport: 'Soccer',
      league: 'Premier League',
      match: 'Manchester United vs Liverpool',
      prediction: 'Over 2.5 Goals',
      odds: 1.75,
      confidence: 78,
      author: 'SoccerExpert',
      authorTier: 'premium',
      stake: 150,
      status: 'pending',
      addedDate: '2024-01-16',
      gameDate: '2024-01-17',
      result: null,
      profit: null
    },
    {
      id: 3,
      sport: 'Tennis',
      league: 'ATP',
      match: 'Djokovic vs Nadal',
      prediction: 'Djokovic ML',
      odds: 2.10,
      confidence: 72,
      author: 'TennisAce',
      authorTier: 'free',
      stake: 75,
      status: 'lost',
      addedDate: '2024-01-14',
      gameDate: '2024-01-14',
      result: 'Nadal won in straight sets',
      profit: -75
    },
    {
      id: 4,
      sport: 'Basketball',
      league: 'NBA',
      match: 'Celtics vs Heat',
      prediction: 'Under 215.5 Total Points',
      odds: 1.90,
      confidence: 80,
      author: 'BasketballGuru',
      authorTier: 'premium',
      stake: 120,
      status: 'won',
      addedDate: '2024-01-13',
      gameDate: '2024-01-13',
      result: 'Total: 208 points',
      profit: 108
    },
    {
      id: 5,
      sport: 'Soccer',
      league: 'La Liga',
      match: 'Barcelona vs Real Madrid',
      prediction: 'Barcelona ML',
      odds: 2.25,
      confidence: 68,
      author: 'ElClasico',
      authorTier: 'premium',
      stake: 200,
      status: 'pending',
      addedDate: '2024-01-16',
      gameDate: '2024-01-18',
      result: null,
      profit: null
    },
    {
      id: 6,
      sport: 'Football',
      league: 'NFL',
      match: 'Chiefs vs Bills',
      prediction: 'Chiefs -3.5',
      odds: 1.95,
      confidence: 75,
      author: 'NFLInsider',
      authorTier: 'free',
      stake: 90,
      status: 'lost',
      addedDate: '2024-01-12',
      gameDate: '2024-01-12',
      result: 'Bills won by 7',
      profit: -90
    }
  ]);

  // Filter tips based on active filter
  const filteredTips = walletTips.filter(tip => {
    if (activeFilter === 'all') return true;
    return tip.status === activeFilter;
  });

  // Calculate summary stats
  const stats = {
    total: walletTips.length,
    won: walletTips.filter(tip => tip.status === 'won').length,
    lost: walletTips.filter(tip => tip.status === 'lost').length,
    pending: walletTips.filter(tip => tip.status === 'pending').length,
    totalProfit: walletTips.reduce((sum, tip) => sum + (tip.profit || 0), 0),
    totalStaked: walletTips.reduce((sum, tip) => sum + tip.stake, 0)
  };

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

  const getAuthorBadge = (tier) => {
    return tier === 'premium' ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary to-secondary text-white">
        ⭐ Premium
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
        Free
      </span>
    );
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-dark p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Wallet</h1>
          <p className="text-gray-400">Track your saved betting tips and performance</p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20">
            <p className="text-primary text-sm mb-1">Total Tips</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-400/20">
            <p className="text-green-400 text-sm mb-1">Won</p>
            <p className="text-2xl font-bold text-white">{stats.won}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-red-500/20 to-red-400/10 border border-red-400/20">
            <p className="text-red-400 text-sm mb-1">Lost</p>
            <p className="text-2xl font-bold text-white">{stats.lost}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 border border-yellow-400/20">
            <p className="text-yellow-400 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-white">{stats.pending}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-500/20 to-purple-400/10 border border-purple-400/20">
            <p className="text-purple-400 text-sm mb-1">Net P&L</p>
            <p className={`text-2xl font-bold ${
              stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit}
            </p>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Tips', count: stats.total },
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'won', label: 'Won', count: stats.won },
              { key: 'lost', label: 'Lost', count: stats.lost }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.key
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tips List */}
        <motion.div variants={itemVariants} className="space-y-4">
          {filteredTips.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-white mb-2">No tips found</h3>
              <p className="text-gray-400">No tips match your current filter selection.</p>
            </div>
          ) : (
            filteredTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getSportIcon(tip.sport)}</span>
                    <div>
                      <h3 className="text-white font-semibold">{tip.match}</h3>
                      <p className="text-gray-400 text-sm">{tip.league}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getAuthorBadge(tip.authorTier)}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tip.status)}`}>
                      {tip.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-primary font-medium mb-2">Prediction</h4>
                    <p className="text-white">{tip.prediction}</p>
                    <p className="text-gray-400 text-sm mt-1">by {tip.author}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Odds</p>
                      <p className="text-white font-semibold">{tip.odds}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Confidence</p>
                      <p className={`font-semibold ${getConfidenceColor(tip.confidence)}`}>
                        {tip.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-gray-400">Stake: </span>
                      <span className="text-white font-medium">${tip.stake}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Added: </span>
                      <span className="text-white">{tip.addedDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Game: </span>
                      <span className="text-white">{tip.gameDate}</span>
                    </div>
                  </div>
                  
                  {tip.status !== 'pending' && (
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        tip.profit > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tip.profit > 0 ? '+' : ''}${tip.profit}
                      </div>
                      {tip.result && (
                        <p className="text-gray-400 text-sm">{tip.result}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Wallet;