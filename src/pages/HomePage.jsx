import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipCard from '../components/TipCard';

const HomePage = () => {
  const { t } = useTranslation();
  
  // Placeholder data for dashboard stats - in a real app, this would come from an API
  const [stats] = useState({
    roi: 12.5,
    winRate: 68,
    totalBets: 45,
    pendingBets: 3,
    weeklyProfit: 250,
  });

  // Placeholder for recent bets
  const [recentBets] = useState([
    { id: 1, match: 'Lakers vs Bulls', prediction: 'Lakers -4.5', odds: 1.95, status: 'won', profit: 95 },
    { id: 2, match: 'Man City vs Arsenal', prediction: 'Over 2.5', odds: 1.85, status: 'lost', profit: -100 },
    { id: 3, match: 'Djokovic vs Nadal', prediction: 'Djokovic to win', odds: 1.75, status: 'pending', profit: 0 },
  ]);
  
  // Mock data for today's predictions - in a real app, this would come from an API
  const [todaysPredictions] = useState([
    {
      id: 'tip-1',
      match: 'Manchester United vs Liverpool',
      prediction: 'Liverpool to win',
      sport: 'soccer',
      odds: 1.85,
      confidence: 'high',
      author: 'John Smith',
      time: '2h ago'
    },
    {
      id: 'tip-2',
      match: 'LA Lakers vs Boston Celtics',
      prediction: 'Over 210.5 points',
      sport: 'basketball',
      odds: 1.95,
      confidence: 'medium',
      author: 'Mike Johnson',
      time: '4h ago'
    },
    {
      id: 'tip-3',
      match: 'Novak Djokovic vs Rafael Nadal',
      prediction: 'Nadal to win',
      sport: 'tennis',
      odds: 2.10,
      confidence: 'high',
      author: 'Sarah Williams',
      time: '6h ago'
    },
    {
      id: 'tip-4',
      match: 'Bayern Munich vs Borussia Dortmund',
      prediction: 'Both teams to score',
      sport: 'soccer',
      odds: 1.75,
      confidence: 'high',
      author: 'Alex Turner',
      time: '3h ago'
    },
    {
      id: 'tip-5',
      match: 'New York Yankees vs Boston Red Sox',
      prediction: 'Yankees -1.5',
      sport: 'baseball',
      odds: 2.25,
      confidence: 'medium',
      author: 'Chris Davis',
      time: '5h ago'
    }
  ]);

  // Handle saving a tip to wallet
  const handleSaveTip = (tip) => {
    console.log('Saving tip to wallet:', tip);
    // In a real app, this would call an API to save the tip
    alert(`${t('tipCard.saveToWallet')}: ${tip.match}`);
  };

  // Animation variants for Framer Motion
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
    <div className="min-h-screen bg-dark text-white">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-b from-dark-lighter to-dark">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('common.appName')}
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('common.tagline')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              to="/dashboard" 
              className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              {t('navigation.dashboard')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Overview Section */}
      <section className="py-12 px-4 md:px-6 bg-dark">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6">{t('dashboard.summary')}</motion.h2>
          
          {/* Stats Overview */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="card bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <p className="text-gray-400 text-sm">{t('dashboard.roi')}</p>
              <p className="text-2xl font-bold text-white">{stats.roi}%</p>
            </div>
            
            <div className="card">
              <p className="text-gray-400 text-sm">{t('dashboard.winRate')}</p>
              <p className="text-2xl font-bold text-white">{stats.winRate}%</p>
            </div>
            
            <div className="card">
              <p className="text-gray-400 text-sm">{t('dashboard.totalBets')}</p>
              <p className="text-2xl font-bold text-white">{stats.totalBets}</p>
            </div>
            
            <div className="card">
              <p className="text-gray-400 text-sm">{t('dashboard.pendingBets')}</p>
              <p className="text-2xl font-bold text-white">{stats.pendingBets}</p>
            </div>
            
            <div className="card bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20 col-span-1 md:col-span-2">
              <p className="text-gray-400 text-sm">{t('dashboard.weeklyProfit')}</p>
              <p className="text-2xl font-bold text-white">${stats.weeklyProfit}</p>
            </div>
          </motion.div>

          {/* Recent Bets */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">{t('dashboard.recentActivity')}</h2>
            <div className="space-y-4">
              {recentBets.map((bet) => (
                <div key={bet.id} className="card flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">{bet.match}</h3>
                    <p className="text-sm text-gray-400">{bet.prediction} @ {bet.odds}</p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center">
                    <span 
                      className={`inline-block px-2 py-1 rounded-full text-xs mr-3 ${
                        bet.status === 'won' ? 'bg-green-500/20 text-green-400' : 
                        bet.status === 'lost' ? 'bg-red-500/20 text-red-400' : 
                        'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {bet.status === 'won' ? t('common.won') : bet.status === 'lost' ? t('common.lost') : t('common.pending')}
                    </span>
                    <span className={`font-medium ${
                      bet.status === 'won' ? 'text-green-400' : 
                      bet.status === 'lost' ? 'text-red-400' : 
                      'text-white'
                    }`}>
                      {bet.status === 'pending' ? '-' : bet.status === 'won' ? `+$${bet.profit}` : `-$${Math.abs(bet.profit)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link 
                to="/dashboard" 
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                {t('dashboard.viewAll')}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Today's Predictions Section */}
      <section className="py-12 px-4 md:px-6 bg-dark-lighter">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">{t('home.todaysPredictions')}</h2>
          
          {todaysPredictions.length > 0 ? (
            <div className="relative">
              <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex space-x-4">
                  {todaysPredictions.map((tip) => (
                    <div key={tip.id} className="min-w-[280px] max-w-[280px]">
                      <TipCard tip={tip} onSave={handleSaveTip} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/wallet" 
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  {t('home.viewAllPredictions')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-dark-lighter rounded-2xl p-8 text-center">
              <p className="text-gray-400">{t('home.noPredictions')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;