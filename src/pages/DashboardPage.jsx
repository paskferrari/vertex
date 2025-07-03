import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();
  // Placeholder data - in a real app, this would come from an API
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
    <div className="min-h-screen bg-dark p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('dashboard.title')}</h1>
          <p className="text-gray-400">{t('dashboard.subtitle', 'Your betting performance at a glance')}</p>
        </motion.div>

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{t('dashboard.recentBets')}</h2>
            <button className="text-primary text-sm hover:underline">{t('dashboard.viewAllBets')}</button>
          </div>
          
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
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="flex space-x-4">
            <button className="btn-primary flex-1">{t('dashboard.viewAllBets')}</button>
            <button className="btn-secondary flex-1">{t('dashboard.latestTips')}</button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;