import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipCard from '../components/TipCard';

const GuestHome = () => {
  const { t } = useTranslation();
  
  // Mock data per le predizioni pubbliche (limitato per guest)
  const [publicPredictions] = useState([
    {
      id: 'guest-tip-1',
      match: 'Manchester United vs Liverpool',
      prediction: 'Liverpool to win',
      sport: 'soccer',
      odds: 1.85,
      confidence: 'high',
      author: 'Expert Tipster',
      time: '2h ago'
    },
    {
      id: 'guest-tip-2',
      match: 'LA Lakers vs Boston Celtics',
      prediction: 'Over 210.5 points',
      sport: 'basketball',
      odds: 1.95,
      confidence: 'medium',
      author: 'Pro Analyst',
      time: '4h ago'
    },
    {
      id: 'guest-tip-3',
      match: 'Bayern Munich vs Borussia Dortmund',
      prediction: 'Both teams to score',
      sport: 'soccer',
      odds: 1.75,
      confidence: 'high',
      author: 'Sports Expert',
      time: '3h ago'
    }
  ]);

  // Handle per guest - mostra messaggio di registrazione
  const handleGuestAction = () => {
    alert('Registrati per accedere a tutte le funzionalità!');
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
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              to="/login" 
              className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              Accedi
            </Link>
            <button 
              onClick={handleGuestAction}
              className="px-6 py-3 bg-transparent border border-primary text-primary font-medium rounded-xl hover:bg-primary/10 transition-colors"
            >
              Registrati Gratis
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-12 px-4 md:px-6 bg-dark">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-center">
            Cosa Puoi Fare con Vertex
          </motion.h2>
          
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-bold mb-2">Traccia le Performance</h3>
              <p className="text-gray-400 text-sm">Monitora ROI, win rate e profitti</p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-bold mb-2">Predizioni Expert</h3>
              <p className="text-gray-400 text-sm">Accedi a tips di qualità professionale</p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="font-bold mb-2">Gestione Bankroll</h3>
              <p className="text-gray-400 text-sm">Controlla il tuo portafoglio betting</p>
            </div>
          </motion.div>

          {/* Demo Stats - Blurred per guest */}
          <motion.div variants={itemVariants} className="relative mb-8">
            <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <p className="text-white font-bold mb-2">🔒 Accedi per vedere le tue statistiche</p>
                <Link to="/login" className="text-primary hover:text-primary/80 text-sm">
                  Effettua il login
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 blur-sm">
              <div className="card">
                <p className="text-gray-400 text-sm">ROI</p>
                <p className="text-2xl font-bold text-white">12.5%</p>
              </div>
              <div className="card">
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">68%</p>
              </div>
              <div className="card">
                <p className="text-gray-400 text-sm">Total Bets</p>
                <p className="text-2xl font-bold text-white">45</p>
              </div>
              <div className="card">
                <p className="text-gray-400 text-sm">Profit</p>
                <p className="text-2xl font-bold text-white">$250</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Public Predictions Preview */}
      <section className="py-12 px-4 md:px-6 bg-dark-lighter">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Predizioni del Giorno</h2>
            <span className="text-sm text-gray-400">Anteprima Gratuita</span>
          </div>
          
          <div className="relative">
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex space-x-4">
                {publicPredictions.map((tip, index) => (
                  <div key={tip.id} className="min-w-[280px] max-w-[280px] relative">
                    {index > 0 && (
                      <div className="absolute inset-0 bg-dark/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                        <div className="text-center">
                          <p className="text-white font-bold mb-2">🔒</p>
                          <p className="text-sm text-gray-300">Accedi per vedere tutte le predizioni</p>
                        </div>
                      </div>
                    )}
                    <TipCard tip={tip} onSave={handleGuestAction} isGuest={true} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
              >
                Accedi per Vedere Tutte le Predizioni
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-t from-dark-lighter to-dark">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto a Iniziare?</h2>
          <p className="text-gray-300 mb-8">
            Unisciti a migliaia di bettors che stanno già migliorando le loro performance con Vertex.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              Inizia Gratis
            </Link>
            <button 
              onClick={handleGuestAction}
              className="px-8 py-4 bg-transparent border border-gray-600 text-gray-300 font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              Scopri di Più
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestHome;