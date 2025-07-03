import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * TipCard component for displaying betting tips
 * @param {Object} props
 * @param {Object} props.tip - The tip data
 * @param {Function} props.onSave - Function to call when saving the tip
 * @param {Function} props.onFollow - Function to call when following the tip
 * @param {boolean} props.isFollowed - Whether the tip is already followed
 * @param {boolean} props.showFollowButton - Whether to show follow button
 */
const TipCard = ({ tip, onSave, onFollow, isFollowed, showFollowButton = true }) => {
  const { t } = useTranslation();
  
  // Determine confidence status color
  const getConfidenceColor = (status) => {
    switch (status) {
      case 'high':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Determine prediction status color and text
  const getPredictionStatusBadge = (status) => {
    switch (status) {
      case 'won':
        return {
          className: 'bg-green-100 text-green-800',
          text: 'Vinto'
        };
      case 'lost':
        return {
          className: 'bg-red-100 text-red-800',
          text: 'Perso'
        };
      case 'pending':
        return {
          className: 'bg-yellow-100 text-yellow-800',
          text: 'In Attesa'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800',
          text: 'Sconosciuto'
        };
    }
  };

  return (
    <motion.div 
      className="card overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Sport, Confidence Level, and Status */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium bg-dark-lighter px-3 py-1 rounded-full text-gray-300 capitalize">
            {tip.sport}
          </span>
          {tip.status && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPredictionStatusBadge(tip.status).className}`}>
              {getPredictionStatusBadge(tip.status).text}
            </span>
          )}
        </div>
        {tip.confidence && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${getConfidenceColor(tip.confidence)}`}>
            {tip.confidence.charAt(0).toUpperCase() + tip.confidence.slice(1)} {t('tipCard.confidence')}
          </span>
        )}
      </div>

      {/* Match and Prediction */}
      <h3 className="font-semibold text-white text-lg mb-1">{tip.match || tip.match_name}</h3>
      <p className="text-gray-300 mb-3">{tip.prediction || tip.description || 'Pronostico disponibile'}</p>

      {/* Odds and Details */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-xs text-gray-400">Quota</span>
          <p className="text-white font-medium">{tip.odds}</p>
        </div>
        <div>
          <span className="text-xs text-gray-400">Potenziale Ritorno</span>
          <p className="text-white font-medium">{((tip.odds - 1) * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Author and Time */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <span>di {tip.author || tip.tipster || tip.created_by}</span>
        <span>{tip.time || (tip.event_date && new Date(tip.event_date).toLocaleDateString('it-IT'))}</span>
      </div>

      {/* Action Button */}
      {showFollowButton && (
        <button 
          onClick={() => onFollow ? onFollow(tip) : onSave(tip)}
          disabled={isFollowed}
          className={`w-full py-2 rounded-xl font-medium transition-colors ${
            isFollowed 
              ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          {isFollowed ? 'Già Seguito' : 'Segui Pronostico'}
        </button>
      )}
    </motion.div>
  );
};

export default TipCard;