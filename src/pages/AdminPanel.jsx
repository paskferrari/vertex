import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const AdminPanel = () => {
  const { user, isAdmin, getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({
    match: '',
    sport: '',
    odds: '',
    date: '',
    tipster: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [latestPredictions, setLatestPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Redirect if not admin
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchLatestPredictions();
  }, []);

  const fetchLatestPredictions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/predictions/all', {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter predictions created by current admin user and get latest 10
        const adminPredictions = data.predictions
          .filter(pred => pred.created_by === user.id)
          .slice(0, 10);
        setLatestPredictions(adminPredictions);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:3001/api/admin/create-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pronostico pubblicato con successo!' });
        setFormData({
          match: '',
          sport: '',
          odds: '',
          date: '',
          tipster: ''
        });
        fetchLatestPredictions(); // Refresh the table
        
        // Hide message after 5 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Errore durante la pubblicazione' });
      }
    } catch (error) {
      console.error('Error creating prediction:', error);
      setMessage({ type: 'error', text: 'Errore di connessione' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updatePredictionStatus = async (predictionId, newStatus) => {
    try {
      setUpdatingStatus(predictionId);
      const response = await fetch(`http://localhost:3001/api/admin/predictions/${predictionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state
        setLatestPredictions(prev => 
          prev.map(prediction => 
            prediction.id === predictionId 
              ? { ...prediction, status: newStatus }
              : prediction
          )
        );
        setMessage({ type: 'success', text: 'Stato aggiornato con successo!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Errore nell\'aggiornamento dello stato' });
      }
    } catch (error) {
      console.error('Error updating prediction status:', error);
      setMessage({ type: 'error', text: 'Errore di connessione' });
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Pannello Amministratore</h1>
            <p className="text-gray-400">Gestisci pronostici e contenuti della piattaforma</p>
          </div>
          <Link 
            to="/admin/users"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
          >
            Gestione Utenti
          </Link>
        </div>

        {/* Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-4 rounded-xl border ${
              message.type === 'success' 
                ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Prediction Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Aggiungi Nuovo Pronostico</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partita
                </label>
                <input
                  type="text"
                  name="match"
                  value={formData.match}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
                  placeholder="es. Inter vs Milan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport
                </label>
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
                >
                  <option value="">Seleziona Sport</option>
                  <option value="calcio">Calcio</option>
                  <option value="tennis">Tennis</option>
                  <option value="basket">Basket</option>
                  <option value="pallavolo">Pallavolo</option>
                  <option value="rugby">Rugby</option>
                  <option value="hockey">Hockey</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quota
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1.01"
                  name="odds"
                  value={formData.odds}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
                  placeholder="es. 1.85"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data e Ora Evento
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipster
                </label>
                <input
                  type="text"
                  name="tipster"
                  value={formData.tipster}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
                  placeholder="es. Analista Pro"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Pubblicazione...' : 'Pubblica Pronostico'}
              </button>
            </form>
          </motion.div>

          {/* Latest Predictions Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ultimi Pronostici Inseriti</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading predictions...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Partita</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Sport</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Quota</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Data</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Stato</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestPredictions.map((prediction) => (
                      <tr key={prediction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-gray-800 font-medium">
                          {prediction.match_name}
                        </td>
                        <td className="py-3 px-2 text-gray-600 capitalize">
                          {prediction.sport}
                        </td>
                        <td className="py-3 px-2 text-gray-800 font-medium">
                          {prediction.odds}
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {formatDate(prediction.event_date)}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            prediction.status === 'won' ? 'bg-green-100 text-green-800' :
                            prediction.status === 'lost' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {prediction.status === 'pending' ? 'In Attesa' :
                             prediction.status === 'won' ? 'Vinto' : 'Perso'}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <select
                            value={prediction.status}
                            onChange={(e) => updatePredictionStatus(prediction.id, e.target.value)}
                            disabled={updatingStatus === prediction.id}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:border-transparent disabled:opacity-50"
                          >
                            <option value="pending">In Attesa</option>
                            <option value="won">Vinto</option>
                            <option value="lost">Perso</option>
                          </select>
                          {updatingStatus === prediction.id && (
                            <div className="text-xs text-blue-600 mt-1">Aggiornamento...</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {latestPredictions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nessun pronostico trovato
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;