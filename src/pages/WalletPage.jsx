import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import TipCard from '../components/TipCard';
import RoiSummary from '../components/RoiSummary';

const WalletPage = () => {
  const { user, getAuthHeaders } = useAuth();
  // Filter state
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'won', 'lost', 'pending'
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollowedPredictions();
    }
  }, [user, activeFilter]);

  const fetchFollowedPredictions = async () => {
    try {
      const statusParam = activeFilter !== 'all' ? `?status=${activeFilter}` : '';
      const response = await fetch(`http://localhost:3001/api/predictions/followed${statusParam}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions || []);
      }
    } catch (error) {
      console.error('Error fetching followed predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals from predictions
  const totalWins = predictions.filter(pred => pred.status === 'won').length;
  const totalLosses = predictions.filter(pred => pred.status === 'lost').length;
  const pendingBets = predictions.filter(pred => pred.status === 'pending').length;
  
  // Calculate profit (simplified - in real app would need bet amounts)
  const totalProfit = predictions
    .filter(pred => pred.status !== 'pending')
    .reduce((sum, pred) => {
      if (pred.status === 'won') {
        return sum + (pred.odds * 100 - 100); // Assuming $100 bet
      } else {
        return sum - 100; // Lost $100
      }
    }, 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSportIcon = (sport) => {
    const icons = {
      basketball: '🏀',
      football: '🏈',
      soccer: '⚽',
      tennis: '🎾',
      baseball: '⚾',
      hockey: '🏒'
    };
    return icons[sport] || '🏆';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your wallet...</p>
        </div>
      </div>
    );
  }

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
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">I tuoi pronostici seguiti</h1>
          <p className="text-gray-400">Traccia tutti i tuoi pronostici e le performance</p>
        </motion.div>

        {/* ROI Summary Component */}
        <motion.div variants={itemVariants} className="mb-6">
          <RoiSummary />
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-dark-lighter text-gray-400'}`}
          >
            All Bets
          </button>
          <button 
            onClick={() => setActiveFilter('won')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'won' ? 'bg-green-500 text-white' : 'bg-dark-lighter text-gray-400'}`}
          >
            Won
          </button>
          <button 
            onClick={() => setActiveFilter('lost')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'lost' ? 'bg-red-500 text-white' : 'bg-dark-lighter text-gray-400'}`}
          >
            Lost
          </button>
          <button 
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-dark-lighter text-gray-400'}`}
          >
            Pending
          </button>
        </motion.div>

        {/* Predictions List */}
        <motion.div variants={itemVariants}>
          {predictions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-medium text-white mb-2">No followed predictions</h3>
              <p className="text-gray-400 mb-6">
                {activeFilter === 'all' 
                  ? 'You haven\'t followed any predictions yet.' 
                  : `No ${activeFilter} predictions in your wallet.`
                }
              </p>
              <a 
                href="/predictions" 
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Browse Predictions
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-lighter rounded-2xl p-6 shadow-lg border border-gray-700/50"
                >
                  {/* Sport Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {getSportIcon(prediction.sport)} {prediction.sport.charAt(0).toUpperCase() + prediction.sport.slice(1)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        Seguito
                      </span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        prediction.status === 'won' ? 'bg-green-500/20 text-green-400' : 
                        prediction.status === 'lost' ? 'bg-red-500/20 text-red-400' : 
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {prediction.status.charAt(0).toUpperCase() + prediction.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {prediction.match_name || prediction.match}
                    </h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Odds:</span>
                      <span className="text-green-400 font-bold">
                        {prediction.odds}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Event Date:</span>
                      <span className="text-gray-300">
                        {formatDate(prediction.event_date || prediction.date)}
                      </span>
                    </div>
                  </div>

                  {/* Tipster */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {(prediction.tipster_name || prediction.tipster || 'T').charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {prediction.tipster_name || prediction.tipster}
                        </p>
                        <p className="text-gray-400 text-xs">Expert Tipster</p>
                      </div>
                    </div>
                  </div>

                  {/* Profit/Loss */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">P&L:</span>
                      <span className={`font-bold ${
                        prediction.status === 'won' ? 'text-green-400' : 
                        prediction.status === 'lost' ? 'text-red-400' : 
                        'text-gray-400'
                      }`}>
                        {prediction.status === 'pending' ? 'Pending' : 
                         prediction.status === 'won' ? `+$${(prediction.odds * 100 - 100).toFixed(0)}` : 
                         '-$100'
                        }
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WalletPage;