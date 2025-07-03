import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import TipCard from '../components/TipCard';

const Predictions = () => {
  const { user, getAuthHeaders } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [followedPredictions, setFollowedPredictions] = useState(new Set());

  useEffect(() => {
    fetchPredictions();
  }, [user]);

  useEffect(() => {
    filterPredictions();
  }, [predictions, activeFilter]);

  const fetchPredictions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/predictions/all', {
        headers: {
          ...getAuthHeaders()
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions || []);
        
        // Track followed predictions
        const followed = new Set(
          data.predictions.filter(p => p.isFollowed).map(p => p.id)
        );
        setFollowedPredictions(followed);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPredictions = () => {
    if (activeFilter === 'all') {
      setFilteredPredictions(predictions);
    } else {
      setFilteredPredictions(
        predictions.filter(prediction => prediction.sport === activeFilter)
      );
    }
  };

  const handleFollow = async (predictionId) => {
    if (!user) {
      alert('Please login to follow predictions');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/predictions/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ predictionId: predictionId })
      });

      if (response.ok) {
        setFollowedPredictions(prev => new Set([...prev, predictionId]));
        // Update the predictions list to reflect the follow status
        setPredictions(prev => 
          prev.map(p => 
            p.id === predictionId ? { ...p, isFollowed: true } : p
          )
        );
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error following prediction:', error);
      alert('Error following prediction');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSportIcon = (sport) => {
    const icons = {
      basketball: '🏀',
      football: '🏈',
      soccer: '⚽',
      calcio: '⚽',
      tennis: '🎾',
      baseball: '⚾',
      hockey: '🏒'
    };
    return icons[sport] || '🏆';
  };

  const uniqueSports = [...new Set(predictions.map(p => p.sport))];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading predictions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pronostici Proposti</h1>
          <p className="text-gray-400">Segui i pronostici degli esperti e costruisci il tuo portafoglio</p>
        </div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-dark-lighter text-gray-400 hover:text-white'
            }`}
          >
            Tutti
          </button>
          {uniqueSports.map(sport => (
            <button
              key={sport}
              onClick={() => setActiveFilter(sport)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                activeFilter === sport 
                  ? 'bg-primary text-white' 
                  : 'bg-dark-lighter text-gray-400 hover:text-white'
              }`}
            >
              {getSportIcon(sport)} {sport}
            </button>
          ))}
        </motion.div>

        {/* Predictions Grid */}
        {filteredPredictions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-white mb-2">Nessun pronostico trovato</h3>
            <p className="text-gray-400">
              {activeFilter === 'all' 
                ? 'Nessun pronostico disponibile al momento.' 
                : `Nessun pronostico di ${activeFilter} disponibile.`
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPredictions.map((prediction, index) => {
              // Transform prediction data to match TipCard expected format
              const tipData = {
                id: prediction.id,
                sport: prediction.sport,
                match: prediction.match_name || prediction.match,
                prediction: prediction.description || `Quota: ${prediction.odds}`,
                odds: prediction.odds,
                status: prediction.status || 'pending',
                confidence: 'high', // Default confidence level
                author: prediction.tipster_name || prediction.tipster || 'Expert Tipster',
                time: formatDate(prediction.event_date || prediction.date)
              };

              return (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <TipCard 
                    tip={tipData}
                    onFollow={() => handleFollow(prediction.id)}
                    isFollowed={followedPredictions.has(prediction.id) || prediction.isFollowed}
                  />
                  
                  {/* Follow Status Overlay */}
                  {(followedPredictions.has(prediction.id) || prediction.isFollowed) && (
                    <div className="absolute top-4 right-4 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <span>✓</span>
                      <span>Seguito</span>
                    </div>
                  )}
                  
                  {/* Disable overlay for followed predictions */}
                  {(followedPredictions.has(prediction.id) || prediction.isFollowed) && (
                    <div className="absolute inset-0 bg-black/20 rounded-2xl pointer-events-none"></div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Predictions;